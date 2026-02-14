# RetireRight NL 🇳🇱

A personalized FIRE (Financial Independence, Retire Early) calculator tailored for Dutch users, optimized for Dutch tax regulations, pension systems, and wealth-building strategies.

## 🎯 Overview

RetireRight NL helps you plan your path to early retirement by calculating:
- **Inflation-adjusted retirement needs** (2% annual inflation)
- **Target nest egg** accounting for Dutch Box 3 wealth tax
- **Monthly savings required** to reach your retirement goal
- **Tax-optimized strategies** leveraging Dutch tax deductions
- **Personalized investment recommendations** for Dutch investors

The calculator is unique because it accounts for **Dutch-specific financial rules** that standard FIRE calculators miss, including:
- Box 3 wealth tax (€59,357 exemption)
- Jaarruimte (annual pension contribution room)
- Lijfrente (private pension) benefits
- Fictitious income tax model for investments

## ✨ Features

### Core Calculations
- **Inflation Adjustment**: Compounds monthly expenses by 2% annual inflation
- **Box 3 Tax Optimization**: Estimates annual tax based on wealth above €59,357
- **Conservative Withdrawal Rate**: Uses 3.5% (vs. 4% rule) due to Dutch wealth tax drag
- **Monthly Savings Goal**: Calculates required monthly savings using compound interest
- **Target Nest Egg**: Determines the portfolio size needed for sustainable retirement

### User Interface
- **Interactive Form**: Real-time preview as you adjust parameters
- **Live Calculations**: Right-side panel updates instantly
- **Wealth Projection Chart**: Visual graph of wealth growth over time
- **Strategy Results**: Comprehensive recommendations with actionable steps
- **Product Recommendations**: Curated list of Dutch investment products
- **Wealth Journey Timeline**: 5-year milestone checkpoints to retirement

### Tax & Investment Insights
- **Dutch Tax Optimization**: Box 3 strategy and pension recommendations
- **Recommended Products**: 
  - iShares AEX ETF
  - ABN AMRO Lijfrente
  - Triodos Sustainable Funds
  - DeGiro Investment Broker
- **Annual Tax Savings Estimate**: Shows potential tax benefits
- **Asset Allocation**: Default 70% stocks, 20% bonds, 5% real estate, 5% cash

## 🛠 Tech Stack

- **Frontend**: Next.js 14.1.0 (App Router) with React 18
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.3.0
- **UI Components**: Heroicons React (24px outline)
- **Icons**: Heroicons for consistent design
- **Build**: Next.js with standalone output for Docker
- **Runtime**: Node.js 18 Alpine

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Setup

```bash
# Clone the repository
git clone <repo-url>
cd finance-nl-app/retire-right-nl

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Docker Setup

```bash
# Build the Docker image
docker build -t retire-right-nl:latest .

# Run the container
docker run -p 3000:3000 retire-right-nl:latest

# Access at http://localhost:3000
```

## 🚀 Usage

### Default Scenario
The app comes with default values:
- **Current Age**: 30 years
- **Retirement Age**: 50 years
- **Monthly Expenses**: €3,000
- **Current Wealth**: €50,000

### To Calculate Your Strategy:

1. **Adjust Your Financial Profile**:
   - Monthly Expenditure (€500 - €15,000)
   - Current Savings & Investments (€0 - €1,000,000)
   - Current Age
   - Desired Retirement Age

2. **Click "Generate My Strategy"**:
   - Watch the loading spinner as we analyze your scenario
   - System calculates optimal retirement plan

3. **Review Your Results**:
   - See key metrics (monthly needs, target nest egg, savings gap)
   - View wealth projection chart
   - Read personalized strategy recommendations
   - Explore Dutch tax optimization tips
   - Check the 5-year milestone timeline

4. **Adjust & Recalculate**:
   - Click "Adjust Parameters" to refine your inputs
   - See how different scenarios affect your retirement date

## 📁 Project Structure

```
retire-right-nl/
├── app/
│   ├── api/
│   │   └── calculate/
│   │       └── route.ts           # Core calculation engine (POST endpoint)
│   ├── components/
│   │   └── Dashboard.tsx          # Main UI component (client-side)
│   ├── page.tsx                   # Home page (mounts Dashboard)
│   ├── layout.tsx                 # Root layout with metadata
│   └── globals.css                # Global Tailwind styles
├── public/                         # Static assets
├── next.config.js                 # Next.js configuration (standalone output)
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies
├── Dockerfile                     # Docker configuration
└── postcss.config.js              # PostCSS configuration
```

## 🧮 Core Calculation Logic

### 1. Inflation Adjustment
```
futureMonthlyNeed = monthlyExpenses × (1 + inflationRate)^yearsToRetirement
```

### 2. Target Nest Egg (Box 3 Adjusted)
```
targetNestEgg = (futureMonthlyNeed × 12) / 0.035
```
Uses 3.5% withdrawal rate instead of standard 4% due to Dutch wealth tax.

### 3. Monthly Savings Required
```
monthlySavings = gapToFill × (monthlyRate / ((1 + monthlyRate)^months - 1))
```
Based on future value of annuity formula with 6.5% annual growth (8% gross - 1.5% tax drag).

### 4. Box 3 Tax Estimation
```
estimatedBox3Tax = (wealth - €59,357) × 0.06 × 0.36
```
- Fictitious gain: 6% annual return
- Tax rate: 36% on fictional income above threshold

## 2026 Tax Constants

- **Box 3 Tax Rate**: 36%
- **Tax-Free Allowance**: €59,357
- **Assumed Investment Return**: 6% (fictitious)
- **Withdrawal Rate**: 3.5% (conservative for Dutch context)
- **Growth Rate**: 6.5% annual (8% gross minus 1.5% tax drag)
- **Inflation Rate**: 2% default

## 📊 API Endpoints

### POST `/api/calculate`

**Request Body**:
```json
{
  "currentAge": 30,
  "retirementAge": 50,
  "currentWealth": 50000,
  "monthlyExpenses": 3000,
  "inflationRate": 0.02
}
```

**Response**:
```json
{
  "monthlyNeed": 4458,
  "targetNestEgg": 1529357,
  "gapToFill": 1479357,
  "monthlySavings": 3500,
  "estimatedBox3Tax": 1094,
  "allocation": {
    "stocks": 70,
    "bonds": 20,
    "realEstate": 5,
    "cash": 5
  }
}
```

All monetary values are returned as rounded integers (EUR).

## 🎨 Design System

### Colors
- **Primary**: Slate (UI backgrounds)
- **Accent**: Blue (primary actions, wealth metric)
- **Success**: Emerald (bonds, target goals)
- **Warning**: Amber (gap to fill metric)
- **Highlight**: Purple (savings target)

### Typography
- **Headings**: Slate-900, bold
- **Body**: Slate-500/600, regular
- **Emphasis**: Strong/bold for key numbers

### Components
- Metric cards with colored icons
- Interactive sliders and inputs
- Allocation bars with gradients
- Timeline with milestone markers
- Product recommendation cards
- Strategy boxes with dark backgrounds

## 🚢 Deployment

### Docker
The project is configured for Docker containerization:

```dockerfile
# Multi-stage build:
# 1. deps: Install dependencies
# 2. builder: Build Next.js application
# 3. runner: Lightweight production image
```

Configuration:
- **Output**: `standalone` (optimized for Docker)
- **Base Image**: node:18-alpine
- **Port**: 3000
- **Non-root user**: nextjs (security best practice)

### Environment Variables
Currently no environment variables required. Tax constants are hardcoded for 2026 rules.

To update for different years:
- Edit `BOX_3_TAX_RATE`, `TAX_FREE_ALLOWANCE`, etc. in `app/api/calculate/route.ts`

## 📝 Development

### Build & Run
```bash
npm run dev       # Development server (hot reload)
npm run build     # Production build
npm start         # Start production server
npm run lint      # Lint with Next.js linter
```

### TypeScript
- Strict mode enabled
- Path alias: `@/*` maps to project root
- All components are typed

### Code Patterns
- **Client Components**: Use `'use client'` directive
- **Hooks**: `useState`, `useEffect` for state management
- **Styling**: Tailwind utility classes
- **Icons**: Heroicons from `@heroicons/react/24/outline`

### Adding New Features

1. **New Calculation Field**:
   - Update logic in `app/api/calculate/route.ts`
   - Return new field in response
   - Display in `app/components/Dashboard.tsx`

2. **New UI Component**:
   - Create in `app/components/`
   - Use `'use client'` if interactive
   - Follow Tailwind/Heroicons patterns

3. **Updating Tax Rules**:
   - Modify constants at top of `route.ts`
   - Update comments with source documentation
   - Test edge cases (wealth near €59,357)

## 🧪 Testing Notes

### Manual Test Scenario
- **Age 30 → 50** (20 years)
- **€50,000** current wealth
- **€3,000/month** expenses
- **Expected Results**:
  - Monthly need at retirement: €4,458
  - Target nest egg: ~€1.5M
  - Monthly savings: ~€3,500
  - Box 3 tax: Minimal (under threshold)

### Edge Cases to Verify
- Wealth exactly at €59,357 (tax threshold)
- Negative savings gap (already have enough)
- Very short timeframe (1-2 years)
- High current wealth vs. expenses

## 📚 Resources

### Dutch Financial Concepts
- **Box 3 Tax**: Wealth tax on savings & investments
- **Jaarruimte**: Annual room for tax-deductible pension contributions
- **Lijfrente**: Private pension (deferred income insurance)
- **AEX**: Amsterdam stock exchange index

### References
- GlobalFIRE Retirement Engine Strategy v1.0 (internal documentation)
- Dutch Tax Authority (Belastingdienst) guidelines
- FIRE (Financial Independence, Retire Early) principles

## 🤝 Contributing

When working on this codebase:

1. **Preserve Dutch Tax Logic** - Don't simplify calculations without understanding the impact
2. **Test Numerical Outputs** - Verify against manual calculations for edge cases
3. **Maintain Separation** - API handles math, components handle rendering
4. **Follow Patterns** - Use existing conventions for new code
5. **Document Tax Changes** - Reference source when updating rules

## 📄 License

[Add appropriate license here]

## 👨‍💻 Authors

RetireRight NL - Designed for Dutch financial independence seekers

---

**Status**: Active Development  
**Last Updated**: February 2026  
**Deployed**: Docker container running on Node.js 18 Alpine
