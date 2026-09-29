import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrisis } from '../../context/CrisisContext';
import { memoryApi } from '../../api/memoryApi';
import { 
  Brain, 
  Database, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Search,
  Filter,
  Layers,
  Sparkles,
  History,
  Plus,
  Loader2,
  X
} from 'lucide-react';
import { OrganizationalMemoryItem } from '../../types/crisis';

export const OrganizationalMemoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    organizationalMemories, 
    historicalCases, 
    setSelectedCaseForModal, 
    setDecisionMemoryModalOpen,
    showToast
  } = useCrisis();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedMemory, setSelectedMemory] = useState<OrganizationalMemoryItem | null>(null);

  // Manual retain state
  const [showRetainModal, setShowRetainModal] = useState(false);
  const [retainContent, setRetainContent] = useState('');
  const [retainTag, setRetainTag] = useState('Pricing Rule');
  const [isRetaining, setIsRetaining] = useState(false);

  // Semantic search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  const categories = [
    'All',
    'Pricing & Bundling',
    'Inventory Allocation',
    'Margin Protection',
    'Channel Strategy'
  ];

  const handleSemanticSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchFilter.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const res = await memoryApi.search(searchFilter);
      setSearchResults(res.memories || []);
      showToast('HindSight Recall Complete', `Retrieved ${res.memories?.length || 0} semantic memories.`, 'info');
    } catch {
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRetainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!retainContent.trim()) return;

    setIsRetaining(true);
    try {
      await memoryApi.retain({
        content: retainContent,
        tags: [retainTag, 'Manual Entry'],
      });
      showToast('Memory Retained', 'Stored lesson in HindSight organization memory bank.', 'success');
      setRetainContent('');
      setShowRetainModal(false);
    } catch (err: any) {
      showToast('Retain Failed', err?.message || 'Could not retain in HindSight.', 'error');
    } finally {
      setIsRetaining(false);
    }
  };

  const filteredMemories = organizationalMemories.filter((mem) => {
    const matchesCategory = selectedCategory === 'All' || mem.category === selectedCategory;
    const matchesSearch = 
      mem.statement.toLowerCase().includes(searchFilter.toLowerCase()) ||
      mem.ruleSummary.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8 text-[#17213D]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F3F0FD] text-[#7567E8] border border-[#E4DEFC]">
              HindSight Engine
            </span>
            <span className="text-[12px] text-[#64748B]">
              Continuous Organizational Learning
            </span>
          </div>
          <h1 className="text-[28px] lg:text-[32px] font-bold text-[#17213D] font-heading tracking-tight mt-1">
            Organizational Memory
          </h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">
            What CrisisPilot has learned from past decisions, real-world outcomes, and financial post-mortems.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowRetainModal(true)}
            className="px-4 py-2 bg-[#7567E8] hover:bg-[#6658DC] text-white text-[13px] font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Retain Memory</span>
          </button>

          <button
            onClick={() => navigate('/past-decisions')}
            className="px-4 py-2 bg-white hover:bg-[#FAFBFD] border border-[#E6EAF0] text-[#17213D] text-[13px] font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <History className="w-4 h-4 text-[#7567E8]" />
            <span>Browse Past Decisions</span>
          </button>
        </div>
      </div>

      {/* Core Product Loop Visualizer */}
      <div className="enterprise-card p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-bold text-[#17213D] font-heading">
              The CrisisPilot Continuous Learning Loop
            </h3>
            <p className="text-[12px] text-[#64748B]">
              How historical experience informs present crises and refines organizational knowledge
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#7567E8] bg-[#F3F0FD] px-2 py-0.5 rounded border border-[#E4DEFC]">
            HindSight Multi-Tenant Bank Active
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 relative">
          {[
            { step: '01', title: 'PAST DECISIONS', sub: 'Cataloged actions' },
            { step: '02', title: 'OUTCOMES', sub: 'Revenue & margin results' },
            { step: '03', title: 'HINDSIGHT RECALL', sub: 'Semantic vector lookup' },
            { step: '04', title: 'CURRENT CRISIS', sub: 'Live sales/stock friction' },
            { step: '05', title: 'SIMULATIONS', sub: 'Deterministic models' },
            { step: '06', title: 'RECOMMENDATION', sub: 'Confidence-scored plan' },
            { step: '07', title: 'EXECUTION', sub: 'Production rollout' },
            { step: '08', title: 'RETAIN MEMORY', sub: 'Permanent learning' },
          ].map((item, idx) => (
            <div 
              key={idx}
              className={`p-3 rounded-lg border text-center relative flex flex-col justify-between ${
                idx === 2 || idx === 7
                  ? 'bg-[#F3F0FD] border-[#DDD8F8] text-[#7567E8]'
                  : 'bg-[#FAFBFD] border-[#E6EAF0] text-[#17213D]'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono font-bold block mb-1 opacity-70">
                  {item.step}
                </span>
                <span className="text-[11px] font-bold block leading-tight">
                  {item.title}
                </span>
              </div>
              <span className="text-[10px] text-[#64748B] block mt-1.5 leading-snug">
                {item.sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Semantic Memory Search Bar */}
      <form onSubmit={handleSemanticSearch} className="enterprise-card p-4 bg-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-3" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search HindSight organizational memory (e.g. 'discount elasticity', 'South region bundle')..."
              className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-xl pl-8 pr-3 py-2 text-[#17213D] focus:outline-none focus:border-[#7567E8] focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 bg-[#7567E8] hover:bg-[#6658DC] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Semantic Recall</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-[12px] font-medium px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#7567E8] text-white'
                  : 'bg-[#FAFBFD] hover:bg-[#F3F0FD] text-[#64748B] hover:text-[#17213D] border border-[#E6EAF0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </form>

      {/* Semantic Recall Results Banner (if active) */}
      {searchResults && (
        <div className="enterprise-card p-5 bg-white border border-[#E4DEFC] space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-[#7567E8] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7567E8]" />
              <span>HindSight Semantic Recall Results ({searchResults.length})</span>
            </h3>
            <button 
              onClick={() => setSearchResults(null)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear Results
            </button>
          </div>

          <div className="space-y-2">
            {searchResults.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No matching semantic memories found in HindSight bank.</p>
            ) : (
              searchResults.map((mem, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="font-semibold text-[#17213D]">{mem.text || mem.content}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Relevance Score: {mem.similarity ? `${Math.round(mem.similarity * 100)}%` : 'High'}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Memory Items Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] lg:text-[20px] font-bold text-[#17213D] font-heading">
            Active Learned Rules ({filteredMemories.length})
          </h2>
          <span className="text-[12px] text-[#64748B]">
            Validated empirical principles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMemories.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMemory(item)}
              className="enterprise-card p-5 bg-white flex flex-col justify-between hover:border-[#8175EA] transition-all cursor-pointer shadow-xs group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2.5">
                  <span className="font-semibold text-[#7567E8] bg-[#F3F0FD] px-2 py-0.5 rounded border border-[#E4DEFC]">
                    {item.category}
                  </span>
                  
                  <div className="flex items-center gap-2 text-[#64748B]">
                    <span>{item.evidenceCount} supporting cases</span>
                  </div>
                </div>

                <h3 className="text-[15px] font-bold text-[#17213D] font-heading leading-snug group-hover:text-[#6455D8] transition-colors">
                  "{item.statement}"
                </h3>

                <p className="text-[12px] text-[#64748B] mt-2 leading-relaxed">
                  {item.ruleSummary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F1F4F9] flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-[#94A3B8] text-[10px] uppercase font-semibold block">Confidence</span>
                    <span className="text-[#2D7A5D] font-bold">{item.confidence}%</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] text-[10px] uppercase font-semibold block">Impact</span>
                    <span className="text-[#17213D] font-semibold">{item.impactMetric}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#7567E8] font-medium group-hover:translate-x-0.5 transition-transform">
                  <span>Inspect Precedent</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retain Memory Modal */}
      {showRetainModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            onClick={() => setShowRetainModal(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E8E6FA] text-[#7567E8] flex items-center justify-center">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17213D]">Retain Institutional Memory</h3>
                    <p className="text-[11px] text-slate-500">Inject verified empirical experience directly into HindSight</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowRetainModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRetainSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Rule Category / Tag
                  </label>
                  <select
                    value={retainTag}
                    onChange={(e) => setRetainTag(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#7567E8] focus:bg-white"
                  >
                    <option value="Pricing Rule">Pricing Rule</option>
                    <option value="Inventory Strategy">Inventory Strategy</option>
                    <option value="Regional Arbitrage">Regional Arbitrage</option>
                    <option value="Channel Incentive">Channel Incentive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Lesson Statement / Synthesis
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={retainContent}
                    onChange={(e) => setRetainContent(e.target.value)}
                    placeholder="e.g. In Q3 audio accessories, bundling with fast-moving companion SKUs lifted sell-through by 35% without triggering partner margin degradation."
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#7567E8] focus:bg-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowRetainModal(false)}
                    className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRetaining}
                    className="px-4 py-2 bg-[#7567E8] hover:bg-[#6658DC] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isRetaining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5" />}
                    <span>Retain in HindSight Bank</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Selected Memory Inspector Side Panel / Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            onClick={() => setSelectedMemory(null)}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs transition-opacity"
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-[#E6EAF0] p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#7567E8] uppercase tracking-wider bg-[#F3F0FD] px-2 py-0.5 rounded border border-[#E4DEFC]">
                    {selectedMemory.category}
                  </span>
                  <h3 className="text-[18px] font-bold text-[#17213D] font-heading mt-2">
                    "{selectedMemory.statement}"
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="text-[#64748B] hover:text-[#17213D] p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#E6EAF0]">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                  Empirical Rule Formulation
                </span>
                <p className="text-[13px] text-[#17213D] leading-relaxed">
                  {selectedMemory.ruleSummary}
                </p>
              </div>

              <div>
                <span className="text-[12px] font-bold text-[#17213D] block mb-2">
                  Supporting Historical Precedents ({selectedMemory.supportingCases.length} Cases):
                </span>
                <div className="space-y-1.5">
                  {selectedMemory.supportingCases.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-white border border-[#E6EAF0] text-[12px] flex items-center justify-between"
                    >
                      <span className="font-semibold text-[#17213D]">{c}</span>
                      <span className="text-[11px] text-[#2D7A5D] font-medium">Outcome: Successful</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-[12px]">
                <div className="p-2.5 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0]">
                  <span className="text-[#64748B] block text-[11px]">Statistical Confidence</span>
                  <span className="text-[16px] font-bold text-[#2D7A5D]">{selectedMemory.confidence}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0]">
                  <span className="text-[#64748B] block text-[11px]">Last Observed</span>
                  <span className="text-[16px] font-bold text-[#17213D]">{selectedMemory.lastObserved}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0]">
                  <span className="text-[#64748B] block text-[11px]">Impact</span>
                  <span className="text-[16px] font-bold text-[#7567E8]">{selectedMemory.impactMetric}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="px-4 py-2 bg-[#7567E8] text-white text-[13px] font-semibold rounded-xl hover:bg-[#6658DC] cursor-pointer"
                >
                  Close Precedent View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
