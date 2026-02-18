import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const name = currentLang === 'ar' ? product.name_ar : product.name_fr;
  const description = currentLang === 'ar' ? product.description_ar : product.description_fr;

  const handleWhatsApp = () => {
    const text = `Bonjour Rimy, je souhaite commander le produit: ${name}\n\nPhoto: ${product.images[0] || ''}`;
    window.open(`https://wa.me/22224230000?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.images[0] || 'https://via.placeholder.com/400x500?text=RIMY'} alt={name} className="product-image" />
        {product.isSoldOut && <span className="badge badge-sold-out absolute-badge">{t('sold_out')}</span>}
        {product.isBestSeller && <span className="badge badge-best-seller absolute-badge top-right">{t('best_sellers')}</span>}
      </div>

      <div className="product-info">
        <h3>{name}</h3>
        <p className="price">{product.price} MRU</p>
      </div>

      <div className="product-actions" style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
        <button className="btn btn-accent full-width-btn" onClick={handleWhatsApp} disabled={product.isSoldOut}>
          <MessageCircle size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          {t('add_to_cart')}
        </button>
      </div>

      <style jsx="true">{`
        .product-card {
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          overflow: hidden;
          transition: var(--transition);
          border: 1px solid #f0f0f0;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        .product-image-container {
          position: relative;
          height: 400px;
          overflow: hidden;
        }
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition);
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .absolute-badge {
          position: absolute;
          bottom: 15px;
          left: 15px;
        }
        .top-right {
          top: 15px;
          right: 15px;
          bottom: auto;
          left: auto;
        }
        .product-info {
          padding: 1.5rem 1.5rem 0.5rem 1.5rem;
          text-align: center;
        }
        .product-info h3 {
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
          color: var(--text-dark);
        }
        .price {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 1.5rem;
        }
        .full-width-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
