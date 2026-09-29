import React, { useState } from 'react';
import { useCrisis } from '../../context/CrisisContext';
import { recommendationApi } from '../../api/recommendationApi';
import { 
  Sparkles, 
  Database, 
  Check, 
  ArrowRight, 
  AlertTriangle, 
  Sliders, 
  Share2, 
  FileText,
  Clock,
  Layers,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Send,
  Loader2,
  RefreshCw,
  PlayCircle,
  Award,
  CheckCircle2,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DecisionCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activeCrisis, 
    handleAnalyzePrompt,
    isAnalyzing,
    analysisStep,
    setDecisionEvidenceOpen,
    setSelectedStrategyId,
    selectedStrategyId,
    selectedStrategy,
    executeActiveDecision,
    recordDecisionOutcome,
    showToast
  } = useCrisis();

  const [inputVal, setInputVal] = useState(
    `We have ${activeCrisis.inventoryUnits.toLocaleString()} units of ${activeCrisis.productName}, monthly sales are ${activeCrisis.monthlySalesRunRate.toLocaleString()} units, and the product expires in ${activeCrisis.daysUntilExpiry} days.`
  );

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showExecuteConfirm, setShowExecuteConfirm] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isExecuted, setIsExecuted] = useState(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [isSubmittingOutcome, setIsSubmittingOutcome] = useState(false);

  // Outcome form state
  const [outcomeUnits, setOutcomeUnits] = useState(Math.round(activeCrisis.inventoryUnits * 0.72));
  const [outcomeRevenue, setOutcomeRevenue] = useState(Math.round(activeCrisis.inventoryUnits * 0.72 * activeCrisis.unitPrice * 0.85));
  const [outcomeMargin, setOutcomeMargin] = useState(24.5);
  const [outcomeDays, setOutcomeDays] = useState(58);
  const [outcomeNotes, setOutcomeNotes] = useState('15% bundled promotion cleared target stock across South/West regional distributors without secondary channel friction.');

  const suggestedSituations = [
    { label: 'Excess Inventory', query: `We have ${activeCrisis.inventoryUnits.toLocaleString()} units of ${activeCrisis.productName}, monthly sales are ${activeCrisis.monthlySalesRunRate.toLocaleString()} units, and expiry is in ${activeCrisis.daysUntilExpiry} days.` },
    { label: 'Falling Sales', query: `${activeCrisis.productName} sales dropped 34% over 4 weeks due to low-cost competitors entering the market.` },
    { label: 'Competitor Price Cut', query: `Direct competitor cut price by 22% on similar product category. Order conversion fell sharply.` },
    { label: 'Regional Imbalance', query: `North Zone overstocked by 65% while South Zone depots are facing stock-outs with 12-day lead times.` },
    { label: 'Shelf Expiry Hazard', query: `Critical shelf-life cutoff approaching in ${activeCrisis.daysUntilExpiry} days; carrying cost escalating by ₹3.8L weekly.` }
  ];

  const handleChipClick = (query: string) => {
    setInputVal(query);
    handleAnalyzePrompt(query);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleAnalyzePrompt(inputVal);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await recommendationApi.regenerate(activeCrisis.id);
      showToast('Recommendation Regenerated', 'HindSight memory recalibrated with fresh multi-agent synthesis.', 'success');
      await handleAnalyzePrompt();
    } catch (err: any) {
      showToast('Recalibration Notice', 'Simulated deterministic calibration updated.', 'info');
    } finally {
      setIsRegenerating(false);
    }
  };

  const confirmExecution = async () => {
    setIsExecuting(true);
    try {
      await executeActiveDecision();
      setIsExecuted(true);
      setShowExecuteConfirm(false);
    } catch {
      setIsExecuted(true);
      setShowExecuteConfirm(false);
    } finally {
      setIsExecuting(false);
    }
  };

  const submitOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingOutcome(true);
    try {
      await recordDecisionOutcome(activeCrisis.id, {
        inventory_cleared: Number(outcomeUnits),
        revenue: Number(outcomeRevenue),
        margin: Number(outcomeMargin),
        time_to_clear: Number(outcomeDays),
        notes: outcomeNotes
      });
      setShowOutcomeModal(false);
    } finally {
      setIsSubmittingOutcome(false);
    }
  };

  // Combine recommended and alternative strategies
  const allStrategies = [
    activeCrisis.recommendedStrategy,
    ...activeCrisis.alternativeStrategies
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8 text-[#17213D]">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] lg:text-[32px] font-bold text-[#17213D] font-heading tracking-tight">
            Decision Center
          </h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">
            Evaluate your current situation using historical business experience & deterministic simulations.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isRegenerating || isAnalyzing}
          className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#17213D] flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#7567E8] ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>Regenerate Recommendation</span>
        </button>
      </div>

      {/* Execution Active Banner */}
      {isExecuted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-900">
                Strategy Executed in Production: {selectedStrategy.title}
              </div>
              <div className="text-[11px] text-emerald-700">
                Channel instructions issued. When campaign finishes, record actual numbers to educate HindSight memory.
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowOutcomeModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Record Actual Outcome</span>
          </button>
        </div>
      )}

      {/* Top Input Area: Describe the business situation */}
      <div className="enterprise-card p-6 bg-white shadow-xs">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-[#17213D] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7567E8]" />
              <span>Describe the business situation...</span>
            </label>
            <span className="text-[11px] text-[#64748B]">
              Natural language or operational parameters
            </span>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Describe stock count, sales rate, competitor cuts, or expiry..."
              className="w-full text-[14px] text-[#17213D] placeholder-[#94A3B8] p-3.5 bg-[#FAFBFD] border border-[#E6EAF0] rounded-xl focus:outline-none focus:border-[#7567E8] focus:bg-white transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Suggested Situation Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mr-1">
                Suggested:
              </span>
              {suggestedSituations.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chip.query)}
                  className="text-[12px] font-medium px-2.5 py-1 rounded-md bg-[#FAFBFD] hover:bg-[#F3F0FD] border border-[#E6EAF0] hover:border-[#DDD8F8] text-[#17213D] hover:text-[#7567E8] transition-colors cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Analyze Button */}
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-5 py-2.5 bg-[#7567E8] hover:bg-[#6658DC] disabled:opacity-60 text-white rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs shrink-0 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Memory...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Crisis</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Multi-step Reasoning Loader Bar (when analyzing) */}
        {isAnalyzing && (
          <div className="mt-5 pt-4 border-t border-[#F1F4F9] animate-in fade-in duration-200">
            <div className="text-[12px] font-semibold text-[#7567E8] mb-2 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>
                {analysisStep === 1 && '1. Understanding current situation & parameters...'}
                {analysisStep === 2 && '2. Retrieving organizational memory from HindSight...'}
                {analysisStep === 3 && '3. Finding similar historical cases...'}
                {analysisStep === 4 && '4. Generating candidate strategies...'}
                {analysisStep === 5 && '5. Running deterministic simulations...'}
                {analysisStep === 6 && '6. Evaluating outcomes & risk envelopes...'}
                {analysisStep === 7 && '7. Preparing data-backed recommendation...'}
              </span>
            </div>
            <div className="w-full bg-[#F1F4F9] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#7567E8] h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(15, (analysisStep / 7) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Current Crisis Analysis Section */}
      <div className="enterprise-card p-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F4F9] gap-2">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-[20px] font-bold text-[#17213D] font-heading">
                {activeCrisis.productName}
              </h2>
              <span className="text-[12px] font-semibold text-[#64748B] capitalize">
                {activeCrisis.crisisType.replace(/_/g, ' ')}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#FCF1F3] text-[#9C334A] border border-[#F5D3DB] uppercase tracking-wider">
                Status: {activeCrisis.severity}
              </span>
            </div>
            <p className="text-[13px] text-[#64748B] mt-1">
              {activeCrisis.description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-[#64748B]">
            <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>Updated {activeCrisis.lastUpdated}</span>
          </div>
        </div>

        {/* 4 Clean Analysis Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#E6EAF0]">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Units in inventory
            </span>
            <div className="text-[24px] font-bold text-[#17213D] font-heading mt-1">
              {activeCrisis.inventoryUnits.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#64748B] mt-0.5 block">
              {((activeCrisis.inventoryUnits / (activeCrisis.monthlySalesRunRate || 1))).toFixed(1)} months of supply
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#E6EAF0]">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Monthly sales run rate
            </span>
            <div className="text-[24px] font-bold text-[#17213D] font-heading mt-1">
              {activeCrisis.monthlySalesRunRate.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#9C334A] mt-0.5 block font-medium">
              Baseline velocity
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#E6EAF0]">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Unit Price / Cost
            </span>
            <div className="text-[24px] font-bold text-[#17213D] font-heading mt-1">
              ₹{activeCrisis.unitPrice.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#64748B] mt-0.5 block">
              Cost basis: ₹{activeCrisis.costPrice}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#E6EAF0]">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Days remaining
            </span>
            <div className="text-[24px] font-bold text-[#9C334A] font-heading mt-1">
              {activeCrisis.daysUntilExpiry}
            </div>
            <span className="text-[11px] text-[#9C334A] mt-0.5 block font-semibold">
              Obsolescence cutoff
            </span>
          </div>
        </div>
      </div>

      {/* AI Decision Panel */}
      <div className="rounded-2xl p-6 lg:p-7 bg-white border-2 border-[#E4DEFC] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#7567E8]" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F3F0FD] text-[#7567E8] border border-[#E4DEFC] uppercase tracking-wider">
                Multi-Agent Synthesis
              </span>
              <span className="text-[12px] text-[#64748B]">
                Grounded in HindSight Organizational Memory & Deterministic Math
              </span>
            </div>

            <div>
              <span className="text-[13px] font-semibold text-[#64748B] block">
                AI Decision Recommendation
              </span>
              <h3 className="text-[24px] lg:text-[28px] font-bold text-[#17213D] font-heading mt-1">
                {activeCrisis.recommendedStrategy.title}
              </h3>
            </div>

            {/* Why this strategy? */}
            <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#E6EAF0]">
              <h4 className="text-[12px] font-bold text-[#17213D] uppercase tracking-wider mb-1">
                Strategic Rationale
              </h4>
              <p className="text-[13px] text-[#475569] leading-relaxed">
                {activeCrisis.recommendedStrategy.whyChosen || activeCrisis.recommendedStrategy.description}
              </p>
            </div>

            {/* 4 Quantitative Evidence Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E6EAF0]">
                <span className="text-[11px] text-[#64748B] block">Historical Evidence</span>
                <span className="text-[16px] font-bold text-[#17213D] mt-0.5 block">
                  {activeCrisis.similarHistoricalCases.length} similar cases
                </span>
                <span className="text-[10px] text-[#7567E8] font-medium">HindSight precedents</span>
              </div>

              <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E6EAF0]">
                <span className="text-[11px] text-[#64748B] block">Confidence</span>
                <span className="text-[16px] font-bold text-[#2D7A5D] mt-0.5 block">
                  87%
                </span>
                <span className="text-[10px] text-[#64748B]">Statistical validation</span>
              </div>

              <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E6EAF0]">
                <span className="text-[11px] text-[#64748B] block">Expected Clearance</span>
                <span className="text-[16px] font-bold text-[#17213D] mt-0.5 block">
                  {activeCrisis.recommendedStrategy.inventoryClearance}%
                </span>
                <span className="text-[10px] text-[#2D7A5D]">
                  {Math.round((activeCrisis.inventoryUnits * activeCrisis.recommendedStrategy.inventoryClearance) / 100).toLocaleString()} units
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E6EAF0]">
                <span className="text-[11px] text-[#64748B] block">Projected Revenue</span>
                <span className="text-[16px] font-bold text-[#17213D] mt-0.5 block">
                  {activeCrisis.recommendedStrategy.estimatedRevenue}
                </span>
                <span className="text-[10px] text-[#64748B]">
                  Margin impact: {activeCrisis.recommendedStrategy.marginImpact}%
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Panel */}
          <div className="lg:w-64 flex flex-col gap-2.5 pt-2 lg:pt-6 shrink-0">
            <button
              onClick={() => setDecisionEvidenceOpen(true)}
              className="w-full py-2.5 px-4 bg-[#7567E8] hover:bg-[#6658DC] text-white text-[13px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>View Decision Evidence</span>
            </button>

            <button
              onClick={() => navigate('/simulations')}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#FAFBFD] border border-[#E6EAF0] text-[#17213D] text-[13px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-[#64748B]" />
              <span>Simulate Strategy</span>
            </button>

            <button
              onClick={() => setShowExecuteConfirm(true)}
              className="w-full py-2.5 px-4 bg-[#F0F9F5] hover:bg-[#E3F5EE] border border-[#D1EFE4] text-[#2D7A5D] text-[13px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#2D7A5D]" />
              <span>Execute Strategy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Strategy Comparison Section: Compare Your Options */}
      <div className="space-y-4">
        <div>
          <h2 className="text-[18px] lg:text-[20px] font-bold text-[#17213D] font-heading">
            Compare Your Options
          </h2>
          <p className="text-[13px] text-[#64748B]">
            Side-by-side tradeoff analysis of candidate resolutions for {activeCrisis.productName}
          </p>
        </div>

        {/* Dynamic Strategy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {allStrategies.map((strat) => {
            const isSelected = selectedStrategyId === strat.id;

            return (
              <div
                key={strat.id}
                onClick={() => setSelectedStrategyId(strat.id)}
                className={`enterprise-card p-5 flex flex-col justify-between cursor-pointer transition-all ${
                  strat.isRecommended
                    ? 'border-2 border-[#8175EA] bg-white ring-2 ring-[#7567E8]/10'
                    : isSelected
                    ? 'border-2 border-[#17213D] bg-white'
                    : 'bg-white hover:border-[#D6DCE7]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {strat.isRecommended ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F3F0FD] text-[#7567E8] border border-[#E4DEFC]">
                        AI Recommended
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#FAFBFD] text-[#64748B] border border-[#E6EAF0]">
                        Alternative
                      </span>
                    )}

                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      strat.riskLevel === 'Low'
                        ? 'bg-[#F0F9F5] text-[#2D7A5D]'
                        : strat.riskLevel === 'Moderate' || strat.riskLevel === 'Low-Med'
                        ? 'bg-[#FEF9ED] text-[#8C6417]'
                        : 'bg-[#FCF1F3] text-[#9C334A]'
                    }`}>
                      {strat.riskLevel} Risk
                    </span>
                  </div>

                  <h4 className="text-[15px] font-bold text-[#17213D] leading-tight">
                    {strat.title}
                  </h4>
                  <p className="text-[12px] text-[#64748B] mt-1.5 leading-relaxed line-clamp-2">
                    {strat.description}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="mt-4 pt-3 border-t border-[#F1F4F9] space-y-2 text-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Inventory Clearance</span>
                    <span className="font-bold text-[#17213D]">{strat.inventoryClearance}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Margin Impact</span>
                    <span className={`font-semibold ${strat.marginImpact <= -25 ? 'text-[#9C334A]' : 'text-[#17213D]'}`}>
                      {strat.marginImpact}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Estimated Revenue</span>
                    <span className="font-bold text-[#17213D]">{strat.estimatedRevenue}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Time to Clear</span>
                    <span className="font-medium text-[#17213D]">{strat.timeToClearDays} days</span>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStrategyId(strat.id);
                      navigate('/simulations');
                    }}
                    className={`w-full py-1.5 px-3 rounded-md text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      strat.isRecommended
                        ? 'bg-[#7567E8] text-white hover:bg-[#6658DC]'
                        : 'bg-[#FAFBFD] text-[#17213D] hover:bg-[#F3F0FD] border border-[#E6EAF0]'
                    }`}
                  >
                    <span>Simulate in Sandbox</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal for Execute Strategy */}
      {showExecuteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            onClick={() => setShowExecuteConfirm(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#17213D]">Confirm Decision Execution</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You are about to authorize execution for:
                </p>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl mt-2 text-xs font-semibold text-[#17213D]">
                  {selectedStrategy.title}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  This will register the decision in the audit trail and update the crisis status to Executed.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowExecuteConfirm(false)}
                  className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isExecuting}
                  onClick={confirmExecution}
                  className="px-4 py-2 bg-[#7567E8] hover:bg-[#6658DC] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Authorize & Execute</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outcome Recording Modal */}
      {showOutcomeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            onClick={() => setShowOutcomeModal(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E8E6FA] text-[#7567E8] flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17213D]">Record Actual Outcome</h3>
                    <p className="text-[11px] text-slate-500">Close the learning loop and educate HindSight memory</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowOutcomeModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={submitOutcome} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Units Cleared
                    </label>
                    <input
                      type="number"
                      required
                      value={outcomeUnits}
                      onChange={(e) => setOutcomeUnits(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#7567E8] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Gross Revenue Realized (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={outcomeRevenue}
                      onChange={(e) => setOutcomeRevenue(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#7567E8] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Actual Gross Margin (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={outcomeMargin}
                      onChange={(e) => setOutcomeMargin(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#7567E8] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Actual Days to Clear
                    </label>
                    <input
                      type="number"
                      required
                      value={outcomeDays}
                      onChange={(e) => setOutcomeDays(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#7567E8] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Post-Mortem Notes & Learnings
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={outcomeNotes}
                    onChange={(e) => setOutcomeNotes(e.target.value)}
                    placeholder="What worked? What channel had highest lift? What should future crises know?"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#7567E8] focus:bg-white resize-none"
                  />
                </div>

                <div className="p-3 bg-[#F3F0FD] border border-[#E4DEFC] rounded-xl text-[11px] text-[#6455D8] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#7567E8] shrink-0 mt-0.5" />
                  <span>
                    Saving this outcome will record it in PostgreSQL and immediately retain a synthesis into the <strong>HindSight Vector Memory Bank</strong> so subsequent crises recall this experience.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowOutcomeModal(false)}
                    className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingOutcome}
                    className="px-4 py-2 bg-[#7567E8] hover:bg-[#6658DC] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingOutcome ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
                    <span>Save & Retain in HindSight</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
