/* =====================================================================
 * js/views/real-estate.js
 * WHAT IT DOES : TAB: Real Estate – search, filters and listing cards (save, site visit, reserve & pay). Only builds HTML – actions live in js/app/.
 * NEEDS (loaded before it): views/shared.js, helpers.js, store.js
 * ===================================================================== */

Object.assign(Views, {
  /* REAL ESTATE – discovery: search, filter, save, visit, reserve */
  realEstate() {
    const f = Store.state.realEstate, bands = PRICE_BANDS[f.intent];
    const results = App.filterListings();
    $("badge-real-estate-count").textContent = LISTINGS.length;
    $("tab-view-real-estate").innerHTML = `
      ${banner({ icon:"shield-check", badge:"Ardhisasa Kenya Verified Registry", title:"Verified Kenya Real Estate &amp; Listings", sub:"Legally verified title deeds, digital survey maps, and direct developer acquisitions." })}
      <section class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4" id="search-filter-section">
        <div class="flex items-center gap-2 border-b border-slate-100 pb-3" id="intent-filter-pills">
          ${["Buy","Rent","Commercial"].map(i => `<button class="px-5 py-2 rounded-xl text-xs font-semibold transition ${f.intent === i ? "bg-[#091E18] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}" onclick="App.setIntent('${i}')">${i}</button>`).join("")}
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
          <div class="space-y-1"><label class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Location</label><div class="relative"><i class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" data-lucide="map-pin"></i><input class="w-full pl-8 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl" id="filter-location" type="text" placeholder="e.g. Karen, Kilimani" value="${esc(f.query)}" onkeydown="if(event.key==='Enter') App.applyFilters()"/></div></div>
          <div class="space-y-1"><label class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Property Type</label><select class="w-full py-2 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl" id="filter-type">${["All","Villa","Apartment","Land","Commercial"].map(t => `<option ${f.type === t ? "selected" : ""}>${t}</option>`).join("")}</select></div>
          <div class="space-y-1"><label class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Price Range</label><select class="w-full py-2 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl" id="filter-price">${bands.map((b,i) => `<option value="${i}" ${f.band === i ? "selected" : ""}>${b[0]}</option>`).join("")}</select></div>
          <div class="space-y-1"><label class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Bedrooms</label><select class="w-full py-2 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl" id="filter-beds">${["Any","1 - 2","3 - 5","6+"].map(b => `<option ${f.beds === b ? "selected" : ""}>${b}</option>`).join("")}</select></div>
          <div class="space-y-1 flex flex-col justify-end"><button class="w-full py-2 px-4 bg-[#091E18] hover:bg-emerald-950 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition" onclick="App.applyFilters()"><i class="w-3.5 h-3.5" data-lucide="search"></i><span>Search Now</span></button></div>
        </div>
      </section>
      <div class="flex items-center justify-between"><div class="text-xs text-slate-500">Showing <strong class="text-slate-900">${results.length}</strong> of ${LISTINGS.length} verified listings</div>${f.query || f.type !== "All" || f.band || f.beds !== "Any" ? `<button class="text-xs font-semibold text-emerald-800 hover:underline" onclick="App.resetFilters()">Clear filters</button>` : ""}</div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5" id="real-estate-properties-grid">${results.length ? results.map(p => Views.listingCard(p)).join("") : `<div class="md:col-span-3">${empty("search-x","No listings match your filters.")}</div>`}</div>`;
  },

  listingCard(p) {
    const saved = Store.state.saved.includes(p.id), reserved = Store.state.portfolio.some(x => x.propId === p.id);
    return `<article class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition">
      <div><div class="relative h-48 overflow-hidden"><img src="${p.image}" alt="${esc(p.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.badgeColor} text-white shadow-md">${p.badge}</span>
        <button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition shadow" onclick="App.toggleSave('${p.id}')" aria-label="Save"><i data-lucide="heart" class="w-4 h-4 ${saved ? "text-rose-500 fill-rose-500" : "text-slate-600"}"></i></button></div>
        <div class="p-4 space-y-1"><div class="flex items-baseline gap-1"><span class="text-base font-bold text-slate-900">${fmt(p.price)}</span>${p.per ? `<span class="text-xs text-slate-500">${p.per}</span>` : ""}</div>
          <h3 class="text-sm font-semibold text-slate-800 leading-snug">${esc(p.title)}</h3>
          <p class="text-xs text-slate-500 flex items-center gap-1 pt-0.5"><i data-lucide="map-pin" class="w-3 h-3 text-emerald-600"></i>${esc(p.location)}</p></div></div>
      <div class="p-4 pt-3 border-t border-slate-100 space-y-2.5"><div class="flex items-center justify-between text-[11px] text-slate-500 font-medium"><span>${esc(p.specs)}</span><span>${p.type}</span></div>
        <div class="flex gap-2"><button class="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wide" onclick="App.openBooking('${esc(p.title)}','Site visit')">Site Visit</button>
        <button class="flex-1 py-1.5 rounded-lg ${reserved ? "bg-emerald-100 text-emerald-800" : "bg-brand-800 hover:bg-brand-700 text-white"} text-[11px] font-bold uppercase tracking-wide" onclick="App.reserve('${p.id}')">${reserved ? "Reserved" : p.intent === "Rent" ? "Rent & Pay" : "Reserve & Pay"}</button></div></div>
    </article>`;
  }
});
