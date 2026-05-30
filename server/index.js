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

dotenv.config({ path: path.join(__dirname, '../.env'), override: true }); // Adjust if running from different dir

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

  CREATE TABLE IF NOT EXISTS portfolio_reels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    embed_url TEXT NOT NULL,
    label TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS analytics_logins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login_date TEXT NOT NULL UNIQUE,
    count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS unique_visitors (
    ip_address TEXT PRIMARY KEY,
    first_seen DATETIME DEFAULT CURRENT_TIMESTAMP
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
    ['Shotzy Founder', 'Founder & Creative Director', 'The vision behind Shotzy Hub. Guides creative direction and personally reviews every project before delivery.', 'Creative Direction, Branding, Viral Hooks, Visual Rhythm', 1, 1],
    ['Editor', 'Senior Video Editor', 'Master of pacing and seamless cuts, specializing in high-impact narrative rhythm and visual flow.', 'Premiere Pro, DaVinci Resolve, Editing, Transition Hooks', 1, 2],
    ['AI Editor', 'Lead AI Editor', 'Engineers custom AI styling, virtual assets, and state-of-the-art motion filters for scroll-stopping effects.', 'AI Styling, Generative Filters, Prompts, Motion Effects', 1, 3],
    ['Photographer', 'Director of Photography', 'Captures stunning, high-resolution original footage and high-end cinematic captures tailored to perform.', 'Cinematography, Lighting, High-Speed Camera, Frame Composition', 1, 4]
  ];
  defaults.forEach(d => insert.run(d));
}

// Insert default portfolio reels if empty
const reelsCount = db.prepare('SELECT COUNT(*) as count FROM portfolio_reels').get();
if (reelsCount.count === 0) {
  const insertReel = db.prepare('INSERT INTO portfolio_reels (embed_url, label) VALUES (?, ?)');
  const defaultReels = [
    ["https://www.instagram.com/p/DYPxeaKuhc9/embed/", "AI Edit #1"],
    ["https://www.instagram.com/p/DYglCeESaDi/embed/", "AI Edit #2"],
    ["https://www.instagram.com/p/DVMjiDhE-Yg/embed/", "AI Edit #3"],
    ["https://www.instagram.com/p/DYmcKdZotSD/embed/", "AI Edit #4"],
    ["https://www.instagram.com/p/DWwKCTbCB5f/embed/", "AI Edit #5"],
    ["https://www.instagram.com/p/DV3ZOqwiJ-D/embed/", "AI Edit #6"]
  ];
  defaultReels.forEach(r => insertReel.run(r));
}

// Insert default feedbacks if empty
const feedbackCount = db.prepare('SELECT COUNT(*) as count FROM feedbacks').get();
if (feedbackCount.count === 0) {
  const insertFeedback = db.prepare('INSERT INTO feedbacks (name, email, rating, comment, is_active) VALUES (?, ?, ?, ?, ?)');
  const defaultFeedbacks = [
    ["Vikas R.", "vikas@gmail.com", 5, "Unbelievable editing speed! My reel was ready in less than 10 minutes and the pacing was spot on. Highly recommended!", 1],
    ["Sarah M.", "sarah@gmail.com", 5, "I love the cinematic styling and dynamic caption generation. Best video editor I've used so far.", 1],
    ["Rohan K.", "rohan@gmail.com", 4, "Great transitions and VFX work. Appreciate the fast delivery.", 1]
  ];
  defaultFeedbacks.forEach(f => insertFeedback.run(f));
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
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Log daily login for analytics
    const today = new Date().toISOString().split('T')[0];
    try {
      db.prepare(`
        INSERT INTO analytics_logins (login_date, count) 
        VALUES (?, 1)
        ON CONFLICT(login_date) DO UPDATE SET count = count + 1
      `).run(today);
    } catch (err) {
      console.error('Analytics log failed:', err);
    }

    return res.status(200).json({ success: true, message: 'Logged in successfully' });

  } catch (err) {
    console.error('[admin/login] Error:', err);
    return res.status(500).json({ success: false, error: 'Login failed. Try again.' });
  }
});

// POST /api/admin/logout
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
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

// --- NEW ENDPOINTS FOR REELS & FEEDBACKS ---

// GET /api/reels - Public
app.get('/api/reels', (req, res) => {
  try {
    const reels = db.prepare('SELECT id, embed_url, label FROM portfolio_reels').all();
    return res.status(200).json({ success: true, data: reels });
  } catch (err) {
    console.error('GET /api/reels error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch reels' });
  }
});

// PUT /api/admin/reels - Admin Only
app.put('/api/admin/reels', requireAdminAuth, (req, res) => {
  try {
    const { id, embed_url, label } = req.body;
    if (!id || !embed_url || !label) {
      return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }
    const update = db.prepare('UPDATE portfolio_reels SET embed_url = ?, label = ? WHERE id = ?');
    const result = update.run(embed_url, label, id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Reel not found' });
    }
    return res.status(200).json({ success: true, message: 'Reel updated successfully' });
  } catch (err) {
    console.error('PUT /api/admin/reels error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update reel' });
  }
});

// GET /api/feedback - Public
app.get('/api/feedback', (req, res) => {
  try {
    const reviews = db.prepare('SELECT id, name, rating, comment, created_at FROM feedbacks WHERE is_active = 1 AND rating >= 4 ORDER BY id DESC LIMIT 5').all();
    return res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error('GET /api/feedback error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch feedbacks' });
  }
});

// POST /api/feedback - Public
app.post('/api/feedback', (req, res) => {
  try {
    const { name, email, rating, comment } = req.body;
    if (!name || !email || !rating) {
      return res.status(400).json({ success: false, error: 'Name, email, and rating are required' });
    }
    const insert = db.prepare('INSERT INTO feedbacks (name, email, rating, comment, is_active) VALUES (?, ?, ?, ?, 1)');
    insert.run(name, email, rating, comment || '');
    return res.status(200).json({ success: true, message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('POST /api/feedback error:', err);
    return res.status(500).json({ success: false, error: 'Failed to submit feedback' });
  }
});

// GET /api/admin/feedback - Admin Only
app.get('/api/admin/feedback', requireAdminAuth, (req, res) => {
  try {
    const reviews = db.prepare('SELECT id, name, email, rating, comment, is_active, created_at FROM feedbacks ORDER BY id DESC').all();
    return res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error('GET /api/admin/feedback error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch admin feedbacks' });
  }
});

// PUT /api/admin/feedback/toggle - Admin Only
app.put('/api/admin/feedback/toggle', requireAdminAuth, (req, res) => {
  try {
    const { id, is_active } = req.body;
    if (id === undefined || is_active === undefined) {
      return res.status(400).json({ success: false, error: 'Missing parameters' });
    }
    const update = db.prepare('UPDATE feedbacks SET is_active = ? WHERE id = ?');
    update.run(is_active ? 1 : 0, id);
    return res.status(200).json({ success: true, message: 'Feedback status updated' });
  } catch (err) {
    console.error('PUT /api/admin/feedback/toggle error:', err);
    return res.status(500).json({ success: false, error: 'Failed to toggle feedback' });
  }
});

// DELETE /api/admin/feedback - Admin Only
app.delete('/api/admin/feedback/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const del = db.prepare('DELETE FROM feedbacks WHERE id = ?');
    del.run(id);
    return res.status(200).json({ success: true, message: 'Feedback deleted' });
  } catch (err) {
    console.error('DELETE /api/admin/feedback error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete feedback' });
  }
});

// POST /api/bookings - Public (Called after successful payment)
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      plan,
      video_type,
      date,
      time,
      description,
      amount,
      status
    } = req.body;

    if (!name || !email || !phone || !plan || !video_type || !date || !time) {
      return res.status(400).json({ success: false, error: 'Missing required booking fields' });
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          name,
          email,
          phone,
          plan,
          video_type,
          date,
          time,
          description: description || '',
          amount: amount || 0,
          status: status || 'PAID'
        }
      ])
      .select();

    if (error) {
      console.error('[POST /api/bookings] Supabase insert error:', error);
      return res.status(500).json({ success: false, error: 'Failed to record booking in database' });
    }

    return res.status(201).json({ success: true, data: data?.[0] });
  } catch (err) {
    console.error('[POST /api/bookings] Error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/admin/bookings - Admin Only
app.get('/api/admin/bookings', requireAdminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('GET /api/admin/bookings error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

// PUT /api/admin/bookings/:id/accept - Admin Only
app.put('/api/admin/bookings/:id/accept', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'APPROVED_PENDING_PAYMENT' })
      .eq('id', id)
      .select();

    if (error) throw error;
    return res.status(200).json({ success: true, data: data?.[0] });
  } catch (err) {
    console.error('Accept booking error:', err);
    return res.status(500).json({ success: false, error: 'Failed to accept booking' });
  }
});

// PUT /api/admin/bookings/:id/decline - Admin Only
app.put('/api/admin/bookings/:id/decline', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'DECLINED' })
      .eq('id', id)
      .select();

    if (error) throw error;
    return res.status(200).json({ success: true, data: data?.[0] });
  } catch (err) {
    console.error('Decline booking error:', err);
    return res.status(500).json({ success: false, error: 'Failed to decline booking' });
  }
});

// PUT /api/bookings/:id/payment-success - Public
app.put('/api/bookings/:id/payment-success', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'PAID' })
      .eq('id', id)
      .select();

    if (error) throw error;
    return res.status(200).json({ success: true, data: data?.[0] });
  } catch (err) {
    console.error('Payment success error:', err);
    return res.status(500).json({ success: false, error: 'Failed to record payment' });
  }
});

// POST /api/track-view - Public
app.post('/api/track-view', (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    db.prepare('INSERT OR IGNORE INTO unique_visitors (ip_address) VALUES (?)').run(ip);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Track view error:', err);
    return res.status(500).json({ success: false });
  }
});
// GET /api/admin/stats - Admin Only
app.get('/api/admin/stats', requireAdminAuth, async (req, res) => {
  try {
    let uniqueViews = 0;
    try {
      const visitorCountResult = db.prepare('SELECT COUNT(*) as count FROM unique_visitors').get();
      uniqueViews = visitorCountResult ? visitorCountResult.count : 0;
    } catch (err) {
      console.error('Failed to query unique_visitors:', err);
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('amount, status')
      .eq('status', 'PAID');

    if (error) throw error;

    const totalBookings = bookings?.length || 0;
    // Suppressing standard PAISE (Razorpay) to RUPEES (divide by 100) if needed, or directly mapping.
    // In db, amount is saved in rupees when bookings is created or paise depending on table logic. 
    // In standard index.js, Razorpay order returns price in paise, but supabase insert maps rupees. Let's make sure it handles sums correctly:
    const totalRevenue = bookings?.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0) || 0;

    const loginHistory = db.prepare(`
      SELECT login_date, count FROM analytics_logins 
      ORDER BY login_date DESC LIMIT 7
    `).all();

    return res.status(200).json({
      success: true,
      data: {
        uniqueViews,
        totalBookings,
        totalRevenue,
        loginHistory
      }
    });
  } catch (err) {
    console.error('GET /api/admin/stats error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch admin stats' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
