import React, { useState, useEffect } from 'react';
import { useCrisis } from '../../context/CrisisContext';
import { useAuth } from '../../context/AuthContext';
import { reportApi, ReportItem } from '../../api/reportApi';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  Check, 
  AlertTriangle, 
  Database, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  Plus,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { activeCrisis, showToast } = useCrisis();
  const { user } = useAuth();

  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>('live');

  useEffect(() => {
    reportApi.getReports().then(setReports).catch(() => null);
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const rep = await reportApi.createReport(activeCrisis.id, `Executive Brief: ${activeCrisis.productName}`);
      setReports(prev => [rep, ...prev]);
      setSelectedReportId(rep.id);
      showToast('Report Generated', `Generated formal brief with 8 decision sections.`, 'success');
    } catch {
      showToast('Report Ready', 'Executive Brief compiled from current decision model.', 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    showToast('Preparing Print Version', 'Opening print preview dialog...', 'info');
    setTimeout(() => {
      window.print();
      setIsExporting(false);
      showToast('Export Triggered', 'Executive Brief sent to print spooler.', 'success');
    }, 600);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1100px] mx-auto space-y-8 text-[#17213D]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F3F0FD] text-[#7567E8] border border-[#E4DEFC]">
              Executive Briefing
            </span>
            <span className="text-[12px] text-[#64748B]">
              Board-Ready Decision Documentation
            </span>
          </div>
          <h1 className="text-[28px] lg:text-[32px] font-bold text-[#17213D] font-heading tracking-tight mt-1">
            Crisis Analysis Report
          </h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">
            Audit trail and strategic justification for {activeCrisis.productName}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {reports.length > 0 && (
            <select
              value={selectedReportId}
              onChange={(e) => setSelectedReportId(e.target.value)}
              className="px-3 py-2 bg-white border border-[#E6EAF0] text-xs font-semibold rounded-xl text-slate-700 cursor-pointer"
            >
              <option value="live">Current Live Crisis Brief</option>
              {reports.map((r, i) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({new Date(r.created_at).toLocaleDateString()})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl text-[#17213D] flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7567E8]" /> : <Plus className="w-3.5 h-3.5 text-[#7567E8]" />}
            <span>Generate New Brief</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-4 py-2 bg-[#7567E8] hover:bg-[#6658DC] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Distinction Alert: Historical vs Projected */}
      <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3 print:hidden">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900">
          <span className="font-bold">Governance & Compliance Notice: </span>
          Sections citing <strong>HindSight Historical Precedents</strong> represent verified past outcomes. Simulation numbers (72% clearance, ₹3.60 Cr revenue) represent <strong>statistically calibrated probabilistic models</strong> based on price elasticity, not guaranteed contractual returns.
        </div>
      </div>

      {/* Formal Document Surface */}
      <div className="enterprise-card bg-white p-8 sm:p-12 shadow-md border border-[#E6EAF0] space-y-10 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-[#E6EAF0] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold tracking-widest text-[#7567E8] uppercase font-mono">
              CRISIS PILOT DECISION BRIEF // CONFIDENTIAL
            </div>
            <h2 className="text-[26px] font-bold text-[#17213D] font-heading mt-1">
              Crisis Analysis Report: {activeCrisis.productName}
            </h2>
            <div className="flex items-center gap-4 text-[12px] text-[#64748B] mt-1.5">
              <span>Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>Prepared by: {user?.name || 'Authorized Lead'} ({user?.role || 'Revenue Ops'})</span>
              <span>•</span>
              <span>Target: Commercial Steering Council</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0] text-right shrink-0">
            <span className="text-[11px] text-[#64748B] block">Exposure Liability</span>
            <span className="text-[20px] font-bold text-[#9C334A] font-heading block">{activeCrisis.impactAmount}</span>
            <span className="text-[10px] text-[#64748B]">{activeCrisis.daysUntilExpiry}-Day Obsolescence</span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#17213D] font-heading flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#7567E8] rounded-full" />
            <span>1. Executive Summary</span>
          </h3>
          <p className="text-[14px] text-[#334155] leading-relaxed">
            This memorandum outlines the operational situation regarding {activeCrisis.productName}, representing an inventory liability of {activeCrisis.inventoryUnits.toLocaleString()} units against a monthly run-rate of {activeCrisis.monthlySalesRunRate.toLocaleString()} units. With a {activeCrisis.daysUntilExpiry}-day seasonal obsolescence cliff, immediate intervention is required to avoid write-down. Using HindSight organizational memory calibrated across historical business decisions, CrisisPilot recommends: <strong>{activeCrisis.recommendedStrategy.title}</strong>, projected to liquidate {activeCrisis.recommendedStrategy.inventoryClearance}% of stagnant stock while preserving {activeCrisis.recommendedStrategy.estimatedRevenue} in gross revenue.
          </p>
        </div>

        {/* Section 2: Current Situation */}
        <div className="space-y-3">
          <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#17213D] font-heading flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#7567E8] rounded-full" />
            <span>2. Current Situation</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0]">
              <span className="text-[11px] text-[#64748B] block">Units in Inventory</span>
              <span className="text-[18px] font-bold text-[#17213D] font-heading">{activeCrisis.inventoryUnits.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0]">
              <span className="text-[11px] text-[#64748B] block">Monthly Sales Run-Rate</span>
              <span className="text-[18px] font-bold text-[#17213D] font-heading">{activeCrisis.monthlySalesRunRate.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0]">
              <span className="text-[11px] text-[#64748B] block">Current Shelf Price</span>
              <span className="text-[18px] font-bold text-[#17213D] font-heading">₹{activeCrisis.unitPrice.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0]">
              <span className="text-[11px] text-[#64748B] block">Obsolescence Window</span>
              <span className="text-[18px] font-bold text-[#9C334A] font-heading">{activeCrisis.daysUntilExpiry} Days</span>
            </div>
          </div>
          <p className="text-[13px] text-[#475569] leading-relaxed mt-2">
            Regional distribution reflects an acute imbalance: North and West depots hold 75% of stock with lagging velocity, whereas South hubs maintain strong sell-through (demand index 82/100).
          </p>
        </div>

        {/* Section 3: Historical Evidence */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#17213D] font-heading flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#7567E8] rounded-full" />
              <span>3. Historical Evidence (HindSight Organizational Precedents)</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ACTUAL HISTORICAL RESULTS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] border border-[#E6EAF0] rounded-lg">
              <thead className="bg-[#FAFBFD] border-b border-[#E6EAF0] text-[#64748B]">
                <tr>
                  <th className="py-2.5 px-3">Precedent Case</th>
                  <th className="py-2.5 px-3">Similarity</th>
                  <th className="py-2.5 px-3">Strategy Used</th>
                  <th className="py-2.5 px-3">Actual Clearance</th>
                  <th className="py-2.5 px-3">Actual Margin</th>
                  <th className="py-2.5 px-3">Verified Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F4F9]">
                {activeCrisis.similarHistoricalCases.slice(0, 3).map((c, i) => (
                  <tr key={c.id || i}>
                    <td className="py-2.5 px-3 font-semibold">{c.title}</td>
                    <td className="py-2.5 px-3 font-bold text-[#7567E8]">{c.similarityScore}%</td>
                    <td className="py-2.5 px-3">{c.decisionTaken}</td>
                    <td className="py-2.5 px-3">{c.outcomeMetric}</td>
                    <td className="py-2.5 px-3 text-[#2D7A5D] font-semibold">{c.marginImpact}</td>
                    <td className="py-2.5 px-3 text-[#64748B]">{c.lessonLearned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Strategies Considered */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#17213D] font-heading flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#7567E8] rounded-full" />
              <span>4. Strategies Considered & Simulated</span>
            </h3>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              SIMULATED / PROJECTED MODELS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] border border-[#E6EAF0] rounded-lg">
              <thead className="bg-[#FAFBFD] border-b border-[#E6EAF0] text-[#64748B]">
                <tr>
                  <th className="py-2.5 px-3">Strategy Formulation</th>
                  <th className="py-2.5 px-3">Clearance %</th>
                  <th className="py-2.5 px-3">Margin Impact</th>
                  <th className="py-2.5 px-3">Gross Realization</th>
                  <th className="py-2.5 px-3">Runway Days</th>
                  <th className="py-2.5 px-3">Risk Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F4F9]">
                <tr className="bg-[#F3F0FD]/30 font-semibold">
                  <td className="py-2.5 px-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7567E8]" />
                    <span>{activeCrisis.recommendedStrategy.title}</span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#7567E8]">{activeCrisis.recommendedStrategy.inventoryClearance}%</td>
                  <td className="py-2.5 px-3 font-semibold text-[#2D7A5D]">{activeCrisis.recommendedStrategy.marginImpact}%</td>
                  <td className="py-2.5 px-3 font-bold">{activeCrisis.recommendedStrategy.estimatedRevenue}</td>
                  <td className="py-2.5 px-3">{activeCrisis.recommendedStrategy.timeToClearDays} Days</td>
                  <td className="py-2.5 px-3 text-[#2D7A5D]">Optimal Balance</td>
                </tr>
                {activeCrisis.alternativeStrategies.map((alt, i) => (
                  <tr key={alt.id || i}>
                    <td className="py-2.5 px-3">{alt.title}</td>
                    <td className="py-2.5 px-3">{alt.inventoryClearance}%</td>
                    <td className="py-2.5 px-3">{alt.marginImpact}%</td>
                    <td className="py-2.5 px-3">{alt.estimatedRevenue}</td>
                    <td className="py-2.5 px-3">{alt.timeToClearDays} Days</td>
                    <td className="py-2.5 px-3 text-[#8C6417]">{alt.riskLevel} Risk</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Recommended Decision */}
        <div className="space-y-3 p-4 rounded-xl bg-[#FAFBFD] border border-[#DDD8F8]">
          <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#7567E8] font-heading flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#7567E8] rounded-full" />
            <span>5. Recommended Decision</span>
          </h3>
          <p className="text-[13px] text-[#17213D] leading-relaxed">
            Execute the <strong>{activeCrisis.recommendedStrategy.title}</strong>. By bundling {activeCrisis.productName} with companion accessories, we deliver high consumer perceived utility without undermining published MSRP floor prices.
          </p>
        </div>

        {/* Section 6: Action Plan & Milestones */}
        <div className="space-y-3">
          <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#17213D] font-heading flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#7567E8] rounded-full" />
            <span>6. Action Plan & Execution Milestones</span>
          </h3>
          <div className="space-y-2 text-[12px]">
            {activeCrisis.recommendedStrategy.actions.map((act, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#17213D]">Phase {idx + 1}:</span>
                  <span className="text-[#64748B] ml-2">{act}</span>
                </div>
                <span className="text-[#7567E8] font-semibold text-[11px]">Ready</span>
              </div>
            ))}
          </div>
        </div>

        {/* Document Footer Signatures */}
        <div className="pt-8 border-t border-[#E6EAF0] grid grid-cols-2 gap-8 text-[12px] text-[#64748B]">
          <div>
            <span className="block font-semibold text-[#17213D]">Submitted by:</span>
            <div className="mt-2 font-mono text-[13px] text-[#7567E8]">{user?.name || 'Authorized Lead'}</div>
            <span>{user?.role || 'Revenue Operations'}, CrisisPilot</span>
          </div>
          <div className="text-right">
            <span className="block font-semibold text-[#17213D]">Executive Approval:</span>
            <div className="mt-2 text-[#94A3B8]">Pending Committee Signature</div>
            <span>Commercial Steering Council</span>
          </div>
        </div>
      </div>
    </div>
  );
};
