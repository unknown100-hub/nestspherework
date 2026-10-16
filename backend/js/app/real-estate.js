/* =====================================================================
 * js/app/real-estate.js
 * WHAT IT DOES : ACTIONS for Real Estate: filters, search, save/unsave, reserve/rent, pay installments and rent.
 * NEEDS (loaded before it): app/app.js (the App object), views/, ui/checkout.js
 * ===================================================================== */

Object.assign(App, {
  /* real estate */
  setIntent(i) { Store.state.realEstate = { ...Store.state.realEstate, intent:i, band:0 }; Store.save(); Views.realEstate(); icons(); },
  applyFilters() {
    Store.state.realEstate = { ...Store.state.realEstate, query:val("filter-location"), type:$("filter-type").value, band:+$("filter-price").value, beds:$("filter-beds").value };
    Store.save(); Views.realEstate(); icons();
  },
  resetFilters() { Store.state.realEstate = { intent:Store.state.realEstate.intent, query:"", type:"All", band:0, beds:"Any" }; Views.realEstate(); icons(); },
  filterListings() {
    const f = Store.state.realEstate, band = PRICE_BANDS[f.intent][f.band] || PRICE_BANDS[f.intent][0], q = f.query.toLowerCase();
    return LISTINGS.filter(p => p.intent === f.intent
      && (!q || (p.location + " " + p.title).toLowerCase().includes(q))
      && (f.type === "All" || p.type === f.type)
      && p.price >= band[1] && p.price < band[2]
      && (f.beds === "Any" || (f.beds === "1 - 2" && p.beds >= 1 && p.beds <= 2) || (f.beds === "3 - 5" && p.beds >= 3 && p.beds <= 5) || (f.beds === "6+" && p.beds >= 6)));
  },
  toggleSave(id) {
    if (!Auth.can("listing:save")) return;
    const s = Store.state.saved, i = s.indexOf(id);
    if (i >= 0) { s.splice(i,1); this.toast("Removed from Saved Properties"); } else { s.push(id); this.toast("Added to your Saved Properties"); }
    Store.save(); Views.realEstate(); Views.properties(); icons();
  },
  reserve(id) {
    const p = listing(id); if (!p) return;
    const existing = Store.state.portfolio.find(x => x.propId === id);
    if (existing) { this.toast("Already reserved – manage it under Properties."); return this.switchTab("properties"); }
    const rent = p.intent === "Rent", due = rent ? p.price * 2 : Math.round(p.price * 0.1);
    Pay.open({ title: rent ? `Rent: ${p.title}` : `Reservation: ${p.title}`, subtitle: rent ? "First month's rent + 1 month refundable deposit" : "10% reservation deposit secures the property", amount:due, category:"property",
      onSuccess: tx => {
        const rec = { ref:tx.ref, amount:due, date:tx.date, method:tx.method };
        Store.state.portfolio.unshift(rent
          ? { id:rid("pf"), propId:id, title:p.title, mode:"rent", monthly:p.price, paidThrough:new Date(Date.now() + 30 * 864e5).toISOString(), payments:[rec] }
          : { id:rid("pf"), propId:id, title:p.title, mode:"purchase", total:p.price, paid:due, payments:[rec] });
        Store.save();
      } });
  },
  payInstallment(id) {
    const it = Store.state.portfolio.find(x => x.id === id); if (!it) return;
    const bal = it.total - it.paid;
    Pay.open({ title:`Payment: ${it.title}`, subtitle:`Balance outstanding ${fmt(bal)}`, amount:Math.min(bal, Math.round(it.total * 0.1)), editable:true, min:1000, max:bal, category:"property",
      onSuccess: tx => { it.paid += Math.abs(tx.amount); it.payments.unshift({ ref:tx.ref, amount:Math.abs(tx.amount), date:tx.date, method:tx.method }); Store.save(); } });
  },
  payRent(id) {
    const it = Store.state.portfolio.find(x => x.id === id); if (!it) return;
    Pay.open({ title:`Rent: ${it.title}`, subtitle:"One month's rent", amount:it.monthly, category:"rent",
      onSuccess: tx => { const d = new Date(it.paidThrough); d.setMonth(d.getMonth() + 1); it.paidThrough = d.toISOString(); it.payments.unshift({ ref:tx.ref, amount:it.monthly, date:tx.date, method:tx.method }); Store.save(); } });
  }
});
