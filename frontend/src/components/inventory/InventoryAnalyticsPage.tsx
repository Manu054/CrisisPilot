import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrisis } from '../../context/CrisisContext';
import { inventoryApi, InventorySummaryResponse, ProductInventoryItem } from '../../api/inventoryApi';
import { 
  Package, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  Truck,
  TrendingDown,
  Layers,
  ArrowUpRight,
  Search,
  Filter,
  X,
  Compass
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const InventoryAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeCrisis, crises, setActiveCrisisId } = useCrisis();

  const [summary, setSummary] = useState<InventorySummaryResponse | null>(null);
  const [inventoryList, setInventoryList] = useState<ProductInventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductInventoryItem | null>(null);

  useEffect(() => {
    inventoryApi.getSummary().then(setSummary).catch(() => null);
    inventoryApi.getInventory().then(setInventoryList).catch(() => null);
  }, []);

  const agingData = [
    { range: '<30 Days', units: Math.round(activeCrisis.inventoryUnits * 0.15), fill: '#8BCDB5' },
    { range: '30–60 Days', units: Math.round(activeCrisis.inventoryUnits * 0.35), fill: '#7BA7E8' },
    { range: '60–75 Days', units: Math.round(activeCrisis.inventoryUnits * 0.38), fill: '#E7C77B' },
    { range: '>75 Days (At Cliff)', units: Math.round(activeCrisis.inventoryUnits * 0.12), fill: '#E7A8B7' },
  ];

  const regionalData = activeCrisis.regions.map(r => ({
    name: r.name.split(' ')[0],
    stock: r.stock,
    demand: r.demandIndex
  }));

  const monthlyHoldingCost = summary?.monthly_holding_cost 
    ? Math.round(summary.monthly_holding_cost / 100000)
    : Math.round((activeCrisis.inventoryUnits * activeCrisis.unitPrice * 0.022) / 100000);

  // Filtered rows (either from backend inventory or crises)
  const displayItems = useMemo(() => {
    if (inventoryList && inventoryList.length > 0) {
      return inventoryList.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase();
        return matchesSearch && matchesCategory;
      });
    }

    // Fallback to active crises mapped
    const fallbackItems: ProductInventoryItem[] = crises.map(c => ({
      product_id: c.id,
      sku: `SKU-${c.productName.toUpperCase().replace(/\s+/g, '-').slice(0, 8)}`,
      name: c.productName,
      category: c.category,
      price: c.unitPrice,
      cost: c.costPrice,
      total_units: c.inventoryUnits,
      monthly_velocity: c.monthlySalesRunRate,
      runway_days: Math.round((c.inventoryUnits / (c.monthlySalesRunRate || 1)) * 30),
      expiry_days: c.daysUntilExpiry,
      risk_level: c.severity === 'Critical' ? 'Critical' : c.severity === 'High' ? 'Elevated' : 'Moderate',
      holding_cost_monthly: Math.round(c.inventoryUnits * c.costPrice * 0.02),
      regional_breakdown: c.regions.map(r => ({
        region: r.name,
        units: r.stock,
        runway_days: 60,
        status: r.demandIndex > 60 ? 'Optimal' : 'Surplus'
      }))
    }));

    return fallbackItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [inventoryList, crises, search, categoryFilter]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    crises.forEach(c => set.add(c.category));
    inventoryList.forEach(i => set.add(i.category));
    return Array.from(set);
  }, [crises, inventoryList]);

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8 text-[#17213D]">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F3F0FD] text-[#7567E8] border border-[#E4DEFC]">
              Supply Chain Telemetry
            </span>
            <span className="text-[12px] text-[#64748B]">Active SKU: {activeCrisis.productName}</span>
          </div>
          <h1 className="text-[28px] lg:text-[32px] font-bold text-[#17213D] font-heading tracking-tight mt-1">
            Inventory Analytics
          </h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">
            Monitor aging stock, regional fulfillment imbalances, and capital allocation across national depots.
          </p>
        </div>

        <button
          onClick={() => navigate('/decision-center')}
          className="px-4 py-2 bg-[#7567E8] hover:bg-[#6658DC] text-white text-[13px] font-semibold rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs cursor-pointer"
        >
          <span>Open Decision Center</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Summary Metric Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="enterprise-card p-5 bg-white">
          <span className="text-[12px] font-semibold text-[#64748B]">Total Monitored Stock</span>
          <div className="text-[26px] font-bold text-[#17213D] font-heading mt-1">
            {summary ? `₹${(summary.total_inventory_value / 10000000).toFixed(2)} Cr` : '₹4.82 Cr'}
          </div>
          <span className="text-[11px] text-[#64748B] mt-0.5 block">
            {summary ? summary.total_inventory_units.toLocaleString() : '141,500'} physical units
          </span>
        </div>

        <div className="enterprise-card p-5 bg-white border-l-4 border-l-[#E7A8B7]">
          <span className="text-[12px] font-semibold text-[#64748B]">At-Risk Capital Exposure</span>
          <div className="text-[26px] font-bold text-[#9C334A] font-heading mt-1">
            {summary ? `₹${(summary.total_at_risk_value / 10000000).toFixed(2)} Cr` : '₹1.24 Cr'}
          </div>
          <span className="text-[11px] text-[#9C334A] mt-0.5 block font-medium">
            {summary ? `${summary.total_at_risk_units.toLocaleString()} units near expiry` : '↑ 14.2% from previous month'}
          </span>
        </div>

        <div className="enterprise-card p-5 bg-white">
          <span className="text-[12px] font-semibold text-[#64748B]">Monthly Carrying Cost</span>
          <div className="text-[26px] font-bold text-[#17213D] font-heading mt-1">₹{monthlyHoldingCost} Lakhs</div>
          <span className="text-[11px] text-[#64748B] mt-0.5 block">Warehousing, insurance & capital interest</span>
        </div>

        <div className="enterprise-card p-5 bg-white">
          <span className="text-[12px] font-semibold text-[#64748B]">Regional Mismatch Index</span>
          <div className="text-[26px] font-bold text-[#7567E8] font-heading mt-1">74 / 100</div>
          <span className="text-[11px] text-[#7567E8] mt-0.5 block">High rebalancing arbitrage opportunity</span>
        </div>
      </div>

      {/* 2-Column: Aging Waterfall & Regional Inventory Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Inventory Aging Breakdown */}
        <div className="lg:col-span-6 enterprise-card p-5 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F9]">
            <div>
              <h3 className="text-[16px] font-bold text-[#17213D] font-heading">
                Shelf-Life Aging Exposure
              </h3>
              <p className="text-[12px] text-[#64748B]">
                Distribution of current inventory across obsolescence horizons
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#9C334A] bg-[#FCF1F3] px-2 py-0.5 rounded border border-[#F5D3DB]">
              Critical Cutoff: {activeCrisis.daysUntilExpiry}d
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F9" />
                <XAxis dataKey="range" stroke="#94A3B8" fontSize={11} />
                <YAxis tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} stroke="#94A3B8" fontSize={11} />
                <Tooltip 
                  formatter={(val: any) => [`${Number(val).toLocaleString()} units`, 'Stock Units']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E6EAF0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="units" radius={[4, 4, 0, 0]}>
                  {agingData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Regional Stock vs Demand */}
        <div className="lg:col-span-6 enterprise-card p-5 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F9]">
            <div>
              <h3 className="text-[16px] font-bold text-[#17213D] font-heading">
                Regional Stock Distribution
              </h3>
              <p className="text-[12px] text-[#64748B]">
                Compare depot inventory against normalized consumer demand index (0–100)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {activeCrisis.regions.map((reg, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#FAFBFD] border border-[#E6EAF0] space-y-2">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-[#17213D] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#7567E8]" />
                    <span>{reg.name}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#64748B] text-[12px]">{reg.stock.toLocaleString()} units</span>
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                      reg.demandIndex >= 70 ? 'bg-[#F0F9F5] text-[#2D7A5D]' : 'bg-[#FEF9ED] text-[#8C6417]'
                    }`}>
                      Demand: {reg.demandIndex}/100
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#E6EAF0] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#7567E8] h-full rounded-full"
                    style={{ width: `${reg.demandIndex}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/simulations')}
            className="w-full py-2 bg-white hover:bg-[#FAFBFD] border border-[#E6EAF0] text-[#17213D] text-[12px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 text-[#7567E8]" />
            <span>Simulate Inter-Regional Freight Reallocation</span>
          </button>
        </div>
      </div>

      {/* Enterprise SKU Risk Matrix Table with Search & Filter */}
      <div className="enterprise-card bg-white overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#E6EAF0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-[16px] font-bold text-[#17213D] font-heading">
              Enterprise SKU Risk Registry
            </h3>
            <p className="text-[13px] text-[#64748B]">
              Portfolio view of physical goods across product categories and risk postures
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search SKU or name..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#7567E8] w-40 sm:w-48"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#7567E8] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#FAFBFD] border-b border-[#E6EAF0] text-[#64748B] text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">SKU / Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Units in Depots</th>
                <th className="py-3 px-4">Monthly Velocity</th>
                <th className="py-3 px-4">Runway Days</th>
                <th className="py-3 px-4">Cost Basis</th>
                <th className="py-3 px-4">Risk Severity</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F4F9]">
              {displayItems.map((item, idx) => (
                <tr 
                  key={item.product_id || idx} 
                  onClick={() => setSelectedProduct(item)}
                  className="hover:bg-[#FAFBFD] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-semibold text-[#17213D]">
                    <div>{item.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{item.sku}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B]">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#17213D]">
                    {item.total_units.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B]">
                    {item.monthly_velocity.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#17213D]">
                    {item.runway_days} days
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#17213D]">
                    ₹{item.cost}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      item.risk_level === 'Critical'
                        ? 'bg-[#FCF1F3] text-[#9C334A] border border-[#F5D3DB]'
                        : item.risk_level === 'Elevated'
                        ? 'bg-[#FEF9ED] text-[#8C6417] border border-[#F8ECC7]'
                        : 'bg-[#F2F7FD] text-[#2E62A6] border border-[#D8E6FA]'
                    }`}>
                      {item.risk_level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(item);
                      }}
                      className="px-3 py-1 bg-white hover:bg-[#F3F0FD] border border-[#E6EAF0] text-[#7567E8] text-[12px] font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E8E6FA] text-[#7567E8] flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17213D]">{selectedProduct.name}</h3>
                    <p className="text-[11px] text-slate-500 font-mono">{selectedProduct.sku} · {selectedProduct.category}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Stock</span>
                  <span className="text-sm font-bold text-[#17213D]">{selectedProduct.total_units.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Unit Price</span>
                  <span className="text-sm font-bold text-[#7567E8]">₹{selectedProduct.price}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Runway</span>
                  <span className="text-sm font-bold text-rose-600">{selectedProduct.runway_days} Days</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#17213D] mb-2">Regional Stock Telemetry</h4>
                <div className="space-y-2">
                  {selectedProduct.regional_breakdown.map((r, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{r.region}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">{r.units.toLocaleString()} units</span>
                        <span className="font-medium text-[#7567E8]">{r.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const match = crises.find(c => c.productName === selectedProduct.name);
                    if (match) setActiveCrisisId(match.id);
                    setSelectedProduct(null);
                    navigate('/decision-center');
                  }}
                  className="px-4 py-2 bg-[#7567E8] hover:bg-[#6658DC] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Analyze in Decision Center</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
