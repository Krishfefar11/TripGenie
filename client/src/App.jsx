import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ItineraryPage from './pages/ItineraryPage';
import SavedTripsPage from './pages/SavedTripsPage';
// import { Toaster } from 'lucide-react'; // Removing invalid import causing blank screen

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-light">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/saved-trips" element={<SavedTripsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
