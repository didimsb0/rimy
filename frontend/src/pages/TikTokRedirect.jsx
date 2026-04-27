import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowUp, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import '../styles/TikTokRedirect.css';

const TikTokRedirect = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [copied, setCopied] = useState(false);

  const siteUrl = window.location.origin;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = siteUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  const handleOpen = async () => {
    await copyLink();
    setCopied(true);
    setTimeout(() => {
      window.location.href = siteUrl;
    }, 600);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(isAr ? 'fr' : 'ar');
  };

  return (
    <div className="tiktok-redirect">
      <div className="tt-stars">
        {Array.from({ length: 60 }).map((_, i) => (
          <span
            key={i}
            className="tt-star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <button className="tt-lang" onClick={toggleLanguage}>
        {isAr ? 'Français' : 'العربية'}
      </button>

      <motion.div
        className="tt-arrow-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{ delay: 0.4, duration: 1.6, repeat: Infinity }}
      >
        <ArrowUp size={36} strokeWidth={2.5} />
        <span className="tt-arrow-label">
          {isAr ? 'اضغط هنا ⋮' : 'Appuie ici ⋮'}
        </span>
      </motion.div>

      <motion.div
        className="tt-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="tt-logo">
          <span className="tt-r">R</span>
          <span>i</span>
          <span>m</span>
          <span className="tt-y">y</span>
        </div>

        <div className="tt-divider" />

        <h1 className="tt-title">
          {isAr ? 'افتح الموقع كاملًا' : 'Accède au site complet'}
        </h1>

        <p className="tt-subtitle">
          {isAr
            ? 'اختر «فتح في المتصفح» للحصول على أفضل تجربة.'
            : 'Choisis « Ouvrir dans le navigateur » pour la meilleure expérience.'}
        </p>

        <button className="tt-btn-cta" onClick={handleOpen}>
          {copied ? (
            <>
              <Check size={22} strokeWidth={2.5} />
              {isAr ? 'تم نسخ الرابط' : 'Lien copié'}
            </>
          ) : (
            <>
              <Sparkles size={22} strokeWidth={2.5} />
              {isAr ? 'افتح الموقع' : 'Ouvrir le site'}
            </>
          )}
        </button>

        <p className="tt-footer">Savoir-faire • Élégance • Tradition</p>
      </motion.div>
    </div>
  );
};

export default TikTokRedirect;
