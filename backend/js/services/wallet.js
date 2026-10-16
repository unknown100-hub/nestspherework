/* =====================================================================
 * js/services/wallet.js
 * WHAT IT DOES : Wallet logic: balance, totals, low-balance check, and record() which writes a transaction and updates the balance only after a payment succeeded.
 * NEEDS (loaded before it): store.js, helpers.js
 * ===================================================================== */

const Wallet = {
  balance: () => Store.state.wallet.balance,
  low: () => Store.state.prefs.low_balance && Wallet.balance() < Store.state.payPrefs.lowBalance,
  totals() {
    const t = Store.state.wallet.transactions;
    return { topped: t.filter(x => x.kind === "topup").reduce((a,x) => a + x.amount, 0),
             spent:  t.filter(x => x.kind === "payment").reduce((a,x) => a - x.amount, 0) };
  },
  record({ kind, title, amount, method, meta = {} }) {
    const w = Store.state.wallet;
    let effect = 0;
    if (kind === "topup") effect = amount;
    else if (method === "wallet") effect = -amount;
    if (effect < 0 && w.balance + effect < 0) throw new Error("Insufficient wallet balance.");
    w.balance += effect;                                   // balance is updated only after the gateway confirmed success
    const tx = { id: rid("t"), ref: "NSP-" + Date.now().toString(36).toUpperCase(), kind, title, method, status:"Completed",
                 amount: kind === "topup" ? amount : -amount, date: new Date().toISOString(),
                 balanceAfter: w.balance, walletEffect: effect !== 0, ...meta };
    w.transactions.unshift(tx);
    Store.save();
    return tx;
  }
};
