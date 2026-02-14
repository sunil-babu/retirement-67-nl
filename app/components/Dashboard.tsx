'use client';
import React, { useState, useEffect } from 'react';
import { 
  CurrencyEuroIcon, 
  ChartBarIcon, 
  BanknotesIcon, 
  ArrowTrendingUpIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Form inputs
  const [monthlyExpenses, setMonthlyExpenses] = useState(3000);
  const [currentWealth, setCurrentWealth] = useState(50000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(50);

  // Calculate preview in real-time
  const inflationRate = 0.02;
  const yearsToGrow = retirementAge - currentAge;
  const futureMonthlyNeed = monthlyExpenses * Math.pow((1 + inflationRate), yearsToGrow);

  const handleGenerateStrategy = async () => {
    setLoading(true);
    setHasSubmitted(true);
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        body: JSON.stringify({
          currentAge,
          retirementAge,
          currentWealth,
          monthlyExpenses
        })
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching strategy:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasSubmitted) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="text-center space-y-4 pt-8 pb-12">
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-4 py-1.5 rounded-full border border-yellow-200">
            ✨ AI-Powered Planning
          </span>
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">Plan Your Path to FIRE</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Tailored for the Netherlands. Smart strategies considering Dutch tax rules, pension pillars, and wealth-building opportunities.
          </p>
        </div>

        {/* Info Badges */}
        <div className="flex justify-center gap-8 mb-12 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2">
            <ArrowTrendingUpIcon className="w-5 h-5 text-slate-700" />
            <div>
              <div className="font-semibold text-slate-900">Inflation Adjusted</div>
              <div className="text-sm text-slate-500">2% yearly</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2">
            <CurrencyEuroIcon className="w-5 h-5 text-slate-700" />
            <div>
              <div className="font-semibold text-slate-900">Box 3 Optimized</div>
              <div className="text-sm text-slate-500">Tax efficient</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2">
            <SparklesIcon className="w-5 h-5 text-slate-700" />
            <div>
              <div className="font-semibold text-slate-900">AI Strategy</div>
              <div className="text-sm text-slate-500">Personalized</div>
            </div>
          </div>
        </div>

        {/* Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left: Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Your Financial Profile</h2>
            <p className="text-slate-500 text-sm mb-8">Enter your details to get a personalized retirement strategy</p>

            <div className="space-y-8">
              {/* Monthly Expenditure */}
              <div>
                <label className="flex items-center gap-2 text-slate-700 font-medium mb-3">
                  <CurrencyEuroIcon className="w-4 h-4 text-amber-500" />
                  Monthly Expenditure
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="500"
                    max="15000"
                    step="100"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <span className="text-lg font-bold text-slate-900 min-w-20 text-right">€{monthlyExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>€1,000</span>
                  <span>€15,000</span>
                </div>
              </div>

              {/* Current Savings & Investments */}
              <div>
                <label className="flex items-center gap-2 text-slate-700 font-medium mb-3">
                  <BanknotesIcon className="w-4 h-4 text-emerald-500" />
                  Current Savings & Investments
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={currentWealth}
                    onChange={(e) => setCurrentWealth(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className="text-lg font-bold text-slate-900 min-w-20 text-right">€{currentWealth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>€0</span>
                  <span>€1,000,000</span>
                </div>
              </div>

              {/* Ages */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-medium mb-3 block">Current Age</label>
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-400 mt-1 block">years</span>
                </div>
                <div>
                  <label className="text-slate-700 font-medium mb-3 block">Retirement Age</label>
                  <input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-400 mt-1 block">years</span>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateStrategy}
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Generating...' : 'Generate My Strategy'}
                {!loading && <ArrowTrendingUpIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Right: Results Preview - Real-time calculation */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg">
            <div className="space-y-8">
              <div className="text-center border-b border-slate-700 pb-8">
                <div className="text-sm text-slate-400 font-medium mb-2">TIME TO RETIREMENT</div>
                <div className="text-5xl font-bold">{Math.max(0, yearsToGrow)}</div>
                <div className="text-slate-400 mt-2">years</div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Monthly need today</div>
                  <div className="text-2xl font-bold">€{monthlyExpenses.toLocaleString()}</div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Monthly need at retirement</div>
                  <div className="text-2xl font-bold text-amber-400">€{Math.round(futureMonthlyNeed).toLocaleString()}</div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Current portfolio</div>
                  <div className="text-2xl font-bold">€{currentWealth.toLocaleString()}</div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <div className="text-slate-300 text-xs leading-relaxed">
                    <strong>Inflation adjustment:</strong><br/>
                    Your expenses will grow by 2% annually, reflecting typical Dutch inflation rates.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen">
        {/* Start Over Button */}
        <button
          onClick={() => setHasSubmitted(false)}
          className="text-slate-600 hover:text-slate-900 flex items-center gap-1 mb-8 font-medium"
        >
          ← Start Over
        </button>
        
        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <MetricCard 
            title="Monthly Need (Future)" 
            value={"€" + Math.round(futureMonthlyNeed).toLocaleString()} 
            icon={<CurrencyEuroIcon className="w-6 h-6 text-white" />}
            color="bg-blue-600"
          />
          <MetricCard 
            title="Target Nest Egg" 
            value="—" 
            icon={<BanknotesIcon className="w-6 h-6 text-white" />}
            color="bg-emerald-600"
          />
          <MetricCard 
            title="Gap to Fill" 
            value="—" 
            icon={<ArrowTrendingUpIcon className="w-6 h-6 text-white" />}
            color="bg-amber-500"
          />
          <MetricCard 
            title="Monthly Savings Target" 
            value="..." 
            icon={<ChartBarIcon className="w-6 h-6 text-white" />}
            color="bg-purple-600"
          />
        </div>

        {/* Loading Spinner */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center min-h-96">
          <div className="relative w-16 h-16 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Crafting Your Strategy</h3>
          <p className="text-slate-500 text-center">Analyzing Dutch tax rules and investment options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="text-center space-y-4 pt-8">
        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-4 py-1.5 rounded-full border border-yellow-200">
          ✨ AI-Powered Planning
        </span>
        <h1 className="text-5xl font-bold text-slate-900 tracking-tight">Plan Your Path to FIRE</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Tailored for the Netherlands. Smart strategies considering Dutch tax rules, pension pillars, and wealth-building opportunities.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard 
          title="Monthly Need (Future)" 
          value={"€" + data.monthlyNeed.toLocaleString()} 
          icon={<CurrencyEuroIcon className="w-6 h-6 text-white" />}
          color="bg-blue-600"
        />
        <MetricCard 
          title="Target Nest Egg" 
          value={"€" + data.targetNestEgg.toLocaleString()} 
          icon={<BanknotesIcon className="w-6 h-6 text-white" />}
          color="bg-emerald-600"
        />
        <MetricCard 
          title="Gap to Fill" 
          value={"€" + data.gapToFill.toLocaleString()} 
          icon={<ArrowTrendingUpIcon className="w-6 h-6 text-white" />}
          color="bg-amber-500"
        />
        <MetricCard 
          title="Monthly Savings Target" 
          value={"€" + data.monthlySavings.toLocaleString()} 
          icon={<ChartBarIcon className="w-6 h-6 text-white" />}
          color="bg-purple-600"
        />
      </div>

      <button
        onClick={() => setHasSubmitted(false)}
        className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-6"
      >
        ← Adjust Parameters
      </button>

      {/* Strategy Section (Blue Box) */}
      <div className="bg-slate-900 rounded-2xl p-10 text-white shadow-xl">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            💡 Your Personalized Strategy
          </h2>
          <p className="text-slate-300 leading-relaxed mb-8 text-lg">
            To achieve early retirement at age {retirementAge}, you should aim to save aggressively (<strong>€{data.monthlySavings}/mo</strong>). 
            Utilize the <strong>30% Jaarruimte</strong> deduction to reduce Box 1 tax, 
            and keep taxable Box 3 wealth optimized using the <strong>€59,357</strong> exemption.
          </p>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <span className="font-bold text-slate-200">Feasibility: </span>
            <span className="text-slate-400">With consistent saving and Box 3 optimization, reaching the €{data.targetNestEgg.toLocaleString()} target is feasible.</span>
          </div>
        </div>
      </div>

      {/* Charts & Allocation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
            <ArrowTrendingUpIcon className="w-5 h-5 text-blue-500"/> Wealth Projection
          </h3>
          <WealthProjectionChart 
            currentWealth={currentWealth}
            monthlySavings={data.monthlySavings}
            targetNestEgg={data.targetNestEgg}
            yearsToRetirement={retirementAge - currentAge}
          />
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2 text-lg">
             Recommended Allocation
          </h3>
          <div className="space-y-8">
            <AllocationBar label="Stocks & ETFs" percent={data.allocation.stocks} color="bg-slate-800" />
            <AllocationBar label="Bonds" percent={data.allocation.bonds} color="bg-emerald-500" />
            <AllocationBar label="Real Estate" percent={data.allocation.realEstate} color="bg-amber-500" />
            <AllocationBar label="Cash Reserve" percent={data.allocation.cash} color="bg-slate-300" />
          </div>
        </div>
      </div>

      {/* Action Steps */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900">Key Action Steps</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <ActionCard 
              priority="High" 
              title="Maximize Pension"
              desc="Use your Jaarruimte. Invest up to 30% tax-free into a blocked pension account."
              tag="NL Tax"
           />
           <ActionCard 
              priority="High" 
              title="Invest in Index Funds"
              desc="Buy global ETFs (e.g. VWRL). Target 8-10% ROI to outpace the 6% fictitious tax return."
              tag="Strategy"
           />
           <ActionCard 
              priority="Medium" 
              title="Optimize Box 3"
              desc={`Keep liquid savings low (taxed at ~1.3% assumption) and maximize the €59,357 exemption.`}
              tag="Tax Hack"
           />
        </div>
      </div>

      {/* Dutch Tax Optimization */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-l-4 border-emerald-600 p-8">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🏛️</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Dutch Tax Optimization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="font-semibold text-slate-900 mb-2">Box 3 Strategy</div>
                <p className="text-sm text-slate-700">Invest in products that maximize returns while staying below the Box 3 threshold for optimal tax efficiency.</p>
              </div>
              <div>
                <div className="font-semibold text-slate-900 mb-2">Pension Recommendations</div>
                <p className="text-sm text-slate-700">Contribute to a private pension (lijfrente) to get tax deductions, which can be used for early retirement income.</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 inline-block mt-6">
              <span className="font-bold text-emerald-600">Estimated Annual Tax Savings: €{Math.round(data.estimatedBox3Tax).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Dutch Products */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900">📊 Recommended Dutch Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProductCard
            title="iShares AEX ETF"
            category="ETF"
            desc="Low fees and strong historical returns based on the Dutch stock market."
          />
          <ProductCard
            title="ABN AMRO Lijfrente"
            category="Lijfrente"
            desc="Offers tax benefits, helping you defer income taxes while saving for retirement."
          />
          <ProductCard
            title="Funds managed by Triodos"
            category="Sustainable Investment Fund"
            desc="Align investments with ethical values while aiming for decent returns."
          />
          <ProductCard
            title="DeGiro's Access account"
            category="Investment brokerage"
            desc="Low fees and a wide range of investment options including Dutch ETFs."
          />
        </div>
      </div>

      {/* Your Wealth Journey */}
      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-slate-900">🎯 Your Wealth Journey</h3>
        <div className="space-y-6">
          <TimelineItem
            year={new Date().getFullYear()}
            wealth={data.monthlySavings * 12}
            milestone={`Increase savings rate to €${Math.round(data.monthlySavings)}/month.`}
          />
          <TimelineItem
            year={new Date().getFullYear() + 4}
            wealth={Math.round(data.monthlySavings * 12 * 4)}
            milestone="Maximize investments in AEX index fund."
          />
          <TimelineItem
            year={new Date().getFullYear() + 8}
            wealth={Math.round(data.monthlySavings * 12 * 8)}
            milestone="Review portfolio; consider reallocating excess cash into higher yield investments."
          />
          <TimelineItem
            year={new Date().getFullYear() + 12}
            wealth={Math.round(data.monthlySavings * 12 * 12)}
            milestone="Open lijfrente account to further tax-shelter your investments."
          />
          <TimelineItem
            year={new Date().getFullYear() + (retirementAge - currentAge)}
            wealth={data.targetNestEgg}
            milestone="Start creating an 'income in retirement' plan with your investments."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-slate-200">
        <p className="text-slate-500 text-sm">Designed for the Netherlands • Considers Dutch tax regulations & pension pillars</p>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between h-36 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <span className="text-slate-500 font-medium">{title}</span>
        <div className={`p-2.5 rounded-xl ${color} shadow-sm`}>{icon}</div>
      </div>
      <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
    </div>
  )
}

function AllocationBar({ label, percent, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-bold text-slate-900">{percent}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3">
        <div className={`${color} h-3 rounded-full`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  )
}

function ActionCard({ priority, title, desc, tag }: any) {
    const badgeColor = priority === 'High' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100';
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${badgeColor}`}>{priority} Priority</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-xs text-slate-600 font-medium">{tag}</span>
            </div>
            <h4 className="font-bold text-lg text-slate-900 mb-2">{title}</h4>
            <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
        </div>
    )
}

function ProductCard({ title, category, desc }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="mb-3">
                <h4 className="font-bold text-slate-900 text-lg mb-1">{title}</h4>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">{category}</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
        </div>
    )
}

function TimelineItem({ year, wealth, milestone }: any) {
    return (
        <div className="flex gap-6">
            <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm border-4 border-white shadow-sm"></div>
                <div className="flex-1 w-0.5 bg-gradient-to-b from-blue-200 to-slate-200"></div>
            </div>
            <div className="pb-8">
                <div className="flex items-center gap-4">
                    <div>
                        <div className="font-bold text-lg text-slate-900">Year {year}</div>
                        <div className="text-emerald-600 font-bold">€{wealth.toLocaleString()}</div>
                    </div>
                </div>
                <p className="text-slate-600 text-sm mt-2 max-w-2xl">{milestone}</p>
            </div>
        </div>
    )
}

function WealthProjectionChart({ currentWealth, monthlySavings, targetNestEgg, yearsToRetirement }: any) {
    // Generate yearly projections
    const growthRate = 0.065 / 12; // 6.5% annual growth, monthly rate
    let wealth = currentWealth;
    const yearData = [{ year: 0, wealth: currentWealth }];
    
    for (let year = 1; year <= yearsToRetirement; year++) {
        for (let month = 0; month < 12; month++) {
            wealth = wealth * (1 + growthRate) + monthlySavings;
        }
        yearData.push({ year, wealth: Math.round(wealth) });
    }
    
    // Find max for scaling
    const maxWealth = Math.max(...yearData.map(d => d.wealth), targetNestEgg) * 1.15;
    const minWealth = 0;
    const chartWidth = 100; // percentage
    const chartHeight = 200; // pixels
    const padding = 40;
    
    // Generate SVG path for the line
    const pathPoints = yearData.map((d, i) => {
        const x = padding + (i / (yearData.length - 1)) * (chartWidth - padding - 20);
        const y = chartHeight - ((d.wealth - minWealth) / (maxWealth - minWealth)) * (chartHeight - padding);
        return `${x},${y}`;
    });
    const pathD = `M ${pathPoints.join(' L ')}`;
    
    // Target line y position
    const targetY = chartHeight - ((targetNestEgg - minWealth) / (maxWealth - minWealth)) * (chartHeight - padding);
    
    return (
        <div className="space-y-6">
            <svg width="100%" height="280" viewBox="0 0 500 280" className="border border-slate-200 rounded-lg bg-slate-50/50 p-4">
                {/* Y-axis */}
                <line x1="40" y1="20" x2="40" y2="220" stroke="#94a3b8" strokeWidth="2" />
                
                {/* X-axis */}
                <line x1="40" y1="220" x2="480" y2="220" stroke="#94a3b8" strokeWidth="2" />
                
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = 220 - ratio * 200;
                    return (
                        <line
                            key={`grid-${ratio}`}
                            x1="40"
                            y1={y}
                            x2="480"
                            y2={y}
                            stroke="#e2e8f0"
                            strokeWidth="1"
                            strokeDasharray="4"
                        />
                    );
                })}
                
                {/* Target line */}
                <line
                    x1="40"
                    y1={targetY}
                    x2="480"
                    y2={targetY}
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="5"
                />
                <text x="385" y={targetY - 8} fontSize="12" fill="#059669" fontWeight="bold">
                    Target: €{(targetNestEgg / 1000000).toFixed(1)}M
                </text>
                
                {/* Projection line */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                
                {/* Data points */}
                {yearData.filter((_, i) => i % Math.max(1, Math.floor(yearData.length / 6)) === 0).map((d, idx) => {
                    const x = 40 + (d.year / yearsToRetirement) * (480 - 40);
                    const y = 220 - ((d.wealth - minWealth) / (maxWealth - minWealth)) * 200;
                    return (
                        <g key={`point-${d.year}`}>
                            <circle cx={x} cy={y} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                        </g>
                    );
                })}
                
                {/* Y-axis labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const value = (minWealth + ratio * (maxWealth - minWealth)) / 1000000;
                    const y = 220 - ratio * 200;
                    return (
                        <text key={`y-label-${ratio}`} x="35" y={y + 5} fontSize="11" fill="#64748b" textAnchor="end">
                            €{value.toFixed(1)}M
                        </text>
                    );
                })}
                
                {/* X-axis labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const year = Math.round(ratio * yearsToRetirement);
                    const x = 40 + ratio * (480 - 40);
                    return (
                        <text key={`x-label-${year}`} x={x} y="240" fontSize="11" fill="#64748b" textAnchor="middle">
                            Year {year}
                        </text>
                    );
                })}
                
                {/* Axis labels */}
                <text x="15" y="110" fontSize="12" fill="#475569" fontWeight="bold" textAnchor="middle" transform="rotate(-90 15 110)">
                    Wealth (€)
                </text>
                <text x="260" y="265" fontSize="12" fill="#475569" fontWeight="bold" textAnchor="middle">
                    Years
                </text>
            </svg>
            
            {/* Legend and Summary */}
            <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="text-slate-600 text-xs">Current Wealth</div>
                    <div className="font-bold text-slate-900">€{currentWealth.toLocaleString()}</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="text-slate-600 text-xs">Projected at Retirement</div>
                    <div className="font-bold text-slate-900">€{Math.round(wealth).toLocaleString()}</div>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <div className="text-slate-600 text-xs">Target Nest Egg</div>
                    <div className="font-bold text-emerald-600">€{targetNestEgg.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}
