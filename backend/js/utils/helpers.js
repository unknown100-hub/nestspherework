/* =====================================================================
 * js/utils/helpers.js
 * WHAT IT DOES : Small reusable helpers: money format (fmt), HTML escaping (esc), date format, id maker, email/phone checks, DOM shortcuts ($ and val), icon refresh.
 * NEEDS (loaded before it): constants.js
 * ===================================================================== */

const fmt  = n => "KES " + Number(n).toLocaleString("en-KE");
const esc  = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $    = id => document.getElementById(id);
const val  = id => ($(id) ? $(id).value.trim() : "");
const dstr = iso => new Date(iso).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"});
const rid  = p => p + "-" + Math.random().toString(36).slice(2,8).toUpperCase();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isKePhone = v => /^(?:\+?254|0)[17]\d{8}$/.test(v.replace(/\s+/g,""));
const normPhone = v => { const d = v.replace(/\s+/g,"").replace(/^\+/,""); return d.startsWith("254") ? d : "254" + d.replace(/^0/,""); };
const listing = id => LISTINGS.find(l => l.id === id);
const icons = () => { if (window.lucide) window.lucide.createIcons(); };
