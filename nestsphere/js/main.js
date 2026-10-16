/* =====================================================================
 * js/main.js
 * WHAT IT DOES : Start-up: Escape closes pop-ups, and the app starts when the page is ready.
 * NEEDS (loaded before it): all other files
 * ===================================================================== */

document.addEventListener("keydown", e => { if (e.key === "Escape") Modal.close(); });
document.addEventListener("DOMContentLoaded", async () => {
  const loginUrl = "../../login.html";
  const redirectToLogin = error => {
    try {
      window.sessionStorage.setItem("nestsphere_login_error", error);
      window.location.replace(loginUrl);
    } catch {
      window.location.replace(`${loginUrl}?error=${encodeURIComponent(error)}`);
    }
  };

  if (window.location.protocol === "file:") {
    redirectToLogin("file-protocol");
    return;
  }

  try {
    const response = await fetch(`${window.NESTSPHERE_API_URL}/api/auth/session`, {
      credentials: "include"
    });
    if (!response.ok) {
      redirectToLogin("session-required");
      return;
    }

    const { user } = await response.json();
    App.init(user);
  } catch {
    redirectToLogin("service-unavailable");
  }
});
