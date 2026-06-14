/**
 * Financial formula engine — pure functions.
 * Source of truth: /docs/04_FINANCIAL_FORMULAS.md
 *
 * Rules:
 * - Missing numeric values are treated as 0 inside formulas (safe math).
 * - Missing critical fields are flagged in missingFields[].
 * - Every calculation returns null if foundational data is missing.
 * - No React / UI logic here.
 */

import type { Unit, MoneyField, CalculatedCost, AppSettings } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeNum(
  field: MoneyField | number | null | undefined
): number {
  if (field === null || field === undefined) return 0;
  if (typeof field === "number") return isNaN(field) ? 0 : field;
  if (field.treatment === "Not Applicable") return 0;
  if (field.treatment === "Included" || field.treatment === "Bundled") return 0;
  return isNaN(field.amount) ? 0 : field.amount;
}

// ─── Layer 1: Basic Flat Cost ─────────────────────────────────────────────────

export function calculateBasicFlatCost(unit: Unit): number | null {
  if (unit.basicFlatCost && unit.basicFlatCost > 0) return unit.basicFlatCost;

  const sba = unit.superBuiltUpAreaSqft;
  const rate =
    unit.negotiatedPricePerSqft ??
    unit.basePricePerSqft;

  if (!sba || !rate) return null;
  return sba * rate;
}

// ─── Layer 2: Agreement Value ─────────────────────────────────────────────────

export function calculateAgreementValue(unit: Unit): number | null {
  const basic = calculateBasicFlatCost(unit);
  if (basic === null) return null;

  return (
    basic +
    safeNum(unit.carParkingCharges) +
    safeNum(unit.clubhouseCharges) +
    safeNum(unit.bwssbCharges) +
    safeNum(unit.bescomCharges) +
    safeNum(unit.powerBackupCharges) +
    safeNum(unit.evChargerCharges) +
    safeNum(unit.plcCharges) +
    safeNum(unit.floorRisePremium) +
    safeNum(unit.otherBuilderCharges)
  );
}

// ─── Layer 3: GST ─────────────────────────────────────────────────────────────

export function calculateGST(
  agreementValue: number | null,
  gstPct: number
): number | null {
  if (agreementValue === null) return null;
  if (gstPct <= 0) return 0;
  return (agreementValue * gstPct) / 100;
}

// ─── Layer 4: Stamp Duty ──────────────────────────────────────────────────────

export function calculateStampDuty(
  agreementValue: number | null,
  pct: number
): number | null {
  if (agreementValue === null) return null;
  return (agreementValue * pct) / 100;
}

// ─── Layer 5: Registration ────────────────────────────────────────────────────

export function calculateRegistration(
  agreementValue: number | null,
  flatAmount?: number,
  pct?: number
): number | null {
  if (flatAmount && flatAmount > 0) return flatAmount;
  if (agreementValue === null) return null;
  if (!pct) return null;
  return (agreementValue * pct) / 100;
}

// ─── Carpet Efficiency ────────────────────────────────────────────────────────

export function calculateCarpetEfficiency(
  carpetArea?: number,
  sba?: number
): number | null {
  if (!carpetArea || !sba || sba === 0) return null;
  return (carpetArea / sba) * 100;
}

// ─── EMI Calculation ─────────────────────────────────────────────────────────

export function calculateEMI(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number
): number {
  if (principal <= 0 || annualRatePercent <= 0 || tenureMonths <= 0) return 0;
  const monthlyRate = annualRatePercent / 12 / 100;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );
}

// ─── Full Cost Calculation ────────────────────────────────────────────────────

export function calculateTotalLandingCost(
  unit: Unit,
  settings: AppSettings
): CalculatedCost {
  const missingFields: string[] = [];

  const basicFlatCost = calculateBasicFlatCost(unit);
  if (basicFlatCost === null) {
    missingFields.push("Base Price or SBA");
  }

  const additionalBuilderCharges =
    safeNum(unit.carParkingCharges) +
    safeNum(unit.clubhouseCharges) +
    safeNum(unit.bwssbCharges) +
    safeNum(unit.bescomCharges) +
    safeNum(unit.powerBackupCharges) +
    safeNum(unit.evChargerCharges) +
    safeNum(unit.plcCharges) +
    safeNum(unit.floorRisePremium) +
    safeNum(unit.otherBuilderCharges);

  const agreementValue = calculateAgreementValue(unit);

  // GST
  let gstAmount: number | null = null;
  if (unit.gstAmount) {
    gstAmount = safeNum(unit.gstAmount);
  } else {
    const gstPct = unit.gstPercentage ?? settings.gstDefaultPercentage;
    gstAmount = calculateGST(agreementValue, gstPct);
  }
  if (gstAmount === null) missingFields.push("GST");

  // Stamp duty
  let stampDutyAmount: number | null = null;
  if (unit.stampDutyAmount) {
    stampDutyAmount = safeNum(unit.stampDutyAmount);
  } else {
    const sdPct = unit.stampDutyPercentage ?? settings.stampDutyDefaultPercentage;
    stampDutyAmount = calculateStampDuty(agreementValue, sdPct);
  }
  if (stampDutyAmount === null) missingFields.push("Stamp Duty");

  // Registration
  let registrationAmount: number | null = null;
  if (unit.registrationAmount) {
    registrationAmount = safeNum(unit.registrationAmount);
  } else if (settings.registrationDefaultPercentage > 0 && agreementValue) {
    registrationAmount = (agreementValue * settings.registrationDefaultPercentage) / 100;
  }
  if (registrationAmount === null) missingFields.push("Registration");

  const legalCharges = unit.legalCharges ? safeNum(unit.legalCharges) : null;
  const corpusFund = unit.corpusFund ? safeNum(unit.corpusFund) : null;
  const maintenanceAdvance = unit.maintenanceAdvance
    ? safeNum(unit.maintenanceAdvance)
    : null;
  const interiorsEstimate = unit.interiorsEstimate ?? null;
  const movingCost = unit.movingCost ?? null;

  if (!unit.carpetAreaSqft) missingFields.push("Carpet Area");

  // Total
  const totalLandingCost =
    agreementValue !== null
      ? (agreementValue ?? 0) +
        (gstAmount ?? 0) +
        (stampDutyAmount ?? 0) +
        (registrationAmount ?? 0) +
        (legalCharges ?? 0) +
        (corpusFund ?? 0) +
        (maintenanceAdvance ?? 0) +
        (interiorsEstimate ?? 0) +
        (movingCost ?? 0)
      : null;

  const sba = unit.superBuiltUpAreaSqft;
  const carpet = unit.carpetAreaSqft;

  const trueCostPerSBASqft =
    totalLandingCost !== null && sba && sba > 0
      ? totalLandingCost / sba
      : null;

  const trueCostPerCarpetSqft =
    totalLandingCost !== null && carpet && carpet > 0
      ? totalLandingCost / carpet
      : null;

  const hiddenCostPercentage =
    totalLandingCost !== null && basicFlatCost !== null && basicFlatCost > 0
      ? ((totalLandingCost - basicFlatCost) / basicFlatCost) * 100
      : null;

  const carpetEfficiencyRatio = calculateCarpetEfficiency(carpet, sba);

  return {
    basicFlatCost,
    additionalBuilderCharges,
    agreementValue,
    gstAmount,
    stampDutyAmount,
    registrationAmount,
    legalCharges,
    corpusFund,
    maintenanceAdvance,
    interiorsEstimate,
    movingCost,
    totalLandingCost,
    trueCostPerSBASqft,
    trueCostPerCarpetSqft,
    hiddenCostPercentage,
    carpetEfficiencyRatio,
    hasDataGaps: missingFields.length > 0,
    missingFields,
  };
}
