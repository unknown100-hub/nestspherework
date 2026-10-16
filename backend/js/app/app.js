/* =====================================================================
 * js/app/app.js
 * WHAT IT DOES : App core: start-up, refresh, toast, tab routing, global search, 'payments due' list, notification bell.
 * NEEDS (loaded before it): everything in config/, utils/, core/, services/, ui/, views/
 * ===================================================================== */

const App = {
  activeTab: "dashboard", txFilter: "all", txLimit: 8, _toastT: null,

  init() {
    Store.load();
    this.refreshAll();
    this.applyUser();
  },
  refreshAll() {
    Views.dashboard(); Views.realEstate(); Views.interior(); Views.properties(); Views.construction(); Views.profile(); Views.settings();
    this.applyUser(); this.updateBell(); icons();
  },
  applyUser() {
    const u = Store.state.user;
    document.querySelectorAll(".js-avatar").forEach(i => i.src = u.avatar);
    $("user-display-name").textContent = u.name;
    $("user-role-label").textContent = u.role === "admin" ? "Administrator" : "Customer Account";
  },
  greeting() { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; },
  toast(msg) {
    const t = $("toast-notification"); $("toast-message").textContent = msg;
    t.classList.remove("opacity-0","pointer-events-none","translate-y-3");
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => t.classList.add("opacity-0","pointer-events-none","translate-y-3"), 3200);
  },

  /* routing */
  switchTab(tab) {
    this.activeTab = tab;
    ["dashboard","real-estate","interior-design","properties","construction","profile","settings"].forEach(t => { const el = $(`tab-view-${t}`); if (el) el.classList.toggle("hidden", t !== tab); });
    this.updateSidebar(tab); this.updateHeaderBadge(tab);
    $("main-scroll-container").scrollTo({ top: 0, behavior: "smooth" });
    icons();
  },
  updateSidebar(cur) {
    const items = [["nav-dashboard","dashboard"],["nav-real-estate","real-estate"],["nav-interior-design","interior-design"],["nav-properties","properties"],["nav-construction","construction"],["nav-profile","profile"],["nav-settings","settings"]];
    items.forEach(([id, key]) => {
      const el = $(id); if (!el) return;
      const old = el.querySelector(".nav-indicator"); if (old) old.remove();
      const icon = el.querySelector("i"), on = key === cur;
      if (on) {
        el.className = "flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/20 font-semibold shadow-inner transition-all whitespace-nowrap cursor-pointer";
        const dot = document.createElement("span"); dot.className = "w-1.5 h-1.5 rounded-full bg-emerald-400 nav-indicator ml-2"; el.appendChild(dot);
        if (icon) icon.classList.remove("text-slate-400");
      } else {
        el.className = "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap cursor-pointer group";
        if (icon) icon.classList.add("text-slate-400");
      }
    });
  },
  updateHeaderBadge(tab) {
    const labels = { dashboard:"Overview Dashboard", "real-estate":"Real Estate Listings", properties:"My Properties", "interior-design":"Interior Design Studios", construction:"Construction & Site Hub", profile:"Customer Profile", settings:"Account Settings" };
    $("view-indicator-text").textContent = labels[tab] || "Portal View";
    $("view-indicator-dot").className = tab === "dashboard" ? "w-2 h-2 rounded-full bg-emerald-500" : "w-2 h-2 rounded-full bg-amber-400 animate-pulse";
    $("view-reset-button").classList.toggle("hidden", tab === "dashboard");
  },
  handleSearch(q) { if (q.trim().length > 3) $("view-indicator-text").textContent = `Searching: "${q}"`; },
  runGlobalSearch(q) {
    q = q.trim(); if (!q) return;
    Store.state.realEstate = { ...Store.state.realEstate, query:q }; Views.realEstate(); icons(); this.switchTab("real-estate");
  },

  /* pending tasks power both the dashboard "Payments due" card and the bell */
  pendingTasks() {
    const s = Store.state, out = [];
    s.portfolio.filter(x => x.mode === "purchase" && x.total - x.paid > 0).forEach(x => out.push({ title:x.title, sub:`Balance ${fmt(x.total - x.paid)}`, cta:"Pay", action:`App.payInstallment('${x.id}')` }));
    s.portfolio.filter(x => x.mode === "rent" && new Date(x.paidThrough) < new Date(Date.now() + 7 * 864e5)).forEach(x => out.push({ title:x.title + " – rent", sub:`Due ${dstr(x.paidThrough)}`, cta:"Pay rent", action:`App.payRent('${x.id}')` }));
    s.escrow.milestones.filter(m => m.status === "funded").forEach(m => out.push({ title:`Approve: ${m.name}`, sub:"Inspection verified – awaiting your release", cta:"Review", action:"App.switchTab('construction')" }));
    return out;
  },
  updateBell() { $("bell-dot").classList.toggle("hidden", this.pendingTasks().length === 0 && !Wallet.low()); },
  showNotifications() {
    const n = this.pendingTasks().length;
    this.toast(n ? `You have ${n} item${n > 1 ? "s" : ""} needing action.` : Wallet.low() ? "Your wallet balance is low – consider topping up." : "You're all caught up.");
    if (n) this.switchTab("dashboard");
  }
};
