import { TariffType, CalculationResult, TariffParams, TrancheDetail } from './types';

export const DEFAULT_PARAMS: TariffParams = {
  primeFixe: 500, // D (FCFA) - initialisé à 500 FCFA
  taxeElectricite: 2, // E (FCFA/kWh) - initialisé à 2 FCFA par kWh
  fondsRural: 3, // F (FCFA/kWh) - initialisé à 3 FCFA par kWh
  tvaRate: 18, // 18%
  rateSocial: 86, // BT 1 Tranche sociale: 86 FCFA
  rateTranche1: 125, // BT 1 Tranche 1: 125 FCFA
  rateTranche2: 148, // BT 1 Tranche 2: 148 FCFA
  rateBT2: 125, // BT 2: 125 FCFA
  rateBT3: 133, // BT 3: 133 FCFA
};

/**
 * Calculates the complete electricity bill breakdown.
 */
export function calculateBill(
  tariffType: TariffType,
  consumptionVal: number,
  unit: 'kWh' | 'Wh',
  billingDays: number,
  params: TariffParams
): CalculationResult {
  // Convert consumption to kWh
  const consumptionKwh = unit === 'Wh' ? consumptionVal / 1000 : consumptionVal;

  let baseCost = 0;
  let tranchesBreakdown: TrancheDetail[] = [];
  let isSocialTier = false;

  const {
    primeFixe,
    taxeElectricite,
    fondsRural,
    tvaRate,
    rateSocial,
    rateTranche1,
    rateTranche2,
    rateBT2,
    rateBT3,
  } = params;

  const actualTvaRate = tvaRate / 100;

  if (tariffType === 'BT1') {
    // Domestic Client
    if (consumptionKwh <= 20 && billingDays >= 30) {
      // Social Tier: Q <= 20 kWh and duration is at least 30 days
      isSocialTier = true;
      baseCost = rateSocial * consumptionKwh;
      tranchesBreakdown = [
        {
          name: 'Tranche Sociale (≤ 20 kWh)',
          quantity: consumptionKwh,
          rate: rateSocial,
          cost: baseCost,
          isTaxable: false,
        },
      ];
    } else if (consumptionKwh <= 20 && billingDays < 30) {
      // Less than 30 days and <= 20 kWh -> billed like Tranche 1
      baseCost = rateTranche1 * consumptionKwh;
      tranchesBreakdown = [
        {
          name: 'Tranche 1 (Consommation < 30j)',
          quantity: consumptionKwh,
          rate: rateTranche1,
          cost: baseCost,
          isTaxable: true,
        },
      ];
    } else if (consumptionKwh > 20 && consumptionKwh <= 250) {
      // Tranche 1: 20 < Q <= 250
      baseCost = rateTranche1 * consumptionKwh;
      tranchesBreakdown = [
        {
          name: 'Tranche 1 (21 - 250 kWh)',
          quantity: consumptionKwh,
          rate: rateTranche1,
          cost: baseCost,
          isTaxable: true,
        },
      ];
    } else {
      // Tranche 2: Q > 250
      const c1 = rateTranche1 * 250;
      const c2 = rateTranche2 * (consumptionKwh - 250);
      baseCost = c1 + c2;
      tranchesBreakdown = [
        {
          name: 'Tranche 1 (Premier 250 kWh)',
          quantity: 250,
          rate: rateTranche1,
          cost: c1,
          isTaxable: true,
        },
        {
          name: 'Tranche 2 (Reste > 250 kWh)',
          quantity: consumptionKwh - 250,
          rate: rateTranche2,
          cost: c2,
          isTaxable: true,
        },
      ];
    }
  } else if (tariffType === 'BT2') {
    // Professional client
    baseCost = rateBT2 * consumptionKwh;
    tranchesBreakdown = [
      {
        name: 'Tarif Unique Professionnel',
        quantity: consumptionKwh,
        rate: rateBT2,
        cost: baseCost,
        isTaxable: true,
      },
    ];
  } else {
    // Public lighting (BT3)
    baseCost = rateBT3 * consumptionKwh;
    tranchesBreakdown = [
      {
        name: 'Tarif Unique Éclairage Public',
        quantity: consumptionKwh,
        rate: rateBT3,
        cost: baseCost,
        isTaxable: true,
      },
    ];
  }

  const calculatedTaxeElectricite = taxeElectricite * consumptionKwh;
  const calculatedFondsRural = fondsRural * consumptionKwh;

  // Calculate TVA and Totals
  // In social tier, the transaction is exempt from TVA.
  const tvaBase = isSocialTier ? 0 : baseCost + primeFixe;
  const tvaAmount = isSocialTier ? 0 : tvaBase * actualTvaRate;

  // Total HT
  const totalHT = baseCost + primeFixe + calculatedTaxeElectricite + calculatedFondsRural;
  // Net to pay
  const netToPay = totalHT + tvaAmount;

  return {
    tariffType,
    inputConsumption: consumptionVal,
    inputUnit: unit,
    consumptionKwh,
    billingDays,
    baseCost,
    tranchesBreakdown,
    primeFixe,
    taxeElectricite: calculatedTaxeElectricite,
    fondsRural: calculatedFondsRural,
    isSocialTier,
    tvaBase,
    tvaRate: actualTvaRate,
    tvaAmount,
    netToPay,
  };
}

/**
 * Formats a number in FCFA style
 */
export function formatFCFA(value: number): string {
  // Round to nearest integer for currency display
  const rounded = Math.round(value);
  return new Intl.NumberFormat('fr-FR').format(rounded) + ' FCFA';
}

/**
 * Formats energy quantity for readable display
 */
export function formatEnergy(value: number, unit: 'kWh' | 'Wh'): string {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 3,
  }).format(value) + ' ' + unit;
}
