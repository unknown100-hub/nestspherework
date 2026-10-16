/* =====================================================================
 * js/app/settings.js
 * WHAT IT DOES : ACTIONS for Settings: password, account info, security, notification and payment preferences, data.
 * NEEDS (loaded before it): app/app.js (the App object), views/, ui/checkout.js
 * ===================================================================== */

Object.assign(App, {
  /* settings */
  pwMeter(v) {
    const sc = Validators.strength(v), cols = ["bg-rose-500","bg-orange-400","bg-amber-400","bg-emerald-500"];
    [...$("pw-meter").children].forEach((b,i) => b.className = "h-1 flex-1 rounded-full " + (i < sc ? cols[sc - 1] : "bg-slate-200"));
    $("pw-hint").textContent = v ? ["Too weak","Weak","Fair","Strong"][Math.max(sc - 1, 0)] : "Min 10 characters with upper & lower case, a number and a symbol.";
  },
  async changePassword() {
    const cur = $("pw-current").value, nw = $("pw-new").value, cf = $("pw-confirm").value, err = $("pw-error");
    const fail = m => { err.textContent = m; err.classList.remove("hidden"); };
    const sec = Store.state.security;
    const curOk = sec.passwordHash ? (await hashPw(cur)) === sec.passwordHash : cur === "Demo@12345";
    if (!curOk) return fail("Your current password is incorrect.");
    if (Validators.strength(nw) < 4) return fail("New password must be 10+ characters with upper & lower case, a number and a symbol.");
    if (nw === cur) return fail("New password must be different from the current one.");
    if (nw !== cf) return fail("New password and confirmation do not match.");
    sec.passwordHash = await hashPw(nw); sec.passwordChangedAt = new Date().toISOString();
    sec.sessions = sec.sessions.filter(s => s.current);        // sign out other devices after a password change
    Store.save(); this.refreshAll(); this.toast("Password updated. Other devices were signed out.");
  },
  saveAccount() { Object.assign(Store.state.user, { language:$("acc-lang").value, currency:$("acc-cur").value, timezone:$("acc-tz").value }); Store.save(); this.refreshAll(); this.toast("Account information saved"); },
  setSecurity(k, v) { Store.state.security[k] = v; Store.save(); this.toast(k === "twoFA" ? `Two-factor authentication ${v ? "enabled" : "disabled"}` : "Security setting updated"); },
  setPref(k, v) { Store.state.prefs[k] = v; Store.save(); this.updateBell(); this.toast("Notification preference saved"); },
  signOutSession(id) { const s = Store.state.security; s.sessions = s.sessions.filter(x => x.id !== id); Store.save(); Views.settings(); icons(); this.toast("Session signed out"); },
  signOutOthers() { const s = Store.state.security; s.sessions = s.sessions.filter(x => x.current); Store.save(); Views.settings(); icons(); this.toast("All other sessions signed out"); },
  savePayPrefs() {
    const ph = val("pp-phone"); if (ph && !isKePhone(ph)) return this.toast("Enter a valid Safaricom number.");
    Object.assign(Store.state.payPrefs, { defaultMethod:$("pp-method").value, mpesaPhone:ph, bank:$("pp-bank").value.split(" ")[0], lowBalance:Math.max(0, parseInt(val("pp-low"), 10) || 0) });
    Store.save(); this.refreshAll(); this.toast("Payment preferences saved");
  },
  downloadData() { const { security, ...rest } = Store.state; const u = { ...rest.user, avatar:"[omitted]" }; this.download("nestsphere-my-data.json", JSON.stringify({ ...rest, user:u, exportedAt:new Date().toISOString() }, null, 2), "application/json"); },
  requestDeletion() { Modal.confirm("Request account deletion?", "An administrator will review your request. Withdraw any remaining wallet balance first.", () => this.toast("Deletion request submitted for review."), "Submit request"); }
});
