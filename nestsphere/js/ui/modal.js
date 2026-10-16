/* =====================================================================
 * js/ui/modal.js
 * WHAT IT DOES : The pop-up window used by bookings, checkout and confirmations.
 * NEEDS (loaded before it): helpers.js
 * ===================================================================== */

const Modal = {
  locked: false,
  show(html) { $("modal-body").innerHTML = html; $("booking-modal").classList.remove("hidden"); icons(); },
  close() { if (this.locked) return; $("booking-modal").classList.add("hidden"); $("modal-body").innerHTML = ""; },
  head(icon, title, sub) { return `<div class="flex items-start justify-between mb-3"><div class="flex items-center gap-2.5"><div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center"><i class="w-5 h-5" data-lucide="${icon}"></i></div><div><h3 class="text-base font-bold font-display text-slate-900">${esc(title)}</h3><p class="text-xs text-slate-500">${esc(sub)}</p></div></div><button class="text-slate-400 hover:text-slate-700" onclick="Modal.close()"><i class="w-5 h-5" data-lucide="x"></i></button></div>`; },
  confirm(title, msg, onYes, yesLabel = "Confirm") {
    this._yes = onYes;
    this.show(`${this.head("shield-check", title, "Please confirm")}<p class="text-xs text-slate-600 leading-relaxed">${esc(msg)}</p>
      <div class="flex gap-2 pt-4"><button class="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold" onclick="Modal.close()">Cancel</button>
      <button class="flex-1 py-2 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-semibold" onclick="Modal.close(); Modal._yes && Modal._yes()">${esc(yesLabel)}</button></div>`);
  }
};
