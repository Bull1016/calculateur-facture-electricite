import React, { useState } from 'react';
import { Settings, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { TariffParams } from '../types';
import { DEFAULT_PARAMS } from '../utils';

interface ParameterEditorProps {
  params: TariffParams;
  setParams: (p: TariffParams) => void;
}

export default function ParameterEditor({ params, setParams }: ParameterEditorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateParam = (key: keyof TariffParams, value: number) => {
    setParams({
      ...params,
      [key]: isNaN(value) ? 0 : Math.max(0, value),
    });
  };

  const handleReset = () => {
    setParams({ ...DEFAULT_PARAMS });
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200" id="parameter-panel">
      {/* Header with accordion toggle */}
      <button
        type="button"
        id="toggle-params-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Paramètres des Taxes & Tarifs
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Ajustez la prime fixe (D), taxes (E, F), taux de TVA et grilles tarifaires
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-6 animate-fadeIn">
          {/* Section: Fixed Fees and Taxes */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Frais fixes & Taxes Générales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="param-prime" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Prime fixe (D)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="param-prime"
                    value={params.primeFixe}
                    onChange={(e) => updateParam('primeFixe', parseFloat(e.target.value))}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2 pl-3 pr-16 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 uppercase">FCFA</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">Assujettie à la TVA</span>
              </div>

              <div>
                <label htmlFor="param-taxe" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Taxe Élec. (E) / kWh
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="param-taxe"
                    value={params.taxeElectricite}
                    onChange={(e) => updateParam('taxeElectricite', parseFloat(e.target.value))}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2 pl-3 pr-16 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 uppercase">F/kWh</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">Exonérée de TVA</span>
              </div>

              <div>
                <label htmlFor="param-fonds" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Fonds Rural (F) / kWh
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="param-fonds"
                    value={params.fondsRural}
                    onChange={(e) => updateParam('fondsRural', parseFloat(e.target.value))}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2 pl-3 pr-16 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 uppercase">F/kWh</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">Exonérée de TVA</span>
              </div>

              <div>
                <label htmlFor="param-tva" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Taux de TVA
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="param-tva"
                    value={params.tvaRate}
                    onChange={(e) => updateParam('tvaRate', parseFloat(e.target.value))}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2 pl-3 pr-8 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                  />
                  <span className="absolute right-3 top-2 text-sm font-bold text-slate-400">%</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">Taux standard : 18%</span>
              </div>
            </div>
          </div>

          {/* Section: Unit Rates */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Tarifs par kWh (FCFA)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label htmlFor="param-social" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  BT1 Tranche Sociale
                </label>
                <input
                  type="number"
                  id="param-social"
                  value={params.rateSocial}
                  onChange={(e) => updateParam('rateSocial', parseFloat(e.target.value))}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2 px-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">Défaut : 86 FCFA</span>
              </div>

              <div>
                <label htmlFor="param-tr1" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  BT1 Tranche 1
                </label>
                <input
                  type="number"
                  id="param-tr1"
                  value={params.rateTranche1}
                  onChange={(e) => updateParam('rateTranche1', parseFloat(e.target.value))}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2 px-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">Défaut : 125 FCFA</span>
              </div>

              <div>
                <label htmlFor="param-tr2" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  BT1 Tranche 2
                </label>
                <input
                  type="number"
                  id="param-tr2"
                  value={params.rateTranche2}
                  onChange={(e) => updateParam('rateTranche2', parseFloat(e.target.value))}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2 px-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">Défaut : 148 FCFA</span>
              </div>

              <div>
                <label htmlFor="param-bt2" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  BT2 (Pro)
                </label>
                <input
                  type="number"
                  id="param-bt2"
                  value={params.rateBT2}
                  onChange={(e) => updateParam('rateBT2', parseFloat(e.target.value))}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2 px-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">Défaut : 125 FCFA</span>
              </div>

              <div>
                <label htmlFor="param-bt3" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  BT3 (Public)
                </label>
                <input
                  type="number"
                  id="param-bt3"
                  value={params.rateBT3}
                  onChange={(e) => updateParam('rateBT3', parseFloat(e.target.value))}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2 px-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:bg-white transition-all"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">Défaut : 133 FCFA</span>
              </div>
            </div>
          </div>

          {/* Reset button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              id="reset-params-btn"
              onClick={handleReset}
              className="flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-600 font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Réinitialiser les paramètres d'origine
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
