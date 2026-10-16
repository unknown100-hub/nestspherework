/* =====================================================================
 * js/app/profile.js
 * WHAT IT DOES : ACTIONS for Profile: save details, upload / remove profile picture.
 * NEEDS (loaded before it): app/app.js (the App object), views/, ui/checkout.js
 * ===================================================================== */

Object.assign(App, {
  /* profile */
  saveProfile() {
    const name = val("prof-fullname"), email = val("prof-email"), phone = val("prof-phone"), err = $("prof-error");
    const fail = m => { err.textContent = m; err.classList.remove("hidden"); };
    if (name.length < 2) return fail("Please enter your full name.");
    if (!isEmail(email)) return fail("Please enter a valid email address.");
    if (!/^\+?[0-9\s]{9,16}$/.test(phone)) return fail("Please enter a valid phone number.");
    Object.assign(Store.state.user, { name, email, phone, location:val("prof-location"), occupation:val("prof-occupation"), bio:val("prof-bio") });
    Store.save(); this.refreshAll(); this.toast("Profile changes saved successfully");
  },
  uploadAvatar(input) {
    const file = input.files && input.files[0]; if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return this.toast("Please choose a JPG, PNG or WebP image.");
    if (file.size > 2 * 1024 * 1024) return this.toast("Image is too large – maximum 2 MB.");
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {                       // resize to 256px square so it stays small enough to store
        const c = document.createElement("canvas"), n = 256, side = Math.min(img.width, img.height);
        c.width = c.height = n; c.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, n, n);
        Store.state.user.avatar = c.toDataURL("image/jpeg", 0.85); Store.save(); this.refreshAll(); this.toast("Profile picture updated");
      };
      img.onerror = () => this.toast("That image could not be read.");
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  },
  removeAvatar() { Store.state.user.avatar = DEFAULT_AVATAR; Store.save(); this.refreshAll(); this.toast("Profile picture removed"); }
});
