import React, { useMemo } from 'react';
import { AreaChart, TrendingUp } from 'lucide-react';
import { TariffType, TariffParams } from '../types';
import { calculateBill, formatFCFA } from '../utils';

interface SimulationChartsProps {
  tariffType: TariffType;
  currentKwh: number;
  params: TariffParams;
  billingDays: number;
}

export default function SimulationCharts({
  tariffType,
  currentKwh,
  params,
  billingDays,
}: SimulationChartsProps) {
  // Generate points for the graph (0 to 500 kWh)
  const chartData = useMemo(() => {
    const pointsCount = 40;
    const maxKwh = Math.max(500, currentKwh * 1.15); // Scale x-axis if user exceeds 500 kWh
    const data: { kwh: number; cost: number }[] = [];

    for (let i = 0; i <= pointsCount; i++) {
      const kwh = (maxKwh / pointsCount) * i;
      // Calculate bill for this specific kWh
      const result = calculateBill(tariffType, kwh, 'kWh', billingDays, params);
      data.push({ kwh, cost: result.netToPay });
    }
    return { data, maxKwh };
  }, [tariffType, params, billingDays, currentKwh]);

  const { data, maxKwh } = chartData;

  // Find max cost to scale y-axis
  const maxCost = useMemo(() => {
    return Math.max(...data.map((d) => d.cost));
  }, [data]);

  // Width & height of the SVG viewport
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingLeft = 65;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const graphWidth = svgWidth - paddingLeft - paddingRight;
  const graphHeight = svgHeight - paddingTop - paddingBottom;

  // Helpers to project values to SVG coordinates
  const getX = (kwh: number) => {
    return paddingLeft + (kwh / maxKwh) * graphWidth;
  };

  const getY = (cost: number) => {
    return paddingTop + graphHeight - (cost / maxCost) * graphHeight;
  };

  // Generate SVG path string
  const pathData = useMemo(() => {
    if (data.length === 0) return '';
    return data
      .map((pt, idx) => {
        const x = getX(pt.kwh);
        const y = getY(pt.cost);
        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, [data, maxKwh, maxCost]);

  // Generate SVG area string
  const areaData = useMemo(() => {
    if (data.length === 0) return '';
    const startX = getX(0);
    const startY = getY(0);
    const endX = getX(data[data.length - 1].kwh);
    const bottomY = paddingTop + graphHeight;

    const points = data.map((pt) => `${getX(pt.kwh)} ${getY(pt.cost)}`).join(' L ');
    return `M ${startX} ${bottomY} L ${points} L ${endX} ${bottomY} Z`;
  }, [data, maxKwh, maxCost]);

  // SVG coordinates for the current user's consumption marker
  const markerX = getX(currentKwh);
  const currentResult = calculateBill(tariffType, currentKwh, 'kWh', billingDays, params);
  const markerY = getY(currentResult.netToPay);

  // Define division points for BT1 tranches on the X-axis for visual shading
  const socialTierX = getX(20);
  const tranche1EndX = getX(250);
  const groundY = paddingTop + graphHeight;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col gap-8" id="simulation-chart-panel">
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <AreaChart className="h-4 w-4 text-indigo-600" />
          Simulation d'Évolution des Tarifs
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Visualisez l'impact de votre consommation sur le coût final TTC (FCFA)
        </p>
      </div>

      {/* Interactive Responsive SVG Graph */}
      <div className="w-full overflow-x-auto select-none">
        <div className="min-w-[500px] w-full">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
            {/* Definitions for Gradients */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.00" />
              </linearGradient>
              <linearGradient id="socialGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
              </linearGradient>
              <linearGradient id="tranche1Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.00" />
              </linearGradient>
              <linearGradient id="tranche2Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Background Grid Lines (Horizontal) */}
            {Array.from({ length: 5 }).map((_, i) => {
              const val = (maxCost / 4) * i;
              const y = getY(val);
              return (
                <g key={i}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    strokeDasharray={i === 0 ? '0' : '4 4'}
                  />
                  <text
                    x={paddingLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="font-mono text-[9px] fill-slate-400 font-bold"
                  >
                    {Math.round(val)}
                  </text>
                </g>
              );
            })}

            {/* Vertical grid / labels (KWh) */}
            {Array.from({ length: 6 }).map((_, i) => {
              const val = (maxKwh / 5) * i;
              const x = getX(val);
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={groundY}
                    stroke="#f8fafc"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={groundY + 16}
                    textAnchor="middle"
                    className="font-mono text-[9px] fill-slate-400 font-bold"
                  >
                    {Math.round(val)} kWh
                  </text>
                </g>
              );
            })}

            {/* BT1 Specific Shaded Tranche Regions */}
            {tariffType === 'BT1' && maxKwh >= 250 && (
              <>
                {/* Social tier region (0 to 20 kWh) */}
                <rect
                  x={paddingLeft}
                  y={paddingTop}
                  width={socialTierX - paddingLeft}
                  height={graphHeight}
                  fill="url(#socialGradient)"
                />
                <line
                  x1={socialTierX}
                  y1={paddingTop}
                  x2={socialTierX}
                  y2={groundY}
                  stroke="#10b981"
                  strokeWidth="0.75"
                  strokeDasharray="2 2"
                />

                {/* Tranche 1 region (21 to 250 kWh) */}
                <rect
                  x={socialTierX}
                  y={paddingTop}
                  width={tranche1EndX - socialTierX}
                  height={graphHeight}
                  fill="url(#tranche1Gradient)"
                />
                <line
                  x1={tranche1EndX}
                  y1={paddingTop}
                  x2={tranche1EndX}
                  y2={groundY}
                  stroke="#4f46e5"
                  strokeWidth="0.75"
                  strokeDasharray="2 2"
                />

                {/* Tranche 2 region (> 250 kWh) */}
                <rect
                  x={tranche1EndX}
                  y={paddingTop}
                  width={getX(maxKwh) - tranche1EndX}
                  height={graphHeight}
                  fill="url(#tranche2Gradient)"
                />

                {/* Tranches Label Text overlay */}
                <text x={(paddingLeft + socialTierX) / 2} y={paddingTop + 14} textAnchor="middle" className="text-[8px] font-bold fill-emerald-600/70 tracking-wider">
                  SOCIAL
                </text>
                <text x={(socialTierX + tranche1EndX) / 2} y={paddingTop + 14} textAnchor="middle" className="text-[8px] font-bold fill-indigo-600/70 tracking-wider">
                  TRANCHE 1
                </text>
                <text x={(tranche1EndX + getX(maxKwh)) / 2} y={paddingTop + 14} textAnchor="middle" className="text-[8px] font-bold fill-red-600/70 tracking-wider">
                  TRANCHE 2
                </text>
              </>
            )}

            {/* Filled Area */}
            <path d={areaData} fill="url(#areaGradient)" />

            {/* Trend Line */}
            <path
              d={pathData}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Current Position Marker (Vertical Guide) */}
            <line
              x1={markerX}
              y1={paddingTop}
              x2={markerX}
              y2={groundY}
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Current Position Marker Circle */}
            <circle
              cx={markerX}
              cy={markerY}
              r="6"
              fill="#4f46e5"
              stroke="#ffffff"
              strokeWidth="2.5"
              className="shadow-sm"
            />

            {/* Current Position Marker Outer Glow */}
            <circle
              cx={markerX}
              cy={markerY}
              r="11"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />

            {/* Active Tooltip Box in the SVG */}
            <g transform={`translate(${markerX + (markerX > svgWidth - 140 ? -135 : 10)}, ${markerY > 150 ? markerY - 50 : markerY - 10})`}>
              <rect
                width="125"
                height="45"
                rx="8"
                fill="#0f172a"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
              />
              <text x="8" y="18" className="fill-slate-400 font-bold text-[9px] uppercase tracking-wider">
                Votre Point
              </text>
              <text x="8" y="32" className="fill-white font-mono font-extrabold text-[11px]">
                {currentKwh.toFixed(1)} kWh = {formatFCFA(currentResult.netToPay)}
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Description of Tranche logic and progressive pricing */}
      {tariffType === 'BT1' && (
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 text-xs text-slate-600 flex gap-4">
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 self-start">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="flex flex-col gap-1.5 leading-relaxed">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Comprendre la progressivité des tranches sbee
            </span>
            <p className="mt-1">
              • <strong className="text-emerald-600">Tranche Sociale (0 à 20 kWh)</strong> : Conçue pour accompagner les particuliers, elle applique un tarif minime de 86 FCFA/kWh et est entièrement exempte de TVA.
            </p>
            <p>
              • <strong className="text-indigo-600">Tranche 1 (21 à 250 kWh)</strong> : Bascule vers le tarif standard de 125 FCFA/kWh avec application systématique de la TVA (18%) sur la consommation et la redevance fixe.
            </p>
            <p>
              • <strong className="text-red-500">Tranche 2 (Au-delà de 250 kWh)</strong> : Un coût majoré à 148 FCFA/kWh s'ajoute sur l'excédent de consommation, ce qui accentue la trajectoire de la courbe.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
