import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  PlusCircle,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  PackagePlus,
  Layers
} from 'lucide-react';
import ManageProducts from './ManageProducts';
import ManageCategories from './ManageCategories';

const AdminDashboard = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Tableau de Bord', exact: true },
    { path: '/admin/products', icon: <Package size={20} />, label: 'Produits' },
    { path: '/admin/categories', icon: <Tags size={20} />, label: 'Catégories' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    window.location.href = '/login';
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo-circle">R</div>
          <h2>Admin Rimy</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path) && location.pathname !== '/admin/categories' && location.pathname !== '/admin/products' || location.pathname === item.path;

            // Fix for nested paths
            const activeClass = (item.path === '/admin' && location.pathname === '/admin') ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path))
              ? 'active' : '';

            return (
              <Link key={item.path} to={item.path} className={`nav-item ${activeClass}`}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {activeClass && <ChevronRight size={14} className="active-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="content-header">
          <div className="header-title">
            <h1>{
              location.pathname === '/admin' ? 'Aperçu' :
                location.pathname.includes('products') ? 'Gestion des Produits' :
                  location.pathname.includes('categories') ? 'Gestion des Catégories' : 'Admin'
            }</h1>
            <p>Bienvenue dans votre espace d'administration</p>
          </div>
          <div className="header-actions">
            <button className="btn-icon"><Settings size={20} /></button>
            <div className="user-profile">
              <span>Admin</span>
              <div className="avatar">A</div>
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
        .admin-container {
          display: flex;
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: 'Inter', sans-serif;
        }

        /* Sidebar Styling */
        .admin-sidebar {
          width: 280px;
          background: #0f172a;
          color: white;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          position: sticky;
          top: 0;
          height: 100vh;
          box-shadow: 4px 0 10px rgba(0,0,0,0.1);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 3rem;
          padding: 0.5rem;
        }

        .logo-circle {
          width: 40px;
          height: 40px;
          background: var(--accent);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.2rem;
          box-shadow: 0 4px 10px rgba(212, 175, 55, 0.3);
        }

        .sidebar-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.5px;
          font-family: 'Inter', sans-serif;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #94a3b8;
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .nav-item.active {
          background: rgba(212, 175, 55, 0.1);
          color: var(--accent);
          font-weight: 600;
        }

        .active-indicator {
          margin-left: auto;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: transparent;
          border: none;
          color: #ef4444;
          cursor: pointer;
          border-radius: 10px;
          transition: background 0.2s;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        /* Main Content Styling */
        .admin-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .content-header {
          padding: 1.5rem 3rem;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-title h1 {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          color: #1e293b;
          font-family: 'Inter', sans-serif;
        }

        .header-title p {
          font-size: 0.875rem;
          color: #64748b;
          margin: 4px 0 0 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .btn-icon {
          background: #f1f5f9;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-icon:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-left: 1.5rem;
          border-left: 1px solid #e2e8f0;
        }

        .user-profile span {
          font-weight: 600;
          font-size: 0.9rem;
          color: #1e293b;
        }

        .avatar {
          width: 36px;
          height: 36px;
          background: #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #475569;
          font-size: 0.8rem;
        }

        .content-body {
          padding: 3rem;
          flex: 1;
        }

        @media (max-width: 1024px) {
          .admin-sidebar { width: 80px; padding: 1rem; }
          .sidebar-header h2, .nav-label, .active-indicator, .logout-btn span { display: none; }
          .sidebar-header { justify-content: center; margin-bottom: 2rem; }
          .nav-item { justify-content: center; }
          .content-header, .content-body { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

const AdminHome = () => {
  const [stats, setStats] = React.useState({ products: 0, categories: 0 });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/products`).then(r => r.json()),
          fetch(`${import.meta.env.VITE_API_URL}/api/categories`).then(r => r.json())
        ]);
        setStats({
          products: Array.isArray(prodRes) ? prodRes.length : 0,
          categories: Array.isArray(catRes) ? catRes.length : 0
        });
      } catch (err) {
        console.error("Erreur stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="fade-in">
      <div className="welcome-banner">
        <div className="banner-text">
          <h2>Bonjour, Admin !</h2>
          <p>Voici ce qui se passe dans votre boutique aujourd'hui.</p>
        </div>
        <div className="trending-icon">
          <TrendingUp size={32} />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon products-bg">
            <Package size={24} />
          </div>
          <div className="stat-data">
            <span className="stat-label">Total Produits</span>
            <h3 className="stat-value">{loading ? '...' : stats.products}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon categories-bg">
            <Layers size={24} />
          </div>
          <div className="stat-data">
            <span className="stat-label">Catégories</span>
            <h3 className="stat-value">{loading ? '...' : stats.categories}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon sales-bg">
            <TrendingUp size={24} />
          </div>
          <div className="stat-data">
            <span className="stat-label">Performances</span>
            <h3 className="stat-value">Stable</h3>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Actions Rapides</h3>
        <div className="actions-grid">
          <Link to="/admin/products" className="action-card">
            <div className="action-icon"><PackagePlus /></div>
            <div className="action-info">
              <h4>Ajouter Produit</h4>
              <p>Mettre en ligne un nouvel article</p>
            </div>
          </Link>
          <Link to="/admin/categories" className="action-card">
            <div className="action-icon"><PlusCircle /></div>
            <div className="action-info">
              <h4>Nouvelle Catégorie</h4>
              <p>Organiser vos produits</p>
            </div>
          </Link>
        </div>
      </div>

      <style jsx="true">{`
        .welcome-banner {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: white;
          padding: 2.5rem;
          border-radius: 20px;
          margin-bottom: 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .banner-text h2 {
          font-size: 1.75rem;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }

        .banner-text p {
          opacity: 0.7;
          margin: 8px 0 0 0;
        }

        .trending-icon {
          width: 64px;
          height: 64px;
          background: rgba(255,255,255,0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
          border: 1px solid #f1f5f9;
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px rgba(0,0,0,0.05);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .products-bg { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); }
        .categories-bg { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); }
        .sales-bg { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 4px 0 0 0;
          color: #1e293b;
        }

        .quick-actions {
          margin-top: 2rem;
        }

        .quick-actions h3 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          color: #1e293b;
          font-family: 'Inter', sans-serif;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .action-card {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          text-decoration: none;
          color: inherit;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          border: 1px solid #f1f5f9;
          transition: all 0.2s;
        }

        .action-card:hover {
          border-color: var(--accent);
          background: #fffcf5;
          transform: scale(1.02);
        }

        .action-icon {
          width: 48px;
          height: 48px;
          background: #f8fafc;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          transition: all 0.2s;
        }

        .action-card:hover .action-icon {
          background: var(--accent);
          color: white;
        }

        .action-info h4 {
          margin: 0;
          font-size: 1rem;
          color: #1e293b;
        }

        .action-info p {
          margin: 4px 0 0 0;
          font-size: 0.875rem;
          color: #64748b;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
