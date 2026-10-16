/* =====================================================================
 * js/utils/validators.js
 * WHAT IT DOES : Input checks: card number (Luhn) and brand, card expiry, password strength, password hashing (demo).
 * NEEDS (loaded before it): helpers.js
 * ===================================================================== */

const Validators = {
  luhn(num) { let s = 0, alt = false; for (let i = num.length - 1; i >= 0; i--) { let n = +num[i]; if (alt) { n *= 2; if (n > 9) n -= 9; } s += n; alt = !alt; } return s % 10 === 0; },
  brand(num) { if (/^4/.test(num)) return "visa"; if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(num)) return "mastercard"; return null; },
  expiry(v) { const m = v.match(/^(\d{2})\/(\d{2})$/); if (!m) return false; const mo = +m[1], yr = 2000 + +m[2]; if (mo < 1 || mo > 12) return false; return new Date(yr, mo, 1) > new Date(); },
  strength(pw) { let s = 0; if (pw.length >= 10) s++; if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++; if (/\d/.test(pw)) s++; if (/[^A-Za-z0-9]/.test(pw)) s++; return s; }
};
async function hashPw(s) {
  try { if (window.crypto && crypto.subtle) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2,"0")).join(""); } } catch {}
  return btoa(unescape(encodeURIComponent(s)));
}   // demo only – real hashing (bcrypt/argon2) must happen on the server
