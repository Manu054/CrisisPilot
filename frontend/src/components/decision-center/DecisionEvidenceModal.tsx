import React from 'react';
import { useCrisis } from '../../context/CrisisContext';
import { 
  X, 
  ArrowDown, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  Database, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

export const DecisionEvidenceModal: React.FC = () => {
  const { 
    decisionEvidenceOpen, 
    setDecisionEvidenceOpen, 
    activeCrisis,
    historicalCases,
    setSelectedCaseForModal,
    setDecisionMemoryModalOpen
  } = useCrisis();

  if (!decisionEvidenceOpen) return null;

  // Use similar historical cases from the active crisis if available, otherwise historicalCases
  const evidenceCases = (activeCrisis.similarHistoricalCases && activeCrisis.similarHistoricalCases.length > 0)
    ? activeCrisis.similarHistoricalCases
    : historicalCases;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={() => setDecisionEvidenceOpen(false)}
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E6EAF0] overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E6EAF0] flex items-center justify-between bg-white shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F3F0FD] text-[#7567E8] border border-[#E4DEFC]">
                  HindSight Organizational Memory
                </span>
                <span className="text-[12px] text-[#64748B]">
                  Confidence Score: 87%
                </span>
              </div>
              <h2 className="text-[20px] font-bold text-[#17213D] font-heading mt-1">
                Why CrisisPilot Recommends This
              </h2>
              <p className="text-[13px] text-[#64748B]">
                Full evidence provenance for: {activeCrisis.recommendedStrategy.title}
              </p>
            </div>
            <button
              onClick={() => setDecisionEvidenceOpen(false)}
              className="w-8 h-8 rounded-lg border border-[#E6EAF0] text-[#64748B] hover:text-[#17213D] hover:bg-[#F8FAFC] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFBFD]">
            {/* Structured Evidence Timeline Flow */}
            <div className="enterprise-card p-5 bg-white">
              <h3 className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider mb-4">
                Decision Reasoning Chain
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-6 gap-2 relative">
                <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0] text-center">
                  <div className="text-[10px] font-bold text-[#7567E8] uppercase">Step 1</div>
                  <div className="text-[12px] font-bold text-[#17213D] mt-1">Situation</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">{activeCrisis.inventoryUnits.toLocaleString()} units, {activeCrisis.daysUntilExpiry}d runway</div>
                </div>

                <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0] text-center">
                  <div className="text-[10px] font-bold text-[#7567E8] uppercase">Step 2</div>
                  <div className="text-[12px] font-bold text-[#17213D] mt-1">Memory Recall</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">Retrieved {evidenceCases.length} precedents</div>
                </div>

                <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0] text-center">
                  <div className="text-[10px] font-bold text-[#7567E8] uppercase">Step 3</div>
                  <div className="text-[12px] font-bold text-[#17213D] mt-1">Past Outcomes</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">High bundle lift</div>
                </div>

                <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0] text-center">
                  <div className="text-[10px] font-bold text-[#7567E8] uppercase">Step 4</div>
                  <div className="text-[12px] font-bold text-[#17213D] mt-1">Simulations</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">Evaluated 4 options</div>
                </div>

                <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0] text-center">
                  <div className="text-[10px] font-bold text-[#7567E8] uppercase">Step 5</div>
                  <div className="text-[12px] font-bold text-[#17213D] mt-1">Synthesis</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">Balance clearance/margin</div>
                </div>

                <div className="p-3 rounded-lg bg-[#F3F0FD] border border-[#DDD8F8] text-center">
                  <div className="text-[10px] font-bold text-[#7567E8] uppercase">Recommendation</div>
                  <div className="text-[12px] font-bold text-[#7567E8] mt-1">{activeCrisis.recommendedStrategy.inventoryClearance}% Clearance</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">{activeCrisis.recommendedStrategy.estimatedRevenue}</div>
                </div>
              </div>
            </div>

            {/* Historical Cases Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-bold text-[#17213D] font-heading">
                  Analyzed Historical Cases ({evidenceCases.length} Supporting Cases)
                </h3>
                <span className="text-[12px] text-[#64748B]">Click any case to inspect detailed post-mortem</span>
              </div>

              {evidenceCases.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                  No sufficiently similar historical cases were found.
                </div>
              ) : (
                <div className="space-y-3">
                  {evidenceCases.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedCaseForModal(c);
                        setDecisionMemoryModalOpen(true);
                      }}
                      className="p-4 rounded-xl bg-white border border-[#E6EAF0] hover:border-[#8175EA] transition-all cursor-pointer shadow-xs group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#F1F4F9]">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FAFBFD] border border-[#E6EAF0] text-[#17213D] font-semibold">
                            Case #{c.caseNumber}
                          </span>
                          <span className="text-[12px] text-[#64748B] font-medium">{c.date}</span>
                          <span className="text-[13px] font-bold text-[#17213D]">{c.title}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#64748B]">Match:</span>
                          <span className="text-[11px] font-bold text-[#7567E8] bg-[#F3F0FD] px-2 py-0.5 rounded border border-[#E4DEFC]">
                            {c.similarityScore}%
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            c.status === 'Successful'
                              ? 'bg-[#F0F9F5] text-[#2D7A5D] border border-[#D1EFE4]'
                              : c.status === 'Partial Success'
                              ? 'bg-[#FEF9ED] text-[#8C6417] border border-[#F8ECC7]'
                              : 'bg-[#FCF1F3] text-[#9C334A] border border-[#F5D3DB]'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                      </div>

                      {/* Case Metrics Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3 text-[12px]">
                        <div>
                          <span className="text-[#94A3B8] block text-[11px]">Problem</span>
                          <span className="text-[#17213D] font-medium line-clamp-1">{c.problem}</span>
                        </div>
                        <div>
                          <span className="text-[#94A3B8] block text-[11px]">Decision Taken</span>
                          <span className="text-[#17213D] font-medium line-clamp-1">{c.decisionTaken}</span>
                        </div>
                        <div>
                          <span className="text-[#94A3B8] block text-[11px]">Outcome</span>
                          <span className="text-[#17213D] font-semibold">{c.outcomeMetric}</span>
                        </div>
                        <div>
                          <span className="text-[#94A3B8] block text-[11px]">Financial Impact</span>
                          <span className="text-[#2D7A5D] font-medium">{c.marginImpact} margin impact</span>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-[#F8FAFC] flex items-center justify-between text-[11px] text-[#64748B]">
                        <span className="italic line-clamp-1">Lesson: {c.lessonLearned}</span>
                        <span className="text-[#7567E8] font-semibold group-hover:underline shrink-0 ml-2">
                          Inspect Post-Mortem &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#E6EAF0] bg-white flex items-center justify-between shrink-0">
            <span className="text-[12px] text-[#64748B]">
              Every CrisisPilot recommendation is backed by demonstrable historical precedent in HindSight.
            </span>
            <button
              onClick={() => setDecisionEvidenceOpen(false)}
              className="px-4 py-2 bg-[#7567E8] hover:bg-[#6658DC] text-white text-[13px] font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Done Reviewing Evidence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
