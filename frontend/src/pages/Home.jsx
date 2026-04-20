import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${apiUrl}/api/products`),
          axios.get(`${apiUrl}/api/categories`),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = (Array.isArray(products) ? products : []).filter(p =>
    selectedCategory === 'all' || p.category?._id === selectedCategory
  );

  return (
    <main className="home">
      {/* Hero */}
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

      {/* Catalog */}
      <section id="products" className="container main-catalog">
        {/* Category Filter */}
        <div className="filter-bar">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            {t('all')}
          </button>
          {(Array.isArray(categories) ? categories : []).map(cat => (
            <button
              key={cat._id}
              className={`filter-btn ${selectedCategory === cat._id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat._id)}
            >
              {i18n.language === 'ar' ? cat.name_ar : cat.name_fr}
            </button>
          ))}
        </div>

        {/* Social Links */}
        <div className="social-links-bar">
          <a href="https://wa.me/22224230000" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
          </a>
          <a href="https://www.tiktok.com/@rimyline?_r=1&_t=ZS-95EXezhOcNR" target="_blank" rel="noopener noreferrer" className="social-link tiktok">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.44-.01 2.76.01 5.51-.01 8.27-.04 2.12-.76 4.31-2.48 5.62-1.8 1.34-4.51 1.66-6.42.7-2.02-1.01-3.15-3.35-3-5.59.03-1.63.7-3.2 1.94-4.27 1.4-1.25 3.51-1.62 5.25-1.01V12.8c-1.12-.39-2.52-.16-3.41.67-.65.59-.97 1.51-.83 2.37.07.82.52 1.61 1.25 2.01.62.33 1.37.38 2.05.15.5-.16.89-.54 1.09-1.02.26-.52.24-1.13.24-1.71V0z" /></svg>
          </a>
          <a href="https://www.facebook.com/share/1KMx4s8F5p/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-link facebook">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
          </a>
          <a href="https://snapchat.com/t/CErbBbRs" target="_blank" rel="noopener noreferrer" className="social-link snapchat">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.0001 0.700195C11.5301 0.700195 10.8201 0.770195 10.1901 0.880195C7.21008 1.43019 4.70008 3.55019 3.65008 6.40019C3.49008 6.84019 3.40008 7.30019 3.40008 7.78019C3.40008 10.2802 4.41008 12.2302 5.39008 13.0602C5.55008 13.1902 5.61008 13.2902 5.61008 13.3402C5.61008 13.4302 5.48008 13.5602 5.10008 13.8802C4.16008 14.6502 2.63008 15.9102 2.63008 17.6502C2.63008 18.0002 2.76008 18.3302 2.99008 18.5902C3.51008 19.1602 4.96008 19.2902 6.55008 19.2902C6.73008 19.2902 6.91008 19.2902 7.09008 19.2902C7.30008 19.4602 7.55008 19.7202 7.82008 20.0802C8.17008 20.5502 8.79008 21.6002 8.92008 22.0102C9.28008 23.0102 10.3201 23.2902 11.2301 23.2902H11.2401C12.1501 23.2902 13.1901 23.0102 13.5501 22.0102C13.6801 21.6002 14.3001 20.5502 14.6501 20.0802C14.9201 19.7202 15.1701 19.4602 15.3801 19.2902C15.5601 19.2902 15.7401 19.2902 15.9201 19.2902C17.5101 19.2902 18.9601 19.1602 19.4801 18.5902C19.7101 18.3302 19.8401 18.0002 19.8401 17.6502C19.8401 15.9102 18.3101 14.6502 17.3701 13.8802C16.9901 13.5602 16.8601 13.4302 16.8601 13.3402C16.8601 13.2902 16.9201 13.1902 17.0801 13.0602C18.0601 12.2302 19.0701 10.2802 19.0701 7.78019C19.0701 7.30019 18.9801 6.84019 18.8201 6.40019C17.7701 3.55019 15.2601 1.43019 12.2801 0.880195C12.1101 0.850195 12.0001 0.800195 12.0001 0.700195V0.700195Z" /></svg>
          </a>
        </div>

        {/* Store Info */}
        <div className="store-info-premium">
          <div className="opening-hours-card">
            <Clock size={20} className="info-icon" />
            <div className="hours-text">
              <span className="label">{i18n.language === 'ar' ? 'أوقات العمل' : "Horaires d'ouverture"}</span>
              <p className="value">{t('opening_hours')}</p>
            </div>
          </div>
          <a href="https://maps.app.goo.gl/emd3qBnxFTF1PJQP9?g_st=ic" target="_blank" rel="noopener noreferrer" className="location-card">
            <div className="location-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
            </div>
            <span>{t('location')}</span>
          </a>
        </div>

        {/* Products */}
        {loading ? (
          <div className="loading-state">Chargement...</div>
        ) : (
          <div className="product-grid">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(product => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="empty-state">Aucun produit trouvé dans cette catégorie.</div>
        )}
      </section>
    </main>
  );
};

export default Home;
