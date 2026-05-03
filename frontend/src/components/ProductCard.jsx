import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';
import '../styles/ProductCard.css';
import { trackConversion, getVisitorRef } from '../utils/visitor';

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const name = currentLang === 'ar' ? product.name_ar : product.name_fr;
  const hasDiscount = product.discountPercentage > 0;
  const finalPrice = hasDiscount ? product.finalPrice : product.price;

  const handleWhatsApp = () => {
    trackConversion({
      productId: product._id,
      productName: product.name_fr,
      price: finalPrice,
    });

    const ref = getVisitorRef();
    const priceLineFr = hasDiscount
      ? `💰 *Prix* : ~${product.price} MRU~ ➜ *${finalPrice} MRU* (-${product.discountPercentage}%)`
      : `💰 *Prix* : ${product.price} MRU`;
    const priceLineAr = hasDiscount
      ? `💰 *السعر* : ~${product.price} أوقية~ ➜ *${finalPrice} أوقية* (-${product.discountPercentage}%)`
      : `💰 *السعر* : ${product.price} أوقية`;

    const textFr = `Bonjour Rimy ✨\n\nJe suis très intéressé(e) par ce produit et j'aimerais passer commande :\n\n🛍️ *Produit* : ${product.name_fr}\n${priceLineFr}\n\nPouvez-vous s'il vous plaît me confirmer la disponibilité ? Merci !\n\nPhoto: ${product.images[0] || ''}\n\nRéf: ${ref}`;
    const textAr = `مرحباً ريمي ✨\n\nأنا مهتم(ة) جداً بهذا المنتج وأود تقديم طلب:\n\n🛍️ *المنتج* : ${product.name_ar}\n${priceLineAr}\n\nهل يمكنكم تأكيد توفر هذا المنتج؟ شكراً لكم!\n\nصورة: ${product.images[0] || ''}\n\nالمرجع: ${ref}`;
    const text = currentLang === 'ar' ? textAr : textFr;

    window.open(`https://wa.me/22224230000?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.images[0] || 'https://via.placeholder.com/400x500?text=RIMY'}
          alt={name}
          className="product-image"
        />
        <div className="product-logo-overlay">
          <img src="/logo.jpg" alt="Rimy" className="product-logo-watermark" />
        </div>
        {product.isSoldOut && (
          <span className="badge badge-sold-out absolute-badge">{t('sold_out')}</span>
        )}
        {product.isBestSeller && (
          <span className="badge badge-best-seller absolute-badge top-right">{t('best_sellers')}</span>
        )}
        {product.isNew && (
          <span className="badge badge-new absolute-badge top-right-2">{t('new') || 'Nouveau'}</span>
        )}
        {hasDiscount && (
          <span className="badge badge-discount absolute-badge top-left">-{product.discountPercentage}%</span>
        )}
      </div>

      <div className="product-info">
        <h3>{name}</h3>
        {hasDiscount ? (
          <p className="price">
            <span className="price-old">{product.price} MRU</span>
            <span className="price-new">{finalPrice} MRU</span>
          </p>
        ) : (
          <p className="price">{product.price} MRU</p>
        )}
      </div>

      <div className="product-actions">
        <button
          className="btn btn-accent full-width-btn"
          onClick={handleWhatsApp}
          disabled={product.isSoldOut}
        >
          <MessageCircle size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          {t('add_to_cart')}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
