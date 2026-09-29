import React, { useState } from 'react';
import { useCrisis } from '../../context/CrisisContext';
import { 
  TrendingUp, 
  MapPin, 
  Users, 
  Calendar, 
  Tag, 
  Boxes, 
  CheckCircle2, 
  Database,
  ArrowRight,
  Filter
} from 'lucide-react';
import { PatternInsight } from '../../types/crisis';

export const InsightsPage: React.FC = () => {
  const { 
    patternInsights, 
    historicalCases, 
    setSelectedCaseForModal, 
    setDecisionMemoryModalOpen 
  } = useCrisis();

  const [activeSection, setActiveSection] = useState<string>('All');

  const sections = [
    'All',
    'Pricing Patterns',
    'Inventory Patterns',
    'Regional Patterns',
    'Seasonal Patterns',
    'Customer Behavior'
  ];

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'Pricing Patterns':
        return <Tag className="w-4 h-4 text-[#7567E8]" />;
      case 'Inventory Patterns':
        return <Boxes className="w-4 h-4 text-[#2E62A6]" />;
      case 'Regional Patterns':
        return <MapPin className="w-4 h-4 text-[#2D7A5D]" />;
      case 'Seasonal Patterns':
        return <Calendar className="w-4 h-4 text-[#8C6417]" />;
      case 'Customer Behavior':
        return <Users className="w-4 h-4 text-[#9C334A]" />;
      default:
        return <TrendingUp className="w-4 h-4 text-[#7567E8]" />;
    }
  };

  const filteredInsights = patternInsights.filter(p => 
    activeSection === 'All' || p.section === activeSection
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F3F0FD] text-[#7567E8] border border-[#E4DEFC]">
            Machine Synthesis
          </span>
          <span className="text-[12px] text-[#64748B]">
            Automated Cross-Case Pattern Recognition
          </span>
        </div>
        <h1 className="text-[28px] lg:text-[32px] font-bold text-[#17213D] font-heading tracking-tight mt-1">
          Intelligent Decision Patterns
        </h1>
        <p className="text-[14px] text-[#64748B] mt-0.5">
          Empirical patterns discovered across multi-quarter sales crises, regional distributions, and consumer reactions.
        </p>
      </div>

      {/* Navigation Filter Tabs for the 5 Required Sections */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E6EAF0] pb-3">
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => setActiveSection(sec)}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-2 ${
              activeSection === sec
                ? 'bg-[#17213D] text-white shadow-xs'
                : 'bg-white border border-[#E6EAF0] text-[#64748B] hover:text-[#17213D] hover:bg-[#FAFBFD]'
            }`}
          >
            {sec !== 'All' && getSectionIcon(sec)}
            <span>{sec}</span>
          </button>
        ))}
      </div>

      {/* Pattern Cards by Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredInsights.map((insight) => (
          <div
            key={insight.id}
            className="enterprise-card p-6 bg-white flex flex-col justify-between hover:border-[#8175EA] transition-all shadow-xs"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#FAFBFD] border border-[#E6EAF0] text-[#17213D] flex items-center gap-1.5">
                  {getSectionIcon(insight.section)}
                  <span>{insight.section}</span>
                </span>
                
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-[#64748B]">{insight.sampleSize}</span>
                  <span className="text-[#2D7A5D] font-bold bg-[#F0F9F5] border border-[#D1EFE4] px-1.5 py-0.2 rounded">
                    {insight.confidence}% Confidence
                  </span>
                </div>
              </div>

              {/* Title & Core Observation */}
              <h3 className="text-[17px] font-bold text-[#17213D] font-heading leading-tight">
                {insight.title}
              </h3>
              
              <div className="p-3.5 rounded-xl bg-[#FAFBFD] border border-[#E6EAF0] my-3">
                <p className="text-[13px] font-semibold text-[#17213D] leading-relaxed">
                  "{insight.observation}"
                </p>
              </div>

              {/* Historical Evidence */}
              <div className="text-[12px] text-[#64748B] space-y-1">
                <span className="text-[11px] font-bold text-[#17213D] uppercase tracking-wider block">
                  Historical Grounding:
                </span>
                <p className="leading-relaxed text-[#475569]">
                  {insight.historicalEvidence}
                </p>
              </div>

              {/* Supporting Cases Chips */}
              <div className="mt-3.5">
                <span className="text-[11px] font-semibold text-[#64748B] block mb-1.5">
                  Supporting Historical Cases:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {insight.supportingCaseIds.map((cid) => {
                    const found = historicalCases.find(h => h.id === cid);
                    if (!found) return null;
                    return (
                      <button
                        key={cid}
                        onClick={() => {
                          setSelectedCaseForModal(found);
                          setDecisionMemoryModalOpen(true);
                        }}
                        className="text-[11px] px-2 py-1 rounded bg-white hover:bg-[#F3F0FD] border border-[#E6EAF0] hover:border-[#DDD8F8] text-[#7567E8] font-medium flex items-center gap-1 transition-colors"
                      >
                        <Database className="w-3 h-3" />
                        <span>Case #{found.caseNumber} ({found.date})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Strategic Action Guideline Footer */}
            <div className="mt-5 pt-3.5 border-t border-[#F1F4F9] flex items-center justify-between text-[12px]">
              <div className="text-[#64748B]">
                <span className="font-semibold text-[#17213D]">Rule: </span>
                <span>{insight.actionGuideline}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
