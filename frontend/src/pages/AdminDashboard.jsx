import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard,
  Package,
  Tags,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Users,
  ShoppingBag,
  Plus,
  PackagePlus,
  Layers
} from 'lucide-react';
import ManageProducts from './ManageProducts';
import ManageCategories from './ManageCategories';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    window.location.href = '/login';
  };

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', exact: true },
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
    <div className={`admin-layout ${!isSidebarOpen && !isMobile ? 'sidebar-collapsed' : ''} ${mobileMenuOpen ? 'mobile-menu-active' : ''}`}>
      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobile ? (mobileMenuOpen ? 'mobile-open' : 'mobile-closed') : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">R</div>
            {(isSidebarOpen || isMobile) && <span className="logo-text">Rimy<span>Admin</span></span>}
          </div>
          {isMobile ? (
            <button className="close-menu-btn" onClick={() => setMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          ) : (
            <button className="collapse-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <Menu size={18} /> : <Menu size={18} />}
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
                {(isSidebarOpen || isMobile) && <span className="nav-label">{item.label}</span>}
                {isActive && (isSidebarOpen || isMobile) && <ChevronRight size={14} className="active-arrow" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            {(isSidebarOpen || isMobile) && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-status-header">
          <div className="header-left">
            {isMobile && (
              <button className="mobile-toggle" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={24} />
              </button>
            )}
            <div className="breadcrumb">
              <span className="root">Admin</span>
              <ChevronRight size={14} />
              <span className="current">{getPageTitle()}</span>
            </div>
          </div>

          <div className="header-right">
            <div className="admin-profile">
              <div className="profile-info">
                <span className="name">Directeur</span>
                <span className="role">Boutique Rimy</span>
              </div>
              <div className="profile-avatar">A</div>
            </div>
          </div>
        </header>

        <div className="content-body">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/products" element={<ManageProducts />} />
            <Route path="/categories" element={<ManageCategories />} />
          </Routes>
        </div>
      </main>

      <style jsx="true">{`
        :root {
          --sidebar-width: 260px;
          --sidebar-collapsed: 80px;
          --header-height: 70px;
          --accent: #d4af37;
          --bg: #f8fafc;
          --sidebar-bg: #0f172a;
          --sidebar-item-active: rgba(212, 175, 55, 0.15);
        }

        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg);
          font-family: 'Inter', sans-serif;
        }

        /* Sidebar */
        .sidebar {
          width: var(--sidebar-width);
          background: var(--sidebar-bg);
          color: white;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: fixed;
          height: 100vh;
          z-index: 1000;
        }

        .sidebar-collapsed .sidebar { width: var(--sidebar-collapsed); }

        .sidebar-header {
          height: var(--header-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .logo-section { display: flex; align-items: center; gap: 12px; }
        .logo-icon {
          width: 35px; height: 35px; background: var(--accent);
          border-radius: 8px; display: flex; align-items: center;
          justify-content: center; font-weight: 800; font-size: 1.2rem; color: #1e293b;
        }
        .logo-text { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.5px; }
        .logo-text span { color: var(--accent); margin-left: 2px; font-weight: 400; }

        .collapse-btn, .close-menu-btn {
          background: transparent; border: none; color: #94a3b8;
          cursor: pointer; padding: 4px; border-radius: 6px; display: flex;
        }
        .collapse-btn:hover, .close-menu-btn:hover { background: rgba(255,255,255,0.05); color: white; }

        .sidebar-nav { padding: 1.5rem 0.75rem; flex: 1; }
        .nav-item {
          display: flex; align-items: center; padding: 0.85rem 1rem;
          color: #94a3b8; text-decoration: none; border-radius: 12px;
          margin-bottom: 0.5rem; transition: all 0.2s; gap: 12px;
          position: relative;
        }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: white; }
        .nav-item.active { background: var(--sidebar-item-active); color: var(--accent); font-weight: 600; }
        .nav-item.active::before {
          content: ''; position: absolute; left: 0; top: 15%; bottom: 15%;
          width: 3px; background: var(--accent); border-radius: 0 4px 4px 0;
        }
        .active-arrow { margin-left: auto; }

        .sidebar-footer { padding: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .logout-btn {
          width: 100%; display: flex; align-items: center; gap: 12px;
          padding: 0.75rem; background: transparent; border: 1px solid rgba(255,255,255,0.1);
          color: #ef4444; border-radius: 10px; cursor: pointer; transition: all 0.2s;
          font-weight: 500;
        }
        .logout-btn:hover { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; }

        /* Content */
        .main-content {
          flex: 1;
          margin-left: var(--sidebar-width);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 0;
        }
        .sidebar-collapsed .main-content { margin-left: var(--sidebar-collapsed); }

        .content-status-header {
          height: var(--header-height);
          background: white;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 900;
        }

        .header-left { display: flex; align-items: center; gap: 1rem; }
        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #64748b; }
        .breadcrumb .current { color: #1e293b; font-weight: 600; }

        .mobile-toggle {
          background: #f1f5f9; border: none; color: #1e293b;
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }

        .admin-profile { display: flex; align-items: center; gap: 12px; }
        .profile-info { text-align: right; }
        .profile-info .name { display: block; font-size: 0.95rem; font-weight: 700; color: #1e293b; }
        .profile-info .role { display: block; font-size: 0.75rem; color: #64748b; }
        .profile-avatar {
          width: 40px; height: 40px; border-radius: 12px;
          background: #f1f5f9; color: var(--accent);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .content-body { padding: 2rem; max-width: 1400px; margin: 0 auto; }

        /* Responsive */
        @media (max-width: 1024px) {
          .sidebar { 
            transform: translateX(-100%);
            width: 280px; 
          }
          .sidebar.mobile-open { transform: translateX(0); }
          .main-content { margin-left: 0 !important; }
          .content-status-header { padding: 0 1rem; }
          .content-body { padding: 1.5rem 1rem; }
          
          .mobile-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(4px);
            z-index: 999;
          }
        }

        @media (max-width: 640px) {
          .profile-info, .breadcrumb { display: none; }
          .header-right { margin-left: auto; }
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
    { label: 'Vues', value: '1,284', icon: <TrendingUp />, color: '#10b981', link: '#' },
    { label: 'Clients', value: '42', icon: <Users />, color: '#f59e0b', link: '#' },
  ];

  return (
    <div className="admin-home fade-in">
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Bonjour, Directeur 👋</h1>
          <p>Voici l'état actuel de votre boutique Rimy.</p>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map(card => (
          <div key={card.label} className="stat-card" onClick={() => navigate(card.link)}>
            <div className="stat-icon" style={{ background: `${card.color}15`, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <span className="stat-value">{loading ? '...' : card.value}</span>
              <span className="stat-label">{card.label}</span>
            </div>
            <ChevronRight className="stat-arrow" size={16} />
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h3>Gestion Rapide</h3>
        <div className="action-buttons">
          <Link to="/admin/products" className="action-item">
            <div className="action-icon"><PackagePlus size={20} /></div>
            <div className="action-label">
              <h4>Nouveau Produit</h4>
              <p>Ajouter à l'inventaire</p>
            </div>
          </Link>
          <Link to="/admin/categories" className="action-item">
            <div className="action-icon secondary"><Layers size={20} /></div>
            <div className="action-label">
              <h4>Catégories</h4>
              <p>Organiser le catalogue</p>
            </div>
          </Link>
        </div>
      </div>

      <style jsx="true">{`
        .welcome-banner { margin-bottom: 2rem; }
        .welcome-text h1 { font-size: 1.75rem; font-weight: 800; color: #1e293b; margin: 0 0 0.5rem 0; }
        .welcome-text p { color: #64748b; margin: 0; }

        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
          gap: 1.25rem; 
          margin-bottom: 2.5rem; 
        }
        
        .stat-card {
          background: white; padding: 1.5rem; border-radius: 16px;
          display: flex; align-items: center; gap: 1.25rem;
          border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.3s;
          position: relative;
        }
        .stat-card:hover { transform: translateY(-4px); border-color: var(--accent); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        
        .stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-info { display: flex; flex-direction: column; }
        .stat-value { font-size: 1.5rem; font-weight: 800; color: #1e293b; }
        .stat-label { font-size: 0.85rem; color: #64748b; font-weight: 500; }
        .stat-arrow { position: absolute; right: 1.25rem; color: #cbd5e1; opacity: 0; transition: all 0.3s; }
        .stat-card:hover .stat-arrow { opacity: 1; transform: translateX(5px); }

        .quick-actions h3 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 1.25rem; }
        .action-buttons { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; }
        .action-item {
          background: white; border: 1px solid #e2e8f0; border-radius: 16px;
          padding: 1.25rem; display: flex; align-items: center; gap: 1rem;
          text-decoration: none; color: #1e293b; transition: all 0.2s;
        }
        .action-item:hover { border-color: var(--accent); background: #fdfbf7; transform: scale(1.02); }
        .action-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--accent); color: #1e293b; display: flex; align-items: center; justify-content: center; }
        .action-icon.secondary { background: #f1f5f9; color: #64748b; }
        
        .action-label h4 { margin: 0; font-size: 0.95rem; font-weight: 700; }
        .action-label p { margin: 2px 0 0 0; font-size: 0.8rem; color: #64748b; }

        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr; }
          .action-buttons { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
