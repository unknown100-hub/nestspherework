/* =====================================================================
 * js/ui/checkout.js
 * WHAT IT DOES : The ONE payment checkout used everywhere: wallet top-up, reservations, rent, design packages, escrow. Methods: Wallet, M-Pesa, Bank, Visa, Mastercard.
 * NEEDS (loaded before it): modal.js, wallet.js, gateway.js, validators.js, auth.js, store.js
 * ===================================================================== */

/* Unified checkout used by: wallet top-up, property reservation/rent, design packages, escrow funding */
const Pay = {
  ctx: null, method: "mpesa", busy: false,
  METHODS: [
    { id:"wallet", label:"Wallet", sub:"Instant", icon:"wallet" },
    { id:"mpesa", label:"M-Pesa", sub:"STK push", icon:"smartphone" },
    { id:"bank", label:"Bank", sub:"Transfer", icon:"landmark" },
    { id:"visa", label:"Visa", sub:"Card", icon:"credit-card" },
    { id:"mastercard", label:"Mastercard", sub:"Card", icon:"credit-card" }
  ],
  open(ctx) {
    this.ctx = { allowWallet:true, editable:false, min:100, max:Infinity, ...ctx };
    if (!Auth.can("payment:make")) return App.toast("You do not have permission to make payments.");
    const pref = Store.state.payPrefs.defaultMethod;
    this.method = (pref === "wallet" && !this.ctx.allowWallet) ? "mpesa" : pref;
    Modal.locked = false;
    const c = this.ctx, pp = Store.state.payPrefs;
    const methods = this.METHODS.filter(m => m.id !== "wallet" || c.allowWallet);
    Modal.show(`
      ${Modal.head(c.topup ? "plus-circle" : "credit-card", c.title, c.subtitle || "Secure checkout")}
      <div class="rounded-xl bg-slate-50 border border-slate-200 p-3 mb-3">
        <label class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Amount (KES)</label>
        <input id="pay-amount" type="number" inputmode="numeric" min="${c.min}" step="1" value="${c.amount || ""}" ${c.editable ? "" : "readonly"} oninput="Pay.syncLabel()" class="w-full mt-1 text-lg font-bold font-display text-slate-900 bg-white border-slate-200 rounded-xl ${c.editable ? "" : "bg-slate-100"}"/>
        ${c.topup ? `<div class="flex gap-1.5 mt-2">${[5000,20000,50000,100000].map(a => `<button type="button" class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 hover:border-emerald-600" onclick="$('pay-amount').value=${a};Pay.syncLabel()">+${(a/1000)}K</button>`).join("")}</div>` : ""}
      </div>
      <div class="grid ${methods.length === 5 ? "grid-cols-5" : "grid-cols-4"} gap-1.5 mb-3" id="pay-methods">
        ${methods.map(m => `<button type="button" data-m="${m.id}" onclick="Pay.select('${m.id}')" class="pm p-2 rounded-xl border text-center transition"><i data-lucide="${m.icon}" class="w-4 h-4 mx-auto mb-0.5"></i><div class="text-[11px] font-bold leading-tight">${m.label}</div><div class="text-[10px] text-slate-400">${m.sub}</div></button>`).join("")}
      </div>
      <form id="pay-form" class="space-y-3 text-xs" onsubmit="event.preventDefault(); Pay.submit();" autocomplete="off">
        <div data-panel="wallet" class="hidden p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900">Wallet balance: <strong>${fmt(Wallet.balance())}</strong><div id="pay-wallet-warn" class="text-rose-600 font-medium mt-1 hidden">Insufficient balance – top up or choose another method.</div></div>
        <div data-panel="mpesa" class="hidden space-y-2"><label class="block font-medium text-slate-700">M-Pesa phone number</label><input id="pay-phone" type="tel" value="${esc(pp.mpesaPhone)}" placeholder="07XX XXX XXX" class="w-full rounded-xl border-slate-200 bg-slate-50 text-xs"/><p class="text-[11px] text-slate-500">You will receive an STK push on this number. Enter your M-Pesa PIN to authorise.</p></div>
        <div data-panel="bank" class="hidden space-y-2"><label class="block font-medium text-slate-700">Your bank</label><select id="pay-bank" class="w-full rounded-xl border-slate-200 bg-slate-50 text-xs">${BANKS.map(b => `<option ${pp.bank && b.startsWith(pp.bank) ? "selected" : ""}>${b}</option>`).join("")}</select>
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">Pay to <strong>NestSphere Escrow Collections</strong><br/>Account: <strong>0110 4452 9087</strong> • Reference: <strong id="pay-bank-ref">${esc(this.ref = "NS" + Math.floor(100000 + Math.random()*900000))}</strong><br/>Funds are confirmed once the bank settles (usually within minutes via PesaLink).</div></div>
        <div data-panel="card" class="hidden space-y-2">
          <div><label class="block font-medium text-slate-700 mb-1">Card number</label><input id="pay-card" inputmode="numeric" maxlength="19" placeholder="1234 5678 9012 3456" oninput="Pay.fmtCard(this)" class="w-full rounded-xl border-slate-200 bg-slate-50 text-xs"/></div>
          <div><label class="block font-medium text-slate-700 mb-1">Name on card</label><input id="pay-cardname" class="w-full rounded-xl border-slate-200 bg-slate-50 text-xs"/></div>
          <div class="grid grid-cols-2 gap-2"><div><label class="block font-medium text-slate-700 mb-1">Expiry (MM/YY)</label><input id="pay-exp" maxlength="5" placeholder="MM/YY" oninput="Pay.fmtExp(this)" class="w-full rounded-xl border-slate-200 bg-slate-50 text-xs"/></div><div><label class="block font-medium text-slate-700 mb-1">CVV</label><input id="pay-cvv" type="password" inputmode="numeric" maxlength="4" class="w-full rounded-xl border-slate-200 bg-slate-50 text-xs"/></div></div>
          <p class="text-[11px] text-slate-500 flex items-center gap-1"><i data-lucide="lock" class="w-3 h-3"></i>Card details are never stored by NestSphere. 3-D Secure verification applies.</p></div>
        <div id="pay-error" class="hidden p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium"></div>
        <div class="flex items-center gap-2 pt-1"><button type="button" class="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold" onclick="Modal.close()">Cancel</button>
        <button type="submit" id="pay-submit" class="flex-1 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-semibold shadow-sm">Pay</button></div>
      </form>`);
    this.select(this.method);
  },
  select(id) {
    this.method = id;
    document.querySelectorAll("#pay-methods .pm").forEach(b => {
      const on = b.dataset.m === id;
      b.className = "pm p-2 rounded-xl border text-center transition " + (on ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600" : "border-slate-200 text-slate-600 hover:border-emerald-400");
    });
    document.querySelectorAll("#pay-form [data-panel]").forEach(p => {
      const k = p.dataset.panel, show = (k === "card") ? (id === "visa" || id === "mastercard") : k === id;
      p.classList.toggle("hidden", !show);
    });
    this.syncLabel(); this.fail("");
  },
  syncLabel() {
    const a = parseInt($("pay-amount").value, 10) || 0, btn = $("pay-submit");
    if (btn) btn.textContent = a > 0 ? `${this.ctx.topup ? "Top up" : "Pay"} ${fmt(a)}` : (this.ctx.topup ? "Top up" : "Pay");
    const warn = $("pay-wallet-warn"); if (warn) warn.classList.toggle("hidden", !(this.method === "wallet" && a > Wallet.balance()));
  },
  fmtCard(el) { const d = el.value.replace(/\D/g,"").slice(0,16); el.value = d.replace(/(.{4})/g,"$1 ").trim(); },
  fmtExp(el) { let d = el.value.replace(/\D/g,"").slice(0,4); if (d.length > 2) d = d.slice(0,2) + "/" + d.slice(2); el.value = d; },
  fail(msg) { const e = $("pay-error"); if (!e) return; e.textContent = msg; e.classList.toggle("hidden", !msg); },
  collect(amount) {
    const m = this.method;
    if (m === "wallet") { if (amount > Wallet.balance()) throw new Error("Insufficient wallet balance. Top up or choose another method."); return { method:m, amount }; }
    if (m === "mpesa") { const ph = val("pay-phone"); if (!isKePhone(ph)) throw new Error("Enter a valid Safaricom number, e.g. 0712 345 678."); return { method:m, amount, phone:normPhone(ph) }; }
    if (m === "bank")  return { method:m, amount, bank:val("pay-bank"), reference:this.ref };
    const num = val("pay-card").replace(/\s/g,""), exp = val("pay-exp"), cvv = val("pay-cvv"), name = val("pay-cardname");
    if (num.length < 13 || !Validators.luhn(num)) throw new Error("Card number is not valid.");
    if (Validators.brand(num) !== m) throw new Error(`This is not a ${m === "visa" ? "Visa" : "Mastercard"} number. Choose the matching card type.`);
    if (name.length < 3) throw new Error("Enter the name shown on the card.");
    if (!Validators.expiry(exp)) throw new Error("Card expiry is invalid or in the past.");
    if (!/^\d{3,4}$/.test(cvv)) throw new Error("Enter the 3 or 4-digit CVV.");
    return { method:m, amount, card:{ brand:m, last4:num.slice(-4) } };   // only token-safe data leaves this function
  },
  async submit() {
    if (this.busy) return;
    const c = this.ctx, amount = parseInt($("pay-amount").value, 10);
    if (!Number.isInteger(amount) || amount < c.min) return this.fail(`Minimum amount is ${fmt(c.min)}.`);
    if (amount > c.max) return this.fail(`Maximum amount for this payment is ${fmt(c.max)}.`);
    let payload; try { payload = this.collect(amount); } catch (e) { return this.fail(e.message); }
    this.busy = true; Modal.locked = true;
    const msg = { mpesa:`Check your phone (${esc(payload.phone || "")}) and enter your M-Pesa PIN…`, bank:"Waiting for bank confirmation…", visa:"Verifying card with 3-D Secure…", mastercard:"Verifying card with 3-D Secure…", wallet:"Processing wallet payment…" }[payload.method];
    Modal.show(`<div class="text-center py-10 space-y-4"><div class="spinner mx-auto"></div><h3 class="text-base font-bold font-display text-slate-900">Processing ${fmt(amount)}</h3><p class="text-xs text-slate-500">${msg}</p><p class="text-[11px] text-slate-400">Please do not close this window.</p></div>`);
    try {
      const g = await Gateway.charge(payload);
      const tx = Wallet.record({ kind: c.topup ? "topup" : "payment", title: c.title, amount, method: payload.method, meta:{ gatewayRef:g.gatewayRef, category:c.category || "general" } });
      if (c.onSuccess) c.onSuccess(tx);
      App.refreshAll();
      Modal.locked = false;
      Modal.show(`<div class="text-center py-6 space-y-3"><div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto"><i data-lucide="check" class="w-7 h-7"></i></div>
        <h3 class="text-base font-bold font-display text-slate-900">${c.topup ? "Top-up successful" : "Payment successful"}</h3>
        <div class="rounded-xl bg-slate-50 border border-slate-200 p-3 text-left text-xs space-y-1.5">
          <div class="flex justify-between"><span class="text-slate-500">Amount</span><strong>${fmt(amount)}</strong></div>
          <div class="flex justify-between"><span class="text-slate-500">Method</span><strong class="capitalize">${payload.method === "mpesa" ? "M-Pesa" : payload.method}</strong></div>
          <div class="flex justify-between"><span class="text-slate-500">Reference</span><strong>${tx.ref}</strong></div>
          <div class="flex justify-between"><span class="text-slate-500">Wallet balance</span><strong class="text-emerald-700">${fmt(Wallet.balance())}</strong></div></div>
        <button class="w-full py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-semibold" onclick="Modal.close()">Done</button></div>`);
    } catch (e) {
      Modal.locked = false;
      Modal.show(`<div class="text-center py-6 space-y-3"><div class="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto"><i data-lucide="x" class="w-7 h-7"></i></div>
        <h3 class="text-base font-bold font-display text-slate-900">Payment failed</h3><p class="text-xs text-slate-500">${esc(e.message || "Something went wrong. You have not been charged.")}</p>
        <button class="w-full py-2.5 rounded-xl bg-brand-800 text-white text-xs font-semibold" onclick="Pay.open(Pay.ctx)">Try again</button></div>`);
    } finally { this.busy = false; }
  }
};
