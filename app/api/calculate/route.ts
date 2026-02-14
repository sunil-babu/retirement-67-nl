import { NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';

// 2026 Tax Constants
// Source: GlobalFIRE Retirement Engine Strategy v1.0
const BOX_3_TAX_RATE = 0.36; 
const ASSUMED_INVESTMENT_RETURN = 0.06; 
const TAX_FREE_ALLOWANCE = 59357; 

// Initialize Vertex AI
const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'your-project-id';
const location = process.env.GOOGLE_CLOUD_LOCATION || 'europe-west4';

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

  // 5. Generate AI-Powered Personalized Recommendations using Vertex AI
  let aiRecommendations = null;
  try {
    const vertexAI = new VertexAI({
      project: projectId,
      location: location
    });

    const model = vertexAI.getGenerativeModel({
      model: 'gemini-2.5-flash-preview',
      systemInstruction: 'You are a Dutch FIRE (Financial Independence, Retire Early) expert who specializes in Netherlands tax law, pension systems (pillar 1, 2, 3), Box 3 wealth taxation, and investment strategies for Dutch residents.'
    });

    const prompt = `
Generate a personalized FIRE retirement strategy for a Dutch resident with the following profile:
- Current Age: ${currentAge}
- Target Retirement Age: ${retirementAge}
- Current Wealth: €${currentWealth.toLocaleString()}
- Monthly Expenses: €${monthlyExpenses.toLocaleString()}
- Years to Retirement: ${yearsToGrow}
- Target Nest Egg: €${Math.round(targetNestEgg).toLocaleString()}
- Gap to Fill: €${Math.round(gapToFill).toLocaleString()}
- Monthly Savings Needed: €${Math.round(monthlySavings).toLocaleString()}
- Estimated Box 3 Tax: €${Math.round(estimatedBox3Tax).toLocaleString()}

Please provide a JSON response with the following structure (return ONLY valid JSON, no markdown):
{
  "personalizedStrategy": "A 2-3 sentence personalized strategy summary considering their specific situation, Dutch tax rules, and Box 3 optimization",
  "allocation": {
    "stocks": <percentage 0-100>,
    "bonds": <percentage 0-100>,
    "realEstate": <percentage 0-100>,
    "cash": <percentage 0-100>
  },
  "allocationRationale": "Brief explanation of why this allocation makes sense for their age and risk profile",
  "dutchProducts": [
    {
      "title": "Product name",
      "category": "ETF|Lijfrente|Sustainable Fund|Brokerage",
      "description": "Brief description of why this product suits their needs"
    }
  ],
  "wealthJourney": [
    {
      "year": <year>,
      "projectedWealth": <amount>,
      "milestone": "Specific actionable milestone for this year"
    }
  ],
  "taxOptimization": {
    "box3Strategy": "Specific advice on Box 3 optimization",
    "pensionRecommendation": "Specific pension (lijfrente) recommendations"
  }
}

Important:
- Consider their age for risk tolerance
- Account for Dutch Box 3 taxation (€59,357 exemption in 2026, 36% tax on fictitious 6% return)
- Recommend real Dutch products (DeGiro, ABN AMRO, Rabobank, Brand New Day, VWRL ETF, etc.)
- Make allocation realistic for their age (younger = more stocks, older = more conservative)
- Provide 4-6 milestones spread across their retirement timeline
- Be specific and actionable, not generic
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse JSON from response (remove markdown if present)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      aiRecommendations = JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Error calling Vertex AI:', error);
    // Fall back to default recommendations if AI fails
    aiRecommendations = {
      personalizedStrategy: `To achieve early retirement at age ${retirementAge}, you should aim to save aggressively (€${Math.round(monthlySavings)}/mo). Utilize the 30% Jaarruimte deduction to reduce Box 1 tax, and keep taxable Box 3 wealth optimized using the €59,357 exemption.`,
      allocation: {
        stocks: currentAge < 35 ? 80 : currentAge < 45 ? 70 : 60,
        bonds: currentAge < 35 ? 15 : currentAge < 45 ? 20 : 25,
        realEstate: 5,
        cash: currentAge < 35 ? 0 : currentAge < 45 ? 5 : 10
      },
      allocationRationale: "Allocation adjusted for your age and retirement timeline.",
      dutchProducts: [
        {
          title: "VWRL (Vanguard FTSE All-World)",
          category: "ETF",
          description: "Low-cost global diversification, available on DeGiro with low fees."
        },
        {
          title: "Brand New Day Lijfrente",
          category: "Lijfrente",
          description: "Tax-efficient pension product with low fees and Box 1 deductions."
        }
      ],
      wealthJourney: [
        {
          year: new Date().getFullYear(),
          projectedWealth: Math.round(monthlySavings * 12),
          milestone: `Start saving €${Math.round(monthlySavings)}/month consistently.`
        },
        {
          year: new Date().getFullYear() + Math.floor(yearsToGrow / 3),
          projectedWealth: Math.round(monthlySavings * 12 * (yearsToGrow / 3)),
          milestone: "Review and rebalance portfolio; maximize Box 1 deductions."
        },
        {
          year: new Date().getFullYear() + Math.floor(yearsToGrow * 2 / 3),
          projectedWealth: Math.round(monthlySavings * 12 * (yearsToGrow * 2 / 3)),
          milestone: "Shift to more conservative allocation; plan withdrawal strategy."
        },
        {
          year: new Date().getFullYear() + yearsToGrow,
          projectedWealth: Math.round(targetNestEgg),
          milestone: "Execute retirement plan; set up sustainable withdrawal rate."
        }
      ],
      taxOptimization: {
        box3Strategy: "Keep investments below €59,357 exemption where possible. Consider tax-deferred vehicles like lijfrente for wealth above threshold.",
        pensionRecommendation: "Open a lijfrente account to get Box 1 tax deductions. Aim to contribute at least 10-15% of income."
      }
    };
  }

  return NextResponse.json({
    monthlyNeed: Math.round(futureMonthlyNeed),
    targetNestEgg: Math.round(targetNestEgg),
    gapToFill: Math.round(gapToFill),
    monthlySavings: Math.round(monthlySavings),
    estimatedBox3Tax: Math.round(estimatedBox3Tax),
    allocation: aiRecommendations.allocation,
    allocationRationale: aiRecommendations.allocationRationale,
    personalizedStrategy: aiRecommendations.personalizedStrategy,
    dutchProducts: aiRecommendations.dutchProducts,
    wealthJourney: aiRecommendations.wealthJourney,
    taxOptimization: aiRecommendations.taxOptimization
  });
}