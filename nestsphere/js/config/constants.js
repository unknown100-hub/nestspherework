const DEFAULT_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuDDRSwRadgNiw8zLY6KgQAOEYwE1VORxqxRWG90yGoLMTRVjjIm3Ded_bkrxV-T_yDI35Mpc_GhS01MhJqMDsqDBUoktY00GbGPaFvBGoIdcs-kIg1yi9VtqeifS1VbB3FGV1t-1bahHZD9wjbsw62yfD2PBVsYmvx5tOl61R_B6JvgRSQ457RfTtoBdzW_gqhrrnx5PYtui91i8IMzddUu7ZgkGj-4cDK9BllvmxapYtCnoJ5y6latiiWX-kg_bf1N6g";
const IMG = {
  villa: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpbHJ3mIrR_MIVVf0It0UHq_jHDgZPavX9u9SfygO0vxKye1S_Rf1fPtvLHxIUNFzFncZp6lMspiMxf4C1EgK0QL_Uk4SrIvTnqbLm5SnOGCdA691qWVI_9-S6UkvUT1wJguCVm7_tdLvxQMHzY-evH81L6iC0JoacsZCFFUIiOBSYa4uHroJwaBTShi5coWWfsj0SaQy9v7O4xvyZ-wEJJewqyNwTj9t8eUbarFY68dfLNZoe_KA0jZSmKLf4KQiQgg",
  penthouse: "https://lh3.googleusercontent.com/aida-public/AB6AXuBK4VSsWtuN5-HVtv5zBKi8bEZoNqZqroOcTNpJ4tfqlSONuP4I4eMJqi56DpMCiGwQM9F1e_Xy4CWuJU5KwDC0WAzkwDnCYzcT7NHBFh_qmdD64os-LPjwX-wliXElmu4vX46rLA9VXn1RiUwbWeG5ZF9pcTf6f-ykkhMbCkarPDASTVB7n2W4KUv62_0wT33Ny7R6vq9XKmYM3rO8RlqH6ibFg8b-HlLMJGnS6JatPEaTArl5-0jNAFYr-QNyxgprKg",
  plot: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMzRC3GjIfLEn2oidlFopqajv-mHaKk8AUAskJZEhL2Uy25yX-uhxVlKFDivikWk1y8gXWb2tqlHZqK2tiQO8UYxou3lINOq_mQV7HIIQqM80TNrc48oblClWs0DN5l1UPb49SCrVIBaEQrZ5kGVN3kOZPsXzbSNgaNv7e5CLG3McdRfZFwOqueaoMdirMFlaqB3RD6NMHv1jXk1zZpU8caqb1iCaA9aVTSzh_zsHFEaE4YR3fmPbBelyiVJm3D0ch1Q"
};

const LISTINGS = [
  { id:"prop-01", intent:"Buy", type:"Villa", badge:"FOR SALE", badgeColor:"bg-emerald-600", title:"Modern 4-Bedroom Villa", location:"Karen, Nairobi", price:65000000, beds:4, specs:"4 Beds • 5 Baths", image:IMG.villa },
  { id:"prop-02", intent:"Rent", type:"Apartment", badge:"FOR RENT", badgeColor:"bg-blue-600", title:"Executive 2-Bed Penthouse", location:"Kilimani, Nairobi", price:180000, beds:2, specs:"2 Beds", image:IMG.penthouse, per:"/ month" },
  { id:"prop-03", intent:"Buy", type:"Land", badge:"FOR SALE", badgeColor:"bg-emerald-600", title:"Prime Serviced Plot 1/4 Acre", location:"Ruiru, Eastern Bypass", price:4200000, beds:0, specs:"Ready Title", image:IMG.plot },
  { id:"prop-04", intent:"Buy", type:"Villa", badge:"FOR SALE", badgeColor:"bg-emerald-600", title:"Garden Maisonette 5-Bedroom", location:"Runda, Nairobi", price:112000000, beds:5, specs:"5 Beds • 6 Baths", image:IMG.villa },
  { id:"prop-05", intent:"Rent", type:"Apartment", badge:"FOR RENT", badgeColor:"bg-blue-600", title:"Modern 1-Bed Studio Apartment", location:"Westlands, Nairobi", price:75000, beds:1, specs:"1 Bed", image:IMG.penthouse, per:"/ month" },
  { id:"prop-06", intent:"Commercial", type:"Commercial", badge:"COMMERCIAL", badgeColor:"bg-amber-600", title:"Grade-A Office Floor 420 sqm", location:"Upper Hill, Nairobi", price:95000000, beds:0, specs:"420 sqm • 12 Bays", image:IMG.plot }
];
const PRICE_BANDS = {
  Buy: [["Any price",0,Infinity],["Under KES 15M",0,15e6],["KES 15M - KES 80M",15e6,80e6],["KES 80M +",80e6,Infinity]],
  Commercial: [["Any price",0,Infinity],["Under KES 50M",0,50e6],["KES 50M - KES 150M",50e6,150e6],["KES 150M +",150e6,Infinity]],
  Rent: [["Any price",0,Infinity],["Under KES 100K / mo",0,1e5],["KES 100K - 250K / mo",1e5,2.5e5],["KES 250K + / mo",2.5e5,Infinity]]
};
const STUDIOS = [
  { name:"Studio Nairobi Interiors", rating:"4.9", area:"Karen & Westlands", spec:"Luxury Penthouse Fitouts & Bespoke Styling", cta:"Book Consultation" },
  { name:"Safari Modern Living & Decor", rating:"4.8", area:"Kilimani, Nairobi", spec:"Turnkey Furniture, Lighting & Kenyan Art Curation", cta:"Request Estimate" },
  { name:"Equatorial Craft & Joinery", rating:"4.9", area:"Nationwide Delivery", spec:"Custom Kitchen Cabinets & Island Counters", cta:"Custom Quote" }
];
const DESIGN_PACKAGES = [
  { id:"pk-1", name:"Essential Refresh", price:350000, desc:"Colour scheme, soft furnishings, lighting plan for up to 2 rooms.", items:["Mood board & 3D concept","Paint & textile selection","2 rooms"] },
  { id:"pk-2", name:"Signature Fit-out", price:1200000, desc:"Full living areas with bespoke joinery and curated Kenyan art.", items:["Space planning & renders","Custom joinery","Furniture sourcing"] },
  { id:"pk-3", name:"Luxury Turnkey", price:3500000, desc:"Whole-home delivery: design, procurement, install and styling.", items:["Full-home design","Project management","Install & styling"] }
];
const ENGINEERS = [
  { ini:"ES", color:"emerald", name:"Eng. Samuel Omondi", role:"Lead Civil & Structural Engineer", reg:"EBK / NCA 1", spec:"Villas & Multi-Story RCC", cov:"Nairobi & Kiambu County", stat:["Completed Audits","142 Projects"], cta:"Book Inspection", cta2:"Get BOQ", cat:"Site inspection" },
  { ini:"AM", color:"blue", name:"Arch. Marion Wangari", role:"Principal Architect & Urban Planner", reg:"BORAQS A/942", spec:"Modern Tropical Architecture", cov:"Karen, Tigoni & Ruiru", stat:["Completed Audits","89 Approvals"], cta:"Book Review", cta2:"View Plans", cat:"Plan review" },
  { ini:"QS", color:"amber", name:"Apex Cost Surveyors Ltd", role:"Chartered Quantity Surveyors", reg:"IQSK Fellow", spec:"BOQ & Cost Control Escalation", cov:"Nationwide (Kenya)", stat:["Verified Audits","KES 1.8B Managed"], cta:"Request BOQ", cta2:"Cost Guide", cat:"BOQ request" }
];
const BANKS = ["KCB Bank","Equity Bank","Standard Chartered","Co-operative Bank","NCBA Bank","Absa Bank Kenya"];
