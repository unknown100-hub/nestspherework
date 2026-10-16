/* =====================================================================
 * js/services/gateway.js
 * WHAT IT DOES : Payment gateway adapter (SIMULATED). Replace with real M-Pesa / card / bank calls to your server.
 * NEEDS (loaded before it): helpers.js
 * ===================================================================== */

/* Payment gateway adapter (SIMULATED).
 * Production: call your server, never the provider directly from the browser:
 *   M-Pesa  -> POST /api/payments/mpesa/stk   (Safaricom Daraja STK Push, callback confirms)
 *   Card    -> POST /api/payments/card        (Stripe / Flutterwave / Pesapal; use hosted fields so card data never touches your server)
 *   Bank    -> POST /api/payments/bank        (virtual account / PesaLink, webhook reconciles)
 * The server must verify the amount, enforce an idempotency key and only then credit/debit the wallet. */
const Gateway = {
  async charge(p) {
    const wait = { wallet:600, mpesa:3000, bank:2200, visa:2000, mastercard:2000 }[p.method] || 1500;
    await sleep(wait);
    return { gatewayRef: "GW" + Math.random().toString(36).slice(2,10).toUpperCase(), status:"success" };
  }
};
