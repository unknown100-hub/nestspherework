/* =====================================================================
 * js/core/store.js
 * WHAT IT DOES : Application state (user, wallet, bookings, portfolio...) saved in the browser. Swap load()/save() for server API calls when you build the backend.
 * NEEDS (loaded before it): constants.js
 * ===================================================================== */

const Store = {
  KEY: "nestsphere:v2", state: null,
  defaults() {
    const d = n => new Date(Date.now() - n * 864e5).toISOString();
    return {
      user: { id:"usr_001", role:"client", name:"Kelvin Mwangi", email:"kelvin.mwangi@nestsphere.ke", phone:"+254 712 345 678",
              location:"Nairobi / UK Resident", occupation:"Diaspora Real Estate Investor", bio:"", tier:"ArdhiSasa Verified (Tier 2)",
              avatar: DEFAULT_AVATAR, memberSince: d(210), language:"English", currency:"KES", timezone:"East Africa Time (EAT - UTC+3)" },
      security: { passwordHash:null, twoFA:false, loginAlerts:true, passwordChangedAt:null,
                  sessions:[{id:"s1",device:"Chrome • Windows",place:"Nairobi, KE",last:"Active now",current:true},{id:"s2",device:"Safari • iPhone",place:"Nairobi, KE",last:"Yesterday"}] },
      prefs: { sms_inspection:true, email_escrow:true, new_listings:false, payment_receipts:true, low_balance:true, marketing:false },
      payPrefs: { defaultMethod:"mpesa", mpesaPhone:"+254 712 345 678", bank:"Standard Chartered", lowBalance:20000 },
      wallet: { balance:250000, transactions:[
        { id:"t3", ref:"NSP-SEED03", kind:"payment", title:"Site visit deposit – Karen Villa", amount:-15000, method:"wallet", status:"Completed", date:d(9), balanceAfter:250000, walletEffect:true },
        { id:"t2", ref:"NSP-SEED02", kind:"topup",   title:"Wallet top-up", amount:150000, method:"mpesa", status:"Completed", date:d(14), balanceAfter:265000, walletEffect:true },
        { id:"t1", ref:"NSP-SEED01", kind:"topup",   title:"Wallet top-up", amount:115000, method:"visa",  status:"Completed", date:d(30), balanceAfter:115000, walletEffect:true } ] },
      saved: ["prop-01"], portfolio: [], bookings: [], designProjects: [],
      escrow: { project:"Karen Villa Build", budget:24000000, milestones:[
        { id:"m1", name:"Foundation & Substructure", pct:20, status:"unfunded" },
        { id:"m2", name:"Walls & Structural Slab",   pct:30, status:"unfunded" },
        { id:"m3", name:"Roofing & Weatherproofing", pct:25, status:"unfunded" },
        { id:"m4", name:"Finishes & Handover",       pct:25, status:"unfunded" } ] },
      realEstate: { intent:"Buy", query:"", type:"All", band:0, beds:"Any" }
    };
  },
  load() {
    const base = this.defaults();
    try { const raw = localStorage.getItem(this.KEY); this.state = raw ? { ...base, ...JSON.parse(raw) } : base; }
    catch { this.state = base; }
  },
  save() { try { localStorage.setItem(this.KEY, JSON.stringify(this.state)); } catch (e) { console.warn("Persist failed", e); } }
};
