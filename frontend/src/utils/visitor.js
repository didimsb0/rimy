import axios from 'axios';

const STORAGE_KEY = 'rimy_visitor_id';
const SESSION_VISIT_KEY = 'rimy_visit_tracked';

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'v-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
};

export const getVisitorId = () => {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = generateId();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
};

export const getVisitorRef = () => getVisitorId().replace(/-/g, '').slice(0, 8).toUpperCase();

export const trackVisit = async () => {
  if (sessionStorage.getItem(SESSION_VISIT_KEY) === 'true') return;
  sessionStorage.setItem(SESSION_VISIT_KEY, 'true');

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/visits`, {
      visitorId: getVisitorId(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || null,
      path: window.location.pathname,
    });
  } catch (err) {
    sessionStorage.removeItem(SESSION_VISIT_KEY);
    console.warn('Visit tracking failed:', err.message);
  }
};

export const trackConversion = async ({ productId, productName, price, channel = 'whatsapp' }) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/conversions`, {
      visitorId: getVisitorId(),
      productId,
      productName,
      price,
      channel,
    });
  } catch (err) {
    console.warn('Conversion tracking failed:', err.message);
  }
};
