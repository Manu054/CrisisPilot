import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrisis } from '../../context/CrisisContext';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi, DashboardSummary } from '../../api/dashboardApi';
import { 
  Plus, 
  ChevronDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  Brain, 
  ArrowRight,
  Sparkles,
  Calendar,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    crises, 
    setActiveCrisisId, 
    organizationalMemories 
  } = useCrisis();

  const [dateRange, setDateRange] = useState('Last 90 days');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'impact' | 'units'>('impact');

  const [summaryData, setSummaryData] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    dashboardApi.getSummary().then(setSummaryData).catch(() => null);
  }, []);

  // Compute live aggregates if summary API is loaded, or fallback to real crises summation
  const totalUnits = useMemo(() => {
    return crises.reduce((acc, c) => acc + c.inventoryUnits, 0);
  }, [crises]);

  const atRiskValLakhs = useMemo(() => {
    return crises.reduce((acc, c) => acc + (c.inventoryUnits * c.costPrice) / 100000, 0);
  }, [crises]);

  // Filtered and sorted crises
  const filteredCrises = useMemo(() => {
    return crises.filter(c => {
      const matchesSearch = c.productName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.title.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesSeverity = severityFilter === 'all' || c.severity.toLowerCase() === severityFilter.toLowerCase();
      return matchesSearch && matchesSeverity;
    }).sort((a, b) => {
      if (sortBy === 'units') return b.inventoryUnits - a.inventoryUnits;
      return b.inventoryUnits * b.unitPrice - a.inventoryUnits * a.unitPrice;
    });
  }, [crises, searchFilter, severityFilter, sortBy]);

  // Sparkline data
  const sparklineTotal = [
    { v: 4.1 }, { v: 4.3 }, { v: 4.5 }, { v: 4.4 }, { v: 4.7 }, { v: 4.82 }
  ];
  const sparklineRisk = [
    { v: 0.8 }, { v: 0.9 }, { v: 1.05 }, { v: 1.12 }, { v: 1.18 }, { v: 1.24 }
  ];
  const sparklineRevenue = [
    { v: -3.2 }, { v: -4.5 }, { v: -5.8 }, { v: -6.4 }, { v: -7.6 }, { v: -8.4 }
  ];
  const sparklineDecisions = [
    { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 6 }, { v: 7 }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-[#FCF1F3] text-[#9C334A] border border-[#F5D3DB]';
      case 'High':
        return 'bg-[#FEF9ED] text-[#8C6417] border border-[#F8ECC7]';
      case 'Medium':
        return 'bg-[#F2F7FD] text-[#2E62A6] border border-[#D8E6FA]';
      case 'Low':
        return 'bg-[#F0F9F5] text-[#2D7A5D] border border-[#D1EFE4]';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Needs Decision':
        return 'bg-[#F3F0FD] text-[#6455D8] border border-[#E4DEFC] font-semibold';
      case 'Under Analysis':
        return 'bg-[#FEF9ED] text-[#8C6417] border border-[#F8ECC7]';
      case 'Strategy Ready':
        return 'bg-[#F0F9F5] text-[#2D7A5D] border border-[#D1EFE4]';
      case 'In Simulation':
        return 'bg-[#F2F7FD] text-[#2E62A6] border border-[#D8E6FA]';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'excess_inventory':
        return 'Excess Inventory';
      case 'falling_sales':
        return 'Falling Sales';
      case 'competitor_price_cut':
        return 'Competitor Price Cut';
      case 'seasonal_demand':
        return 'Seasonal Demand';
      case 'product_underperformance':
        return 'Product Underperformance';
      case 'regional_imbalance':
        return 'Regional Imbalance';
      default:
        return 'Inventory Imbalance';
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8 text-[#17213D]">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] lg:text-[32px] font-bold text-[#17213D] font-heading tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Leader'}
          </h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">
            Real-time organizational telemetry and active decision overview.
          </p>
        </div>

        {/* Top-Right: Date Selector & Primary CTA */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E6EAF0] rounded-lg text-[13px] font-medium text-[#17213D] hover:bg-[#FAFBFD] transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
              <span>{dateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            {dateDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-lg shadow-lg border border-[#E6EAF0] py-1 z-50 text-[13px]">
                {['Last 30 days', 'Last 60 days', 'Last 90 days', 'Year to Date'].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setDateRange(r);
                      setDateDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#F8FAFC] cursor-pointer ${
                      dateRange === r ? 'text-[#7567E8] font-semibold bg-[#F3F0FD]' : 'text-[#17213D]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/crisis/new')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#7567E8] hover:bg-[#6658DC] text-white rounded-lg text-[13px] font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Crisis</span>
          </button>
        </div>
      </div>

      {/* Business Health Summary: Four Clean Metric Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Inventory */}
        <div className="enterprise-card p-5 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#64748B]">Total Monitored Stock</span>
              <span className="text-[11px] font-medium text-[#64748B] bg-[#F8FAFC] border border-[#E6EAF0] px-1.5 py-0.5 rounded">
                {crises.length} SKUs
              </span>
            </div>
            <div className="text-[28px] font-bold text-[#17213D] font-heading mt-2">
              {summaryData?.total_inventory
                ? `₹${(summaryData.total_inventory / 10000000).toFixed(2)} Cr`
                : `₹${((totalUnits * 750) / 10000000).toFixed(2)} Cr`}
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-[#F1F4F9] flex items-center justify-between">
            <div className="text-[12px] text-[#64748B] flex items-center gap-1">
              <span className="text-[#2D7A5D] font-semibold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +2.1%
              </span>
              <span>vs plan</span>
            </div>
            <div className="w-18 h-7">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineTotal}>
                  <Area type="monotone" dataKey="v" stroke="#7BA7E8" strokeWidth={1.5} fill="#7BA7E8" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Metric 2: At-Risk Inventory */}
        <div className="enterprise-card p-5 bg-white flex flex-col justify-between border-l-4 border-l-[#E7A8B7]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#64748B]">At-Risk Value</span>
              <span className="text-[10px] font-bold text-[#9C334A] bg-[#FCF1F3] border border-[#F5D3DB] px-1.5 py-0.5 rounded">
                Shelf Alert
              </span>
            </div>
            <div className="text-[28px] font-bold text-[#17213D] font-heading mt-2">
              {summaryData?.at_risk_inventory
                ? `₹${(summaryData.at_risk_inventory / 10000000).toFixed(2)} Cr`
                : `₹${(atRiskValLakhs / 100).toFixed(2)} Cr`}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F1F4F9] flex items-center justify-between">
            <div className="text-[12px] text-[#9C334A] font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{crises.filter(c => c.severity === 'Critical').length} critical items</span>
            </div>
            <div className="w-18 h-7">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineRisk}>
                  <Area type="monotone" dataKey="v" stroke="#E7A8B7" strokeWidth={1.5} fill="#E7A8B7" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Metric 3: Revenue Impact */}
        <div className="enterprise-card p-5 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#64748B]">Projected Margin Variance</span>
              <span className="text-[11px] font-medium text-[#64748B] bg-[#F8FAFC] border border-[#E6EAF0] px-1.5 py-0.5 rounded">
                Variance
              </span>
            </div>
            <div className="text-[28px] font-bold text-[#9C334A] font-heading mt-2">
              -8.4%
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F1F4F9] flex items-center justify-between">
            <div className="text-[12px] text-[#64748B]">
              <span>Carrying risk: ₹48L</span>
            </div>
            <div className="w-18 h-7">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineRevenue}>
                  <Area type="monotone" dataKey="v" stroke="#E7A8B7" strokeWidth={1.5} fill="#E7A8B7" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Metric 4: Active Decisions */}
        <div className="enterprise-card p-5 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#64748B]">Active Decisions</span>
              <span className="text-[11px] font-medium text-[#7567E8] bg-[#F3F0FD] border border-[#E4DEFC] px-1.5 py-0.5 rounded">
                HindSight
              </span>
            </div>
            <div className="text-[28px] font-bold text-[#17213D] font-heading mt-2">
              {summaryData?.active_decisions ?? crises.length}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F1F4F9] flex items-center justify-between">
            <div className="text-[12px] text-[#64748B]">
              <span>{crises.filter(c => c.status === 'Needs Decision').length} awaiting action</span>
            </div>
            <div className="w-18 h-7">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineDecisions}>
                  <Area type="monotone" dataKey="v" stroke="#7567E8" strokeWidth={1.5} fill="#7567E8" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Featured AI Recommendation Highlight Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#FAFBFD] via-[#F3F0FD]/40 to-[#FAFBFD] border border-[#E4DEFC] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#F3F0FD] text-[#7567E8] shrink-0 mt-0.5 border border-[#E4DEFC]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7567E8]">
                HindSight Recommendation Priority
              </span>
              <span className="text-[11px] text-[#64748B]">
                {crises[0]?.productName || 'Product'} requires decision within {crises[0]?.daysUntilExpiry || 90}-day window
              </span>
            </div>
            <p className="text-[13px] font-semibold text-[#17213D] mt-0.5">
              Recommended: {crises[0]?.recommendedStrategy?.title} (Expected {crises[0]?.recommendedStrategy?.inventoryClearance}% clearance, {crises[0]?.recommendedStrategy?.estimatedRevenue})
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveCrisisId(crises[0]?.id);
            navigate('/decision-center');
          }}
          className="px-3.5 py-1.5 rounded-lg bg-[#7567E8] hover:bg-[#6658DC] text-white text-[12px] font-semibold transition-colors shrink-0 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <span>Open Decision Center</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Active Business Situations Section with Search, Filter & Sort */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-[18px] lg:text-[20px] font-bold text-[#17213D] font-heading">
              Active Business Situations
            </h2>
            <p className="text-[13px] text-[#64748B]">
              Real-time monitoring of products facing inventory, sales, or pricing friction
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by product..."
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#17213D] focus:outline-none focus:border-[#7567E8] w-40 sm:w-48"
              />
            </div>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#17213D] focus:outline-none focus:border-[#7567E8] cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-[#17213D] focus:outline-none focus:border-[#7567E8] cursor-pointer"
            >
              <option value="impact">Sort by Financial Impact</option>
              <option value="units">Sort by Inventory Units</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="enterprise-card bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#FAFBFD] border-b border-[#E6EAF0] text-[#64748B] text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Situation Title</th>
                  <th className="py-3 px-4">Product / SKU</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Impact Exposure</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F4F9]">
                {filteredCrises.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                      No matching business situations found.
                    </td>
                  </tr>
                ) : (
                  filteredCrises.map((c) => (
                    <tr 
                      key={c.id} 
                      className="hover:bg-[#FAFBFD] transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-semibold text-[#17213D]">
                        {c.title}
                      </td>
                      <td className="py-3.5 px-4 text-[#17213D] font-medium">
                        <div className="flex items-center gap-1.5">
                          <span>{c.productName}</span>
                          <span className="text-[11px] text-[#64748B]">({c.inventoryUnits.toLocaleString()} units)</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {getTypeLabel(c.crisisType)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${getSeverityBadge(c.severity)}`}>
                          {c.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#17213D]">
                        {c.impactAmount}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] px-2 py-0.5 rounded ${getStatusBadge(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B] text-[12px]">
                        {c.lastUpdated}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setActiveCrisisId(c.id);
                            navigate('/decision-center');
                          }}
                          className="px-3 py-1 bg-white hover:bg-[#F3F0FD] border border-[#E6EAF0] hover:border-[#DDD8F8] text-[#7567E8] text-[12px] font-semibold rounded-md transition-colors cursor-pointer"
                        >
                          {c.status === 'Needs Decision' ? 'Needs Decision →' : 'Evaluate →'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom 2-Column: Organizational Memory Highlights & Core Product Loop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: What CrisisPilot Has Learned Preview */}
        <div className="lg:col-span-7 enterprise-card p-5 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#7567E8]" />
                <h3 className="text-[15px] font-bold text-[#17213D] font-heading">
                  Active HindSight Memory Rules
                </h3>
              </div>
              <button
                onClick={() => navigate('/memory')}
                className="text-[12px] font-semibold text-[#7567E8] hover:underline cursor-pointer"
              >
                View all cases &rarr;
              </button>
            </div>

            <div className="space-y-2.5">
              {organizationalMemories.slice(0, 3).map((mem) => (
                <div 
                  key={mem.id}
                  onClick={() => navigate('/memory')}
                  className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0] hover:border-[#8175EA] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1">
                    <span className="font-semibold text-[#7567E8] bg-[#F3F0FD] px-1.5 py-0.2 rounded">
                      {mem.category}
                    </span>
                    <span>{mem.evidenceCount} supporting cases · {mem.confidence}% confidence</span>
                  </div>
                  <p className="text-[13px] font-semibold text-[#17213D] leading-snug">
                    "{mem.statement}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F1F4F9] text-[12px] text-[#64748B] flex items-center justify-between">
            <span>HindSight updates dynamically after real-world outcomes</span>
            <span className="text-[#2D7A5D] font-semibold">Live Learning Enabled</span>
          </div>
        </div>

        {/* Right: Core Decision Loop Card */}
        <div className="lg:col-span-5 enterprise-card p-5 bg-white flex flex-col justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-[#17213D] font-heading mb-1">
              CrisisPilot Intelligence Loop
            </h3>
            <p className="text-[12px] text-[#64748B] mb-4">
              How organizational memory translates into actionable decisions
            </p>

            <div className="space-y-2 text-[12px]">
              <div className="flex items-center gap-3 p-2 rounded-md bg-[#FAFBFD] border border-[#E6EAF0]">
                <span className="w-5 h-5 rounded-full bg-[#E8E6FA] text-[#7567E8] font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                <span className="text-[#17213D] font-medium">Historical Cases &amp; Outcomes Indexed in HindSight</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md bg-[#FAFBFD] border border-[#E6EAF0]">
                <span className="w-5 h-5 rounded-full bg-[#E8E6FA] text-[#7567E8] font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                <span className="text-[#17213D] font-medium">Current Business Crisis Parameters Parsed</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md bg-[#FAFBFD] border border-[#E6EAF0]">
                <span className="w-5 h-5 rounded-full bg-[#E8E6FA] text-[#7567E8] font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                <span className="text-[#17213D] font-medium">Multi-Scenario Simulations &amp; Risk Scoring</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md bg-[#F3F0FD] border border-[#DDD8F8]">
                <span className="w-5 h-5 rounded-full bg-[#7567E8] text-white font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
                <span className="text-[#17213D] font-semibold">Evidence-Backed Decision Execution &amp; Memory Retain</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/simulations')}
            className="mt-4 w-full py-2 bg-[#FAFBFD] hover:bg-[#F3F0FD] border border-[#E6EAF0] text-[#17213D] text-[12px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Launch Strategy Simulator</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#7567E8]" />
          </button>
        </div>
      </div>
    </div>
  );
};
