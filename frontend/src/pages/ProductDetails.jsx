import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle, ChevronLeft } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;

    // Mock data (replace with API call)
    const product = {
        _id: id,
        name_fr: 'Robe Élégante Premium',
        name_ar: 'فستان أنيق متميز',
        description_fr: 'Une robe magnifique avec des détails dorés, parfaite pour vos soirées.',
        description_ar: 'فستان رائع بتفاصيل ذهبية، مثالي لسهراتكم.',
        price: 1500,
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'],
        isSoldOut: false,
        isBestSeller: true
    };

    const name = currentLang === 'ar' ? product.name_ar : product.name_fr;
    const description = currentLang === 'ar' ? product.description_ar : product.description_fr;

    const handleWhatsApp = () => {
        const text = `Bonjour Rimy, je souhaite commander le produit: ${name}\n\nPhoto: ${product.images[0]}`;
        window.open(`https://wa.me/22224230000?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="product-details-page container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <ChevronLeft /> {currentLang === 'ar' ? 'عودة' : 'Retour'}
            </button>

            <div className="product-layout">
                <div className="product-gallery">
                    <img src={product.images[0]} alt={name} className="main-image" />
                </div>

                <div className="product-main-info">
                    {product.isBestSeller && <span className="badge badge-best-seller">{t('best_sellers')}</span>}
                    <h1>{name}</h1>
                    <p className="detail-price">{product.price} MRU</p>
                    <div className="product-description">
                        <p>{description}</p>
                    </div>

                    <button className="btn btn-accent buy-btn" onClick={handleWhatsApp} disabled={product.isSoldOut}>
                        <MessageCircle size={20} />
                        {t('add_to_cart')}
                    </button>

                    <div className="safety-info">
                        <p>✓ Livraison disponible à Nouakchott</p>
                        <p>✓ Paiement à la livraison</p>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
        .product-details-page { padding-top: 2rem; padding-bottom: 5rem; }
        .back-btn { background: none; border: none; display: flex; align-items: center; gap: 5px; cursor: pointer; color: var(--text-dark); margin-bottom: 2rem; font-weight: 500; }
        .product-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
        .product-gallery { border-radius: var(--border-radius); overflow: hidden; box-shadow: var(--shadow); }
        .main-image { width: 100%; height: auto; display: block; }
        .product-main-info h1 { font-size: 3rem; margin: 1rem 0; }
        .detail-price { font-size: 2rem; font-weight: 800; color: var(--primary); margin-bottom: 2rem; }
        .product-description { font-size: 1.2rem; color: #666; margin-bottom: 3rem; }
        .buy-btn { width: 100%; font-size: 1.2rem; padding: 18px; display: flex; align-items: center; justify-content: center; gap: 12px; }
        .safety-info { margin-top: 3rem; padding: 1.5rem; background: #f9f9f9; border-radius: 8px; font-size: 0.9rem; color: #888; display: flex; flex-direction: column; gap: 10px; }
        @media (max-width: 768px) {
          .product-layout { grid-template-columns: 1fr; gap: 2rem; }
          .product-main-info h1 { font-size: 2rem; }
        }
      `}</style>
        </div>
    );
};

export default ProductDetails;
