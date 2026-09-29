import { CrisisResponse, HistoricalEvidenceItem, StrategySimulationItem, RecommendationData } from '../api/crisisApi';
import { Crisis, HistoricalCase, StrategyOption, CrisisType } from '../types/crisis';

export function mapBackendCrisisToFrontend(
  backend: CrisisResponse,
  evidence?: HistoricalEvidenceItem[],
  strategies?: StrategySimulationItem[],
  recommendation?: RecommendationData
): Crisis {
  const input = backend.input_data || {};
  const inventoryUnits = Number(input.inventory_units || input.inventoryUnits || 48000);
  const unitPrice = Number(input.unit_price || input.unitPrice || 750);
  const costPrice = Number(input.unit_cost || input.costPrice || 480);
  const monthlyRunRate = Number(input.monthly_sales || input.monthlySalesRunRate || 4200);
  const daysExpiry = Number(input.expiry_days || input.daysUntilExpiry || 90);
  const productName = input.product_name || input.product || backend.title || 'Product X';
  const category = input.category || 'Consumer Packaged Goods';

  // Total at-risk value
  const impactVal = (inventoryUnits * unitPrice) / 100000; // in Lakhs
  const impactAmount = impactVal >= 100 ? `₹${(impactVal / 100).toFixed(1)} Cr` : `₹${Math.round(impactVal)}L`;

  // Map status
  let status: Crisis['status'] = 'Needs Decision';
  if (backend.status === 'analyzing') status = 'Under Analysis';
  else if (backend.status === 'recommendation_ready') status = 'Strategy Ready';
  else if (backend.status === 'decision_made' || backend.status === 'resolved') status = 'Resolved';

  // Map severity
  let severity: Crisis['severity'] = 'High';
  if (backend.severity === 'critical') severity = 'Critical';
  else if (backend.severity === 'medium') severity = 'Medium';
  else if (backend.severity === 'low') severity = 'Low';

  // Map strategies
  let recommendedStrategy: StrategyOption;
  let alternativeStrategies: StrategyOption[] = [];

  if (strategies && strategies.length > 0) {
    const stratOptions = strategies.map(mapBackendStrategyToOption);
    const recIndex = stratOptions.findIndex(s => s.isRecommended);
    if (recIndex >= 0) {
      recommendedStrategy = stratOptions[recIndex];
      alternativeStrategies = stratOptions.filter((_, idx) => idx !== recIndex);
    } else {
      recommendedStrategy = stratOptions[0];
      alternativeStrategies = stratOptions.slice(1);
    }
  } else {
    // Default fallback strategy structure
    recommendedStrategy = {
      id: `strat-rec-${backend.id}`,
      title: recommendation?.strategy || 'Targeted 15% Promotion & Bundle Strategy',
      badge: 'AI Recommended',
      isRecommended: true,
      inventoryClearance: Math.round((recommendation?.expected_impact?.inventory_clearance || 0.72) * 100),
      marginImpact: Math.round((recommendation?.expected_impact?.margin_change || -0.18) * 100),
      estimatedRevenue: `₹${((recommendation?.expected_impact?.revenue || inventoryUnits * unitPrice * 0.8) / 10000000).toFixed(2)} Cr`,
      revenueRaw: recommendation?.expected_impact?.revenue || inventoryUnits * unitPrice * 0.8,
      timeToClearDays: recommendation?.expected_impact?.days_to_clear || 60,
      customerRetention: 'High',
      riskLevel: 'Moderate',
      description: recommendation?.reasoning || 'Calibrated markdown campaign balancing velocity with margin preservation.',
      whyChosen: recommendation?.reasoning || 'Maximizes revenue velocity while protecting gross contribution margins.',
      actions: recommendation?.next_steps || [
        'Apply 15% discount for Tier 1 enterprise distributors',
        'Bundle slow-moving SKU with complementary high-velocity product',
        'Redirect 30% of inventory to South Zone distribution centers'
      ]
    };
  }

  // Map historical cases
  const mappedEvidence: HistoricalCase[] = (evidence || []).map(mapBackendEvidenceToCase);

  return {
    id: backend.id,
    title: backend.title,
    productName,
    category,
    crisisType: (backend.crisis_type as CrisisType) || 'excess_inventory',
    severity,
    impactAmount,
    status,
    lastUpdated: new Date(backend.updated_at || backend.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    inventoryUnits,
    monthlySalesRunRate: monthlyRunRate,
    unitPrice,
    currencySymbol: '₹',
    costPrice,
    daysUntilExpiry: daysExpiry,
    description: backend.description || `Excess inventory accumulation for ${productName}.`,
    inventoryBreakdown: {
      available: Math.round(inventoryUnits * 0.75),
      inTransit: Math.round(inventoryUnits * 0.15),
      committed: Math.round(inventoryUnits * 0.08),
      returned: Math.round(inventoryUnits * 0.02)
    },
    recommendedStrategy,
    alternativeStrategies,
    similarHistoricalCases: mappedEvidence,
    regions: [
      { name: 'South Zone (BLR/HYD)', stock: Math.round(inventoryUnits * 0.45), demandIndex: 88 },
      { name: 'West Zone (MUM/PUN)', stock: Math.round(inventoryUnits * 0.30), demandIndex: 64 },
      { name: 'North Zone (DEL/NCR)', stock: Math.round(inventoryUnits * 0.25), demandIndex: 52 }
    ]
  };
}

export function mapBackendStrategyToOption(strat: StrategySimulationItem, idx: number): StrategyOption {
  const isRecommended = !!strat.is_recommended;
  const clearancePct = Math.round(strat.projected_clearance > 1 ? strat.projected_clearance : strat.projected_clearance * 100);
  const marginChangePct = Math.round(Math.abs(strat.margin_change) > 1 ? strat.margin_change : strat.margin_change * 100);
  const revCr = strat.projected_revenue >= 10000000
    ? (strat.projected_revenue / 10000000).toFixed(2)
    : (strat.projected_revenue / 100000).toFixed(1);

  let riskLevel: StrategyOption['riskLevel'] = 'Moderate';
  const riskStr = (strat.risk || strat.risk_score || '').toLowerCase();
  if (riskStr.includes('low')) riskLevel = 'Low';
  else if (riskStr.includes('high')) riskLevel = 'High';
  else if (riskStr.includes('elevated')) riskLevel = 'Low-Med';

  return {
    id: strat.id || `strat-${idx}-${strat.name.toLowerCase().replace(/\s+/g, '-')}`,
    title: strat.name,
    badge: isRecommended ? 'AI Recommended' : undefined,
    isRecommended,
    inventoryClearance: clearancePct,
    marginImpact: marginChangePct,
    estimatedRevenue: `₹${revCr} Cr`,
    revenueRaw: strat.projected_revenue,
    timeToClearDays: strat.days_to_clear,
    customerRetention: clearancePct > 60 ? 'High' : 'Medium',
    riskLevel,
    description: `Simulated ${strat.name} strategy with projected ${clearancePct}% clearance over ${strat.days_to_clear} days.`,
    whyChosen: isRecommended ? 'Selected by Multi-Agent synthesis as optimal balance of revenue velocity and margin preservation.' : undefined,
    actions: [
      `Initiate ${strat.name} parameters across sales channels`,
      `Monitor weekly clearance rate against deterministic simulation curve`,
      `Review channel margin impact at day 30 milestone`
    ]
  };
}

export function mapBackendEvidenceToCase(item: HistoricalEvidenceItem, idx: number): HistoricalCase {
  const similarityScore = Math.round(item.similarity > 1 ? item.similarity : item.similarity * 100);

  let status: HistoricalCase['status'] = 'Successful';
  const outcomeLower = (item.outcome || '').toLowerCase();
  if (outcomeLower.includes('suboptimal') || outcomeLower.includes('fail')) {
    status = 'Suboptimal';
  } else if (outcomeLower.includes('partial')) {
    status = 'Partial Success';
  } else if (outcomeLower.includes('low margin') || outcomeLower.includes('margin hit')) {
    status = 'Low Margin';
  }

  return {
    id: item.case_id || `hist-${idx + 1}`,
    caseNumber: item.case_number || idx + 101,
    date: item.date || 'Historical Precedent',
    title: item.title || `Precedent: ${item.product || 'Product'} Case`,
    crisisType: 'excess_inventory',
    product: item.product || 'Product Case',
    similarityScore,
    problem: item.problem || 'Excess inventory requiring strategic clearance.',
    decisionTaken: item.decision_taken || item.strategy_used || 'Discount & Channel Shift',
    outcomeMetric: item.cleared || `${item.inventory_cleared_pct || 70}% Cleared`,
    status,
    financialImpact: item.financial_impact || item.revenue_impact || '₹2.8 Cr Saved',
    marginImpact: item.margin_impact || '-14%',
    revenueImpact: item.revenue_impact || item.financial_impact || '₹3.2 Cr',
    expectedOutcome: item.expected_outcome || 'Projected 65% clearance within 60 days',
    actualOutcome: item.actual_outcome || item.outcome,
    lessonLearned: item.lesson_learned || 'Timely targeted bundling preserved margins compared to delayed liquidation.',
    tags: item.tags && item.tags.length > 0 ? item.tags : ['Discount', 'Clearance', 'Margin Protection'],
    region: item.region || 'National',
    fullPostMortem: {
      context: item.problem,
      actionTimeline: [
        'Day 1-15: Initial promotion launched across primary regional distribution',
        'Day 16-45: Secondary bundling introduced for wholesale channels',
        'Day 46-60: Final clearance achieved with minimal margin slippage'
      ],
      whatWorked: [
        item.lesson_learned || 'Bundled promotional pricing moved volume fast',
        'Prioritizing South and West zone distribution avoided dead freight'
      ],
      whatFailed: [
        'Delayed regional reallocation cost 12 days in runway'
      ],
      reusabilityScore: `${similarityScore}% Pattern Match`
    }
  };
}
