import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard,
  Package,
  Tags,
  LogOut,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Users,
  ShoppingBag,
  PackagePlus,
  Layers,
  Search
} from 'lucide-react';
import ManageProducts from './ManageProducts';
import ManageCategories from './ManageCategories';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    window.location.href = '/login';
  };

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: <Package size={20} />, label: 'Produits' },
    { path: '/admin/categories', icon: <Tags size={20} />, label: 'Catégories' },
  ];

  const getPageTitle = () => {
    if (location.pathname === '/admin') return 'Aperçu';
    if (location.pathname.includes('products')) return 'Produits';
    if (location.pathname.includes('categories')) return 'Catégories';
    return 'Admin';
  };

  return (
    <div className={`admin-layout ${isMobile ? 'is-mobile' : 'is-desktop'} ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {isMobile && isSidebarOpen && (
        <div className="mobile-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">R</div>
            <span className="logo-text">Rimy<span>Admin</span></span>
          </div>
          {isMobile && (
            <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {isActive && <ChevronRight size={14} className="active-arrow" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <div className="main-container">
        <header className="admin-header">
          <div className="header-left">
            <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <div className="header-page-info">
              <span className="breadcrumb-root">Admin</span>
              <ChevronRight size={12} className="breadcrumb-sep" />
              <span className="breadcrumb-current">{getPageTitle()}</span>
            </div>
          </div>

          <div className="header-right">
            <div className="profile-mini">
              <div className="profile-text">
                <span className="profile-name">Directeur</span>
                <span className="profile-role">Store Rimy</span>
              </div>
              <div className="profile-img">A</div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <div className="content-inner">
            <Routes>
              <Route path="/" element={<AdminHome />} />
              <Route path="/products" element={<ManageProducts />} />
              <Route path="/categories" element={<ManageCategories />} />
            </Routes>
          </div>
        </main>
      </div>

      <style jsx="true">{`
        :root {
          --sidebar-w: 260px;
          --header-h: 64px;
          --accent: #d4af37;
          --sidebar-bg: #0f172a;
          --main-bg: #f8fafc;
          --text-muted: #64748b;
          --text-main: #1e293b;
        }

        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: var(--main-bg);
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .sidebar {
          width: var(--sidebar-w);
          background: var(--sidebar-bg);
          color: white;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1001; /* Above header */
          display: flex;
          flex-direction: column;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-closed .sidebar {
          transform: translateX(-100%);
        }

        .sidebar-header {
          padding: 0 1.5rem;
          height: var(--header-h);
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .logo-section { display: flex; align-items: center; gap: 12px; }
        .logo-icon {
          width: 32px; height: 32px; background: var(--accent);
          border-radius: 8px; display: flex; align-items: center;
          justify-content: center; font-weight: 800; color: #1e293b;
        }
        .logo-text { font-size: 1.1rem; font-weight: 700; }
        .logo-text span { color: var(--accent); font-weight: 400; }

        .close-sidebar-btn {
          background: none; border: none; color: #94a3b8; cursor: pointer; display: flex;
        }

        .sidebar-nav { padding: 1.5rem 0.75rem; flex: 1; }
        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 0.75rem 1rem; color: #94a3b8;
          text-decoration: none; border-radius: 10px;
          margin-bottom: 4px; transition: all 0.2s;
        }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: white; }
        .nav-item.active { background: rgba(212, 175, 55, 0.15); color: var(--accent); font-weight: 600; }
        .active-arrow { margin-left: auto; }

        .sidebar-footer { padding: 1.25rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .logout-btn {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 0.75rem; background: transparent; border: 1px solid rgba(255,255,255,0.1);
          color: #ef4444; border-radius: 8px; cursor: pointer; font-family: inherit; font-size: 0.9rem;
        }

        .main-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .is-desktop.sidebar-open .main-container {
          margin-left: var(--sidebar-w);
        }

        .admin-header {
          height: var(--header-h);
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 900;
        }

        .header-left { display: flex; align-items: center; gap: 1rem; }
        .menu-toggle-btn {
          background: #f1f5f9; border: none; color: #1e293b;
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }

        .header-page-info { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.85rem; }
        .breadcrumb-current { color: var(--text-main); font-weight: 600; }

        .profile-mini { display: flex; align-items: center; gap: 10px; }
        .profile-text { text-align: right; }
        .profile-name { display: block; font-size: 0.9rem; font-weight: 700; color: var(--text-main); }
        .profile-role { display: block; font-size: 0.7rem; color: var(--text-muted); }
        .profile-img {
          width: 36px; height: 36px; border-radius: 10px;
          background: #f1f5f9; color: var(--accent);
          display: flex; align-items: center; justify-content: center; font-weight: 700;
        }

        .admin-content { padding: 1.5rem; flex: 1; }
        .content-inner { max-width: 1200px; margin: 0 auto; width: 100%; }

        .mobile-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); z-index: 1000;
        }

        @media (max-width: 1024px) {
          .admin-header { padding: 0 1rem; }
          .admin-content { padding: 1rem; }
          .profile-text, .header-page-info, .sidebar-open .main-container { margin-left: 0 !important; }
          .is-desktop.sidebar-open .main-container { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

const AdminHome = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, c] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/products`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/categories`)
        ]);
        setStats({ products: p.data.length, categories: c.data.length });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { label: 'Produits', value: stats.products, icon: <ShoppingBag />, color: '#4f46e5', link: '/admin/products' },
    { label: 'Catégories', value: stats.categories, icon: <Tags />, color: '#d4af37', link: '/admin/categories' },
    { label: 'Visites', value: '1,284', icon: <TrendingUp />, color: '#10b981', link: '#' },
    { label: 'Clients', value: '42', icon: <Users />, color: '#f59e0b', link: '#' },
  ];

  return (
    <div className="admin-home fade-in">
      <div className="welcome-section">
        <h1>Bonjour, Directeur 👋</h1>
        <p>Aperçu de l'activité de votre boutique Rimy.</p>
      </div>

      <div className="stats-grid">
        {cards.map(card => (
          <div key={card.label} className="stat-card" onClick={() => card.link !== '#' && navigate(card.link)}>
            <div className="stat-card-icon" style={{ background: `${card.color}10`, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-card-content">
              <span className="stat-card-value">{loading ? '...' : card.value}</span>
              <span className="stat-card-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-access">
        <h3>Actions Rapides</h3>
        <div className="quick-grid">
          <Link to="/admin/products" className="quick-card">
            <div className="quick-icon"><PackagePlus size={24} /></div>
            <div className="quick-info">
              <h4>Nouveau Produit</h4>
              <p>Mettre à jour l'inventaire</p>
            </div>
          </Link>
          <Link to="/admin/categories" className="quick-card">
            <div className="quick-icon secondary"><Layers size={24} /></div>
            <div className="quick-info">
              <h4>Catégories</h4>
              <p>Gérer les sections</p>
            </div>
          </Link>
        </div>
      </div>

      <style jsx="true">{`
        .welcome-section { margin-bottom: 2rem; }
        .welcome-section h1 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin: 0; }
        .welcome-section p { color: #64748b; margin-top: 4px; font-size: 0.95rem; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background: white; border-radius: 16px; padding: 1.5rem;
          border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 1.25rem;
          cursor: pointer; transition: 0.2s;
        }
        .stat-card:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.03); }
        .stat-card-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-card-value { display: block; font-size: 1.5rem; font-weight: 800; color: #1e293b; }
        .stat-card-label { font-size: 0.85rem; color: #64748b; font-weight: 500; }

        .quick-access h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem; color: #1e293b; }
        .quick-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; }
        .quick-card {
          background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem;
          display: flex; align-items: center; gap: 1rem; text-decoration: none; color: inherit; transition: 0.2s;
        }
        .quick-card:hover { border-color: var(--accent); background: #fdfbf7; transform: translateY(-2px); }
        .quick-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--accent); color: #1e293b; display: flex; align-items: center; justify-content: center; }
        .quick-icon.secondary { background: #f1f5f9; color: #64748b; }
        .quick-info h4 { margin: 0; font-size: 1rem; font-weight: 700; }
        .quick-info p { margin: 2px 0 0 0; font-size: 0.8rem; color: #64748b; }

        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr; }
          .quick-grid { grid-template-columns: 1fr; }
          .welcome-section h1 { font-size: 1.25rem; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
