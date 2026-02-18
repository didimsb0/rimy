import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Calendar, Tags } from 'lucide-react';
import ManageProducts from './ManageProducts';
import ManageCategories from './ManageCategories';

const AdminDashboard = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Admin Rimy</h3>
        <nav>
          <Link to="/admin"><LayoutDashboard size={20} /> Dashboard</Link>
          <Link to="/admin/products"><PlusCircle size={20} /> Products</Link>
          <Link to="/admin/categories"><Tags size={20} /> Categories</Link>
        </nav>
      </aside>

      <main className="admin-main">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/products" element={<ManageProducts />} />
          <Route path="/categories" element={<ManageCategories />} />
        </Routes>
      </main>

      <style jsx="true">{`
        .admin-layout {
          display: flex;
          min-height: calc(100vh - 80px);
        }
        .admin-sidebar {
          width: 250px;
          background: #2c3e50;
          color: white;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .admin-sidebar h3 {
          color: var(--accent);
          font-family: 'Inter', sans-serif;
        }
        .admin-sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .admin-sidebar a {
          color: #ecf0f1;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 8px;
          transition: var(--transition);
        }
        .admin-sidebar a:hover {
          background: rgba(255,255,255,0.1);
        }
        .admin-main {
          flex: 1;
          padding: 3rem;
          background: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

const AdminHome = () => (
  <div>
    <h1>Tableau de Bord</h1>
    <p>Bienvenue dans l'espace de gestion de votre boutique Rimy.</p>
  </div>
);

export default AdminDashboard;
