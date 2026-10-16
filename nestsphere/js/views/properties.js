/* =====================================================================
 * js/views/properties.js
 * WHAT IT DOES : TAB: Properties – my portfolio (purchases, rentals, receipts) and saved properties. Only builds HTML – actions live in js/app/.
 * NEEDS (loaded before it): views/shared.js, helpers.js, store.js
 * ===================================================================== */

Object.assign(Views, {
  /* PROPERTIES – my portfolio: purchases, rentals, saved */
  properties() {
    const s = Store.state, saved = s.saved.map(listing).filter(Boolean);
    $("tab-view-properties").innerHTML = `
      ${banner({ icon:"home", badge:"My Property Portfolio", title:"My Properties &amp; Payments", sub:"Track reservations, purchase installments and rent for the properties you have secured.", actions:`<button class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition shadow" onclick="App.switchTab('real-estate')">Browse listings</button>` })}
      <div><h3 class="text-sm font-bold font-display text-slate-900 mb-3">Reserved, Purchased &amp; Rented</h3>
      ${s.portfolio.length ? `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">${s.portfolio.map(it => Views.portfolioCard(it)).join("")}</div>` : card(empty("home","No properties yet. Reserve or rent one from Real Estate and it will appear here with its payment schedule."), "shadow-sm")}</div>
      <div><h3 class="text-sm font-bold font-display text-slate-900 mb-3">Saved Properties</h3>
      ${saved.length ? `<div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100">${saved.map(p => `<div class="p-3.5 flex items-center justify-between gap-3"><div class="flex items-center gap-3 min-w-0"><img src="${p.image}" class="w-14 h-12 rounded-lg object-cover flex-shrink-0" alt=""><div class="min-w-0"><div class="text-xs font-bold text-slate-900 truncate">${esc(p.title)}</div><div class="text-[11px] text-slate-500">${esc(p.location)} • ${fmt(p.price)}${p.per || ""}</div></div></div><div class="flex gap-2 flex-shrink-0"><button class="px-3 py-1.5 rounded-lg bg-brand-800 text-white text-[11px] font-semibold" onclick="App.reserve('${p.id}')">${p.intent === "Rent" ? "Rent" : "Reserve"}</button><button class="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold" onclick="App.toggleSave('${p.id}')">Remove</button></div></div>`).join("")}</div>` : card(empty("heart","Tap the heart on a listing to save it here."), "shadow-sm")}</div>`;
  },

  portfolioCard(it) {
    const p = listing(it.propId) || {}, rent = it.mode === "rent";
    const body = rent
      ? `<div class="text-[11px] text-slate-500 mt-1">Monthly rent ${fmt(it.monthly)} • Deposit ${fmt(it.monthly)} held</div><div class="mt-3 text-xs"><span class="text-slate-500">Rent paid through:</span> <strong>${dstr(it.paidThrough)}</strong></div><button class="mt-3 px-3 py-1.5 rounded-lg bg-brand-800 text-white text-[11px] font-semibold" onclick="App.payRent('${it.id}')">Pay ${fmt(it.monthly)} rent</button>`
      : (() => { const pct = Math.min(100, Math.round(it.paid / it.total * 100)), bal = it.total - it.paid; return `<div class="text-[11px] text-slate-500 mt-1">${fmt(it.paid)} of ${fmt(it.total)} paid (${pct}%)</div><div class="h-2 rounded-full bg-slate-100 mt-3 overflow-hidden"><div class="h-full bg-emerald-600" style="width:${pct}%"></div></div>${bal > 0 ? `<button class="mt-3 px-3 py-1.5 rounded-lg bg-brand-800 text-white text-[11px] font-semibold" onclick="App.payInstallment('${it.id}')">Make payment • ${fmt(bal)} left</button>` : `<div class="mt-3 text-[11px] font-bold text-emerald-700">Fully paid – title transfer in progress</div>`}`; })();
    return card(`<div class="flex gap-3"><img src="${p.image || ""}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt=""><div class="min-w-0 flex-1"><div class="flex items-center justify-between gap-2"><div class="text-sm font-bold text-slate-900 truncate">${esc(it.title)}</div><span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${rent ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}">${rent ? "Rental" : "Purchase"}</span></div><div class="text-[11px] text-slate-500">${esc(p.location || "")}</div>${body}</div></div>
      ${it.payments.length ? `<details class="mt-3 border-t border-slate-100 pt-2"><summary class="text-[11px] font-semibold text-slate-600 cursor-pointer">Receipts (${it.payments.length})</summary>${it.payments.map(r => `<div class="flex justify-between text-[11px] text-slate-500 py-1"><span>${dstr(r.date)} • ${esc(r.ref)}</span><strong class="text-slate-800">${fmt(r.amount)}</strong></div>`).join("")}</details>` : ""}`, "shadow-sm");
  }
});
