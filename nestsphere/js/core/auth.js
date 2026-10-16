/* =====================================================================
 * js/core/auth.js
 * WHAT IT DOES : Roles and permissions: what a CLIENT can do vs what an ADMINISTRATOR can do. The server must enforce the same rules.
 * NEEDS (loaded before it): store.js (used at call time)
 * ===================================================================== */

/* ---------- 2. AUTH / PERMISSIONS ----------
 * Clients and administrators are separate roles with separate capabilities.
 * This dashboard is the CLIENT app; admin capabilities are listed so the server
 * (the only place where they can really be enforced) mirrors the same map. */
const PERMISSIONS = {
  client: ["listing:browse","listing:save","listing:reserve","visit:book","wallet:view","wallet:topup","payment:make",
           "escrow:fund","escrow:approve","design:book","construction:book","profile:edit","settings:edit"],
  admin:  ["listing:create","listing:update","listing:verify","booking:confirm","payment:reconcile","payment:refund",
           "escrow:verify-inspection","user:manage","user:suspend","report:view","audit:view"]
};
const Auth = { can: p => (PERMISSIONS[Store.state.user.role] || []).includes(p) };
