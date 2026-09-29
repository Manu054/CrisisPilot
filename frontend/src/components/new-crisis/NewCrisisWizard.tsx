import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrisis } from '../../context/CrisisContext';
import { CrisisType, StrategyOption, Crisis } from '../../types/crisis';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Package, 
  Calculator, 
  Sliders, 
  Database,
  Layers,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const NewCrisisWizard: React.FC = () => {
  const navigate = useNavigate();
  const { addNewCrisis, setActiveTab, historicalCases } = useCrisis();
  const [step, setStep] = useState<number>(1);
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState('Audio Pro Channel Overhang');
  const [productName, setProductName] = useState('Audio Pro Series 4');
  const [category, setCategory] = useState('Personal Audio');
  const [crisisType, setCrisisType] = useState<CrisisType>('excess_inventory');
  const [severity, setSeverity] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [description, setDescription] = useState(
    'Distributor sell-through slowed down 32% following competitor promotion. 38,000 units stagnant with 90 days before refresh.'
  );

  // Financials & Stock
  const [inventoryUnits, setInventoryUnits] = useState<number>(38000);
  const [monthlySalesRunRate, setMonthlySalesRunRate] = useState<number>(3800);
  const [unitPrice, setUnitPrice] = useState<number>(1200);
  const [costPrice, setCostPrice] = useState<number>(680);
  const [daysUntilExpiry, setDaysUntilExpiry] = useState<number>(90);

  // Levers
  const [maxDiscountPercent, setMaxDiscountPercent] = useState<number>(15);
  const [bundlingAllowed, setBundlingAllowed] = useState<boolean>(true);
  const [campaignBudget, setCampaignBudget] = useState<number>(7.5);

  const startAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setStep(3);
    }, 1800);
  };

  const handleFinishAndDeploy = async () => {
    const calculatedExposure = Math.round((inventoryUnits * (unitPrice - costPrice)) / 100000);
    
    const newCrisisData: Omit<Crisis, 'id'> = {
      title,
      productName,
      category,
      crisisType,
      severity,
      impactAmount: `₹${calculatedExposure}L`,
      status: 'Needs Decision',
      lastUpdated: 'Just now',
      inventoryUnits,
      monthlySalesRunRate,
      unitPrice,
      costPrice,
      currencySymbol: '₹',
      daysUntilExpiry,
      description,
      inventoryBreakdown: {
        available: Math.round(inventoryUnits * 0.75),
        inTransit: Math.round(inventoryUnits * 0.12),
        committed: Math.round(inventoryUnits * 0.10),
        returned: Math.round(inventoryUnits * 0.03)
      },
      recommendedStrategy: {
        id: `strat-${Date.now()}`,
        title: `${maxDiscountPercent}% Promotional Discount + Value Bundle`,
        badge: 'AI Recommended',
        isRecommended: true,
        inventoryClearance: 74,
        marginImpact: -17,
        estimatedRevenue: `₹${((inventoryUnits * 0.74 * unitPrice * (1 - maxDiscountPercent / 100)) / 10000000).toFixed(2)} Cr`,
        revenueRaw: 3.2,
        timeToClearDays: 60,
        customerRetention: 'High',
        riskLevel: 'Moderate',
        description: 'Targeted discount bundled with accessory to protect MSRP perception and speed sell-through.',
        whyChosen: 'Synthesized from matching historical precedents in HindSight memory bank.',
        actions: [
          'Authorize targeted promotional pricing',
          'Pair with fast-moving companion accessories',
          'Deploy regional channel incentive'
        ]
      },
      alternativeStrategies: [],
      similarHistoricalCases: historicalCases.slice(0, 4),
      regions: [
        { name: 'North Depot', stock: Math.round(inventoryUnits * 0.45), demandIndex: 45 },
        { name: 'West Hub', stock: Math.round(inventoryUnits * 0.35), demandIndex: 55 },
        { name: 'South Zone', stock: Math.round(inventoryUnits * 0.20), demandIndex: 78 }
      ]
    };

    await addNewCrisis(newCrisisData);
    navigate('/decision-center');
  };

  return (
    <div className="p-6 lg:p-8 max-w-[900px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F3F0FD] text-[#7567E8] border border-[#E4DEFC]">
            Crisis Ingestion
          </span>
          <span className="text-[12px] text-[#64748B]">Structured Business Triage Wizard</span>
        </div>
        <h1 className="text-[28px] lg:text-[32px] font-bold text-[#17213D] font-heading tracking-tight mt-1">
          Log New Business Situation
        </h1>
        <p className="text-[14px] text-[#64748B] mt-0.5">
          Enter operational parameters to trigger HindSight organizational matching and predictive scenario modeling.
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="grid grid-cols-3 gap-2">
        <div className={`p-3 rounded-lg border text-center transition-colors ${
          step === 1 ? 'bg-[#F3F0FD] border-[#DDD8F8] text-[#7567E8]' : 'bg-white border-[#E6EAF0] text-[#64748B]'
        }`}>
          <span className="text-[10px] font-bold block uppercase">Step 1</span>
          <span className="text-[12px] font-semibold">Situation Definition</span>
        </div>

        <div className={`p-3 rounded-lg border text-center transition-colors ${
          step === 2 ? 'bg-[#F3F0FD] border-[#DDD8F8] text-[#7567E8]' : 'bg-white border-[#E6EAF0] text-[#64748B]'
        }`}>
          <span className="text-[10px] font-bold block uppercase">Step 2</span>
          <span className="text-[12px] font-semibold">Inventory &amp; Financials</span>
        </div>

        <div className={`p-3 rounded-lg border text-center transition-colors ${
          step === 3 ? 'bg-[#F3F0FD] border-[#DDD8F8] text-[#7567E8]' : 'bg-white border-[#E6EAF0] text-[#64748B]'
        }`}>
          <span className="text-[10px] font-bold block uppercase">Step 3</span>
          <span className="text-[12px] font-semibold">AI Triage &amp; Evidence</span>
        </div>
      </div>

      {/* Step 1: Definition */}
      {step === 1 && (
        <div className="enterprise-card p-6 bg-white space-y-5">
          <h3 className="text-[16px] font-bold text-[#17213D] font-heading pb-2 border-b border-[#F1F4F9]">
            Step 1: Define Business Situation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-semibold text-[#17213D] block mb-1">
                Situation Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-2 text-[#17213D] focus:outline-none focus:border-[#7567E8]"
                placeholder="e.g. Q3 Excess Inventory Accumulation"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#17213D] block mb-1">
                Product SKU / Line
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-2 text-[#17213D] focus:outline-none focus:border-[#7567E8]"
                placeholder="e.g. Product X (Batch 2026)"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#17213D] block mb-1">
                Crisis Type
              </label>
              <select
                value={crisisType}
                onChange={(e) => setCrisisType(e.target.value as CrisisType)}
                className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-2 text-[#17213D] focus:outline-none focus:border-[#7567E8]"
              >
                <option value="excess_inventory">Excess Inventory</option>
                <option value="falling_sales">Falling Sales</option>
                <option value="competitor_price_cut">Competitor Price Cut</option>
                <option value="seasonal_demand">Seasonal Demand Shift</option>
                <option value="regional_imbalance">Regional Imbalance</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#17213D] block mb-1">
                Urgency Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-2 text-[#17213D] focus:outline-none focus:border-[#7567E8]"
              >
                <option value="Critical">Critical (Immediate intervention)</option>
                <option value="High">High (Address within 14 days)</option>
                <option value="Medium">Medium (Quarterly review)</option>
                <option value="Low">Low (Telemetry monitoring)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#17213D] block mb-1">
              Operational Narrative / Root Cause
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg p-3 text-[#17213D] focus:outline-none focus:border-[#7567E8]"
              placeholder="Detail channel context, competitor moves, and current warehouse bottlenecks..."
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2 bg-[#7567E8] hover:bg-[#6658DC] text-white text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <span>Continue to Financials</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Financials & Levers */}
      {step === 2 && (
        <div className="enterprise-card p-6 bg-white space-y-5">
          <h3 className="text-[16px] font-bold text-[#17213D] font-heading pb-2 border-b border-[#F1F4F9]">
            Step 2: Financial Parameters &amp; Inventory Boundaries
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[12px] font-semibold text-[#17213D] block mb-1">
                Units in Stock
              </label>
              <input
                type="number"
                value={inventoryUnits}
                onChange={(e) => setInventoryUnits(Number(e.target.value))}
                className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-2 text-[#17213D] font-mono focus:outline-none focus:border-[#7567E8]"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#17213D] block mb-1">
                Monthly Run-Rate (Units)
              </label>
              <input
                type="number"
                value={monthlySalesRunRate}
                onChange={(e) => setMonthlySalesRunRate(Number(e.target.value))}
                className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-2 text-[#17213D] font-mono focus:outline-none focus:border-[#7567E8]"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#17213D] block mb-1">
                Days Remaining to Cutoff
              </label>
              <input
                type="number"
                value={daysUntilExpiry}
                onChange={(e) => setDaysUntilExpiry(Number(e.target.value))}
                className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-2 text-[#17213D] font-mono focus:outline-none focus:border-[#7567E8]"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#17213D] block mb-1">
                Unit Selling Price (₹)
              </label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-2 text-[#17213D] font-mono focus:outline-none focus:border-[#7567E8]"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#17213D] block mb-1">
                Unit Cost Basis (₹)
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-2 text-[#17213D] font-mono focus:outline-none focus:border-[#7567E8]"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#17213D] block mb-1">
                Max Allowed Discount (%)
              </label>
              <input
                type="number"
                max={40}
                value={maxDiscountPercent}
                onChange={(e) => setMaxDiscountPercent(Number(e.target.value))}
                className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-2 text-[#17213D] font-mono focus:outline-none focus:border-[#7567E8]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#F1F4F9]">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-[#E6EAF0] bg-white text-[#17213D] text-[13px] font-semibold rounded-lg hover:bg-[#FAFBFD]"
            >
              Back
            </button>

            <button
              onClick={startAnalysis}
              disabled={analyzing}
              className="px-5 py-2 bg-[#7567E8] hover:bg-[#6658DC] text-white text-[13px] font-semibold rounded-lg flex items-center gap-2 transition-colors"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Precedents...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Trigger HindSight Scan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Synthesis & Ready to Launch */}
      {step === 3 && (
        <div className="enterprise-card p-6 bg-white space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F1F4F9]">
            <CheckCircle2 className="w-5 h-5 text-[#2D7A5D]" />
            <h3 className="text-[16px] font-bold text-[#17213D] font-heading">
              Step 3: HindSight AI Synthesis Complete
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-[#F3F0FD] border border-[#DDD8F8] space-y-2">
            <span className="text-[11px] font-bold text-[#7567E8] uppercase tracking-wider block">
              Precedent Match Summary
            </span>
            <p className="text-[14px] font-semibold text-[#17213D]">
              Matched 4 historically congruent cases with average similarity of 88%.
            </p>
            <p className="text-[12px] text-[#64748B]">
              Recommended formulation: 15% Promotional Discount + Value Bundle. Projected clearance: 74% within 60 days.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[12px]">
            <div className="p-3 rounded-lg border border-[#E6EAF0] bg-[#FAFBFD]">
              <span className="text-[#64748B] block">Units to Clear</span>
              <span className="text-[16px] font-bold text-[#17213D]">{Math.round(inventoryUnits * 0.74).toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-lg border border-[#E6EAF0] bg-[#FAFBFD]">
              <span className="text-[#64748B] block">Forecast Clearance</span>
              <span className="text-[16px] font-bold text-[#2D7A5D]">74%</span>
            </div>
            <div className="p-3 rounded-lg border border-[#E6EAF0] bg-[#FAFBFD]">
              <span className="text-[#64748B] block">Margin Preservation</span>
              <span className="text-[16px] font-bold text-[#17213D]">-17%</span>
            </div>
            <div className="p-3 rounded-lg border border-[#E6EAF0] bg-[#FAFBFD]">
              <span className="text-[#64748B] block">Runway</span>
              <span className="text-[16px] font-bold text-[#7567E8]">60 Days</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#F1F4F9]">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-[#E6EAF0] bg-white text-[#17213D] text-[13px] font-semibold rounded-lg hover:bg-[#FAFBFD]"
            >
              Modify Levers
            </button>

            <button
              onClick={handleFinishAndDeploy}
              className="px-5 py-2.5 bg-[#7567E8] hover:bg-[#6658DC] text-white text-[13px] font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Commit Crisis to Decision Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
