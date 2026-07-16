export type TariffType = 'BT1' | 'BT2' | 'BT3';

export interface TrancheDetail {
  name: string;
  quantity: number;
  rate: number;
  cost: number;
  isTaxable: boolean;
}

export interface CalculationResult {
  tariffType: TariffType;
  inputConsumption: number; // in current unit
  inputUnit: 'kWh' | 'Wh';
  consumptionKwh: number; // converted to kWh
  billingDays: number;
  baseCost: number; // total cost of energy consumption
  tranchesBreakdown: TrancheDetail[];
  primeFixe: number; // D
  taxeElectricite: number; // E
  fondsRural: number; // F
  isSocialTier: boolean;
  tvaBase: number; // base for TVA (energy cost + D if taxable)
  tvaRate: number; // e.g. 0.18
  tvaAmount: number; // TVA cost
  netToPay: number; // Total cost (M + H)
}

export interface TariffParams {
  primeFixe: number; // D
  taxeElectricite: number; // E
  fondsRural: number; // F
  tvaRate: number; // e.g. 18
  rateSocial: number; // 86
  rateTranche1: number; // 125
  rateTranche2: number; // 148
  rateBT2: number; // 125
  rateBT3: number; // 133
}
