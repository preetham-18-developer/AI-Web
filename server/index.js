import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import helmet from 'helmet';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '../.env', override: true }); // Adjust if running from different dir

const app = express();

// CRITICAL: body parser MUST come before all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

const db = new Database(path.join(__dirname, 'database.sqlite'));
db.exec(`
  CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    skills TEXT,
    photo_url TEXT,
    social_link TEXT,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert default team members if empty
const count = db.prepare('SELECT COUNT(*) as count FROM team_members').get();
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO team_members (name, role, bio, skills, is_active, display_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const defaults = [
    ['Salman', 'Founder & Lead AI Editor', 'The vision behind every reel. Salman leads creative direction and personally reviews every project before delivery.', 'AI Editing, Storytelling, Instagram Algorithm, Creative Direction', 1, 1],
    ['Team Member', 'Senior Colour Grader', 'Makes every frame look like it was shot by a cinema camera. Specialist in mood-driven colour work.', 'DaVinci Resolve, Lumetri Color, LUT Design, Skin Tone Correction', 1, 2],
    ['Team Member', 'Motion Designer', 'Transitions, kinetic text, and visual effects that feel premium — not templated.', 'After Effects, Premiere Pro, Motion Graphics, Kinetic Typography', 1, 3],
    ['Team Member', 'Sound Designer', 'Music sync and audio design that makes reels feel cinematic, not just loud.', 'Audio Sync, Sound Design, Music Licensing, Vocal Enhancement', 1, 4]
  ];
  defaults.forEach(d => insert.run(d));
}

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ancsnhzdyvuyfzulkjsn.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Kmky13lRd60O_a9ghiN5jw_ixSdO9Kj';
const supabase = createClient(supabaseUrl, supabaseKey);

// CRITICAL: validate env vars at startup — crash early, not during a booking
const requiredEnvVars = ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD_HASH'];
requiredEnvVars.forEach(key => {
  if (!process.env[key]) {
    console.error(`FATAL: Missing environment variable: ${key}`);
    process.exit(1); // stop the server — don't serve broken routes
  }
});

// Initialize Razorpay ONCE at module level — not inside the route handler
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/create-order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, planName, customerName, customerEmail, customerPhone } = req.body;

    // Validate required fields
    if (!amount || typeof amount !== 'number' || amount < 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount. Must be a number in paise (minimum 100).'
      });
    }

    const options = {
      amount: Math.round(amount), // amount in PAISE (₹1 = 100 paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        planName: planName || '',
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
      }
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
      }
    });

  } catch (err) {
    // Log the FULL error — never swallow it silently
    console.error('[create-order] Razorpay error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to create payment order. Please try again.',
      // Never expose err.message to client in production
    });
  }
});

// POST /api/razorpay-webhook
app.post('/api/razorpay-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const secret = process.env.RAZORPAY_KEY_SECRET;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.body) // req.body must be raw Buffer here — that's why express.raw() is used
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('[webhook] Signature mismatch — possible tampered request');
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      // Save booking to DB here
      console.log('[webhook] Payment captured:', payment.id);
      // Optional: Add supabase insert here based on your previous logic
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[webhook] Error:', err);
    return res.status(500).json({ success: false });
  }
});

app.get('/api/slots/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // Get team capacity
    const { data: settingsData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'team_capacity')
      .single();

    const capacity = settingsData ? parseInt(settingsData.value, 10) : 3;

    // Get bookings for date
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('time')
      .eq('date', date)
      .eq('status', 'PAID');

    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      return res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
    }

    const bookedSlots = {};
    if (bookingsData) {
      bookingsData.forEach(b => {
        bookedSlots[b.time] = (bookedSlots[b.time] || 0) + 1;
      });
    }

    res.json({ success: true, data: { bookedSlots, capacity } });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ success: false, error: 'Failed to fetch slots' });
  }
});


const requireAdminAuth = (req, res, next) => {
  try {
    const token = req.cookies?.adminToken;
    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired session' });
  }
};


// POST /api/admin/login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    if (email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { role: 'admin', email: process.env.ADMIN_EMAIL },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ success: true, message: 'Logged in successfully' });

  } catch (err) {
    console.error('[admin/login] Error:', err);
    return res.status(500).json({ success: false, error: 'Login failed. Try again.' });
  }
});

// POST /api/admin/logout
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('adminToken');
  return res.status(200).json({ success: true });
});

// GET /api/admin/me
app.get('/api/admin/me', requireAdminAuth, (req, res) => {
  return res.status(200).json({ success: true, data: { email: req.admin.email } });
});

// GET /api/team - public
app.get('/api/team', (req, res) => {
  try {
    const members = db.prepare(
      `SELECT id, name, role, bio, skills, photo_url, social_link, is_active
       FROM team_members WHERE is_active = 1 ORDER BY display_order ASC`
    ).all();
    return res.status(200).json({ success: true, data: members });
  } catch (err) {
    console.error('[/api/team] Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch team' });
  }
});

app.get('/api/stats/weekly-bookings', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PAID')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Weekly bookings fetch error:', error);
      return res.json({ success: true, count: 0 }); // graceful fallback
    }

    res.json({ success: true, count: count || 0 });
  } catch (err) {
    console.error('Weekly bookings fetch error:', err);
    res.json({ success: true, count: 0 }); // graceful fallback — never breaks UI
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
