import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrisis } from '../../context/CrisisContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings, 
  Database, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Save, 
  Check, 
  Building2, 
  Users,
  LogOut,
  Sparkles,
  Cpu
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useCrisis();
  const { user, organization, logout } = useAuth();

  const [similarityThreshold, setSimilarityThreshold] = useState(75);
  const [marginFloor, setMarginFloor] = useState(18);
  const [agingCliffDays, setAgingCliffDays] = useState(75);
  const [currencySymbol, setCurrencySymbol] = useState(organization?.currency || 'INR');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);

  const handleSave = () => {
    showToast('Platform Settings Updated', 'HindSight memory thresholds and safety guardrails saved.', 'success');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-6 lg:p-8 max-w-[900px] mx-auto space-y-8 text-[#17213D]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F3F0FD] text-[#7567E8] border border-[#E4DEFC]">
            Administration
          </span>
          <span className="text-[12px] text-[#64748B]">Platform Controls &amp; Governance</span>
        </div>
        <h1 className="text-[28px] lg:text-[32px] font-bold text-[#17213D] font-heading tracking-tight mt-1">
          Settings &amp; Workspace
        </h1>
        <p className="text-[14px] text-[#64748B] mt-0.5">
          Manage user profiles, multi-tenant organization boundaries, HindSight parameters, and notifications.
        </p>
      </div>

      <div className="enterprise-card p-6 bg-white space-y-8">
        {/* User Profile Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F1F4F9]">
            <Users className="w-4 h-4 text-[#7567E8]" />
            <h3 className="text-[15px] font-bold text-[#17213D] font-heading">
              User Account Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Full Name</span>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#17213D]">
                {user?.name || 'Authorized User'}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Work Email</span>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-[#17213D] truncate">
                {user?.email || 'user@company.com'}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Assigned Role</span>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#7567E8] capitalize">
                {user?.role || 'Admin'}
              </div>
            </div>
          </div>
        </div>

        {/* Organization Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F1F4F9]">
            <Building2 className="w-4 h-4 text-[#7567E8]" />
            <h3 className="text-[15px] font-bold text-[#17213D] font-heading">
              Organization Boundary &amp; Workspace Isolation
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Organization Name</span>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#17213D]">
                {organization?.name || 'Workspace Org'}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Industry Sector</span>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700">
                {organization?.industry || 'Retail & Consumer Goods'}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Operating Currency</span>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-[#17213D]">
                {organization?.currency || 'INR'} (₹ Lakhs &amp; Crores)
              </div>
            </div>
          </div>
        </div>

        {/* AI & Infrastructure Architecture Display */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F1F4F9]">
            <Cpu className="w-4 h-4 text-[#7567E8]" />
            <h3 className="text-[15px] font-bold text-[#17213D] font-heading">
              Decision Intelligence Engine Architecture
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#17213D]">
                <Database className="w-3.5 h-3.5 text-[#7567E8]" />
                <span>HindSight by Vectorize</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Multi-tenant organizational memory bank isolating case embeddings per organization.
              </p>
              <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Active &amp; Connected</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#17213D]">
                <Sparkles className="w-3.5 h-3.5 text-[#7567E8]" />
                <span>Groq LPU Inference (openai/gpt-oss-120b)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Ultra-low latency reasoning engine (0.09s response) grounded in HindSight memory.
              </p>
              <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Active &amp; Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: HindSight Engine Tuning */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F1F4F9]">
            <Database className="w-4 h-4 text-[#7567E8]" />
            <h3 className="text-[15px] font-bold text-[#17213D] font-heading">
              HindSight Memory Engine Tuning
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-semibold text-[#17213D]">Minimum Historical Similarity Threshold</span>
              <span className="font-bold text-[#7567E8] font-mono bg-[#F3F0FD] px-2 py-0.5 rounded border border-[#E4DEFC]">
                {similarityThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
              className="w-full accent-[#7567E8] cursor-pointer"
            />
            <p className="text-[11px] text-[#64748B]">
              Historical business cases scoring lower than this threshold will be excluded from AI recommendations.
            </p>
          </div>
        </div>

        {/* Section: Margin Guardrails */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F1F4F9]">
            <ShieldCheck className="w-4 h-4 text-[#2D7A5D]" />
            <h3 className="text-[15px] font-bold text-[#17213D] font-heading">
              Enterprise Margin Protection Guardrails
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-semibold text-[#17213D] block mb-1">
                Minimum Gross Margin Floor (%)
              </label>
              <input
                type="number"
                value={marginFloor}
                onChange={(e) => setMarginFloor(Number(e.target.value))}
                className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-xl px-3 py-2 text-[#17213D] font-mono focus:outline-none focus:border-[#7567E8]"
              />
              <span className="text-[11px] text-[#64748B] mt-0.5 block">
                Simulator flags strategies eroding margins below this floor.
              </span>
            </div>

            <div>
              <label className="text-[12px] font-semibold text-[#17213D] block mb-1">
                Inventory Aging Cliff Trigger (Days)
              </label>
              <input
                type="number"
                value={agingCliffDays}
                onChange={(e) => setAgingCliffDays(Number(e.target.value))}
                className="w-full text-[13px] bg-[#FAFBFD] border border-[#E6EAF0] rounded-xl px-3 py-2 text-[#17213D] font-mono focus:outline-none focus:border-[#7567E8]"
              />
              <span className="text-[11px] text-[#64748B] mt-0.5 block">
                Standard corporate threshold for urgent triage intervention.
              </span>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F1F4F9]">
            <Bell className="w-4 h-4 text-[#7567E8]" />
            <h3 className="text-[15px] font-bold text-[#17213D] font-heading">
              Notification &amp; Triage Alert Preferences
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded text-[#7567E8] focus:ring-[#7567E8]"
              />
              <span className="text-slate-700">Email summary when critical shelf-life hazard is flagged (&lt;90 days)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={slackAlerts}
                onChange={(e) => setSlackAlerts(e.target.checked)}
                className="rounded text-[#7567E8] focus:ring-[#7567E8]"
              />
              <span className="text-slate-700">Webhook alerts to commercial operations Slack channel</span>
            </label>
          </div>
        </div>

        {/* Actions Footer: Save & Sign Out */}
        <div className="pt-6 border-t border-[#F1F4F9] flex items-center justify-between">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#7567E8] hover:bg-[#6658DC] text-white text-[13px] font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
