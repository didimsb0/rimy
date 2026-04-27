import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MoreVertical, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import '../styles/TikTokRedirect.css';

const TikTokRedirect = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [copied, setCopied] = useState(false);

  const siteUrl = window.location.origin;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = siteUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
        className="tt-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="tt-logo">
          <span className="tt-r">R</span>
          <span>i</span>
          <span>m</span>
          <span className="tt-y">y</span>
        </div>

        <div className="tt-divider" />

        <h1 className="tt-title">
          {isAr ? 'افتح في المتصفح' : 'Ouvre dans ton navigateur'}
        </h1>

        <p className="tt-subtitle">
          {isAr
            ? 'تيك توك يمنع التصفح الكامل للموقع. اتبع الخطوات لتجربة أفضل.'
            : 'TikTok limite la navigation. Suis ces étapes pour une expérience optimale.'}
        </p>

        <div className="tt-steps">
          <div className="tt-step">
            <div className="tt-step-num">1</div>
            <div className="tt-step-text">
              {isAr ? 'اضغط على' : 'Appuie sur'}{' '}
              <span className="tt-icon-inline">
                <MoreVertical size={18} />
              </span>{' '}
              {isAr ? 'في الأعلى' : 'en haut'}
            </div>
          </div>

          <div className="tt-step">
            <div className="tt-step-num">2</div>
            <div className="tt-step-text">
              {isAr
                ? 'اختر "افتح في المتصفح"'
                : 'Choisis « Ouvrir dans le navigateur »'}
            </div>
          </div>
        </div>

        <div className="tt-actions">
          <button className="tt-btn tt-btn-primary" onClick={handleCopy}>
            {copied ? (
              <>
                <Check size={18} />
                {isAr ? 'تم النسخ' : 'Lien copié'}
              </>
            ) : (
              <>
                <Copy size={18} />
                {isAr ? 'انسخ الرابط' : 'Copier le lien'}
              </>
            )}
          </button>

          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tt-btn tt-btn-ghost"
          >
            <ExternalLink size={18} />
            {isAr ? 'فتح الموقع' : 'Ouvrir le site'}
          </a>
        </div>

        <p className="tt-footer">Savoir-faire • Élégance • Tradition</p>
      </motion.div>
    </div>
  );
};

export default TikTokRedirect;
