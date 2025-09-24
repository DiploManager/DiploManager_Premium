import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ReservationProvider } from './contexts/ReservationContext';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Reservations from './pages/Reservations';
import Integrations from './pages/Integrations';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import { useAuth } from './contexts/AuthContext';
import './App.css';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/integrations" element={<Integrations />} />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ReservationProvider>
          <AppContent />
        </ReservationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;