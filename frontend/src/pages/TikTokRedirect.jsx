import { motion } from 'framer-motion';
import { MoreVertical, ArrowDown, Globe } from 'lucide-react';
import '../styles/TikTokRedirect.css';

const TikTokRedirect = () => {
  return (
    <div className="tiktok-redirect" dir="rtl">
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

      <motion.div
        className="tt-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="tt-logo-wrap">
          <img src="/logo.jpg" alt="Rimy" className="tt-logo-img" />
        </div>

        <div className="tt-divider" />

        <h1 className="tt-title">مرحبًا بكم في ريمي</h1>
        <p className="tt-subtitle">
          لتصفح الموقع كاملًا، الرجاء فتحه في المتصفح
        </p>

        <div className="tt-guide">
          <div className="tt-guide-row">
            <div className="tt-step-circle">1</div>
            <div className="tt-step-body">
              <div className="tt-step-text">اضغط على النقاط الثلاث</div>
              <div className="tt-icon-pill">
                <MoreVertical size={22} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <motion.div
            className="tt-guide-arrow"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <ArrowDown size={26} strokeWidth={2.5} />
          </motion.div>

          <div className="tt-guide-row">
            <div className="tt-step-circle">2</div>
            <div className="tt-step-body">
              <div className="tt-step-text">اختر «فتح في المتصفح»</div>
              <div className="tt-icon-pill tt-icon-pill-browser">
                <Globe size={22} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="tt-pointer"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="tt-pointer-label">ابدأ من هنا</div>
          <div className="tt-pointer-arrow">↑</div>
        </motion.div>

        <p className="tt-footer">Savoir-faire • Élégance • Tradition</p>
      </motion.div>
    </div>
  );
};

export default TikTokRedirect;
