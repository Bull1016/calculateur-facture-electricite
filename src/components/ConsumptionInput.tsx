import React from 'react';
import { Sparkles, Calendar, Zap } from 'lucide-react';

interface ConsumptionInputProps {
  consumption: number;
  setConsumption: (val: number) => void;
  unit: 'kWh' | 'Wh';
  setUnit: (unit: 'kWh' | 'Wh') => void;
  billingDays: number;
  setBillingDays: (days: number) => void;
  tariffType: string;
}

export default function ConsumptionInput({
  consumption,
  setConsumption,
  unit,
  setUnit,
  billingDays,
  setBillingDays,
  tariffType,
}: ConsumptionInputProps) {
  // Common presets based on tariff type
  const presets = tariffType === 'BT1'
    ? [
        { label: 'Tranche Sociale', val: 15, unit: 'kWh' as const, desc: 'Petits consommateurs' },
        { label: 'Tranche 1 (Moyen)', val: 120, unit: 'kWh' as const, desc: 'Foyer classique' },
        { label: 'Tranche 2 (Élevé)', val: 350, unit: 'kWh' as const, desc: 'Climatisation + Équipements' },
      ]
    : [
        { label: 'Professionnel Léger', val: 150, unit: 'kWh' as const, desc: 'Boutique, salon' },
        { label: 'Professionnel Moyen', val: 450, unit: 'kWh' as const, desc: 'Atelier, restaurant' },
        { label: 'Élevé / Industriel', val: 1200, unit: 'kWh' as const, desc: 'Hôtel, menuiserie' },
      ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      setConsumption(0);
    } else {
      setConsumption(Math.max(0, val));
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsumption(parseFloat(e.target.value));
  };

  // Convert current value to kWh to determine slider limits
  const currentKwh = unit === 'Wh' ? consumption / 1000 : consumption;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col gap-8" id="consumption-panel">
      {/* Unit Selector and Input Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-600 fill-indigo-600/10" />
            Consommation Énergétique
          </h2>
          <p className="text-xs text-slate-500 mt-1">Renseignez l'énergie consommée sur la période</p>
        </div>

        {/* Toggle switch for kWh / Wh */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto border border-slate-200">
          <button
            type="button"
            id="unit-kwh-btn"
            onClick={() => {
              if (unit === 'Wh') {
                setUnit('kWh');
                setConsumption(Math.round(consumption / 1000 * 100) / 100);
              }
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              unit === 'kWh'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            kWh
          </button>
          <button
            type="button"
            id="unit-wh-btn"
            onClick={() => {
              if (unit === 'kWh') {
                setUnit('Wh');
                setConsumption(consumption * 1000);
              }
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              unit === 'Wh'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Wh
          </button>
        </div>
      </div>

      {/* Main input value styled beautifully with Clean Minimalism light text */}
      <div className="relative">
        <div className="flex items-center">
          <input
            type="number"
            id="consumption-input"
            min="0"
            step="any"
            value={consumption === 0 ? '' : consumption}
            placeholder="0"
            onChange={handleInputChange}
            className="w-full text-6xl font-light py-4 border-b-2 border-slate-100 focus:border-indigo-600 outline-none transition-colors pr-20 text-slate-800 font-sans tracking-tight"
          />
          <span className="absolute right-0 bottom-4 text-2xl font-semibold text-slate-400">
            {unit}
          </span>
        </div>
        {unit === 'Wh' && (
          <div className="text-xs text-indigo-600 mt-2.5 flex items-center gap-1.5 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Équivaut à <span className="font-bold text-slate-800">{(consumption / 1000).toFixed(3)} kWh</span>
          </div>
        )}
      </div>

      {/* Quick Slider (0 to 600 kWh) with custom indigo theme */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>0 {unit}</span>
          <span>
            {unit === 'kWh' ? '500' : '500 000'} {unit}
          </span>
        </div>
        <input
          type="range"
          id="consumption-range-slider"
          min="0"
          max={unit === 'kWh' ? '500' : '500000'}
          step={unit === 'kWh' ? '1' : '1000'}
          value={consumption > (unit === 'kWh' ? 500 : 500000) ? (unit === 'kWh' ? 500 : 500000) : consumption}
          onChange={handleSliderChange}
          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
        />
        {currentKwh > 500 && (
          <p className="text-center text-[11px] text-indigo-600 font-semibold">
            Consommation supérieure à la plage rapide du curseur (+500 kWh).
          </p>
        )}
      </div>

      {/* Billing Days */}
      <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <label htmlFor="days-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Période de facturation
            </label>
            <p className="text-[10px] text-slate-400 mt-0.5">Nécessaire pour le calcul des tranches sociales</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            id="days-input"
            min="1"
            max="365"
            value={billingDays}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setBillingDays(isNaN(val) ? 30 : Math.max(1, Math.min(365, val)));
            }}
            className="w-16 text-center border border-slate-200 rounded-xl py-2 px-2 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 bg-slate-50/50"
          />
          <span className="text-xs font-semibold text-slate-500">jours</span>

          {/* Quick preset 30 days */}
          <div className="flex gap-1 ml-2">
            <button
              type="button"
              id="set-30-days-btn"
              onClick={() => setBillingDays(30)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                billingDays === 30
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              30j
            </button>
            <button
              type="button"
              id="set-15-days-btn"
              onClick={() => setBillingDays(15)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                billingDays === 15
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              15j
            </button>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Modèles de consommation rapides :</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              id={`preset-btn-${idx}`}
              onClick={() => {
                setUnit(p.unit);
                setConsumption(p.val);
              }}
              className="flex flex-col items-start p-4 rounded-2xl border border-slate-200 bg-slate-50/30 hover:bg-white hover:border-indigo-500 hover:shadow-xs text-left transition-all cursor-pointer group"
            >
              <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {p.val} {p.unit}
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1">{p.label}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{p.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
