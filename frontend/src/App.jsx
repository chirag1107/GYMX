import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MembershipProvider } from './context/MembershipContext';
import { ProgressProvider } from './context/ProgressContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Workouts from './pages/Workouts';
import WorkoutDetail from './pages/WorkoutDetail';
import Nutrition from './pages/Nutrition';
import NutritionDetail from './pages/NutritionDetail';
import NutritionItemDetail from './pages/NutritionItemDetail';
import Progress from './pages/Progress';
import Membership from './pages/Membership';
import MembershipDetail from './pages/MembershipDetail';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Tracker from './pages/Tracker';
import ActiveWorkout from './pages/ActiveWorkout';
import Profile from './pages/Profile';
import { TrackerProvider } from './context/TrackerContext';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <MembershipProvider>
        <Router>
          <ProgressProvider>
            <TrackerProvider>
              <ScrollToTop />
              <ProtectedRoute>
                <div className="app">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/workouts" element={<Workouts />} />
                      <Route path="/workouts/:id" element={<WorkoutDetail />} />
                      <Route path="/nutrition" element={<Nutrition />} />
                      <Route path="/nutrition/:id" element={<NutritionDetail />} />
                      <Route path="/nutrition/:id/:itemId" element={<NutritionItemDetail />} />
                      <Route path="/progress" element={<Progress />} />
                      <Route path="/membership" element={<Membership />} />
                      <Route path="/membership/:id" element={<MembershipDetail />} />
                      <Route path="/checkout/:id" element={<Checkout />} />
                      <Route path="/tracker" element={<Tracker />} />
                      <Route path="/workout/active/:id" element={<ActiveWorkout />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </ProtectedRoute>
            </TrackerProvider>
          </ProgressProvider>
        </Router>
      </MembershipProvider>
    </AuthProvider>
  );
}

export default App;
