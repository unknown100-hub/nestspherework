/* =====================================================================
 * js/views/settings.js
 * WHAT IT DOES : TAB: Settings – password, account info, security, notifications, payment preferences, data. Only builds HTML – actions live in js/app/.
 * NEEDS (loaded before it): views/shared.js, helpers.js, store.js
 * ===================================================================== */

Object.assign(Views, {
  /* SETTINGS – account management only (security, preferences, payments, data) */
  settings() {
    const s = Store.state, u = s.user, sec = s.security, pp = s.payPrefs;
    const toggle = (id, label, on, handler) => `<label class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"><span class="text-slate-700">${label}</span><input ${on ? "checked" : ""} class="rounded text-emerald-700 focus:ring-emerald-700" type="checkbox" onchange="${handler}"/></label>`;
    const field = (id, label, type, extra = "") => `<div><label class="block text-xs font-medium text-slate-600 mb-1">${label}</label><input id="${id}" type="${type}" ${extra} class="w-full text-xs rounded-xl border-slate-200 focus:ring-emerald-700 bg-slate-50"/></div>`;
    const prefLabels = { sms_inspection:"SMS updates for site inspection completions", email_escrow:"NCA milestone disbursement sign-off emails", new_listings:"New off-plan listings matching saved criteria", payment_receipts:"Email receipts for every payment", low_balance:"Low wallet balance alerts", marketing:"Offers and product news" };
    $("tab-view-settings").innerHTML = `
      ${banner({ icon:"settings", badge:"Account Management", title:"Account Settings", sub:"Control your password, security, notifications, payment preferences and personal data." })}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        ${card(`<h3 class="text-sm font-bold font-display text-slate-900 flex items-center gap-2 mb-3"><i class="w-4 h-4 text-emerald-800" data-lucide="key-round"></i>Change Password</h3>
          <form class="space-y-3" onsubmit="event.preventDefault(); App.changePassword();" autocomplete="off">
            ${field("pw-current","Current password","password",'autocomplete="current-password"')}
            ${field("pw-new","New password","password",'autocomplete="new-password" oninput="App.pwMeter(this.value)"')}
            <div><div class="flex gap-1" id="pw-meter">${[0,1,2,3].map(() => `<div class="h-1 flex-1 rounded-full bg-slate-200"></div>`).join("")}</div><p class="text-[11px] text-slate-400 mt-1" id="pw-hint">Min 10 characters with upper &amp; lower case, a number and a symbol.</p></div>
            ${field("pw-confirm","Confirm new password","password",'autocomplete="new-password"')}
            <div id="pw-error" class="hidden p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"></div>
            <div class="flex items-center justify-between"><span class="text-[11px] text-slate-400">${sec.passwordChangedAt ? "Last changed " + dstr(sec.passwordChangedAt) : "Demo password: Demo@12345"}</span><button class="px-4 py-2 bg-brand-800 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold" type="submit">Update password</button></div></form>`, "shadow-sm")}
        ${card(`<h3 class="text-sm font-bold font-display text-slate-900 flex items-center gap-2 mb-3"><i class="w-4 h-4 text-emerald-800" data-lucide="id-card"></i>Account Information</h3>
          <form class="space-y-3" onsubmit="event.preventDefault(); App.saveAccount();">
            <div><label class="block text-xs font-medium text-slate-600 mb-1">Login email</label><input class="w-full text-xs rounded-xl border-slate-200 bg-slate-100" value="${esc(u.email)}" readonly/><p class="text-[11px] text-slate-400 mt-1">Change your email under Profile.</p></div>
            <div class="grid grid-cols-2 gap-3"><div><label class="block text-xs font-medium text-slate-600 mb-1">Language</label><select id="acc-lang" class="w-full text-xs rounded-xl border-slate-200 bg-slate-50">${["English","Kiswahili"].map(l => `<option ${u.language === l ? "selected" : ""}>${l}</option>`).join("")}</select></div>
            <div><label class="block text-xs font-medium text-slate-600 mb-1">Currency</label><select id="acc-cur" class="w-full text-xs rounded-xl border-slate-200 bg-slate-50">${["KES","USD","GBP"].map(l => `<option ${u.currency === l ? "selected" : ""}>${l}</option>`).join("")}</select></div></div>
            <div><label class="block text-xs font-medium text-slate-600 mb-1">Preferred Timezone</label><select id="acc-tz" class="w-full text-xs rounded-xl border-slate-200 bg-slate-50">${["East Africa Time (EAT - UTC+3)","London (GMT / BST)","Eastern Standard Time (EST)"].map(l => `<option ${u.timezone === l ? "selected" : ""}>${l}</option>`).join("")}</select></div>
            <div class="flex justify-end"><button class="px-4 py-2 bg-brand-800 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold" type="submit">Save account info</button></div></form>`, "shadow-sm")}
        ${card(`<h3 class="text-sm font-bold font-display text-slate-900 flex items-center gap-2 mb-3"><i class="w-4 h-4 text-emerald-800" data-lucide="shield"></i>Security</h3>
          <div class="space-y-1 text-xs">${toggle("","Two-factor authentication (SMS code at login)", sec.twoFA, "App.setSecurity('twoFA',this.checked)")}${toggle("","Alert me about new-device logins", sec.loginAlerts, "App.setSecurity('loginAlerts',this.checked)")}</div>
          <div class="mt-3 border-t border-slate-100 pt-3"><div class="flex items-center justify-between mb-1"><span class="text-xs font-semibold text-slate-700">Active sessions</span>${sec.sessions.length > 1 ? `<button class="text-[11px] text-rose-600 hover:underline" onclick="App.signOutOthers()">Sign out all others</button>` : ""}</div>
          ${sec.sessions.map(x => `<div class="flex items-center justify-between py-1.5 text-xs"><div><div class="font-medium text-slate-800">${esc(x.device)}${x.current ? ' <span class="text-[10px] text-emerald-700 font-bold">(this device)</span>' : ""}</div><div class="text-[11px] text-slate-500">${esc(x.place)} • ${esc(x.last)}</div></div>${x.current ? "" : `<button class="text-[11px] text-slate-500 hover:text-rose-600" onclick="App.signOutSession('${x.id}')">Sign out</button>`}</div>`).join("")}</div>`, "shadow-sm")}
        ${card(`<h3 class="text-sm font-bold font-display text-slate-900 flex items-center gap-2 mb-3"><i class="w-4 h-4 text-emerald-800" data-lucide="bell"></i>Notification Preferences</h3>
          <div class="space-y-1 text-xs">${Object.keys(prefLabels).map(k => toggle("", prefLabels[k], s.prefs[k], `App.setPref('${k}',this.checked)`)).join("")}</div>`, "shadow-sm")}
        ${card(`<h3 class="text-sm font-bold font-display text-slate-900 flex items-center gap-2 mb-3"><i class="w-4 h-4 text-emerald-800" data-lucide="credit-card"></i>Payment Preferences</h3>
          <form class="space-y-3" onsubmit="event.preventDefault(); App.savePayPrefs();">
            <div><label class="block text-xs font-medium text-slate-600 mb-1">Default payment method</label><select id="pp-method" class="w-full text-xs rounded-xl border-slate-200 bg-slate-50">${Pay.METHODS.map(m => `<option value="${m.id}" ${pp.defaultMethod === m.id ? "selected" : ""}>${m.label}</option>`).join("")}</select></div>
            ${field("pp-phone","Saved M-Pesa number","tel",`value="${esc(pp.mpesaPhone)}"`)}
            <div><label class="block text-xs font-medium text-slate-600 mb-1">Preferred bank for transfers</label><select id="pp-bank" class="w-full text-xs rounded-xl border-slate-200 bg-slate-50">${BANKS.map(b => `<option ${b.startsWith(pp.bank) ? "selected" : ""}>${b}</option>`).join("")}</select></div>
            ${field("pp-low","Low-balance alert (KES)","number",`min="0" value="${pp.lowBalance}"`)}
            <p class="text-[11px] text-slate-400 flex items-center gap-1"><i data-lucide="lock" class="w-3 h-3"></i>Card numbers are never saved – you enter them securely at checkout.</p>
            <div class="flex justify-end"><button class="px-4 py-2 bg-brand-800 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold" type="submit">Save preferences</button></div></form>`, "shadow-sm")}
        ${card(`<h3 class="text-sm font-bold font-display text-slate-900 flex items-center gap-2 mb-3"><i class="w-4 h-4 text-emerald-800" data-lucide="database"></i>Privacy &amp; Data</h3>
          <div class="space-y-2.5 text-xs"><button class="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 flex items-center justify-between" onclick="App.downloadData()"><span>Download my data (JSON)</span><i data-lucide="download" class="w-4 h-4"></i></button>
          <button class="w-full py-2 px-3 rounded-xl border border-rose-200 hover:bg-rose-50 font-semibold text-rose-600 flex items-center justify-between" onclick="App.requestDeletion()"><span>Request account deletion</span><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          <p class="text-[11px] text-slate-400">Deletion requests are reviewed by an administrator. Wallet funds must be withdrawn first.</p></div>`, "shadow-sm")}
      </div>`;
  }
});
