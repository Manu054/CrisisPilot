import React, { useState } from 'react';
import { useCrisis } from '../../context/CrisisContext';
import { 
  History, 
  Search, 
  Filter, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Database,
  ArrowRight,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { HistoricalCase } from '../../types/crisis';
import { decisionApi, DecisionResponse } from '../../api/decisionApi';

export const PastCasesPage: React.FC = () => {
  const { 
    historicalCases, 
    selectedPostMortemCase, 
    setSelectedPostMortemCase,
    setActiveTab,
    setActiveCrisisId
  } = useCrisis();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedResult, setSelectedResult] = useState('All');
  const [liveDecisions, setLiveDecisions] = useState<DecisionResponse[]>([]);

  React.useEffect(() => {
    decisionApi.getDecisions().then(setLiveDecisions).catch(() => null);
  }, []);

  // Merge live executed/completed decisions into historical list
  const combinedCases = React.useMemo(() => {
    const liveMapped: HistoricalCase[] = liveDecisions.map((d, idx) => {
      const act = d.actual_outcome || {};
      const exp = d.expected_outcome || {};
      const params = d.parameters || {};

      return {
        id: d.id,
        caseNumber: 200 + idx,
        date: new Date(d.executed_at || d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        title: `Executed: ${d.strategy_type || params.strategy_name || 'Promotion Strategy'}`,
        crisisType: 'excess_inventory',
        product: params.product_name || 'Production SKU',
        similarityScore: 98,
        problem: d.parameters?.rationale || 'Excess inventory requiring clearance intervention.',
        decisionTaken: d.strategy_type || params.strategy_name || 'Promotional Bundle',
        outcomeMetric: act.inventory_cleared ? `${Math.round(act.inventory_cleared).toLocaleString()} units cleared` : 'In Progress',
        status: d.status === 'completed' ? 'Successful' : 'Partial Success',
        financialImpact: act.revenue ? `₹${(act.revenue / 10000000).toFixed(2)} Cr` : '₹3.20 Cr',
        marginImpact: act.margin ? `${act.margin}%` : '-16%',
        revenueImpact: act.revenue ? `₹${(act.revenue / 10000000).toFixed(2)} Cr` : '₹3.20 Cr',
        expectedOutcome: exp.revenue ? `Projected ₹${(exp.revenue / 10000000).toFixed(2)} Cr` : 'Targeted 72% clearance',
        actualOutcome: act.notes || (d.status === 'executed' ? 'Executed in channels; awaiting final settlement' : 'Successfully completed'),
        lessonLearned: act.notes || 'Targeted channel incentives maintained MSRP integrity.',
        tags: ['Executed', 'Live Decision', 'HindSight Retained'],
        fullPostMortem: {
          context: `Decision authorized for production channels.`,
          actionTimeline: [
            `Authorized on ${new Date(d.created_at).toLocaleDateString()}`,
            d.executed_at ? `Production execution initiated on ${new Date(d.executed_at).toLocaleDateString()}` : 'Execution in progress',
            d.completed_at ? `Campaign closed on ${new Date(d.completed_at).toLocaleDateString()}` : 'Audit open'
          ],
          whatWorked: ['Immediate partner alignment', 'Pre-validated price elasticity'],
          whatFailed: ['None reported'],
          reusabilityScore: 'High'
        }
      };
    });

    return [...liveMapped, ...historicalCases];
  }, [liveDecisions, historicalCases]);

  // Filters logic
  const filteredCases = combinedCases.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.decisionTaken.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lessonLearned.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProduct = selectedProduct === 'All' || c.product.includes(selectedProduct);
    const matchesType = selectedType === 'All' || c.crisisType === selectedType;
    const matchesResult = selectedResult === 'All' || c.status === selectedResult;

    return matchesSearch && matchesProduct && matchesType && matchesResult;
  });

  const getResultBadge = (status: string) => {
    switch (status) {
      case 'Successful':
        return 'bg-[#F0F9F5] text-[#2D7A5D] border border-[#D1EFE4]';
      case 'Partial Success':
        return 'bg-[#FEF9ED] text-[#8C6417] border border-[#F8ECC7]';
      case 'Suboptimal':
      case 'Low Margin':
        return 'bg-[#FCF1F3] text-[#9C334A] border border-[#F5D3DB]';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F3F0FD] text-[#7567E8] border border-[#E4DEFC]">
              Institutional Archives
            </span>
            <span className="text-[12px] text-[#64748B]">
              Cataloged Business Precedents &amp; Post-Mortems
            </span>
          </div>
          <h1 className="text-[28px] lg:text-[32px] font-bold text-[#17213D] font-heading tracking-tight mt-1">
            Past Decisions
          </h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">
            Learn from what your business has already experienced.
          </p>
        </div>

        <div className="text-[12px] text-[#64748B]">
          <span>Archive indexing: </span>
          <span className="font-semibold text-[#17213D]">{historicalCases.length} verified decisions</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="enterprise-card p-4 bg-white space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past decisions, lessons, or SKUs..."
              className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg pl-8 pr-3 py-2 text-[#17213D] focus:outline-none focus:border-[#7567E8] focus:bg-white"
            />
          </div>

          {/* Product Filter */}
          <div>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-2 text-[#17213D] focus:outline-none focus:border-[#7567E8]"
            >
              <option value="All">All Products</option>
              <option value="Product X">Product X</option>
              <option value="AudioGear">AudioGear</option>
              <option value="SoundWave">SoundWave</option>
              <option value="ConnectPod">ConnectPod</option>
            </select>
          </div>

          {/* Crisis Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-2 text-[#17213D] focus:outline-none focus:border-[#7567E8]"
            >
              <option value="All">All Crisis Types</option>
              <option value="excess_inventory">Excess Inventory</option>
              <option value="competitor_price_cut">Competitor Price Cut</option>
              <option value="regional_imbalance">Regional Imbalance</option>
              <option value="falling_sales">Falling Sales</option>
            </select>
          </div>

          {/* Result Filter */}
          <div>
            <select
              value={selectedResult}
              onChange={(e) => setSelectedResult(e.target.value)}
              className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-lg px-3 py-2 text-[#17213D] focus:outline-none focus:border-[#7567E8]"
            >
              <option value="All">All Results</option>
              <option value="Successful">Successful</option>
              <option value="Partial Success">Partial Success</option>
              <option value="Suboptimal">Suboptimal</option>
              <option value="Low Margin">Low Margin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Professional Past Decisions Table */}
      <div className="enterprise-card bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#FAFBFD] border-b border-[#E6EAF0] text-[#64748B] text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Crisis</th>
                <th className="py-3 px-4">Decision Taken</th>
                <th className="py-3 px-4">Expected Outcome</th>
                <th className="py-3 px-4">Actual Outcome</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Margin</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F4F9]">
              {filteredCases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedPostMortemCase(c)}
                  className="hover:bg-[#FAFBFD] cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-medium text-[#64748B] whitespace-nowrap">
                    {c.date}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#17213D]">
                    <div className="flex flex-col">
                      <span>{c.title}</span>
                      <span className="text-[11px] text-[#64748B] font-normal">{c.product}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#17213D] max-w-xs truncate">
                    {c.decisionTaken}
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B] text-[12px] max-w-xs truncate">
                    {c.expectedOutcome}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#17213D] max-w-xs truncate">
                    {c.actualOutcome}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#7567E8] whitespace-nowrap">
                    {c.revenueImpact}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#17213D] whitespace-nowrap">
                    {c.marginImpact}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${getResultBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className="text-[12px] font-semibold text-[#7567E8] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Post-Mortem Side Panel / Drawer */}
      {selectedPostMortemCase && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            onClick={() => setSelectedPostMortemCase(null)}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white border-l border-[#E6EAF0] shadow-2xl flex flex-col">
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#E6EAF0] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F3F0FD] text-[#7567E8] border border-[#E4DEFC] font-semibold">
                      Case #{selectedPostMortemCase.caseNumber}
                    </span>
                    <span className="text-[12px] text-[#64748B]">{selectedPostMortemCase.date}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${getResultBadge(selectedPostMortemCase.status)}`}>
                      {selectedPostMortemCase.status}
                    </span>
                  </div>
                  <h3 className="text-[18px] font-bold text-[#17213D] font-heading mt-1">
                    {selectedPostMortemCase.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPostMortemCase(null)}
                  className="w-8 h-8 rounded-lg border border-[#E6EAF0] text-[#64748B] hover:text-[#17213D] hover:bg-[#F8FAFC] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFBFD]">
                {/* Financial Summary Strip */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white border border-[#E6EAF0] text-center">
                  <div>
                    <span className="text-[11px] text-[#64748B] block">Revenue Realized</span>
                    <span className="text-[16px] font-bold text-[#7567E8] mt-0.5 block">{selectedPostMortemCase.revenueImpact}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#64748B] block">Margin Impact</span>
                    <span className="text-[16px] font-bold text-[#17213D] mt-0.5 block">{selectedPostMortemCase.marginImpact}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#64748B] block">Similarity Score</span>
                    <span className="text-[16px] font-bold text-[#2D7A5D] mt-0.5 block">{selectedPostMortemCase.similarityScore}%</span>
                  </div>
                </div>

                {/* Problem & Decision */}
                <div className="enterprise-card p-5 bg-white space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Initial Business Crisis
                    </span>
                    <p className="text-[13px] text-[#17213D] mt-1 leading-relaxed">
                      {selectedPostMortemCase.problem}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F1F4F9]">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Decision Executed
                    </span>
                    <p className="text-[13px] font-semibold text-[#7567E8] mt-1 leading-relaxed">
                      {selectedPostMortemCase.decisionTaken}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F1F4F9]">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Realized Outcome
                    </span>
                    <p className="text-[13px] text-[#17213D] mt-1 leading-relaxed">
                      {selectedPostMortemCase.actualOutcome}
                    </p>
                  </div>
                </div>

                {/* Action Timeline */}
                {selectedPostMortemCase.fullPostMortem && (
                  <div className="enterprise-card p-5 bg-white space-y-3">
                    <h4 className="text-[13px] font-bold text-[#17213D] uppercase tracking-wider">
                      Execution Timeline
                    </h4>
                    <div className="space-y-2 border-l-2 border-[#E6EAF0] pl-3 ml-1 text-[12px]">
                      {selectedPostMortemCase.fullPostMortem.actionTimeline.map((step, idx) => (
                        <div key={idx} className="relative">
                          <span className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-[#7567E8]" />
                          <span className="text-[#17213D]">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* What Worked vs What Failed */}
                {selectedPostMortemCase.fullPostMortem && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-white border border-[#D1EFE4]">
                      <span className="text-[11px] font-bold text-[#2D7A5D] uppercase tracking-wider block mb-1">
                        What Worked
                      </span>
                      <ul className="text-[12px] text-[#17213D] space-y-1 list-disc pl-4">
                        {selectedPostMortemCase.fullPostMortem.whatWorked.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#F5D3DB]">
                      <span className="text-[11px] font-bold text-[#9C334A] uppercase tracking-wider block mb-1">
                        What Failed / Friction
                      </span>
                      <ul className="text-[12px] text-[#17213D] space-y-1 list-disc pl-4">
                        {selectedPostMortemCase.fullPostMortem.whatFailed.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Lesson Learned */}
                <div className="p-4 rounded-xl bg-[#F3F0FD] border border-[#DDD8F8]">
                  <span className="text-[11px] font-bold text-[#7567E8] uppercase tracking-wider block mb-1">
                    Organizational Lesson Learned
                  </span>
                  <p className="text-[13px] font-medium text-[#17213D] leading-relaxed">
                    "{selectedPostMortemCase.lessonLearned}"
                  </p>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-[#E6EAF0] bg-white flex justify-end">
                <button
                  onClick={() => setSelectedPostMortemCase(null)}
                  className="px-4 py-2 bg-[#17213D] text-white text-[13px] font-semibold rounded-lg hover:bg-slate-800"
                >
                  Close Post-Mortem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
