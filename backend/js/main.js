/* =====================================================================
 * js/main.js
 * WHAT IT DOES : Start-up: Escape closes pop-ups, and the app starts when the page is ready.
 * NEEDS (loaded before it): all other files
 * ===================================================================== */

document.addEventListener("keydown", e => { if (e.key === "Escape") Modal.close(); });
document.addEventListener("DOMContentLoaded", () => App.init());
