import { useState } from 'react';
import TariffSelector from './components/TariffSelector';
import ConsumptionInput from './components/ConsumptionInput';
import ParameterEditor from './components/ParameterEditor';
import ReceiptBreakdown from './components/ReceiptBreakdown';
import SimulationCharts from './components/SimulationCharts';
import { TariffType, TariffParams } from './types';
import { DEFAULT_PARAMS, calculateBill } from './utils';
import { Zap, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [tariffType, setTariffType] = useState<TariffType>('BT1');
  const [consumption, setConsumption] = useState<number>(150); // Default 150
  const [unit, setUnit] = useState<'kWh' | 'Wh'>('kWh');
  const [billingDays, setBillingDays] = useState<number>(30); // Default 30 days
  const [params, setParams] = useState<TariffParams>(DEFAULT_PARAMS);
  const [showDocumentation, setShowDocumentation] = useState<boolean>(false);

  // Compute the current bill breakdown
  const billResult = calculateBill(tariffType, consumption, unit, billingDays, params);

  return (
    <div className="min-h-screen bg-[#fafbfc] py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-2xl shadow-lg shadow-indigo-500/10 shrink-0">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Simulateur de Facture Électrique
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Calculateur interactif basse tension basé sur le barème SBEE Bénin
              </p>
            </div>
          </div>

          {/* Quick Action Documentation Button */}
          <button
            type="button"
            id="toggle-doc-btn"
            onClick={() => setShowDocumentation(!showDocumentation)}
            className="flex items-center gap-2 px-4.5 py-2.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/60 rounded-xl transition-all cursor-pointer border border-indigo-100/50"
          >
            <BookOpen className="h-4 w-4" />
            {showDocumentation ? 'Masquer le barème de calcul' : 'Voir le barème de calcul'}
          </button>
        </header>

        {/* Documentation / Rates card panel */}
        {showDocumentation && (
          <section className="bg-indigo-50/20 border border-indigo-100/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 animate-fadeIn" id="doc-panel">
            <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Barème de Facturation Officiel Basse Tension (SBEE Bénin)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60">
                <h4 className="font-bold text-slate-800 mb-3">Usage Domestique (BT 1)</h4>
                <p className="mb-2.5"><strong>Tranche Sociale</strong> : ≤ 20 kWh par 30 jours</p>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-500">
                  <li>Tarif réduit : <strong>86 FCFA/kWh</strong></li>
                  <li><strong>Exonéré de TVA</strong> (0% de TVA)</li>
                </ul>
                <p className="mt-4 mb-2.5"><strong>Régime Général</strong> : &gt; 20 kWh ou &lt; 30 jours</p>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-500">
                  <li><strong>Tranche 1 (≤ 250 kWh)</strong> : <strong>125 FCFA/kWh</strong> + TVA 18%</li>
                  <li><strong>Tranche 2 (&gt; 250 kWh)</strong> : <strong>148 FCFA/kWh</strong> + TVA 18%</li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60">
                <h4 className="font-bold text-slate-800 mb-3">Usage Professionnel (BT 2)</h4>
                <p className="mb-2.5">Applicable aux commerces, ateliers de service, locaux professionnels et PME.</p>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-500">
                  <li><strong>Tarif unique</strong> : Facturé à <strong>125 FCFA/kWh</strong></li>
                  <li>Toutes consommations soumises à la TVA standard (18%)</li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60">
                <h4 className="font-bold text-slate-800 mb-3">Autres composantes du tarif</h4>
                <ul className="list-disc pl-4 space-y-2 text-slate-500">
                  <li><strong>Prime Fixe (D)</strong> : Abonnement fixe par période, assujetti à la TVA (500 FCFA par défaut)</li>
                  <li><strong>Taxe Électricité (E)</strong> : 2 FCFA/kWh, non soumise à la TVA</li>
                  <li><strong>Fonds Électricité Rural (F)</strong> : 3 FCFA/kWh, non soumis à la TVA</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Dashboard Grid Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Controls (Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* 1. Tariff Selection */}
            <TariffSelector
              selectedTariff={tariffType}
              setSelectedTariff={(t) => {
                setTariffType(t);
                // Adjust consumption if needed to typical range of professional if switching
                if (t !== 'BT1' && consumption < 50) {
                  setConsumption(150);
                }
              }}
            />

            {/* 2. Consumption and period fields */}
            <ConsumptionInput
              consumption={consumption}
              setConsumption={setConsumption}
              unit={unit}
              setUnit={setUnit}
              billingDays={billingDays}
              setBillingDays={setBillingDays}
              tariffType={tariffType}
            />

            {/* 3. Parameter settings editor */}
            <ParameterEditor params={params} setParams={setParams} />
          </div>

          {/* Right Column: Receipts and Charts (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Receipt Breakdown Card */}
            <ReceiptBreakdown result={billResult} />

            {/* Interactive SVG Chart Card */}
            <SimulationCharts
              tariffType={tariffType}
              currentKwh={billResult.consumptionKwh}
              params={params}
              billingDays={billingDays}
            />
          </div>
        </main>

        {/* Footer Disclaimer */}
        <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400 leading-relaxed flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>
            Modélisation de tarification et simulateur mathématique indépendant basé sur le barème Basse Tension SBEE.
          </p>
          <p className="font-bold text-slate-500 uppercase tracking-widest">
            Devise : Franc CFA (XOF)
          </p>
        </footer>
      </div>
    </div>
  );
}
