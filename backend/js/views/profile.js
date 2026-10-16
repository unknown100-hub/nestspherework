/* =====================================================================
 * js/views/profile.js
 * WHAT IT DOES : TAB: Profile – personal information, avatar, profile completeness. Only builds HTML – actions live in js/app/.
 * NEEDS (loaded before it): views/shared.js, helpers.js, store.js
 * ===================================================================== */

Object.assign(Views, {
  /* PROFILE – identity & personal details only */
  profile() {
    const u = Store.state.user, fields = [u.name, u.email, u.phone, u.location, u.occupation, u.bio], pct = Math.round(fields.filter(Boolean).length / fields.length * 100) , hasPhoto = u.avatar !== DEFAULT_AVATAR;
    $("tab-view-profile").innerHTML = `
      ${banner({ icon:"user-check", badge:"Verified Customer Profile", title:"Account &amp; Diaspora Credentials", sub:"Manage your Kenya National ID, ArdhiSasa registry verification, and land search authorizations." })}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 text-center space-y-4">
          <div class="relative w-24 h-24 mx-auto"><img alt="Profile photo" class="js-avatar w-full h-full rounded-full object-cover ring-4 ring-emerald-500/20" src="${esc(u.avatar)}"/>
            <button class="absolute bottom-0 right-0 p-1.5 bg-brand-800 text-white rounded-full hover:bg-brand-700 shadow" onclick="$('avatar-file').click()" aria-label="Change photo"><i class="w-3.5 h-3.5" data-lucide="camera"></i></button>
            <input id="avatar-file" type="file" accept="image/png,image/jpeg,image/webp" class="hidden" onchange="App.uploadAvatar(this)"/></div>
          <div><h3 class="text-base font-bold text-slate-900 font-display">${esc(u.name)}</h3><p class="text-xs text-slate-500">${esc(u.occupation || "—")}</p><span class="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">${esc(u.tier)}</span></div>
          ${hasPhoto ? `<button class="text-[11px] text-slate-500 hover:text-rose-600 underline" onclick="App.removeAvatar()">Remove photo</button>` : `<p class="text-[11px] text-slate-400">JPG, PNG or WebP • max 2 MB</p>`}
          <div class="border-t border-slate-100 pt-3 text-left space-y-2 text-xs text-slate-600">
            <div class="flex justify-between"><span>Kenya ID / Passport:</span><span class="font-medium text-slate-900">2893****</span></div>
            <div class="flex justify-between"><span>KRA PIN:</span><span class="font-medium text-slate-900">A007****X</span></div>
            <div class="flex justify-between"><span>Member since:</span><span class="font-medium text-slate-900">${dstr(u.memberSince)}</span></div></div>
          <div class="text-left"><div class="flex justify-between text-[11px] text-slate-500 mb-1"><span>Profile completeness</span><strong class="text-slate-800">${pct}%</strong></div><div class="h-1.5 rounded-full bg-slate-100 overflow-hidden"><div class="h-full bg-emerald-600" style="width:${pct}%"></div></div></div>
        </div>
        <div class="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 space-y-4">
          <h3 class="text-sm font-bold font-display text-slate-900">Personal Information</h3>
          <form class="space-y-4" onsubmit="event.preventDefault(); App.saveProfile();">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label class="block text-xs font-medium text-slate-600 mb-1">Full Legal Name</label><input class="w-full text-xs rounded-xl border-slate-200 focus:ring-emerald-700 bg-slate-50" id="prof-fullname" type="text" value="${esc(u.name)}"/></div>
              <div><label class="block text-xs font-medium text-slate-600 mb-1">Email Address</label><input class="w-full text-xs rounded-xl border-slate-200 focus:ring-emerald-700 bg-slate-50" id="prof-email" type="email" value="${esc(u.email)}"/></div>
              <div><label class="block text-xs font-medium text-slate-600 mb-1">M-Pesa / Phone Number</label><input class="w-full text-xs rounded-xl border-slate-200 focus:ring-emerald-700 bg-slate-50" id="prof-phone" type="tel" value="${esc(u.phone)}"/></div>
              <div><label class="block text-xs font-medium text-slate-600 mb-1">Primary Location</label><input class="w-full text-xs rounded-xl border-slate-200 focus:ring-emerald-700 bg-slate-50" id="prof-location" type="text" value="${esc(u.location)}"/></div>
              <div class="md:col-span-2"><label class="block text-xs font-medium text-slate-600 mb-1">Occupation / Investor Type</label><input class="w-full text-xs rounded-xl border-slate-200 focus:ring-emerald-700 bg-slate-50" id="prof-occupation" type="text" value="${esc(u.occupation)}"/></div>
              <div class="md:col-span-2"><label class="block text-xs font-medium text-slate-600 mb-1">About you</label><textarea class="w-full text-xs rounded-xl border-slate-200 focus:ring-emerald-700 bg-slate-50" id="prof-bio" rows="3" maxlength="300" placeholder="What are you looking for? (shown to verified agents)">${esc(u.bio)}</textarea></div>
            </div>
            <div id="prof-error" class="hidden p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"></div>
            <div class="pt-2 flex justify-end"><button class="px-5 py-2 bg-brand-800 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition" type="submit">Save Changes</button></div>
          </form>
        </div>
      </div>`;
  }
});
