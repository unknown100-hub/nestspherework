/* =====================================================================
 * js/app/interior-design.js
 * WHAT IT DOES : ACTIONS for Interior Design: start a package (deposit) and pay the balance.
 * NEEDS (loaded before it): app/app.js (the App object), views/, ui/checkout.js
 * ===================================================================== */

Object.assign(App, {
  /* interior design */
  startDesign(pkId) {
    const pk = DESIGN_PACKAGES.find(x => x.id === pkId), dep = Math.round(pk.price * 0.2);
    Pay.open({ title:`Design deposit: ${pk.name}`, subtitle:"20% deposit starts your project", amount:dep, category:"design",
      onSuccess: tx => { Store.state.designProjects.unshift({ id:rid("dp"), name:pk.name, total:pk.price, paid:dep, date:tx.date }); Store.save(); } });
  },
  payDesign(id) {
    const d = Store.state.designProjects.find(x => x.id === id), bal = d.total - d.paid;
    Pay.open({ title:`Design balance: ${d.name}`, subtitle:`Outstanding ${fmt(bal)}`, amount:bal, editable:true, min:1000, max:bal, category:"design",
      onSuccess: tx => { d.paid += Math.abs(tx.amount); Store.save(); } });
  }
});
