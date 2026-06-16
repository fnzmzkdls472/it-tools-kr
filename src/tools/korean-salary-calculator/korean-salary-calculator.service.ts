// =========================================================================
// 2025년 기준 연봉 실수령액 계산 (연말정산 기준 추정)
// - 4대보험 요율: 2025년
// - 소득세: 소득세법 누진세율 + 근로소득공제 + 근로소득세액공제 (연말정산 기준)
// - 실제 매월 명세서의 원천징수(간이세액표)와는 차이가 있으며 연말정산으로 정산됨
// 요율 변경 시 아래 상수만 수정하면 됨.
// =========================================================================

// --- 4대보험 본인부담 (2025) ---
const NP_RATE = 0.045; // 국민연금 4.5%
const NP_BASE_MAX = 6_170_000; // 기준소득월액 상한 (2024.7~2025.6)
const NP_BASE_MIN = 390_000; // 기준소득월액 하한
const HEALTH_RATE = 0.03545; // 건강보험 3.545%
const LTC_RATE = 0.1295; // 장기요양 = 건강보험료 × 12.95%
const EI_RATE = 0.009; // 고용보험(실업급여) 0.9%

// --- 근로소득공제 (한도 2,000만원) ---
function earnedIncomeDeduction(grossForTax: number): number {
  let d: number;
  if (grossForTax <= 5_000_000) {
    d = grossForTax * 0.7;
  }
  else if (grossForTax <= 15_000_000) {
    d = 3_500_000 + (grossForTax - 5_000_000) * 0.4;
  }
  else if (grossForTax <= 45_000_000) {
    d = 7_500_000 + (grossForTax - 15_000_000) * 0.15;
  }
  else if (grossForTax <= 100_000_000) {
    d = 12_000_000 + (grossForTax - 45_000_000) * 0.05;
  }
  else {
    d = 14_750_000 + (grossForTax - 100_000_000) * 0.02;
  }
  return Math.min(d, 20_000_000);
}

// --- 종합소득세 누진세율 (2025) ---
const TAX_BRACKETS = [
  { limit: 14_000_000, rate: 0.06, deduct: 0 },
  { limit: 50_000_000, rate: 0.15, deduct: 1_260_000 },
  { limit: 88_000_000, rate: 0.24, deduct: 5_760_000 },
  { limit: 150_000_000, rate: 0.35, deduct: 15_440_000 },
  { limit: 300_000_000, rate: 0.38, deduct: 19_940_000 },
  { limit: 500_000_000, rate: 0.40, deduct: 25_940_000 },
  { limit: 1_000_000_000, rate: 0.42, deduct: 35_940_000 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.45, deduct: 65_940_000 },
];

function calculatedTax(base: number): number {
  if (base <= 0) {
    return 0;
  }
  const bracket = TAX_BRACKETS.find(b => base <= b.limit)!;
  return base * bracket.rate - bracket.deduct;
}

// --- 근로소득세액공제 (소득세법 §59) ---
function earnedIncomeTaxCredit(calcTax: number, grossForTax: number): number {
  const credit = calcTax <= 1_300_000
    ? calcTax * 0.55
    : 715_000 + (calcTax - 1_300_000) * 0.3;

  let cap: number;
  if (grossForTax <= 33_000_000) {
    cap = 740_000;
  }
  else if (grossForTax <= 70_000_000) {
    cap = Math.max(660_000, 740_000 - (grossForTax - 33_000_000) * 0.008);
  }
  else if (grossForTax <= 120_000_000) {
    cap = Math.max(500_000, 660_000 - (grossForTax - 70_000_000) * 0.5);
  }
  else {
    cap = Math.max(200_000, 500_000 - (grossForTax - 120_000_000) * 0.5);
  }
  return Math.min(credit, cap);
}

export interface SalaryResult {
  // 월 기준
  monthlyGross: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  incomeTax: number;
  localTax: number;
  totalDeduction: number;
  netMonthly: number;
  // 연 기준
  netAnnual: number;
}

export interface SalaryInput {
  annualSalary: number; // 연봉 (원)
  monthlyNonTax: number; // 월 비과세액 (원, 식대 등)
  dependents: number; // 공제대상 가족 수 (본인 포함)
}

export function calculateSalary({ annualSalary, monthlyNonTax, dependents }: SalaryInput): SalaryResult | null {
  if (!(annualSalary > 0)) {
    return null;
  }
  const deps = Math.max(1, Math.floor(dependents) || 1);
  const annualNonTax = Math.max(0, monthlyNonTax) * 12;
  const monthlyTaxable = Math.max(0, (annualSalary - annualNonTax) / 12);

  // 4대보험 (월)
  const npBase = Math.min(Math.max(monthlyTaxable, NP_BASE_MIN), NP_BASE_MAX);
  const nationalPension = Math.round(npBase * NP_RATE);
  const healthInsurance = Math.round(monthlyTaxable * HEALTH_RATE);
  const longTermCare = Math.round(healthInsurance * LTC_RATE);
  const employmentInsurance = Math.round(monthlyTaxable * EI_RATE);
  const insuranceMonthly = nationalPension + healthInsurance + longTermCare + employmentInsurance;

  // 소득세 (연 → 월) : 연말정산 기준
  const grossForTax = Math.max(0, annualSalary - annualNonTax); // 총급여
  const earnedIncome = grossForTax - earnedIncomeDeduction(grossForTax); // 근로소득금액
  const personalDeduction = 1_500_000 * deps; // 인적공제 (본인 포함)
  const pensionDeduction = nationalPension * 12; // 연금보험료공제 (국민연금 전액)
  const insuranceDeduction = (healthInsurance + longTermCare + employmentInsurance) * 12; // 보험료 특별소득공제
  const taxBase = Math.max(0, earnedIncome - personalDeduction - pensionDeduction - insuranceDeduction);

  const calcTax = calculatedTax(taxBase);
  const credit = earnedIncomeTaxCredit(calcTax, grossForTax);
  const annualIncomeTax = Math.max(0, Math.round(calcTax - credit));
  const annualLocalTax = Math.round(annualIncomeTax * 0.1);

  const incomeTax = Math.round(annualIncomeTax / 12);
  const localTax = Math.round(annualLocalTax / 12);

  const totalDeduction = insuranceMonthly + incomeTax + localTax;
  const netMonthly = Math.round(annualSalary / 12) - totalDeduction;

  return {
    monthlyGross: Math.round(annualSalary / 12),
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTax,
    localTax,
    totalDeduction,
    netMonthly,
    netAnnual: netMonthly * 12,
  };
}

export function formatWon(value: number): string {
  return `${Math.round(value).toLocaleString('ko-KR')}원`;
}
