import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, eventRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/events')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
        setEvents(eventRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category?._id === selectedCategory);

  return (
    <main className="home">
      {/* Event Banner */}
      {events.length > 0 && (
        <motion.div
          className="event-banner"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container">
            <p>
              {i18n.language === 'ar'
                ? 'رمضان مبارك مع ريمي'
                : 'Ramadan Moubarak avec Rimy'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <motion.section
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container hero-content">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {t('welcome')}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Exclusivité, Élégance et Qualité
          </motion.p>
          <motion.a
            href="#products"
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('shop_now')}
          </motion.a>
        </div>
      </motion.section>

      {/* Category Filter */}
      <section id="products" className="container main-catalog">
        <div className="filter-bar">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            {t('all')}
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              className={`filter-btn ${selectedCategory === cat._id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat._id)}
            >
              {i18n.language === 'ar' ? cat.name_ar : cat.name_fr}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">Chargement...</div>
        ) : (
          <motion.div
            className="product-grid"
            layout
          >
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map(product => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="empty-state">Aucun produit trouvé dans cette catégorie.</div>
        )}
      </section>

      <style jsx="true">{`
        .hero {
          height: 70vh;
          background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/port.jpg');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          margin-bottom: 4rem;
        }
        .hero h1 {
          font-size: 4.5rem;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 4px;
        }
        .hero p {
          font-size: 1.8rem;
          margin-bottom: 2.5rem;
          font-family: 'Playfair Display', serif;
          font-style: italic;
        }
        .main-catalog {
          padding-bottom: 5rem;
        }
        .filter-bar {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 4rem;
          overflow-x: auto;
          padding: 15px 0;
          scrollbar-width: none;
        }
        .filter-bar::-webkit-scrollbar { display: none; }
        .filter-btn {
          background: white;
          border: 1px solid #eee;
          padding: 12px 30px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 1px;
          transition: var(--transition);
        }
        .filter-btn:hover {
          border-color: var(--accent);
        }
        .filter-btn.active {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 3rem;
        }
        .hero { height: 50vh; margin-bottom: 2rem; }
          .hero h1 { font-size: 2.2rem; letter-spacing: 2px; }
          .hero p { font-size: 1.2rem; }
          .filter-bar { justify-content: flex-start; padding: 10px 20px; }
          .product-grid { gap: 1.5rem; }
        }

        .event-banner {
          background: var(--accent);
          color: black;
          padding: 10px 0;
          text-align: center;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.9rem;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        [dir="rtl"] .event-banner {
          font-family: 'Noto Sans Arabic', sans-serif;
          letter-spacing: 0;
          font-size: 1.1rem;
        }
      `}</style>
    </main>
  );
};

export default Home;
