import React, { useState } from 'react';
import { BookOpen, Search, Filter, ExternalLink, ShieldAlert, CheckCircle2, Bookmark, FileText } from 'lucide-react';
import { translations } from '../utils/translations';

const STANDARDS_DATA = [
  {
    id: "nbc_part3",
    category: "nbc",
    code: "NBC 2016 Part 3",
    title: "Development Control Rules & General Building Requirements",
    title_hi: "विकास नियंत्रण नियम और सामान्य भवन आवश्यकताएं",
    authority: "Bureau of Indian Standards (BIS)",
    scope: "National Building Code across India",
    key_points: [
      "Open Spaces Around Buildings: Exterior open space for buildings up to 35m in height shall not be less than 6.0m on sides and rear.",
      "Courtyard & Interior Light Wells: Minimum courtyard width shall be not less than 1/5th of the building height for adequate daylight and ventilation.",
      "Mixed-Use Ingress: Separate dedicated pedestrian accessways for commercial podium and residential lobbies."
    ],
    inferno_compliance: "Fully integrated: 6.0m side/rear setbacks and 16m courtyard width exceed 1/5th height (7.0m) threshold."
  },
  {
    id: "nbc_part4",
    category: "nbc",
    code: "NBC 2016 Part 4",
    title: "Fire & Life Safety Compliance for Mixed-Use High-Rise",
    title_hi: "अग्नि एवं जीवन सुरक्षा अनुपालन",
    authority: "Bureau of Indian Standards (BIS)",
    scope: "Fire prevention, egress travel distance, and firefighting access",
    key_points: [
      "Vehicular Access: Abutting road width &ge; 12.0m with unobstructed fire tender movement corridor.",
      "Staircase Enclosures: Two pressurized fire-rated egress staircases required for occupant loads &gt; 100 persons per floor.",
      "Refuge Area: Cantilever refuge balconies required every 7 floors above 24m building height."
    ],
    inferno_compliance: "Dual fire stair cores with 2-hour rating and dedicated 6m peripheral driveway provided."
  },
  {
    id: "mumbai_dcpr",
    category: "mumbai",
    code: "Mumbai DCPR 2034",
    title: "Development Control & Promotion Regulations for Greater Mumbai",
    title_hi: "वृहन्मुंबई विकास नियंत्रण एवं संवर्धन नियमावली 2034",
    authority: "Municipal Corporation of Greater Mumbai (MCGM)",
    scope: "Zoning, TDR, Fungible FSI & Commercial Mixed-Use",
    key_points: [
      "Zonal FAR: Base FAR 1.33 + Road width incentive up to 3.00 for plots abutting &ge; 18.0m roads.",
      "Podium Parking: Above-ground or basement parking permitted with 20% provision for EV charging.",
      "Fungible Area: 35% compensatory FSI allowable for residential balconies and utility ducts."
    ],
    inferno_compliance: "Preset incorporates 3.00 max FAR and 18m abutting road standard."
  },
  {
    id: "delhi_mpd",
    category: "delhi",
    code: "Delhi MPD 2021 / 2041",
    title: "Master Plan for Delhi — Mixed-Use & Transit Oriented Development (TOD)",
    title_hi: "दिल्ली मास्टर प्लान — मिश्रित उपयोग और ट्रांजिट-ओरिएंटेड डेवलपमेंट",
    authority: "Delhi Development Authority (DDA)",
    scope: "National Capital Territory of Delhi",
    key_points: [
      "Permissible FAR: Base 2.00 to 2.50 with TOD corridor intensification within 500m of metro stations.",
      "Ground Coverage: Capped at 40% for commercial-residential integrated plots.",
      "Front Setback: Minimum 9.0m mandatory setback on master plan arterial roads."
    ],
    inferno_compliance: "Preset enforces 40% ground coverage cap and 9m front setback."
  },
  {
    id: "bbmp_bda",
    category: "bengaluru",
    code: "BBMP / BDA Zonal Regulations",
    title: "Bengaluru Master Plan & Building Bye-Laws",
    title_hi: "बेंगलुरु जोनल विनियम और भवन उपनियम",
    authority: "Bruhat Bengaluru Mahanagara Palike (BBMP)",
    scope: "Greater Bengaluru Metropolitan Area",
    key_points: [
      "FAR Bands: FAR 2.75 for plots with road width &ge; 18.0m and plot depth &ge; 60m.",
      "Rainwater Harvesting: Compulsory percolation pits and dual-plumbing greywater recycling.",
      "Basement Setbacks: Clear 3.0m offset from boundary for basement excavation walls."
    ],
    inferno_compliance: "Includes rainwater percolation bioswales and 2.75 FAR threshold."
  },
  {
    id: "cea_ev",
    category: "cea",
    code: "CEA Guidelines 2022",
    title: "Electric Vehicle (EV) Charging Infrastructure Norms",
    title_hi: "विद्युत वाहन (EV) चार्जिंग इंफ्रास्ट्रक्चर दिशानिर्देश",
    authority: "Central Electricity Authority (Ministry of Power)",
    scope: "Public and private commercial/residential complexes",
    key_points: [
      "Mandatory EV Allocation: Minimum 20% of total parking capacity must have dedicated AC Slow/Fast EV chargers.",
      "Electrical Load Provisioning: Substation transformer capacity sized for 3.3 kW to 22 kW EV charging per designated bay.",
      "Fire Separation: EV charging zones in basements require automatic sprinkler grids and smoke containment baffles."
    ],
    inferno_compliance: "24 out of 118 bays (20.3%) designated as EV charging bays in Basement B1."
  },
  {
    id: "bee_ecbc",
    category: "bee",
    code: "BEE ECBC 2017",
    title: "Energy Conservation Building Code for Commercial Complexes",
    title_hi: "ऊर्जा संरक्षण भवन कोड (ECBC)",
    authority: "Bureau of Energy Efficiency (Ministry of Power)",
    scope: "Envelope thermal performance, lighting, HVAC efficiency",
    key_points: [
      "Maximum WWR: 40% prescriptive window-to-wall ratio for non-residential building envelope.",
      "Solar Heat Gain Coefficient: SHGC &le; 0.30 for composite and hot-dry climates.",
      "Daylight Autonomy: Spatial daylight autonomy (sDA) of at least 40% of occupied area."
    ],
    inferno_compliance: "Façade studio calibrated to 40% default WWR and DGU Low-E glass (SHGC 0.28)."
  }
];

export function ReferenceLibrary({ lang = 'en' }) {
  const t = translations[lang] || translations.en;

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStandards = STANDARDS_DATA.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery = 
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.key_points.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-800 overflow-y-auto">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'वास्तुशिल्प संदर्भ' : 'Architectural Knowledge Base'}
            </span>
            <span className="text-xs text-slate-500 font-mono">SIH 2026 Academic Research</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            {lang === 'hi' ? 'वास्तुशिल्प मानक और संदर्भ पुस्तकालय' : 'Design Standards & Reference Library'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'hi'
              ? 'एनबीसी 2016, डीसीपीआर 2034, एमपीडी, बीबीएमपी और सीईए दिशा-निर्देशों का संकलन'
              : 'Digest of National Building Code (NBC 2016), municipal by-laws, ECBC, and CEA EV charging guidelines'}
          </p>
        </div>

        {/* Academic Prototype Disclaimer Callout */}
        <div className="px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs max-w-md">
          <div className="flex items-center gap-1.5 font-bold mb-0.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Academic Reference Disclaimer</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-tight">
            Compiled for educational modeling. Does not replace statutory municipal clearance or professional legal counsel.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'all', label: 'All Standards' },
              { id: 'nbc', label: 'NBC 2016' },
              { id: 'mumbai', label: 'Mumbai DCPR' },
              { id: 'delhi', label: 'Delhi MPD' },
              { id: 'bengaluru', label: 'Bengaluru BBMP' },
              { id: 'cea', label: 'CEA (EV Norms)' },
              { id: 'bee', label: 'BEE ECBC' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clauses, setbacks, FAR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content: Standards Cards Grid */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        <div className="text-xs text-slate-500 flex justify-between items-center mb-2">
          <span>Showing {filteredStandards.length} Standards & By-Law References</span>
          <span className="font-mono">Typology: B + G + 9 Mixed-Use Commercial/Residential</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredStandards.map((std) => (
            <div 
              key={std.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {std.code}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {std.authority}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-slate-900 mb-1">
                  {lang === 'hi' ? std.title_hi || std.title : std.title}
                </h2>
                <div className="text-xs text-slate-500 mb-3 italic">
                  {std.scope}
                </div>

                {/* Key Clauses */}
                <div className="space-y-2 mb-4">
                  {std.key_points.map((pt, idx) => (
                    <div key={idx} className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start gap-2">
                      <Bookmark className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* INFERNO Implementation Status Footer */}
              <div className="pt-3 border-t border-slate-100 bg-emerald-50/50 -mx-5 -mb-5 p-4 rounded-b-xl border-t border-emerald-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-semibold text-emerald-950 block">INFERNO Studio Integration:</span>
                  <span className="text-emerald-800">{std.inferno_compliance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
