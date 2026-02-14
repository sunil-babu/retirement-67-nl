import { NextResponse } from 'next/server';

// 2026 Tax Constants
// Source: GlobalFIRE Retirement Engine Strategy v1.0
const BOX_3_TAX_RATE = 0.36; 
const ASSUMED_INVESTMENT_RETURN = 0.06; 
const TAX_FREE_ALLOWANCE = 59357; 

export async function POST(request: Request) {
  const body = await request.json();
  const { 
    currentAge, 
    retirementAge, 
    currentWealth, 
    monthlyExpenses,
    inflationRate = 0.02 
  } = body;

  const yearsToGrow = retirementAge - currentAge;
  
  // 1. Inflation Adjustment
  const futureMonthlyNeed = monthlyExpenses * Math.pow((1 + inflationRate), yearsToGrow);

  // 2. Target Nest Egg (Adjusted for Dutch Box 3 Drag)
  // Standard 4% rule is risky in NL due to wealth tax. We use a 3.5% withdrawal rate.
  const targetNestEgg = (futureMonthlyNeed * 12) / 0.035;

  // 3. Gap Calculation
  const annualGrowthRate = 0.065; // 8% gross - ~1.5% tax drag
  const monthlyRate = annualGrowthRate / 12;
  const months = yearsToGrow * 12;

  // Calculate Future Value of current wealth
  const fvCurrent = currentWealth * Math.pow((1 + monthlyRate), months);
  
  // Calculate gap to fill
  const gapToFill = Math.max(0, targetNestEgg - fvCurrent);

  let monthlySavings = 0;
  if (gapToFill > 0) {
    monthlySavings = gapToFill * (monthlyRate / (Math.pow(1 + monthlyRate, months) - 1));
  }

  // 4. Box 3 Tax Estimate (2026 Rules)
  let estimatedBox3Tax = 0;
  if (currentWealth > TAX_FREE_ALLOWANCE) {
    const taxableBase = currentWealth - TAX_FREE_ALLOWANCE;
    const fictitiousGain = taxableBase * ASSUMED_INVESTMENT_RETURN;
    estimatedBox3Tax = fictitiousGain * BOX_3_TAX_RATE;
  }

  return NextResponse.json({
    monthlyNeed: Math.round(futureMonthlyNeed),
    targetNestEgg: Math.round(targetNestEgg),
    gapToFill: Math.round(gapToFill),
    monthlySavings: Math.round(monthlySavings),
    estimatedBox3Tax: Math.round(estimatedBox3Tax),
    allocation: {
      stocks: 70,
      bonds: 20,
      realEstate: 5,
      cash: 5
    }
  });
}