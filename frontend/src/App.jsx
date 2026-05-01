import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import './index.css';
import './styles/animations.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import TikTokRedirect from './pages/TikTokRedirect';
import { trackVisit } from './utils/visitor';

const isTikTokBrowser = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('tiktok') || ua.includes('musical_ly') || ua.includes('bytedance');
};

const AppContent = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isTikTokPath = location.pathname === '/tiktok';

  useEffect(() => {
    if (isTikTokPath || isAdminPath) return;
    if (sessionStorage.getItem('tiktokDismissed') === 'true') return;
    if (isTikTokBrowser()) {
      navigate('/tiktok', { replace: true });
    }
  }, [isTikTokPath, isAdminPath, navigate]);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/admin') || path === '/login' || path === '/tiktok') return;
    trackVisit();
  }, [location.pathname]);

  return (
    <>
      {!isAdminPath && !isTikTokPath && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tiktok" element={<TikTokRedirect />} />
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route
          path="/admin/*"
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
};

function App() {
  const { i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('adminAuth') === 'true'
  );

  useEffect(() => {
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
    </Router>
  );
}

export default App;
