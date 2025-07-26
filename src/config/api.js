const API_CONFIG = {
  endpoint: import.meta.env.VITE_API_ENDPOINT || '',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

const getApiHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
});

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags and entities
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[<>&'"]/g, (char) => {
      const entities = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&#39;',
        '"': '&quot;'
      };
      return entities[char];
    })
    .trim();
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10 && phone.length <= 20;
};

export { API_CONFIG, getApiHeaders, sanitizeInput, validateEmail, validatePhoneNumber };