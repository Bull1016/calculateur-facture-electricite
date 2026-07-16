import React from 'react';
import { Home, Briefcase, Landmark, Check } from 'lucide-react';
import { TariffType } from '../types';

interface TariffSelectorProps {
  selectedTariff: TariffType;
  setSelectedTariff: (tariff: TariffType) => void;
}

export default function TariffSelector({ selectedTariff, setSelectedTariff }: TariffSelectorProps) {
  const options = [
    {
      id: 'BT1' as TariffType,
      title: 'Usage Domestique (BT 1)',
      subtitle: 'Ménages & Habitations',
      description: 'Idéal pour l\'éclairage, l\'électroménager et la climatisation des particuliers. Intègre une tranche sociale avantageuse pour les faibles consommations.',
      rates: 'Barème progressif',
      icon: Home,
      color: 'border-indigo-600 bg-indigo-50/20 text-indigo-600',
      badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    },
    {
      id: 'BT2' as TariffType,
      title: 'Usage Professionnel (BT 2)',
      subtitle: 'Commerces & Bureaux',
      description: 'Conçu pour les activités professionnelles : boutiques, salons, bureaux, cafés, restaurants, ateliers artisanaux ou prestataires de services.',
      rates: 'Tarif unique : 125 FCFA',
      icon: Briefcase,
      color: 'border-indigo-600 bg-indigo-50/20 text-indigo-600',
      badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
    },
    {
      id: 'BT3' as TariffType,
      title: 'Éclairage Public (BT 3)',
      subtitle: 'Installations Collectives',
      description: 'Réservé aux collectivités, municipalités, et réseaux de distribution d\'éclairage des voiries publiques et parcs.',
      rates: 'Tarif unique : 133 FCFA',
      icon: Landmark,
      color: 'border-indigo-600 bg-indigo-50/20 text-indigo-600',
      badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Catégorie d'abonnement</h2>
        <p className="text-xs text-slate-500 mt-1">Sélectionnez le type d'usage pour appliquer la réglementation SBEE</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt) => {
          const IconComponent = opt.icon;
          const isSelected = selectedTariff === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              id={`tariff-card-${opt.id}`}
              onClick={() => setSelectedTariff(opt.id)}
              className={`relative flex flex-col p-6 rounded-3xl border text-left transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 bg-white shadow-sm ring-1 ring-indigo-600/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Selected badge */}
              {isSelected && (
                <div className="absolute top-6 right-6 p-1 rounded-full bg-indigo-600 text-white shadow-xs">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                </div>
              )}

              {/* Icon Container */}
              <div className={`p-3 rounded-2xl inline-flex self-start ${
                isSelected
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'bg-slate-50 text-slate-400'
              }`}>
                <IconComponent className="h-5 w-5" />
              </div>

              {/* Titles */}
              <div className="mt-5 flex flex-col gap-0.5">
                <span className="text-base font-bold text-slate-800">{opt.title}</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{opt.subtitle}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 mt-3 leading-relaxed flex-grow">
                {opt.description}
              </p>

              {/* Rates badge */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${opt.badgeColor}`}>
                  {opt.rates}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
