import React from 'react';
import { 
  ShieldAlert, 
  BrainCircuit, 
  Calculator, 
  RefreshCw, 
  Sparkles, 
  FileText, 
  HelpCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 text-[#17213D]">
      {/* Hero Header */}
      <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#E8E6FA] flex items-center justify-center text-[#6455D8]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#17213D]">CrisisPilot Knowledge & Help Center</h1>
            <p className="text-xs text-slate-500">Understanding organizational memory, deterministic simulations, and closed-loop decision intelligence.</p>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-[#6455D8]">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-[#17213D]">1. HindSight Organizational Memory</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            CrisisPilot uses <strong>HindSight by Vectorize</strong> to store institutional memory. Unlike generic LLMs that hallucinate past facts, HindSight retains every executed decision, markdown experiment, and actual post-mortem outcome in an isolated organization memory bank (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">organization:{"{org_id}"}:crisispilot</code>).
          </p>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4">
            <li><strong>Retain</strong>: Stores real-world business outcomes after decisions complete.</li>
            <li><strong>Recall</strong>: Semantically retrieves similar past crises and clearance rates.</li>
            <li><strong>Reflect</strong>: Synthesizes high-level pricing and inventory rules across past cases.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-[#3B82F6]">
            <Calculator className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-[#17213D]">2. Deterministic Financial Simulations</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Financial math is never delegated to LLMs.</strong> All revenue, gross margin, clearance percentage, and runway numbers are calculated by Python algorithms calibrated against verified price elasticity coefficients.
          </p>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4">
            <li><strong>Elasticity Modeling</strong>: Discounts stimulate demand non-linearly.</li>
            <li><strong>Timeline Projections</strong>: Computes milestone curves at 0, 15, 30, 45, 60, 75, and 90 days.</li>
            <li><strong>Risk Scoring</strong>: Evaluates margin destruction thresholds (&lt;15%) and expiry hazards.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-[#10B981]">
            <RefreshCw className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-[#17213D]">3. The Closed Learning Loop</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            When you execute a decision in the <strong>Decision Center</strong>, the system changes status to <span className="text-amber-700 font-semibold">executed</span>. Once the promotion completes, click <strong>Record Actual Outcome</strong> to enter real units cleared and revenue.
          </p>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4">
            <li>PostgreSQL stores the audit trail of what was planned vs. achieved.</li>
            <li>HindSight immediately retains the lesson learned.</li>
            <li>Subsequent crises retrieve this new experience as fresh precedent.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-[#8B5CF6]">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-[#17213D]">4. Multi-Agent Strategy Synthesis</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Five specialized agents orchestrate recommendations:
          </p>
          <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4">
            <li><strong>Situation Agent</strong>: Validates constraints without hallucination.</li>
            <li><strong>Memory Agent</strong>: Queries HindSight for historical precedents.</li>
            <li><strong>Strategy Agent</strong>: Ranks candidates based on your chosen objective.</li>
            <li><strong>Simulation Agent</strong>: Evaluates deterministic clearance curves.</li>
            <li><strong>Explanation Agent</strong>: Articulates trade-offs, risks, and assumptions.</li>
          </ul>
        </div>
      </div>

      {/* Step-by-Step Workflow Guide */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#17213D]">Step-by-Step Operating Workflow</h2>
        <div className="space-y-3">
          {[
            { step: 'Step 1', title: 'Submit a New Crisis', desc: 'Go to New Crisis, choose the product, stock volume, price, shelf-life expiry, and your primary business objective.' },
            { step: 'Step 2', title: 'Stream Analysis & Synthesize Strategy', desc: 'Click Analyze Crisis to retrieve HindSight memory cases, simulate candidate markdowns, and inspect confidence scores.' },
            { step: 'Step 3', title: 'Inspect Decision Center', desc: 'Review the AI recommended strategy, compare alternative discount/bundle options, and query the assistant via AI Chat.' },
            { step: 'Step 4', title: 'Execute & Record Outcome', desc: 'Execute the strategy with your channel team. After the campaign, record actual clearance and margin to permanently educate the memory bank.' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
              <span className="text-[11px] font-bold text-[#6455D8] bg-[#E8E6FA] px-2 py-0.5 rounded-md mt-0.5">
                {item.step}
              </span>
              <div>
                <h3 className="text-xs font-semibold text-[#17213D]">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
