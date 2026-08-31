// ============================================================
//  Ethics Critic — Security, Privacy & Enterprise Hardening
// ============================================================

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

/**
 * PII Sanitizer / Redactor
 * Strips personally identifiable information before prompts reach LLM inference providers.
 */
function sanitizePII(text) {
  if (!text || typeof text !== 'string') return text;

  let sanitized = text;

  // 1. Email addresses
  sanitized = sanitized.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    '[EMAIL_REDACTED]'
  );

  // 2. Phone numbers (international and local formats)
  sanitized = sanitized.replace(
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    '[PHONE_REDACTED]'
  );

  // 3. Social Security Numbers (SSN) / National ID formats
  sanitized = sanitized.replace(
    /\b\d{3}[-.\s]\d{2}[-.\s]\d{4}\b/g,
    '[SSN_REDACTED]'
  );

  // 4. Credit card numbers (major cards: Visa, MC, Amex, Discover)
  sanitized = sanitized.replace(
    /\b(?:\d{4}[- ]?){3}\d{4}\b|\b3[47]\d{13}\b/g,
    '[CREDIT_CARD_REDACTED]'
  );

  // 5. IPv4 addresses
  sanitized = sanitized.replace(
    /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g,
    '[IP_REDACTED]'
  );

  return sanitized;
}

/**
 * Chat Endpoint Rate Limiter
 * Limits requests to 40 per minute per IP to protect LLM provider quotas and prevent DDoS.
 */
const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many evaluation requests from this IP. Please wait 1 minute before submitting another query.'
  }
});

/**
 * Global API Rate Limiter
 */
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 250,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP. Please try again later.'
  }
});

/**
 * Configure Helmet with appropriate CSP for Vite / SSE client assets
 */
const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "https:", "wss:", "ws:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false,
});

module.exports = {
  sanitizePII,
  chatRateLimiter,
  globalRateLimiter,
  helmetMiddleware,
};
