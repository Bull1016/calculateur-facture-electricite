import React from 'react';
import { Printer, ShieldAlert, BadgeCheck, Info } from 'lucide-react';
import { CalculationResult } from '../types';
import { formatFCFA, formatEnergy } from '../utils';

interface ReceiptBreakdownProps {
  result: CalculationResult;
}

export default function ReceiptBreakdown({ result }: ReceiptBreakdownProps) {
  const {
    tariffType,
    inputConsumption,
    inputUnit,
    consumptionKwh,
    billingDays,
    baseCost,
    tranchesBreakdown,
    primeFixe,
    taxeElectricite,
    fondsRural,
    isSocialTier,
    tvaBase,
    tvaRate,
    tvaAmount,
    netToPay,
  } = result;

  // Generate a mock invoice ID for aesthetic purposes
  const mockInvoiceNumber = React.useMemo(() => {
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `FAC-${billingDays}J-${rand}`;
  }, [billingDays]);

  const mockDate = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Visual Badge/Alert based on Tranche */}
      {isSocialTier ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-start gap-4">
          <BadgeCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-emerald-300">Éligible à la Tranche Sociale</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Félicitations ! Votre consommation est inférieure ou égale à 20 kWh pour une période d'au moins 30 jours. 
              Vous bénéficiez du tarif réduit de <strong>86 FCFA/kWh</strong> et êtes <strong>exonéré de TVA</strong>.
            </p>
          </div>
        </div>
      ) : tariffType === 'BT1' && consumptionKwh <= 20 && billingDays < 30 ? (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-300">Tranche Sociale non applicable</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Votre période de facturation est inférieure à 30 jours ({billingDays} jours). 
              Conformément au barème SBEE, vous êtes facturé au tarif de la <strong>Tranche 1 (125 FCFA/kWh)</strong> avec application de la TVA.
            </p>
          </div>
        </div>
      ) : null}

      {/* Main Clean Minimalism slate-900 paper bill */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden" id="receipt-container">
        {/* Subtle decorative border accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-700"></div>

        {/* Invoice Header */}
        <div>
          <div className="flex justify-between items-start pb-6 border-b border-slate-800">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                SÉCURISÉ • SBEE BÉNIN
              </p>
              <h3 className="text-base font-bold text-slate-200 mt-1">
                Facture Basse Tension (BT)
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">N° RÉFÉRENCE</span>
              <p className="font-mono text-xs font-bold text-indigo-400 mt-0.5">{mockInvoiceNumber}</p>
              <p className="text-[9px] text-slate-500 mt-1">{mockDate}</p>
            </div>
          </div>

          {/* Large display for Cost */}
          <div className="py-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Coût Total Estimé (TTC)
            </span>
            <div className="flex items-baseline mt-1">
              <h2 className="text-5xl font-extrabold tracking-tight text-white font-sans">
                {Math.round(netToPay).toLocaleString('fr-FR')}
              </h2>
              <span className="text-xl font-light text-slate-400 ml-2">FCFA</span>
            </div>
            {isSocialTier && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 mt-3 border border-emerald-500/10">
                Régime social exonéré
              </span>
            )}
          </div>

          {/* Quick summary cards */}
          <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-800 text-xs">
            <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-800/50">
              <span className="text-slate-400 font-medium block">Formule d'usage</span>
              <span className="font-bold text-white mt-1 block">
                {tariffType === 'BT1' ? 'Domestique (BT 1)' : tariffType === 'BT2' ? 'Professionnel (BT 2)' : 'Éclairage Pub. (BT 3)'}
              </span>
            </div>
            <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-800/50">
              <span className="text-slate-400 font-medium block">Quantité Active</span>
              <span className="font-mono font-bold text-indigo-300 mt-1 block">
                {formatEnergy(consumptionKwh, 'kWh')}
              </span>
            </div>
          </div>

          {/* Breakdown table list */}
          <div className="py-6 flex flex-col gap-4">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Éléments facturés
            </span>

            <div className="flex flex-col gap-4">
              {/* Active Energy consumption */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Consommation Énergie (HT)
                </span>

                {tranchesBreakdown.map((tranche, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs pl-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-400">{tranche.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                        {formatEnergy(tranche.quantity, 'kWh')} × {tranche.rate} FCFA
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-slate-200">
                      {formatFCFA(tranche.cost)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Prime fixe (D) */}
              <div className="flex justify-between items-start text-xs border-t border-slate-800/60 pt-3.5">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                    Abonnement fixe (Prime D)
                  </span>
                  <span className="text-[10px] text-slate-500 pl-4 mt-0.5">Redevance de puissance</span>
                </div>
                <span className="font-mono font-semibold text-slate-200">{formatFCFA(primeFixe)}</span>
              </div>

              {/* Taxes (E, F) */}
              <div className="flex flex-col gap-2 border-t border-slate-800/60 pt-3.5">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                  Taxes réglementaires (E, F)
                </span>

                <div className="flex justify-between items-center text-xs pl-4">
                  <span className="font-medium text-slate-400">Taxe Électricité (E)</span>
                  <span className="font-mono font-semibold text-slate-200">{formatFCFA(taxeElectricite)}</span>
                </div>

                <div className="flex justify-between items-center text-xs pl-4">
                  <span className="font-medium text-slate-400">Fonds Électrification (F)</span>
                  <span className="font-mono font-semibold text-slate-200">{formatFCFA(fondsRural)}</span>
                </div>
              </div>

              {/* TVA (H) */}
              <div className="flex justify-between items-start text-xs border-t border-slate-800/60 pt-3.5">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Taxe d'État (TVA)
                  </span>
                  <span className="text-[10px] text-slate-500 pl-4 mt-0.5">
                    {isSocialTier
                      ? 'Exonérée en tranche sociale'
                      : `Taux standard de ${Math.round(tvaRate * 100)}% sur base HT`}
                  </span>
                </div>
                <span className="font-mono font-semibold text-slate-200">
                  {isSocialTier ? '0 FCFA' : formatFCFA(tvaAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Paper teardrop design */}
        <div className="py-2 flex items-center justify-between gap-1 select-none opacity-20">
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} className="text-slate-400 text-xs shrink-0">•</span>
          ))}
        </div>

        {/* Formule explanatory details */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-500 leading-relaxed flex flex-col gap-1">
          <div className="flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-400">Formule réglementaire appliquée :</p>
              <p className="mt-1">
                Hors TVA (M) = Coût Énergie + D ({primeFixe} F) + E ({taxeElectricite} F) + F ({fondsRural} F) ={' '}
                <span className="font-mono text-slate-400">
                  {formatFCFA(baseCost + primeFixe + taxeElectricite + fondsRural)}
                </span>
              </p>
              <p className="mt-0.5">
                TVA (H) = {isSocialTier ? '0 FCFA (Exonéré)' : `(Énergie + Prime D) × ${Math.round(tvaRate * 100)}% = ${formatFCFA(tvaAmount)}`}
              </p>
              <p className="mt-0.5">
                Total TTC à payer = M + H = <span className="font-mono text-indigo-400 font-semibold">{formatFCFA(netToPay)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Printer/Action controls */}
      <div className="flex justify-center sm:justify-end gap-3 print:hidden">
        <button
          type="button"
          id="print-receipt-btn"
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-2xl shadow-xs transition-colors cursor-pointer"
        >
          <Printer className="h-4 w-4 text-slate-600" />
          Télécharger la facture (PDF / Impression)
        </button>
      </div>
    </div>
  );
}
