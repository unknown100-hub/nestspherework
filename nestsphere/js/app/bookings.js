/* =====================================================================
 * js/app/bookings.js
 * WHAT IT DOES : ACTIONS for site visits / consultations / inspections / BOQ: booking pop-up and validation.
 * NEEDS (loaded before it): app/app.js (the App object), views/, ui/checkout.js
 * ===================================================================== */

Object.assign(App, {
  /* bookings (site visits, consultations, inspections, BOQ) */
  openBooking(title, category) {
    this._bk = { title, category };
    const today = new Date().toISOString().slice(0,10);
    Modal.show(`${Modal.head("calendar-check", title, category + " • Verified professionals")}
      <form class="space-y-3 pt-2 text-xs" onsubmit="event.preventDefault(); App.submitBooking();">
        <div><label class="block font-medium text-slate-700 mb-1">Target Property / Site Location</label><input class="w-full rounded-xl border-slate-200 bg-slate-50 text-xs" id="modal-input-location" type="text" value="${esc(Store.state.user.location.split("/")[0].trim())}"/></div>
        <div><label class="block font-medium text-slate-700 mb-1">Preferred Date</label><input class="w-full rounded-xl border-slate-200 bg-slate-50 text-xs" id="modal-input-date" type="date" min="${today}"/></div>
        <div><label class="block font-medium text-slate-700 mb-1">Notes or Specific Reference</label><textarea class="w-full rounded-xl border-slate-200 bg-slate-50 text-xs" id="modal-input-notes" maxlength="400" placeholder="e.g. Foundation reinforcement inspection and soil test sign-off" rows="2"></textarea></div>
        <div id="bk-error" class="hidden p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium"></div>
        <div class="flex items-center gap-2 pt-2"><button class="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold" onclick="Modal.close()" type="button">Cancel</button><button class="flex-1 py-2 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-semibold shadow-sm" type="submit">Confirm Booking</button></div>
      </form>`);
  },
  submitBooking() {
    const date = val("modal-input-date"), loc = val("modal-input-location"), err = $("bk-error");
    const fail = m => { err.textContent = m; err.classList.remove("hidden"); };
    if (loc.length < 2) return fail("Please enter the site location.");
    if (!date) return fail("Please choose a preferred date.");
    if (new Date(date) < new Date(new Date().toDateString())) return fail("The date cannot be in the past.");
    const ref = "BK-" + Math.floor(1000 + Math.random() * 9000);
    Store.state.bookings.unshift({ id:rid("bk"), ref, title:this._bk.title, category:this._bk.category, date, location:loc, notes:val("modal-input-notes"), status:"Pending confirmation" });
    Store.save(); Modal.close(); this.refreshAll(); this.toast(`Booking requested! Reference ${ref}`);
  }
});
