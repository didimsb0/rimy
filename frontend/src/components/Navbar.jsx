import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <img src="/logo.jpg" alt="RIMY" className="logo-img" />
        </Link>

        {/* Desktop Links */}
        <div className="nav-links desktop-only">
          <Link to="/">{t('categories')}</Link>
          <button onClick={toggleLanguage} className="lang-btn">
            <Globe size={18} />
            {t('lang_toggle')}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle mobile-only" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu mobile-only">
          <Link to="/" onClick={() => setIsOpen(false)}>{t('categories')}</Link>
          <button onClick={() => { toggleLanguage(); setIsOpen(false); }} className="lang-btn">
            <Globe size={18} />
            {t('lang_toggle')}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
