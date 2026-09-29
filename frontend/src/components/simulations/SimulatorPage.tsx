import React, { useState } from 'react';
import { useCrisis } from '../../context/CrisisContext';
import { 
  Sliders, 
  TrendingUp, 
  Save, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  ArrowRight, 
  Database, 
  Calendar, 
  Layers, 
  Sparkles,
  Calculator,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { SimulationResult } from '../../types/crisis';

export const SimulatorPage: React.FC = () => {
  const { 
    simulationParams, 
    setSimulationParams, 
    calculateSimulation, 
    runBackendSimulation,
    savedScenarios, 
    saveCurrentScenario,
    loadScenario,
    crises,
    activeCrisis,
    showToast
  } = useCrisis();

  const [activeTab, setActiveTab] = useState<'live' | 'compare'>('live');
  const [scenarioNameInput, setScenarioNameInput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<'A' | 'B' | 'C' | 'Custom'>('B');
  const [isSimulating, setIsSimulating] = useState(false);
  const [backendResult, setBackendResult] = useState<SimulationResult | null>(null);

  const liveResult = backendResult || calculateSimulation(simulationParams);

  const applyPreset = (preset: 'A' | 'B' | 'C') => {
    setSelectedPreset(preset);
    if (preset === 'A') {
      setSimulationParams({
        discountPercent: 10,
        promoDurationDays: 90,
        inventoryAllocationPercent: 100,
        targetRegion: 'All Regions',
        salesTargetUnits: 26000,
        campaignBudgetInLakhs: 4.0,
        product: activeCrisis.productName
      });
      showToast('Scenario A Applied', '10% Conservative Discount parameters loaded.', 'info');
    } else if (preset === 'B') {
      setSimulationParams({
        discountPercent: 15,
        promoDurationDays: 60,
        inventoryAllocationPercent: 85,
        targetRegion: 'All Regions',
        salesTargetUnits: 35000,
        campaignBudgetInLakhs: 8.5,
        product: activeCrisis.productName
      });
      showToast('Scenario B Applied', '15% Targeted Discount + Bundle (AI Recommended) loaded.', 'info');
    } else if (preset === 'C') {
      setSimulationParams({
        discountPercent: 0,
        promoDurationDays: 45,
        inventoryAllocationPercent: 70,
        targetRegion: 'South Zone (Bengaluru/HYD)',
        salesTargetUnits: 31000,
        campaignBudgetInLakhs: 5.8,
        product: activeCrisis.productName
      });
      showToast('Scenario C Applied', 'Regional Redistribution parameters loaded.', 'info');
    }
  };

  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    const name = scenarioNameInput.trim() || `Scenario ${savedScenarios.length + 1}`;
    saveCurrentScenario(name);
    setScenarioNameInput('');
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F3F0FD] text-[#7567E8] border border-[#E4DEFC]">
              Predictive Decision Support
            </span>
            <span className="text-[12px] text-[#64748B]">
              Calibrated Price Elasticity Model (v1.65)
            </span>
          </div>
          <h1 className="text-[28px] lg:text-[32px] font-bold text-[#17213D] font-heading tracking-tight mt-1">
            Strategy Simulator
          </h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">
            Test strategy assumptions, adjust levers in real-time, and forecast inventory clearance, revenue, and gross margins.
          </p>
        </div>

        {/* View Switcher: Live Simulation vs Scenario Comparison */}
        <div className="flex items-center bg-white border border-[#E6EAF0] p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors ${
              activeTab === 'live'
                ? 'bg-[#17213D] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#17213D]'
            }`}
          >
            Live Simulator
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors ${
              activeTab === 'compare'
                ? 'bg-[#17213D] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#17213D]'
            }`}
          >
            Compare Scenarios
          </button>
        </div>
      </div>

      {/* Preset Scenarios Header Strip */}
      <div className="enterprise-card p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[#64748B]">Baseline Scenarios:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset('A')}
              className={`px-3 py-1 rounded-md text-[12px] font-semibold transition-colors border ${
                selectedPreset === 'A'
                  ? 'bg-[#17213D] text-white border-[#17213D]'
                  : 'bg-[#FAFBFD] text-[#17213D] border-[#E6EAF0] hover:bg-[#F3F0FD]'
              }`}
            >
              Scenario A: 10% Discount
            </button>
            <button
              onClick={() => applyPreset('B')}
              className={`px-3 py-1 rounded-md text-[12px] font-semibold transition-colors border ${
                selectedPreset === 'B'
                  ? 'bg-[#7567E8] text-white border-[#7567E8]'
                  : 'bg-[#F3F0FD] text-[#7567E8] border-[#E4DEFC] hover:bg-[#EAE4FB]'
              }`}
            >
              Scenario B: 15% + Bundle (AI Rec)
            </button>
            <button
              onClick={() => applyPreset('C')}
              className={`px-3 py-1 rounded-md text-[12px] font-semibold transition-colors border ${
                selectedPreset === 'C'
                  ? 'bg-[#17213D] text-white border-[#17213D]'
                  : 'bg-[#FAFBFD] text-[#17213D] border-[#E6EAF0] hover:bg-[#F3F0FD]'
              }`}
            >
              Scenario C: Regional Redistribution
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveScenario} className="flex items-center gap-2">
          <input
            type="text"
            value={scenarioNameInput}
            onChange={(e) => setScenarioNameInput(e.target.value)}
            placeholder="Name custom scenario..."
            className="text-[12px] px-2.5 py-1 bg-[#FAFBFD] border border-[#E6EAF0] rounded-md focus:outline-none focus:border-[#7567E8] w-44"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-white hover:bg-[#FAFBFD] border border-[#E6EAF0] text-[#17213D] text-[12px] font-semibold rounded-md transition-colors flex items-center gap-1"
          >
            <Save className="w-3.5 h-3.5 text-[#7567E8]" />
            <span>Save</span>
          </button>
        </form>
      </div>

      {activeTab === 'live' ? (
        /* Main 2-Column Live Simulator View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-5 enterprise-card p-6 bg-white space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F9]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#7567E8]" />
                <h3 className="text-[16px] font-bold text-[#17213D] font-heading">
                  Simulation Levers
                </h3>
              </div>
              <button
                onClick={() => applyPreset('B')}
                className="text-[11px] font-semibold text-[#7567E8] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to AI Rec</span>
              </button>
            </div>

            {/* Product Selector Dropdown */}
            <div>
              <label className="text-[12px] font-semibold text-[#17213D] block mb-1.5">
                Target Product
              </label>
              <select
                value={simulationParams.product}
                onChange={(e) => {
                  setSimulationParams(prev => ({ ...prev, product: e.target.value }));
                  setSelectedPreset('Custom');
                }}
                className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-2 text-[#17213D] focus:outline-none focus:border-[#7567E8]"
              >
                {crises.map(c => (
                  <option key={c.id} value={c.productName}>
                    {c.productName} ({c.inventoryUnits.toLocaleString()} units at risk)
                  </option>
                ))}
              </select>
            </div>

            {/* Region Selector Dropdown */}
            <div>
              <label className="text-[12px] font-semibold text-[#17213D] block mb-1.5">
                Fulfillment Target Region
              </label>
              <select
                value={simulationParams.targetRegion}
                onChange={(e) => {
                  setSimulationParams(prev => ({ ...prev, targetRegion: e.target.value }));
                  setSelectedPreset('Custom');
                }}
                className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-2 text-[#17213D] focus:outline-none focus:border-[#7567E8]"
              >
                <option value="All Regions">All Regions (National Rollout)</option>
                <option value="South Zone (Bengaluru/HYD)">South Zone (High demand run-rate: 82/100)</option>
                <option value="North Depot (Delhi/NCR)">North Depot (Delhi/NCR)</option>
                <option value="West Hub (Mumbai/Bhiwandi)">West Hub (Mumbai/Bhiwandi)</option>
                <option value="East Region (Kolkata)">East Region (Kolkata)</option>
              </select>
            </div>

            {/* Slider 1: Discount Percent */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-semibold text-[#17213D]">Promotional Discount</span>
                <span className="font-bold text-[#7567E8] font-mono bg-[#F3F0FD] px-2 py-0.5 rounded border border-[#E4DEFC]">
                  {simulationParams.discountPercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                step="1"
                value={simulationParams.discountPercent}
                onChange={(e) => {
                  setSimulationParams(prev => ({ ...prev, discountPercent: Number(e.target.value) }));
                  setSelectedPreset('Custom');
                }}
                className="w-full accent-[#7567E8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8]">
                <span>0% (Full Price)</span>
                <span>15% (AI Rec)</span>
                <span>45% (Deep Clearance)</span>
              </div>
            </div>

            {/* Slider 2: Promotion Duration */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-semibold text-[#17213D]">Promotion Duration</span>
                <span className="font-bold text-[#17213D] font-mono bg-[#FAFBFD] px-2 py-0.5 rounded border border-[#E6EAF0]">
                  {simulationParams.promoDurationDays} days
                </span>
              </div>
              <input
                type="range"
                min="14"
                max="120"
                step="5"
                value={simulationParams.promoDurationDays}
                onChange={(e) => {
                  setSimulationParams(prev => ({ ...prev, promoDurationDays: Number(e.target.value) }));
                  setSelectedPreset('Custom');
                }}
                className="w-full accent-[#7567E8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8]">
                <span>14 Days (Flash)</span>
                <span>60 Days (Recommended)</span>
                <span>120 Days</span>
              </div>
            </div>

            {/* Slider 3: Inventory Allocation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-semibold text-[#17213D]">Inventory Allocated</span>
                <span className="font-bold text-[#17213D] font-mono bg-[#FAFBFD] px-2 py-0.5 rounded border border-[#E6EAF0]">
                  {simulationParams.inventoryAllocationPercent}% ({Math.round(activeCrisis.inventoryUnits * (simulationParams.inventoryAllocationPercent / 100)).toLocaleString()} units)
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={simulationParams.inventoryAllocationPercent}
                onChange={(e) => {
                  setSimulationParams(prev => ({ ...prev, inventoryAllocationPercent: Number(e.target.value) }));
                  setSelectedPreset('Custom');
                }}
                className="w-full accent-[#7567E8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8]">
                <span>20% (Phased)</span>
                <span>85% (Optimal)</span>
                <span>100% (Total Stock)</span>
              </div>
            </div>

            {/* Input: Campaign Budget in Lakhs */}
            <div>
              <div className="flex items-center justify-between text-[13px] mb-1.5">
                <span className="font-semibold text-[#17213D]">Campaign Marketing Budget</span>
                <span className="text-[11px] text-[#64748B]">Co-op retail & digital push</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-[13px] font-semibold text-[#64748B]">₹</span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  value={simulationParams.campaignBudgetInLakhs}
                  onChange={(e) => {
                    setSimulationParams(prev => ({ ...prev, campaignBudgetInLakhs: Number(e.target.value) }));
                    setSelectedPreset('Custom');
                  }}
                  className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg pl-7 pr-16 py-2 text-[#17213D] font-mono focus:outline-none focus:border-[#7567E8]"
                />
                <span className="absolute right-3 top-2 text-[12px] text-[#64748B]">Lakhs</span>
              </div>
            </div>

            <button
              onClick={async () => {
                setIsSimulating(true);
                try {
                  const res = await runBackendSimulation(simulationParams);
                  setBackendResult(res);
                  showToast('Simulation Computed', 'Deterministic results calculated by Python backend engine.', 'success');
                } finally {
                  setIsSimulating(false);
                }
              }}
              disabled={isSimulating}
              className="w-full py-2.5 px-4 bg-[#7567E8] hover:bg-[#6658DC] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
            >
              {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
              <span>{isSimulating ? 'Computing Python Algorithms...' : 'Run Deterministic Simulation (Backend)'}</span>
            </button>
          </div>

          {/* Right Column: Live Expected Impact & Recharts */}
          <div className="lg:col-span-7 space-y-6">
            {/* 4 Live Impact Result Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="enterprise-card p-4 bg-white">
                <span className="text-[11px] font-semibold text-[#64748B] block">Clearance Rate</span>
                <div className="text-[22px] font-bold text-[#17213D] font-heading mt-1">
                  {liveResult.expectedClearancePercent}%
                </div>
                <span className="text-[10px] text-[#2D7A5D] font-medium block mt-0.5">
                  {liveResult.clearedUnits.toLocaleString()} units
                </span>
              </div>

              <div className="enterprise-card p-4 bg-white">
                <span className="text-[11px] font-semibold text-[#64748B] block">Remaining Stock</span>
                <div className="text-[22px] font-bold text-[#17213D] font-heading mt-1">
                  {liveResult.remainingUnits.toLocaleString()}
                </div>
                <span className="text-[10px] text-[#64748B] block mt-0.5">
                  at end of campaign
                </span>
              </div>

              <div className="enterprise-card p-4 bg-white">
                <span className="text-[11px] font-semibold text-[#64748B] block">Projected Revenue</span>
                <div className="text-[22px] font-bold text-[#7567E8] font-heading mt-1">
                  ₹{liveResult.projectedRevenueCr} Cr
                </div>
                <span className="text-[10px] text-[#64748B] block mt-0.5">
                  Gross realizations
                </span>
              </div>

              <div className="enterprise-card p-4 bg-white">
                <span className="text-[11px] font-semibold text-[#64748B] block">Effective Margin</span>
                <div className={`text-[22px] font-bold font-heading mt-1 ${
                  liveResult.effectiveMarginPercent < 18 ? 'text-[#9C334A]' : 'text-[#2D7A5D]'
                }`}>
                  {liveResult.effectiveMarginPercent}%
                </div>
                <span className="text-[10px] text-[#64748B] block mt-0.5">
                  Risk: {liveResult.riskScore}
                </span>
              </div>
            </div>

            {/* Recharts Timeline Chart: Inventory Remaining over 90 Days */}
            <div className="enterprise-card p-5 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-[#17213D] font-heading">
                    Projected Inventory Depletion Curve (Units Remaining)
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    Forecasted stock reduction trajectory across the 90-day obsolescence window
                  </p>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#FAFBFD] border border-[#E6EAF0] text-[#17213D]">
                  Estimated {liveResult.daysToClear} Days to Clear Target
                </span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={liveResult.timelineProjection}>
                    <defs>
                      <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7567E8" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#7567E8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F9" />
                    <XAxis 
                      dataKey="day" 
                      tickFormatter={(val) => `Day ${val}`}
                      stroke="#94A3B8" 
                      fontSize={11} 
                    />
                    <YAxis 
                      tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                      stroke="#94A3B8" 
                      fontSize={11} 
                    />
                    <Tooltip 
                      formatter={(val: any) => [`${Number(val).toLocaleString()} units`, 'Units in Stock']}
                      labelFormatter={(label) => `Day ${label}`}
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E6EAF0', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="remainingStock" 
                      stroke="#7567E8" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#colorStock)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recharts Revenue Realization vs Margin Bar Chart */}
            <div className="enterprise-card p-5 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-[#17213D] font-heading">
                    Cumulative Revenue Milestones (₹ Crores)
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    Projected gross cash flow realized at 15-day checkpoints
                  </p>
                </div>
              </div>

              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={liveResult.timelineProjection}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F9" />
                    <XAxis 
                      dataKey="day" 
                      tickFormatter={(val) => `Day ${val}`}
                      stroke="#94A3B8" 
                      fontSize={11} 
                    />
                    <YAxis 
                      tickFormatter={(val) => `₹${val}Cr`}
                      stroke="#94A3B8" 
                      fontSize={11} 
                    />
                    <Tooltip 
                      formatter={(val: any) => [`₹${val} Cr`, 'Realized Revenue']}
                      labelFormatter={(label) => `Checkpoint Day ${label}`}
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E6EAF0', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Bar dataKey="revenueCr" fill="#7BA7E8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Scenario Comparison Table & Analysis */
        <div className="space-y-6">
          <div className="enterprise-card bg-white overflow-hidden">
            <div className="p-5 border-b border-[#E6EAF0]">
              <h3 className="text-[16px] font-bold text-[#17213D] font-heading">
                Scenario Comparison Matrix
              </h3>
              <p className="text-[13px] text-[#64748B]">
                Side-by-side analysis of candidate strategic parameters and their expected business outcomes
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="bg-[#FAFBFD] border-b border-[#E6EAF0] text-[#64748B] text-[11px] font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Scenario</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Target Region</th>
                    <th className="py-3 px-4">Clearance</th>
                    <th className="py-3 px-4">Revenue</th>
                    <th className="py-3 px-4">Margin</th>
                    <th className="py-3 px-4">Risk</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F4F9]">
                  {savedScenarios.map((scen) => (
                    <tr key={scen.id} className="hover:bg-[#FAFBFD] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#17213D]">
                        {scen.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium">
                        {scen.params.discountPercent}%
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {scen.params.promoDurationDays} days
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {scen.params.targetRegion}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#17213D]">
                        {scen.result.expectedClearancePercent}%
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#7567E8]">
                        ₹{scen.result.projectedRevenueCr} Cr
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#2D7A5D]">
                        {scen.result.effectiveMarginPercent}%
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          scen.result.riskScore === 'Low'
                            ? 'bg-[#F0F9F5] text-[#2D7A5D]'
                            : scen.result.riskScore === 'Moderate'
                            ? 'bg-[#FEF9ED] text-[#8C6417]'
                            : 'bg-[#FCF1F3] text-[#9C334A]'
                        }`}>
                          {scen.result.riskScore}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            loadScenario(scen);
                            setActiveTab('live');
                          }}
                          className="px-3 py-1 bg-white hover:bg-[#F3F0FD] border border-[#E6EAF0] text-[#7567E8] text-[12px] font-semibold rounded transition-colors"
                        >
                          Load Levers →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
