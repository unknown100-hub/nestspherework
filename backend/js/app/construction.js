/* =====================================================================
 * js/app/construction.js
 * WHAT IT DOES : ACTIONS for Construction: open escrow, fund a milestone, approve & release funds.
 * NEEDS (loaded before it): app/app.js (the App object), views/, ui/checkout.js
 * ===================================================================== */

Object.assign(App, {
  /* construction / escrow */
  openEscrow() { this.switchTab("construction"); setTimeout(() => $("escrow-section").scrollIntoView({ behavior:"smooth", block:"start" }), 120); },
  fundMilestone(id) {
    const es = Store.state.escrow, m = es.milestones.find(x => x.id === id), amt = es.budget * m.pct / 100;
    Pay.open({ title:`Escrow: ${m.name}`, subtitle:"Held securely until you approve the inspection report", amount:amt, category:"escrow", onSuccess: () => { m.status = "funded"; Store.save(); } });
  },
  releaseMilestone(id) {
    if (!Auth.can("escrow:approve")) return this.toast("Only the project owner can approve releases.");
    const es = Store.state.escrow, m = es.milestones.find(x => x.id === id);
    Modal.confirm("Release escrow funds?", `You are approving ${fmt(es.budget * m.pct / 100)} for "${m.name}". This cannot be undone.`, () => { m.status = "released"; Store.save(); this.refreshAll(); this.toast("Funds released to the contractor."); }, "Approve & release");
  }
});
