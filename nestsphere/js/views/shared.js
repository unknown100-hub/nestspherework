/* =====================================================================
 * js/views/shared.js
 * WHAT IT DOES : Creates the Views object and the small layout pieces reused by every tab (banner, card, empty message).
 * NEEDS (loaded before it): helpers.js
 * ===================================================================== */

const Views = {};

const banner = ({icon, badge, title, sub, actions=""}) => `
  <div class="p-6 rounded-2xl bg-gradient-to-r from-[#0F382C] via-[#144738] to-[#0A261E] text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
    <div class="space-y-1">
      <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/20"><i class="w-3.5 h-3.5 text-emerald-300" data-lucide="${icon}"></i><span>${badge}</span></div>
      <h2 class="text-2xl font-bold font-display tracking-tight">${title}</h2>
      <p class="text-xs text-emerald-100/80">${sub}</p>
    </div>
    <div class="flex items-center gap-2">${actions}</div>
  </div>`;
const card = (inner, cls="") => `<div class="bg-white rounded-2xl p-5 border border-slate-200/80 ${cls}">${inner}</div>`;
const empty = (icon, text) => `<div class="text-center py-8 text-xs text-slate-400"><i data-lucide="${icon}" class="w-6 h-6 mx-auto mb-2 text-slate-300"></i>${text}</div>`;
