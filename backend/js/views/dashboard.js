/* =====================================================================
 * js/views/dashboard.js
 * WHAT IT DOES : TAB: Dashboard – wallet balance, stats, payments due, upcoming appointments, transaction history. Only builds HTML – actions live in js/app/.
 * NEEDS (loaded before it): views/shared.js, helpers.js, store.js
 * ===================================================================== */

Object.assign(Views, {
  /* DASHBOARD – overview: wallet, what needs attention, ledger */
  dashboard() {
    const s = Store.state, t = Wallet.totals(), tasks = App.pendingTasks();
    const upcoming = s.bookings.filter(b => new Date(b.date) >= new Date(new Date().toDateString())).sort((a,b) => a.date.localeCompare(b.date)).slice(0,4);
    $("tab-view-dashboard").innerHTML = `
    <section class="rounded-3xl bg-[#091E18] text-white p-7 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-emerald-900/40" id="hero-banner-section">
      <div class="md:w-3/5 space-y-3 z-10">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Verified Kenya Real Estate Portal</span>
        <h1 class="text-2xl lg:text-3xl font-bold font-display tracking-tight text-white">${App.greeting()}, ${esc(s.user.name.split(" ")[0])} <span class="inline-block animate-wave">👋</span></h1>
        <p class="text-xs lg:text-sm text-emerald-100/80 leading-relaxed max-w-xl">Find your dream home, connect with verified professionals, and turn your vision into reality across Kenya.</p>
      </div>
      <div class="md:w-2/5 h-44 rounded-2xl overflow-hidden relative shadow-inner flex-shrink-0 w-full border border-emerald-700/30">
        <img alt="Featured Kenyan Villa" class="w-full h-full object-cover" src="${IMG.villa}"/>
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3"><span class="text-[11px] font-semibold text-emerald-200">Karen Country Haven • Prime Villa</span></div>
      </div>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="rounded-2xl p-5 bg-gradient-to-br from-[#0F382C] to-[#144738] text-white shadow-md border border-emerald-900/40 flex flex-col justify-between" id="wallet-card">
        <div><div class="flex items-center justify-between text-emerald-200 text-xs font-semibold"><span class="flex items-center gap-1.5"><i data-lucide="wallet" class="w-4 h-4"></i>Wallet balance</span><span class="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px]">${esc(s.user.currency)}</span></div>
          <div class="text-3xl font-bold font-display mt-2 tracking-tight" id="wallet-balance">${fmt(s.wallet.balance)}</div>
          ${Wallet.low() ? `<div class="mt-2 text-[11px] text-amber-300 flex items-center gap-1"><i data-lucide="alert-triangle" class="w-3 h-3"></i>Balance is below your ${fmt(s.payPrefs.lowBalance)} alert level</div>` : `<div class="mt-2 text-[11px] text-emerald-200/70">Use it to pay for reservations, rent, designs and escrow.</div>`}</div>
        <button class="mt-4 w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition" onclick="App.topUp()"><i data-lucide="plus" class="w-4 h-4"></i>Top up wallet</button>
      </div>
      <div class="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        ${[["Total topped up", fmt(t.topped), "arrow-down-circle","text-emerald-700 bg-emerald-50"],["Total spent", fmt(t.spent), "arrow-up-circle","text-rose-600 bg-rose-50"],["Active deals", s.portfolio.length, "home","text-blue-700 bg-blue-50"],["Needs action", tasks.length, "bell-ring","text-amber-700 bg-amber-50"]]
          .map(([l,v,i,c]) => `<div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm"><div class="w-9 h-9 rounded-xl ${c} flex items-center justify-center mb-2"><i data-lucide="${i}" class="w-4 h-4"></i></div><div class="text-[11px] text-slate-500 font-medium">${l}</div><div class="text-sm font-bold font-display text-slate-900 mt-0.5 break-words">${v}</div></div>`).join("")}
        <div class="col-span-2 md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          ${card(`<h3 class="text-sm font-bold font-display text-slate-900 mb-2 flex items-center gap-2"><i data-lucide="credit-card" class="w-4 h-4 text-emerald-800"></i>Payments due</h3>
            ${tasks.length ? tasks.map(x => `<div class="flex items-center justify-between py-2 border-t border-slate-100 first:border-0 text-xs"><div><div class="font-semibold text-slate-800">${esc(x.title)}</div><div class="text-[11px] text-slate-500">${esc(x.sub)}</div></div><button class="px-2.5 py-1 rounded-lg bg-brand-800 hover:bg-brand-700 text-white text-[11px] font-semibold" onclick="${x.action}">${esc(x.cta)}</button></div>`).join("") : empty("check-circle","You're all caught up.")}`, "shadow-sm")}
          ${card(`<h3 class="text-sm font-bold font-display text-slate-900 mb-2 flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4 text-emerald-800"></i>Upcoming appointments</h3>
            ${upcoming.length ? upcoming.map(b => `<div class="flex items-center justify-between py-2 border-t border-slate-100 first:border-0 text-xs"><div><div class="font-semibold text-slate-800">${esc(b.title)}</div><div class="text-[11px] text-slate-500">${esc(b.category)} • ${dstr(b.date)}</div></div><span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">${esc(b.status)}</span></div>`).join("") : empty("calendar-x","No appointments yet – book a site visit, consultation or inspection.")}`, "shadow-sm")}
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between" onclick="App.switchTab('real-estate')">
        <div class="flex items-center gap-4"><div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 flex-shrink-0"><i class="w-6 h-6" data-lucide="building"></i></div>
        <div><h3 class="text-sm font-bold font-display text-slate-900">Find Property</h3><p class="text-xs text-slate-500 mt-0.5">Browse verified listings with verified title deeds &amp; virtual tours.</p></div></div><i class="w-5 h-5 text-slate-400" data-lucide="chevron-right"></i></div>
      <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between" onclick="App.switchTab('construction')">
        <div class="flex items-center gap-4"><div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 flex-shrink-0"><i class="w-6 h-6" data-lucide="hard-hat"></i></div>
        <div><div class="flex items-center gap-2"><h3 class="text-sm font-bold font-display text-slate-900">Construction &amp; Engineers</h3><span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">NCA Verified</span></div><p class="text-xs text-slate-500 mt-0.5">Connect with NCA structural engineers, registered architects &amp; site inspectors.</p></div></div><i class="w-5 h-5 text-slate-400" data-lucide="arrow-right"></i></div>
    </section>

    <section class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden" id="wallet-history">
      <div class="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
        <div><h2 class="text-lg font-bold font-display text-slate-900">Transaction &amp; Payment History</h2><p class="text-xs text-slate-500">Every top-up and payment, with live balance after each transaction</p></div>
        <div class="flex items-center gap-2">
          <div class="flex rounded-xl bg-slate-100 p-0.5 text-xs font-semibold">${[["all","All"],["topup","Top-ups"],["payment","Payments"]].map(([k,l]) => `<button class="px-3 py-1.5 rounded-lg ${App.txFilter === k ? "bg-white shadow text-slate-900" : "text-slate-500"}" onclick="App.setTxFilter('${k}')">${l}</button>`).join("")}</div>
          <button class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5" onclick="App.exportCsv()"><i data-lucide="download" class="w-3.5 h-3.5"></i>CSV</button>
        </div>
      </div>
      <div class="overflow-x-auto"><table class="w-full text-xs"><thead class="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider"><tr><th class="text-left px-5 py-2.5">Date</th><th class="text-left px-3 py-2.5">Description</th><th class="text-left px-3 py-2.5">Method</th><th class="text-left px-3 py-2.5">Reference</th><th class="text-right px-3 py-2.5">Amount</th><th class="text-right px-3 py-2.5">Balance</th><th class="text-right px-5 py-2.5">Status</th></tr></thead>
      <tbody>${Views.txRows()}</tbody></table></div>
    </section>`;
  },

  txRows() {
    const all = Store.state.wallet.transactions.filter(x => App.txFilter === "all" || x.kind === App.txFilter);
    if (!all.length) return `<tr><td colspan="7">${empty("receipt","No transactions to show.")}</td></tr>`;
    const rows = all.slice(0, App.txLimit).map(x => `<tr class="border-t border-slate-100 hover:bg-slate-50/60"><td class="px-5 py-3 text-slate-500 whitespace-nowrap">${dstr(x.date)}</td><td class="px-3 py-3 font-semibold text-slate-800">${esc(x.title)}</td><td class="px-3 py-3 capitalize text-slate-600">${x.method === "mpesa" ? "M-Pesa" : esc(x.method)}</td><td class="px-3 py-3 text-slate-500 font-mono text-[11px]">${esc(x.ref)}</td><td class="px-3 py-3 text-right font-bold ${x.amount >= 0 ? "text-emerald-700" : "text-rose-600"}">${x.amount >= 0 ? "+" : "−"}${fmt(Math.abs(x.amount))}</td><td class="px-3 py-3 text-right text-slate-600">${x.walletEffect ? fmt(x.balanceAfter) : "—"}</td><td class="px-5 py-3 text-right"><span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">${esc(x.status)}</span></td></tr>`).join("");
    return rows + (all.length > App.txLimit ? `<tr><td colspan="7" class="text-center py-3"><button class="text-xs font-semibold text-emerald-800 hover:underline" onclick="App.txLimit+=10;Views.dashboard();icons()">Show more</button></td></tr>` : "");
  }
});
