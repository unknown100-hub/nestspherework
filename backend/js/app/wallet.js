/* =====================================================================
 * js/app/wallet.js
 * WHAT IT DOES : ACTIONS for the Dashboard: top-up, transaction filter, CSV export, file download helper.
 * NEEDS (loaded before it): app/app.js (the App object), views/, ui/checkout.js
 * ===================================================================== */

Object.assign(App, {
  /* wallet */
  topUp() { Pay.open({ title:"Wallet top-up", subtitle:"Add money to your NestSphere wallet", topup:true, editable:true, min:100, max:1000000, allowWallet:false, category:"topup" }); },
  setTxFilter(f) { this.txFilter = f; this.txLimit = 8; Views.dashboard(); icons(); },
  exportCsv() {
    const rows = [["Date","Description","Method","Reference","Amount","Balance","Status"], ...Store.state.wallet.transactions.map(x => [new Date(x.date).toISOString(), x.title, x.method, x.ref, x.amount, x.walletEffect ? x.balanceAfter : "", x.status])];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    this.download("nestsphere-transactions.csv", csv, "text/csv");
  },
  download(name, content, type) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
});
