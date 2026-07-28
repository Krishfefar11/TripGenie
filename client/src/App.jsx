import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ui/ScrollProgress';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ItineraryPage from './pages/ItineraryPage';
import SavedTripsPage from './pages/SavedTripsPage';

/** Route changes should land at the top, not wherever the last page was. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ScrollProgress />

      <div className="flex min-h-screen flex-col">
        <Navbar />

        {/* Offset for the fixed navbar */}
        <main className="flex-1" style={{ paddingTop: 'var(--nav-h)' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/saved-trips" element={<SavedTripsPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
