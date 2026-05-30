
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IntroAnimation } from './components/IntroAnimation';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { Portfolio } from './components/Portfolio';
import { About } from './components/About';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { Process } from './components/Process';
import { Booking } from './components/Booking';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { BookingSuccess } from './components/BookingSuccess';
import { FloatingSocial } from './components/FloatingSocial';
import { AuthPage } from './pages/AuthPage';
import { Testimonials } from './components/Testimonials';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserProfile } from './pages/UserProfile';

const Home = () => {
  return (
    <>
      <IntroAnimation />
      <Navigation />
      <main>
        <Hero />
        <TrustBar />
        <Portfolio />
        <About />
        <Features />
        <Pricing />
        <Process />
        <Booking />
        <FAQ />
        <Testimonials />
      </main>
      <FloatingSocial />
      <Footer />
    </>
  );
};

import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const trackView = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL || '';
        await fetch(`${API_URL}/api/track-view`, { method: 'POST' });
      } catch (err) {
        console.error('Failed to track page view:', err);
      }
    };
    trackView();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
