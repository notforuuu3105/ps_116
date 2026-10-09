import React from 'react';
import { Compass, Maximize2, ShieldCheck, AlertTriangle } from 'lucide-react';

export function SitePlan2D({ massingData, requestState }) {
  if (!massingData) return null;

  const { metrics, compliance, site_boundary_2d, setback_boundary_2d, podium_footprint_2d, tower_footprint_2d } = massingData;
  const W = requestState?.plot_width || 60;
  const D = requestState?.plot_depth || 80;
  const frontSB = requestState?.setback_front || 9;
  const rearSB = requestState?.setback_rear || 6;
  const sideSB = requestState?.setback_sides || 6;

  // ViewBox margins
  const margin = 20;
  const viewBoxW = W + margin * 2;
  const viewBoxH = D + margin * 2;

  // Convert real-world coordinates [x, y] to SVG coordinates
  // SVG top-left is (0,0), our site front is y=0, rear is y=D
  const toSvgX = (x) => margin + x;
  const toSvgY = (y) => margin + (D - y); // Flip Y so front road is at bottom

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* CAD Header overlay */}
      <div className="absolute top-4 left-6 z-10 flex items-center gap-3 bg-slate-900/90 backdrop-blur border border-slate-700/60 rounded-xl px-4 py-2 text-xs">
        <div className="font-semibold text-sky-400">2D ARCHITECTURAL BYE-LAW PLAN</div>
        <div className="text-slate-400 border-l border-slate-700 pl-3">Scale 1:100 (Metric Units)</div>
        <div className="text-slate-400 border-l border-slate-700 pl-3">
          Site: <span className="text-white font-mono">{W}m × {D}m ({metrics.plot_area} m²)</span>
        </div>
      </div>

      {/* SVG Drawing Canvas */}
      <div className="w-full h-full max-w-4xl max-h-[85vh] flex items-center justify-center p-4">
        <svg
          viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
          className="w-full h-full drop-shadow-2xl font-mono text-[2.8px] overflow-visible"
        >
          {/* Defs for hatching patterns */}
          <defs>
            <pattern id="commPattern" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="4" stroke="#3b82f6" strokeWidth="0.8" strokeOpacity="0.4" />
            </pattern>
            <pattern id="resPattern" width="4" height="4" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="4" stroke="#f97316" strokeWidth="0.8" strokeOpacity="0.5" />
            </pattern>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
            </marker>
          </defs>

          {/* 1. Surrounding Context / Road strip at bottom (Front) */}
          <rect
            x={toSvgX(-margin * 0.8)}
            y={toSvgY(0)}
            width={W + margin * 1.6}
            height={margin * 0.8}
            fill="#18181b"
            stroke="#27272a"
            strokeWidth="0.4"
          />
          <text
            x={toSvgX(W / 2)}
            y={toSvgY(-margin * 0.35)}
            textAnchor="middle"
            fill="#a1a1aa"
            fontSize="3.2"
            letterSpacing="0.5"
          >
            PRIMARY ACCESS ARTERIAL ROAD (18.0M RIGHT-OF-WAY)
          </text>
          {/* Road center line */}
          <line
            x1={toSvgX(-margin * 0.8)}
            y1={toSvgY(-margin * 0.4)}
            x2={toSvgX(W + margin * 0.8)}
            y2={toSvgY(-margin * 0.4)}
            stroke="#eab308"
            strokeWidth="0.5"
            strokeDasharray="3 2"
          />

          {/* 2. Site Boundary */}
          <rect
            x={toSvgX(0)}
            y={toSvgY(D)}
            width={W}
            height={D}
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="1.0"
          />

          {/* 3. Permeable Green Setback Area (Buffer) */}
          <rect
            x={toSvgX(sideSB)}
            y={toSvgY(D - rearSB)}
            width={W - sideSB * 2}
            height={D - frontSB - rearSB}
            fill="#064e3b"
            fillOpacity="0.15"
          />

          {/* 4. Mandatory Setback Envelopes (Dashed Yellow) */}
          <rect
            x={toSvgX(sideSB)}
            y={toSvgY(D - rearSB)}
            width={W - sideSB * 2}
            height={D - frontSB - rearSB}
            fill="none"
            stroke="#eab308"
            strokeWidth="0.7"
            strokeDasharray="2.5 1.5"
          />

          {/* 5. Commercial Podium Footprint (Blue) */}
          <rect
            x={toSvgX(sideSB)}
            y={toSvgY(D - rearSB)}
            width={W - sideSB * 2}
            height={D - frontSB - rearSB}
            fill="url(#commPattern)"
            stroke="#1d4ed8"
            strokeWidth="1.2"
          />

          {/* 6. Residential Tower Footprint (Orange) */}
          {tower_footprint_2d && tower_footprint_2d.length >= 4 && (() => {
            const twX0 = tower_footprint_2d[0][0];
            const twY0 = tower_footprint_2d[0][1];
            const twX1 = tower_footprint_2d[1][0];
            const twY1 = tower_footprint_2d[2][1];
            const tW = twX1 - twX0;
            const tD = twY1 - twY0;

            return (
              <g>
                <rect
                  x={toSvgX(twX0)}
                  y={toSvgY(twY1)}
                  width={tW}
                  height={tD}
                  fill="url(#resPattern)"
                  stroke="#ea580c"
                  strokeWidth="1.2"
                />
                <text
                  x={toSvgX(twX0 + tW / 2)}
                  y={toSvgY(twY0 + tD / 2)}
                  textAnchor="middle"
                  fill="#fdba74"
                  fontSize="2.8"
                  fontWeight="bold"
                >
                  RESIDENTIAL TOWER FOOTPRINT
                </text>
                <text
                  x={toSvgX(twX0 + tW / 2)}
                  y={toSvgY(twY0 + tD / 2) + 3.2}
                  textAnchor="middle"
                  fill="#fed7aa"
                  fontSize="2.2"
                >
                  ({(tW * tD).toFixed(0)} m² Floor Plate)
                </text>
              </g>
            );
          })()}

          {/* 7. Setback Dimension Annotations */}
          {/* Front Setback */}
          <line
            x1={toSvgX(W / 2)}
            y1={toSvgY(0)}
            x2={toSvgX(W / 2)}
            y2={toSvgY(frontSB)}
            stroke="#38bdf8"
            strokeWidth="0.4"
            markerEnd="url(#arrow)"
            markerStart="url(#arrow)"
          />
          <text
            x={toSvgX(W / 2 + 2)}
            y={toSvgY(frontSB / 2)}
            fill="#38bdf8"
            fontSize="2.4"
          >
            FRONT SB: {frontSB}m
          </text>

          {/* Rear Setback */}
          <line
            x1={toSvgX(W / 2)}
            y1={toSvgY(D)}
            x2={toSvgX(W / 2)}
            y2={toSvgY(D - rearSB)}
            stroke="#38bdf8"
            strokeWidth="0.4"
            markerEnd="url(#arrow)"
            markerStart="url(#arrow)"
          />
          <text
            x={toSvgX(W / 2 + 2)}
            y={toSvgY(D - rearSB / 2)}
            fill="#38bdf8"
            fontSize="2.4"
          >
            REAR SB: {rearSB}m
          </text>

          {/* Left Side Setback */}
          <line
            x1={toSvgX(0)}
            y1={toSvgY(D / 2)}
            x2={toSvgX(sideSB)}
            y2={toSvgY(D / 2)}
            stroke="#38bdf8"
            strokeWidth="0.4"
            markerEnd="url(#arrow)"
            markerStart="url(#arrow)"
          />
          <text
            x={toSvgX(sideSB / 2)}
            y={toSvgY(D / 2 - 2)}
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="2.2"
          >
            SIDE: {sideSB}m
          </text>

          {/* Right Side Setback */}
          <line
            x1={toSvgX(W)}
            y1={toSvgY(D / 2)}
            x2={toSvgX(W - sideSB)}
            y2={toSvgY(D / 2)}
            stroke="#38bdf8"
            strokeWidth="0.4"
            markerEnd="url(#arrow)"
            markerStart="url(#arrow)"
          />
          <text
            x={toSvgX(W - sideSB / 2)}
            y={toSvgY(D / 2 - 2)}
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="2.2"
          >
            SIDE: {sideSB}m
          </text>

          {/* 8. Overall Plot Dimensions */}
          {/* Top Width Dimension */}
          <line
            x1={toSvgX(0)}
            y1={toSvgY(D + 6)}
            x2={toSvgX(W)}
            y2={toSvgY(D + 6)}
            stroke="#94a3b8"
            strokeWidth="0.5"
            markerEnd="url(#arrow)"
            markerStart="url(#arrow)"
          />
          <text
            x={toSvgX(W / 2)}
            y={toSvgY(D + 7.5)}
            textAnchor="middle"
            fill="#f1f5f9"
            fontSize="3.0"
            fontWeight="bold"
          >
            PLOT WIDTH = {W.toFixed(1)}m
          </text>

          {/* Right Depth Dimension */}
          <line
            x1={toSvgX(W + 6)}
            y1={toSvgY(0)}
            x2={toSvgX(W + 6)}
            y2={toSvgY(D)}
            stroke="#94a3b8"
            strokeWidth="0.5"
            markerEnd="url(#arrow)"
            markerStart="url(#arrow)"
          />
          <text
            x={toSvgX(W + 8)}
            y={toSvgY(D / 2)}
            textAnchor="middle"
            fill="#f1f5f9"
            fontSize="3.0"
            fontWeight="bold"
            transform={`rotate(-90 ${toSvgX(W + 8)} ${toSvgY(D / 2)})`}
          >
            PLOT DEPTH = {D.toFixed(1)}m
          </text>

          {/* 9. Ingress & Egress Entrance Arrows */}
          <g transform={`translate(${toSvgX(sideSB + 5)}, ${toSvgY(0)})`}>
            <polygon points="0,-4 3,0 -3,0" fill="#22c55e" />
            <text x="0" y="2.5" textAnchor="middle" fill="#22c55e" fontSize="2.2" fontWeight="bold">COMMERCIAL IN</text>
          </g>
          <g transform={`translate(${toSvgX(W - sideSB - 5)}, ${toSvgY(0)})`}>
            <polygon points="0,-4 3,0 -3,0" fill="#3b82f6" />
            <text x="0" y="2.5" textAnchor="middle" fill="#3b82f6" fontSize="2.2" fontWeight="bold">RESIDENTIAL IN</text>
          </g>

          {/* 10. Fire Tender Access Driveway Loop (Yellow dashed path around building) */}
          <rect
            x={toSvgX(sideSB / 2)}
            y={toSvgY(D - rearSB / 2)}
            width={W - sideSB}
            height={D - frontSB / 2 - rearSB / 2}
            fill="none"
            stroke="#ca8a04"
            strokeWidth="0.4"
            strokeDasharray="1.5 1.5"
          />
          <text
            x={toSvgX(W / 2)}
            y={toSvgY(D - rearSB / 2 + 1.2)}
            textAnchor="middle"
            fill="#fef08a"
            fontSize="1.8"
          >
            MANDATORY 6.0M ALL-AROUND FIRE TENDER ACCESS DRIVEWAY
          </text>

          {/* 11. North Arrow Indicator */}
          <g transform={`translate(${toSvgX(-margin * 0.4)}, ${toSvgY(D - 5)})`}>
            <circle cx="0" cy="0" r="4.5" fill="#0f172a" stroke="#475569" strokeWidth="0.5" />
            <polygon points="0,-3.8 1.8,2.5 0,1.2 -1.8,2.5" fill="#ef4444" />
            <polygon points="0,3.8 1.8,2.5 0,1.2 -1.8,2.5" fill="#94a3b8" />
            <text x="0" y="-5" textAnchor="middle" fill="#f87171" fontSize="3.0" fontWeight="bold">N</text>
          </g>
        </svg>
      </div>

      {/* Bottom Summary Bar */}
      <div className="absolute bottom-4 left-6 right-6 z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur border border-slate-700/60 rounded-xl px-5 py-2.5 text-xs text-slate-300">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-600 rounded-sm" />
            <span>Podium Footprint: <strong className="text-white">{metrics.buildable_footprint_area} m²</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-600 rounded-sm" />
            <span>Tower Footprint: <strong className="text-white">{((W - sideSB * 2 - (requestState?.tower_stepback || 2.5) * 2) * (D - frontSB - rearSB - (requestState?.tower_stepback || 2.5) * 2)).toFixed(0)} m²</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-yellow-400 border-b border-dashed" />
            <span>Setback Limits (Front: {frontSB}m, Rear: {rearSB}m, Sides: {sideSB}m)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {compliance.fire_safety_compliance ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800">
              <ShieldCheck className="w-4 h-4" /> Fire Clearance Compliant (≥6m)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold bg-rose-950/60 px-2.5 py-1 rounded-md border border-rose-800">
              <AlertTriangle className="w-4 h-4" /> Fire Clearance Deficient (&lt;6m)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
