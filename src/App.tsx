
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
import { Admin } from './components/Admin';
import { FloatingSocial } from './components/FloatingSocial';

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
      </main>
      <FloatingSocial />
      <Footer />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
