import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Maximize2,
  Compass,
  ArrowRight,
  ShieldCheck,
  Search,
  Layers,
  Ruler,
  Building
} from 'lucide-react';

const CITY_PRESETS = [
  { name: 'Nariman Point, Mumbai', lat: 18.9256, lng: 72.8242, authority: 'mumbai_dcr', defaultW: 60, defaultD: 80 },
  { name: 'Connaught Place, New Delhi', lat: 28.6315, lng: 77.2167, authority: 'delhi_dda', defaultW: 70, defaultD: 90 },
  { name: 'MG Road CBD, Bengaluru', lat: 12.9756, lng: 77.6097, authority: 'bengaluru_bbmp', defaultW: 65, defaultD: 85 },
  { name: 'HITEC City, Hyderabad', lat: 17.4474, lng: 78.3762, authority: 'mumbai_dcr', defaultW: 80, defaultD: 100 },
  { name: 'Shivaji Nagar, Pune', lat: 18.5314, lng: 73.8446, authority: 'mumbai_dcr', defaultW: 55, defaultD: 75 }
];

export function GISMapConfigurator({
  requestState,
  setRequestState,
  setActiveView,
  onImportParcel
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polygonLayerRef = useRef(null);

  const [selectedCity, setSelectedCity] = useState(CITY_PRESETS[0]);
  const [parcelWidth, setParcelWidth] = useState(requestState.plot_width || 60);
  const [parcelDepth, setParcelDepth] = useState(requestState.plot_depth || 80);
  const [roadWidth, setRoadWidth] = useState(requestState.abutting_road_width || 18.0);
  const [authority, setAuthority] = useState('mumbai_dcr');

  // NBC 2016 Permissible Height Calculation
  const frontSetback = requestState.setback_front || 7.5;
  const nbcMaxHeight = (1.5 * (roadWidth + frontSetback)).toFixed(1);
  const plotArea = (parcelWidth * parcelDepth).toFixed(0);
  const plotAreaAcres = ((parcelWidth * parcelDepth) / 4046.86).toFixed(2);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedCity.lat, selectedCity.lng],
        zoom: 17,
        zoomControl: true
      });

      // OpenStreetMap Standard Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | MoHUA GIS'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    map.setView([selectedCity.lat, selectedCity.lng], 17);

    // Draw parcel polygon box around center
    if (polygonLayerRef.current) {
      map.removeLayer(polygonLayerRef.current);
    }

    // Convert meters to approximate lat/lng degrees
    // 1 deg lat ~ 111,320m
    const latOffset = (parcelDepth / 111320) / 2;
    const lngOffset = (parcelWidth / (111320 * Math.cos((selectedCity.lat * Math.PI) / 180))) / 2;

    const bounds = [
      [selectedCity.lat - latOffset, selectedCity.lng - lngOffset],
      [selectedCity.lat - latOffset, selectedCity.lng + lngOffset],
      [selectedCity.lat + latOffset, selectedCity.lng + lngOffset],
      [selectedCity.lat + latOffset, selectedCity.lng - lngOffset]
    ];

    const poly = L.polygon(bounds, {
      color: '#003366',
      weight: 3,
      fillColor: '#38bdf8',
      fillOpacity: 0.35
    }).addTo(map);

    poly.bindPopup(`
      <div style="font-family: sans-serif; font-size: 11px;">
        <strong style="color: #003366;">Selected Land Parcel</strong><br/>
        Dimensions: ${parcelWidth}m × ${parcelDepth}m<br/>
        Area: ${plotArea} m² (${plotAreaAcres} Acres)<br/>
        Authority: ${authority.toUpperCase()}
      </div>
    `).openPopup();

    polygonLayerRef.current = poly;

    // Click on map to reposition parcel
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setSelectedCity((prev) => ({ ...prev, lat, lng, name: 'Custom Traced Parcel' }));
    });

  }, [selectedCity, parcelWidth, parcelDepth, authority]);

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setParcelWidth(city.defaultW);
    setParcelDepth(city.defaultD);
    setAuthority(city.authority);
  };

  const handleImportTo3D = () => {
    const updated = {
      ...requestState,
      plot_width: parcelWidth,
      plot_depth: parcelDepth,
      abutting_road_width: roadWidth
    };
    setRequestState(updated);
    if (onImportParcel) onImportParcel(updated, authority);
    setActiveView('studio');
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row overflow-hidden bg-slate-100">
      {/* 1. Left Control Panel for GIS Scrutiny */}
      <aside className="w-full lg:w-96 bg-white border-r border-slate-200 p-5 flex flex-col justify-between overflow-y-auto shrink-0 shadow-sm z-20">
        <div className="space-y-5">
          {/* Header */}
          <div className="border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#003366] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-blue-700" /> GIS Land Parcel Configurator
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select real urban sites or trace cadastral parcels to enforce NBC 2016 road-width limits.
            </p>
          </div>

          {/* City / Location Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Select Urban Hotspot</span>
              <span className="text-[10px] text-blue-600 font-medium">Cadastral Grid Active</span>
            </label>
            <div className="space-y-1.5">
              {CITY_PRESETS.map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCityChange(city)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition flex items-center justify-between ${
                    selectedCity.name === city.name
                      ? 'bg-blue-50 border-blue-600 text-[#003366] font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{city.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {city.defaultW}×{city.defaultD}m
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Municipal Authority Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Municipal Bye-Law Authority
            </label>
            <select
              value={authority}
              onChange={(e) => setAuthority(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-600 font-medium"
            >
              <option value="mumbai_dcr">Mumbai (MCGM DCR 2034)</option>
              <option value="delhi_dda">New Delhi (DDA MPD-2041)</option>
              <option value="bengaluru_bbmp">Bengaluru (BBMP Zonal Rules)</option>
            </select>
          </div>

          {/* Parcel Dimension Sliders */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">Traced Parcel Dimensions</span>
              <span className="text-xs font-bold font-mono text-blue-700">{plotArea} m²</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Parcel Width</span>
                <span className="font-mono font-bold text-slate-800">{parcelWidth} m</span>
              </div>
              <input
                type="range"
                min="30"
                max="150"
                step="1"
                value={parcelWidth}
                onChange={(e) => setParcelWidth(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Parcel Depth</span>
                <span className="font-mono font-bold text-slate-800">{parcelDepth} m</span>
              </div>
              <input
                type="range"
                min="30"
                max="160"
                step="1"
                value={parcelDepth}
                onChange={(e) => setParcelDepth(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Abutting Road Width Slider & NBC 2016 Height Rule */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex justify-between text-xs text-slate-800">
              <span className="font-semibold">Abutting Road Width (Right-of-Way)</span>
              <span className="font-mono font-bold text-blue-700">{roadWidth} m</span>
            </div>
            <input
              type="range"
              min="9.0"
              max="45.0"
              step="1.5"
              value={roadWidth}
              onChange={(e) => setRoadWidth(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            {/* Live NBC Rule Callout */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>NBC 2016 Clause 3.4.1 Height Formula:</span>
              </div>
              <div>
                H<sub>max</sub> = 1.5 × (Road {roadWidth}m + SB {frontSetback}m) ={' '}
                <strong className="text-amber-950 font-mono text-xs">{nbcMaxHeight}m</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Import into 3D Massing Studio */}
        <div className="pt-4 border-t border-slate-200 mt-4">
          <button
            onClick={handleImportTo3D}
            className="w-full py-3 bg-[#003366] hover:bg-blue-900 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>Import Plot into 3D Massing Studio</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </aside>

      {/* 2. Interactive Leaflet Web Map Container */}
      <main className="flex-1 h-full relative">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Map HUD Badge */}
        <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur border border-slate-200 rounded-xl px-4 py-3 shadow-lg text-xs space-y-1">
          <div className="font-bold text-[#003366] flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Real-World GIS Cadastre</span>
          </div>
          <div className="text-slate-600">
            Lat: {selectedCity.lat.toFixed(4)} | Lng: {selectedCity.lng.toFixed(4)}
          </div>
          <div className="text-slate-500 text-[10px]">
            Click anywhere on map to relocate land parcel.
          </div>
        </div>
      </main>
    </div>
  );
}
