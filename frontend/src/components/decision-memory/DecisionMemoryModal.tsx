import React from 'react';
import { useCrisis } from '../../context/CrisisContext';
import { X, Database, ArrowDown, CheckCircle, ShieldAlert, ChevronRight } from 'lucide-react';

export const DecisionMemoryModal: React.FC = () => {
  const { 
    decisionMemoryModalOpen, 
    setDecisionMemoryModalOpen, 
    activeCrisis, 
    historicalCases,
    selectedCaseForModal,
    setSelectedCaseForModal 
  } = useCrisis();

  if (!decisionMemoryModalOpen) return null;

  const displayCase = selectedCaseForModal || historicalCases[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={() => setDecisionMemoryModalOpen(false)}
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E6EAF0] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[#E6EAF0]">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-[#F3F0FD] text-[#7567E8]">
                  <Database className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-bold text-[#7567E8] uppercase tracking-wider">
                  HindSight Memory Inspector
                </span>
              </div>
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[#17213D] font-heading mt-1">
                Case Precedent #{displayCase.caseNumber}: {displayCase.title}
              </h2>
              <p className="text-[12px] text-[#64748B]">
                Recorded {displayCase.date} · Similarity congruent match: {displayCase.similarityScore}%
              </p>
            </div>
            <button
              onClick={() => setDecisionMemoryModalOpen(false)}
              className="w-8 h-8 rounded-lg border border-[#E6EAF0] text-[#64748B] hover:text-[#17213D] hover:bg-[#F8FAFC] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Case Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[12px]">
            <span className="text-[#64748B] font-medium shrink-0">Switch Case:</span>
            {historicalCases.slice(0, 6).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseForModal(c)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium transition-colors border ${
                  displayCase.id === c.id
                    ? 'bg-[#F3F0FD] text-[#7567E8] border-[#DDD8F8] font-semibold'
                    : 'bg-[#FAFBFD] text-[#17213D] border-[#E6EAF0] hover:bg-white'
                }`}
              >
                Case #{c.caseNumber} ({c.date})
              </button>
            ))}
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[12px]">
            <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0]">
              <span className="text-[#64748B] block text-[11px]">Product Line</span>
              <span className="text-[14px] font-bold text-[#17213D] mt-0.5 block truncate">{displayCase.product}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0]">
              <span className="text-[#64748B] block text-[11px]">Clearance Outcome</span>
              <span className="text-[14px] font-bold text-[#2D7A5D] mt-0.5 block">{displayCase.outcomeMetric}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0]">
              <span className="text-[#64748B] block text-[11px]">Margin Variance</span>
              <span className="text-[14px] font-bold text-[#17213D] mt-0.5 block">{displayCase.marginImpact}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0]">
              <span className="text-[#64748B] block text-[11px]">Result Audit</span>
              <span className={`text-[12px] font-bold mt-1 inline-block px-2 py-0.5 rounded ${
                displayCase.status === 'Successful'
                  ? 'bg-[#F0F9F5] text-[#2D7A5D]'
                  : 'bg-[#FEF9ED] text-[#8C6417]'
              }`}>
                {displayCase.status}
              </span>
            </div>
          </div>

          {/* Context, Decision & Outcome */}
          <div className="enterprise-card p-5 bg-white space-y-4">
            <div>
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                Historical Context &amp; Initial Problem
              </span>
              <p className="text-[13px] text-[#17213D] mt-1 leading-relaxed">
                {displayCase.problem}
              </p>
            </div>

            <div className="pt-3 border-t border-[#F1F4F9]">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                Decision Implemented
              </span>
              <p className="text-[13px] font-semibold text-[#7567E8] mt-1 leading-relaxed">
                {displayCase.decisionTaken}
              </p>
            </div>

            <div className="pt-3 border-t border-[#F1F4F9]">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                Financial Impact
              </span>
              <p className="text-[13px] text-[#17213D] mt-1 leading-relaxed">
                {displayCase.financialImpact}
              </p>
            </div>
          </div>

          {/* Post Mortem Timeline */}
          {displayCase.fullPostMortem && (
            <div className="space-y-3">
              <h4 className="text-[13px] font-bold text-[#17213D] uppercase tracking-wider">
                Execution Milestones
              </h4>
              <div className="space-y-1.5 border-l-2 border-[#E6EAF0] pl-3 text-[12px]">
                {displayCase.fullPostMortem.actionTimeline.map((step, idx) => (
                  <div key={idx} className="text-[#475569] leading-relaxed">
                    • {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lesson Learned */}
          <div className="p-4 rounded-xl bg-[#F3F0FD] border border-[#DDD8F8]">
            <span className="text-[11px] font-bold text-[#7567E8] uppercase tracking-wider block mb-1">
              Generalizable Lesson Learned
            </span>
            <p className="text-[13px] font-medium text-[#17213D] leading-relaxed">
              "{displayCase.lessonLearned}"
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-2 border-t border-[#E6EAF0]">
            <button
              onClick={() => setDecisionMemoryModalOpen(false)}
              className="px-4 py-2 bg-[#7567E8] hover:bg-[#6658DC] text-white text-[13px] font-semibold rounded-lg transition-colors"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
