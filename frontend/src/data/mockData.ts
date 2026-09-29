import { 
  Crisis, 
  HistoricalCase, 
  StrategyOption, 
  OrganizationalMemoryItem, 
  PatternInsight, 
  NotificationItem 
} from '../types/crisis';

export const HISTORICAL_CASES: HistoricalCase[] = [
  {
    id: 'case-104',
    caseNumber: 104,
    date: 'Jan 2024',
    title: 'Product X Legacy Batch Overstock',
    crisisType: 'excess_inventory',
    product: 'Product X (Batch 2023-B)',
    similarityScore: 94,
    problem: '46,000 units stagnant after Q4 channel overestimate; 95 days shelf-life remaining with ₹16L carrying cost/mo.',
    decisionTaken: '15% targeted discount + companion accessory bundle',
    outcomeMetric: '68% inventory cleared in 55 days',
    status: 'Successful',
    financialImpact: 'Generated ₹3.42 Cr revenue at 31.2% blended gross margin.',
    marginImpact: '-16%',
    revenueImpact: '₹3.42 Cr',
    expectedOutcome: 'Clear 65% of units within 60 days; limit margin erosion to <20%.',
    actualOutcome: 'Cleared 68% (31,280 units) in 55 days; gross margin held at 31.2%.',
    lessonLearned: 'Bundling with accessories prevented retail price erosion while motivating distributors to maintain shelf space.',
    tags: ['Bundle Strategy', 'Consumer Electronics', 'Shelf-Life Risk'],
    region: 'North & West',
    fullPostMortem: {
      context: 'Q4 demand missed projections by 22% due to mild winter in North territories. Stock buildup threatened upcoming product refresh.',
      actionTimeline: [
        'Day 1–5: Cross-referenced channel inventory across 84 tier-1 distributors',
        'Day 6: Authorized 15% discount bundled with high-margin connector accessory',
        'Day 28: Reached 42% clearance milestone ahead of projection',
        'Day 55: Closed campaign at 68% inventory clearance; returned baseline pricing'
      ],
      whatWorked: [
        'Pairing high-margin accessory cushioned overall gross margin',
        'Restricted promotional codes to registered corporate and retail partners prevented price cannibalization'
      ],
      whatFailed: [
        'Initial logistics delays in Mumbai hub delayed Western roll-out by 4 days'
      ],
      reusabilityScore: '96% (Near-identical match to current Product X crisis)'
    }
  },
  {
    id: 'case-112',
    caseNumber: 112,
    date: 'Aug 2024',
    title: 'Post-Festival Audio Inventory Surplus',
    crisisType: 'excess_inventory',
    product: 'AudioGear Pro',
    similarityScore: 89,
    problem: '38,000 units unsold post-Diwali advance staging. Warehouse capacity constraint at Bhiwandi central depot.',
    decisionTaken: '12% discount + accessory bundle and distributor volume rebate',
    outcomeMetric: '74% inventory cleared in 48 days',
    status: 'Successful',
    financialImpact: 'Cleared ₹2.85 Cr at 28.6% margin; avoided ₹32L external storage penalty.',
    marginImpact: '-14%',
    revenueImpact: '₹2.85 Cr',
    expectedOutcome: 'Clear 70% in 50 days; maintain regional partner margins.',
    actualOutcome: 'Exceeded clearance target (74%) in 48 days with zero distributor channel disputes.',
    lessonLearned: 'Combining modest consumer discount with partner sell-through bonus yields 1.3x faster velocity.',
    tags: ['Seasonal Surplus', 'Distributor Incentive', 'Bundle Promotion'],
    region: 'West & South',
    fullPostMortem: {
      context: 'Over-ordered in anticipation of festival surge that shifted toward entry-tier SKUs.',
      actionTimeline: [
        'Day 1–3: Audited regional warehousing costs and storage surcharges',
        'Day 4: Deployed 12% consumer discount voucher backed by ₹4L partner campaign',
        'Day 30: 56% clearance achieved; accelerated allocation to Bengaluru hub',
        'Day 48: Campaign concluded with 74% stock liquidated'
      ],
      whatWorked: ['Distributor incentive aligned partner sales reps with product focus'],
      whatFailed: ['Late notification to South zone distributors cost 72 hours of momentum'],
      reusabilityScore: '91% (Demonstrates high efficacy of bundle + channel alignment)'
    }
  },
  {
    id: 'case-079',
    caseNumber: 79,
    date: 'Nov 2024',
    title: 'Competitor Price Slash Counter-Action',
    crisisType: 'competitor_price_cut',
    product: 'SoundWave ANC',
    similarityScore: 83,
    problem: 'Tier-1 competitor slashed category price by 25%. Weekly order volume plummeted 48%.',
    decisionTaken: 'Aggressive 25% direct price reduction to defend market share',
    outcomeMetric: '82% units cleared in 35 days (severe margin destruction)',
    status: 'Low Margin',
    financialImpact: 'Gross margin collapsed from 34% to 11.2%; channel demanded ₹26L retroactive price protection.',
    marginImpact: '-31%',
    revenueImpact: '₹2.45 Cr',
    expectedOutcome: 'Retain market share and liquidate 75% inventory in 40 days.',
    actualOutcome: 'Units cleared (82%) but destroyed category profitability and triggered channel hostility.',
    lessonLearned: 'Direct price wars cause irreversible brand margin erosion. Never counter price cuts with equal cuts without bundle protection.',
    tags: ['Price Slash', 'Cautionary Case', 'Margin Erosion'],
    region: 'All Regions',
    fullPostMortem: {
      context: 'Aggressive competitor funding forced a rapid defensive reaction without organizational memory consultation.',
      actionTimeline: [
        'Day 1: Emergency reactive 25% price cut broadcasted across all e-commerce channels',
        'Day 14: Unit volume jumped 2.8x but channel partners halted purchases of newer models',
        'Day 35: Inventory cleared, but retail price floor remained permanently depressed'
      ],
      whatWorked: ['Rapid liquidation of physical units'],
      whatFailed: [
        'Permanently damaged distributor trust',
        'Created customer expectation of chronic discounting'
      ],
      reusabilityScore: 'Cautionary Reference (Strongly advise against reproducing)'
    }
  },
  {
    id: 'case-128',
    caseNumber: 128,
    date: 'Mar 2025',
    title: 'Southern Region Inventory Glut',
    crisisType: 'regional_imbalance',
    product: 'Product X Series',
    similarityScore: 88,
    problem: 'Chennai and Hyderabad fulfillment hubs held 32,000 units while Pune & Delhi faced stockouts.',
    decisionTaken: 'Inter-regional redistribution combined with localized tiered bundle',
    outcomeMetric: '71% inventory cleared in 52 days',
    status: 'Successful',
    financialImpact: 'Net revenue ₹2.65 Cr; net logistics transit cost was ₹5.8L vs ₹38L estimated markdown.',
    marginImpact: '-17%',
    revenueImpact: '₹2.65 Cr',
    expectedOutcome: 'Rebalance 18,000 units northwards and clear 65% remaining stock.',
    actualOutcome: 'Cleared 71% across both zones with blended margin of 29.4%.',
    lessonLearned: 'Customers in South India respond 1.8x better to value bundles than direct discounts.',
    tags: ['Regional Redistribution', 'Logistics Balancing', 'Bundle Preference'],
    region: 'South to West/North',
    fullPostMortem: {
      context: 'Unbalanced seasonal shipments caused localized inventory buildup during regional New Year holidays.',
      actionTimeline: [
        'Day 1: Automated logistics variance flagged stockout danger in North',
        'Day 5: 14,000 units reassigned via express container to Gurgaon warehouse',
        'Day 18: Localized bundle campaign launched for remaining Southern inventory',
        'Day 52: Full rebalance achieved; stockout rate in North dropped to zero'
      ],
      whatWorked: ['Dynamic inventory transfer preserved full-price velocity in demand zones'],
      whatFailed: ['Secondary freight provider experienced 48-hour tracking blackout'],
      reusabilityScore: '89% (Validates regional redistribution effectiveness)'
    }
  },
  {
    id: 'case-064',
    caseNumber: 64,
    date: 'Jul 2025',
    title: 'Mid-Cycle Demand Slowdown',
    crisisType: 'falling_sales',
    product: 'ConnectPod v2',
    similarityScore: 82,
    problem: 'Sales run-rate dropped from 6,000 to 2,800 units/mo; 44,000 units at risk with 110 days runway.',
    decisionTaken: 'Conservative 10% direct price reduction with minimal marketing push',
    outcomeMetric: '42% inventory cleared (missed target of 65%)',
    status: 'Suboptimal',
    financialImpact: 'Generated only ₹1.72 Cr; left 25,500 units stranded at expiry, forcing ₹48L write-down.',
    marginImpact: '-9%',
    revenueImpact: '₹1.72 Cr',
    expectedOutcome: 'Clear 65% in 90 days with minimal margin hit.',
    actualOutcome: '10% discount was insufficient to stimulate consumer interest; competitors captured search traffic.',
    lessonLearned: 'Weak discounts (<12%) fail to trigger consumer purchase intent during mid-cycle obsolescence. Proactive bundling is required.',
    tags: ['Underpowered Discount', 'Failed Clearance', 'Cautionary Case'],
    region: 'All Regions',
    fullPostMortem: {
      context: 'Reluctance to sacrifice margin led management to adopt an overly timid 10% markdown.',
      actionTimeline: [
        'Day 1: Applied 10% discount on direct-to-consumer store',
        'Day 30: Sales run rate increased by only 6%, falling far short of clearance trajectory',
        'Day 90: Campaign ended with 58% of inventory still unsold'
      ],
      whatWorked: ['Preserved gross margin on the small fraction of units sold'],
      whatFailed: ['Failed primary objective of inventory clearance; caused major write-down'],
      reusabilityScore: 'Negative Guidance (Proof that 10% direct cut is inadequate for 40k+ units)'
    }
  },
  {
    id: 'case-139',
    caseNumber: 139,
    date: 'Dec 2025',
    title: 'Year-End Stock Liquidation',
    crisisType: 'excess_inventory',
    product: 'Product X (Special Edition)',
    similarityScore: 92,
    problem: '51,000 units remaining before corporate tax cutoff; ₹1.2 Cr inventory carrying liability.',
    decisionTaken: '15% targeted discount + premium extended warranty bundle',
    outcomeMetric: '77% inventory cleared in 58 days',
    status: 'Successful',
    financialImpact: 'Achieved ₹3.88 Cr revenue at 29.8% margin; beat revenue target by 14%.',
    marginImpact: '-18%',
    revenueImpact: '₹3.88 Cr',
    expectedOutcome: 'Clear 70% in 60 days.',
    actualOutcome: '77% clearance (39,270 units) achieved in 58 days with exceptional customer satisfaction scores.',
    lessonLearned: '15% discount paired with low-cost, high-perceived-value services (warranty/accessories) yields optimal balance of speed and profitability.',
    tags: ['Year-End Clearance', 'Warranty Bundle', 'Optimal Strategy'],
    region: 'All Regions',
    fullPostMortem: {
      context: 'Corporate tax deadline required aggressive balance sheet optimization without collapsing street prices.',
      actionTimeline: [
        'Day 1: Structured 15% discount packaged with 1-year extended warranty',
        'Day 15: Corporate gifting corporate bulk orders accounted for 32% of sales',
        'Day 58: Met target with 77% inventory sold'
      ],
      whatWorked: ['Extended warranty had high perceived value with low actual delivery cost'],
      whatFailed: ['Fulfillment bottleneck during last week of December'],
      reusabilityScore: '95% (Strongest benchmark for current Product X recommendation)'
    }
  },
  {
    id: 'case-147',
    caseNumber: 147,
    date: 'May 2026',
    title: 'Q2 Sudden Competitor Markdown',
    crisisType: 'competitor_price_cut',
    product: 'Product X Pro Series',
    similarityScore: 86,
    problem: 'Competitor dropped price by 20%; Product X orders dropped 38% week-over-week.',
    decisionTaken: '20% direct price reduction across modern trade retail',
    outcomeMetric: '79% inventory cleared in 38 days',
    status: 'Partial Success',
    financialImpact: 'Cleared ₹3.15 Cr revenue but margin fell to 18.2% (-24% margin impact).',
    marginImpact: '-24%',
    revenueImpact: '₹3.15 Cr',
    expectedOutcome: 'Clear inventory within 40 days.',
    actualOutcome: 'Cleared quickly (79%) but left significant margin on the table compared to bundle alternatives.',
    lessonLearned: 'Direct 20% cut works for raw velocity, but sacrifices 6% more margin than a 15% + bundle structure.',
    tags: ['Speed over Margin', 'Direct Markdown', 'Modern Trade'],
    region: 'Metros',
    fullPostMortem: {
      context: 'Urgent clearance prioritized due to imminent warehouse lease termination.',
      actionTimeline: [
        'Day 1: Implemented 20% discount across 120 Modern Trade partner doors',
        'Day 20: 52% of inventory cleared',
        'Day 38: 79% clearance achieved'
      ],
      whatWorked: ['Fast execution and total stock elimination'],
      whatFailed: ['Margin sacrifice exceeded optimal threshold'],
      reusabilityScore: '84% (Useful tradeoff reference: speed vs margin)'
    }
  }
];

export const STRATEGY_OPTIONS_PRODUCT_X: StrategyOption[] = [
  {
    id: 'strat-bundle-15',
    title: '15% Targeted Discount + Bundle Promotion',
    badge: 'AI Recommended',
    isRecommended: true,
    inventoryClearance: 72,
    marginImpact: -18,
    estimatedRevenue: '₹3.60 Cr',
    revenueRaw: 3.60,
    timeToClearDays: 60,
    customerRetention: 'High',
    riskLevel: 'Moderate',
    description: 'Provide a 15% discount voucher when purchased with high-margin companion accessories or extended warranty.',
    whyChosen: 'Seven historically similar situations were identified. Bundle-based promotions produced stronger inventory clearance while preserving more margin than aggressive price reductions.',
    actions: [
      'Activate 15% promotional pricing across tier-1 e-commerce and retail partners',
      'Bundle with fast-moving companion accessory kit (perceived value ₹650, marginal cost ₹180)',
      'Pre-notify 120 key channel partners with 14-day lead time',
      'Set automated liquidation checkpoints at Day 20, 40, and 60'
    ]
  },
  {
    id: 'strat-disc-10',
    title: '10% Conservative Discount',
    badge: 'Low Clearance Risk',
    isRecommended: false,
    inventoryClearance: 54,
    marginImpact: -10,
    estimatedRevenue: '₹2.90 Cr',
    revenueRaw: 2.90,
    timeToClearDays: 90,
    customerRetention: 'High',
    riskLevel: 'Low',
    description: 'Modest price cut preserving maximum unit gross margin, relying on baseline organic demand to absorb stock.',
    whyChosen: 'Preserves baseline product equity and limits margin hit to -10%, but leaves 22,000 units exposed to shelf-life expiry.',
    actions: [
      'Apply flat 10% markdown across direct D2C portal and flagship stores',
      'Run targeted email marketing to past category purchasers',
      'Maintain existing dealer wholesale terms without volume incentives'
    ]
  },
  {
    id: 'strat-disc-20',
    title: '20% Aggressive Direct Price Cut',
    badge: 'High Velocity / Margin Dilution',
    isRecommended: false,
    inventoryClearance: 84,
    marginImpact: -28,
    estimatedRevenue: '₹3.20 Cr',
    revenueRaw: 3.20,
    timeToClearDays: 35,
    customerRetention: 'Medium',
    riskLevel: 'High',
    description: 'Broad market price slash to rapidly liquidate units through open marketplaces before seasonal cutoff.',
    whyChosen: 'Clears 84% within 35 days, but Case #79 and Case #147 demonstrate this triggers distributor margin disputes and destroys brand price floor.',
    actions: [
      'Broadcast 20% flat markdown across Amazon, Flipkart, and Croma',
      'Execute flash sale marketing blitz across social search',
      'Provide price protection credits to top 30 distribution accounts'
    ]
  },
  {
    id: 'strat-regional',
    title: 'Regional Redistribution to High-Velocity Hubs',
    badge: 'Margin Preserving',
    isRecommended: false,
    inventoryClearance: 64,
    marginImpact: -6,
    estimatedRevenue: '₹3.40 Cr',
    revenueRaw: 3.40,
    timeToClearDays: 45,
    customerRetention: 'High',
    riskLevel: 'Low-Med',
    description: 'Transfer 18,000 units from stagnant North/West depots to South & East zones where baseline sell-through is 2.4x higher.',
    whyChosen: 'Safeguards margin (only -6% logistics friction) but requires 7-10 days of freight transit buffer.',
    actions: [
      'Initiate inter-state transfer of 18,000 units to Bengaluru and Hyderabad depots',
      'Support regional channel partners with co-op local merchandising funds',
      'Hold MSRP firm in recipient regions where stock velocity remains elevated'
    ]
  }
];

export const MOCK_CRISES: Crisis[] = [
  {
    id: 'crisis-prod-x',
    title: 'Excess Inventory Crisis',
    productName: 'Product X',
    category: 'Consumer Electronics',
    crisisType: 'excess_inventory',
    severity: 'Critical',
    impactAmount: '₹48L',
    status: 'Needs Decision',
    lastUpdated: '12 mins ago',
    inventoryUnits: 48000,
    monthlySalesRunRate: 5000,
    unitPrice: 1000,
    costPrice: 580,
    currencySymbol: '₹',
    daysUntilExpiry: 90,
    description: 'We have 48,000 units of Product X in stock. Current monthly sales are 5,000 units, leaving a 9.6-month supply. The product faces seasonal obsolescence in 90 days, creating ₹48 Lakhs in carrying cost and unsellable inventory risk.',
    inventoryBreakdown: {
      available: 36500,
      inTransit: 4500,
      committed: 5200,
      returned: 1800
    },
    recommendedStrategy: STRATEGY_OPTIONS_PRODUCT_X[0],
    alternativeStrategies: STRATEGY_OPTIONS_PRODUCT_X,
    similarHistoricalCases: HISTORICAL_CASES.slice(0, 7),
    regions: [
      { name: 'North Depot (Delhi/NCR)', stock: 22000, demandIndex: 38 },
      { name: 'West Hub (Mumbai/Bhiwandi)', stock: 14000, demandIndex: 44 },
      { name: 'South Zone (Bengaluru/HYD)', stock: 8500, demandIndex: 82 },
      { name: 'East Region (Kolkata)', stock: 3500, demandIndex: 68 }
    ]
  },
  {
    id: 'crisis-prod-y',
    title: 'Falling Sales & Demand Decay',
    productName: 'Product Y',
    category: 'Smart Home Devices',
    crisisType: 'falling_sales',
    severity: 'Medium',
    impactAmount: '₹22L',
    status: 'Under Analysis',
    lastUpdated: '2 hours ago',
    inventoryUnits: 26000,
    monthlySalesRunRate: 3200,
    unitPrice: 850,
    costPrice: 510,
    currencySymbol: '₹',
    daysUntilExpiry: 120,
    description: 'Weekly sales run rate slipped 34% over the past 4 weeks following market entry of low-cost competitors. 26,000 units remain in warehouse channel.',
    inventoryBreakdown: {
      available: 21000,
      inTransit: 2500,
      committed: 1800,
      returned: 700
    },
    recommendedStrategy: {
      id: 'strat-prod-y',
      title: 'Subscription Value Bundle + Channel Push',
      badge: 'AI Recommended',
      isRecommended: true,
      inventoryClearance: 68,
      marginImpact: -12,
      estimatedRevenue: '₹1.88 Cr',
      revenueRaw: 1.88,
      timeToClearDays: 75,
      customerRetention: 'High',
      riskLevel: 'Moderate',
      description: 'Bundle 6 months free cloud service to revitalize consumer appeal without lowering shelf MSRP.',
      actions: ['Package complimentary cloud tiers', 'Engage tier-2 retail distributors']
    },
    alternativeStrategies: [],
    similarHistoricalCases: [HISTORICAL_CASES[1], HISTORICAL_CASES[4]],
    regions: [
      { name: 'North Depot', stock: 11000, demandIndex: 45 },
      { name: 'West Hub', stock: 8500, demandIndex: 52 },
      { name: 'South Zone', stock: 6500, demandIndex: 60 }
    ]
  },
  {
    id: 'crisis-prod-z',
    title: 'Competitor Price Cut Vulnerability',
    productName: 'Product Z',
    category: 'Audio & Acoustics',
    crisisType: 'competitor_price_cut',
    severity: 'High',
    impactAmount: '₹31L',
    status: 'Strategy Ready',
    lastUpdated: '4 hours ago',
    inventoryUnits: 34000,
    monthlySalesRunRate: 4100,
    unitPrice: 1200,
    costPrice: 720,
    currencySymbol: '₹',
    daysUntilExpiry: 75,
    description: 'Primary market competitor lowered their equivalent headset by 22%. Organic conversion dropped from 3.8% to 1.9% within 10 days.',
    inventoryBreakdown: {
      available: 28000,
      inTransit: 3200,
      committed: 2100,
      returned: 700
    },
    recommendedStrategy: {
      id: 'strat-prod-z',
      title: 'Targeted Trade-In Bonus & Accessory Bundle',
      badge: 'AI Recommended',
      isRecommended: true,
      inventoryClearance: 75,
      marginImpact: -16,
      estimatedRevenue: '₹2.95 Cr',
      revenueRaw: 2.95,
      timeToClearDays: 50,
      customerRetention: 'High',
      riskLevel: 'Moderate',
      description: 'Offer ₹300 upgrade trade-in allowance paired with protective travel case instead of raw price reduction.',
      actions: ['Launch trade-in campaign', 'Partner with authorized service centers']
    },
    alternativeStrategies: [],
    similarHistoricalCases: [HISTORICAL_CASES[2], HISTORICAL_CASES[6]],
    regions: [
      { name: 'North Depot', stock: 15000, demandIndex: 42 },
      { name: 'West Hub', stock: 12000, demandIndex: 48 },
      { name: 'South Zone', stock: 7000, demandIndex: 74 }
    ]
  },
  {
    id: 'crisis-prod-w',
    title: 'Seasonal Demand Slowdown',
    productName: 'Alpha Pro Audio',
    category: 'Personal Audio',
    crisisType: 'seasonal_demand',
    severity: 'Medium',
    impactAmount: '₹15L',
    status: 'In Simulation',
    lastUpdated: 'Yesterday',
    inventoryUnits: 14500,
    monthlySalesRunRate: 1800,
    unitPrice: 1800,
    costPrice: 1050,
    currencySymbol: '₹',
    daysUntilExpiry: 110,
    description: 'Post-festive quarter contraction across regional distributors. Carrying cost elevated by ₹5.2L/month.',
    inventoryBreakdown: {
      available: 12000,
      inTransit: 1200,
      committed: 900,
      returned: 400
    },
    recommendedStrategy: {
      id: 'strat-prod-w',
      title: 'Corporate Gifting Tie-Up + Flash Bundle',
      badge: 'AI Recommended',
      isRecommended: true,
      inventoryClearance: 70,
      marginImpact: -14,
      estimatedRevenue: '₹1.82 Cr',
      revenueRaw: 1.82,
      timeToClearDays: 45,
      customerRetention: 'Medium',
      riskLevel: 'Low-Med',
      description: 'Package in B2B corporate reward catalogs with tiered unit incentives.',
      actions: ['Direct corporate sales outreach', 'Co-branded packaging option']
    },
    alternativeStrategies: [],
    similarHistoricalCases: [HISTORICAL_CASES[1], HISTORICAL_CASES[5]],
    regions: [
      { name: 'West Hub', stock: 8000, demandIndex: 65 },
      { name: 'South Zone', stock: 6500, demandIndex: 70 }
    ]
  },
  {
    id: 'crisis-prod-v',
    title: 'Regional Inventory Imbalance',
    productName: 'Neo Wearables',
    category: 'Fitness Wearables',
    crisisType: 'regional_imbalance',
    severity: 'Low',
    impactAmount: '₹18L',
    status: 'Strategy Ready',
    lastUpdated: '2 days ago',
    inventoryUnits: 19000,
    monthlySalesRunRate: 2900,
    unitPrice: 1400,
    costPrice: 820,
    currencySymbol: '₹',
    daysUntilExpiry: 140,
    description: 'North distribution center holds 14,000 units with 45-day turnaround, while Bengaluru is losing 40 sales/day to localized stockouts.',
    inventoryBreakdown: {
      available: 16500,
      inTransit: 1500,
      committed: 700,
      returned: 300
    },
    recommendedStrategy: {
      id: 'strat-prod-v',
      title: 'Express Inter-Depot Rebalancing',
      badge: 'AI Recommended',
      isRecommended: true,
      inventoryClearance: 82,
      marginImpact: -5,
      estimatedRevenue: '₹2.18 Cr',
      revenueRaw: 2.18,
      timeToClearDays: 40,
      customerRetention: 'High',
      riskLevel: 'Low',
      description: 'Transfer 7,500 units from Delhi hub to Bengaluru and Hyderabad via priority freight.',
      actions: ['Dispatch 7,500 units to South hub', 'Fulfill backlogged pre-orders at standard MSRP']
    },
    alternativeStrategies: [],
    similarHistoricalCases: [HISTORICAL_CASES[3]],
    regions: [
      { name: 'North Depot', stock: 14000, demandIndex: 32 },
      { name: 'South Zone', stock: 5000, demandIndex: 94 }
    ]
  }
];

export const ORGANIZATIONAL_MEMORY_ITEMS: OrganizationalMemoryItem[] = [
  {
    id: 'mem-01',
    statement: 'Bundle promotions outperform direct discounts for Product X.',
    category: 'Pricing & Bundling',
    evidenceCount: 7,
    lastObserved: 'Aug 2026',
    confidence: 91,
    ruleSummary: 'Pairing stagnant hardware with low-cost accessories increases clearance velocity by 1.35x while preserving 14–18% more gross margin than raw price cuts.',
    supportingCases: ['Case #104 (Jan 2024)', 'Case #112 (Aug 2024)', 'Case #139 (Dec 2025)'],
    impactMetric: '+16.4% higher net margin',
    status: 'Active Rule'
  },
  {
    id: 'mem-02',
    statement: 'Regional redistribution worked better than price reduction during the 2024 seasonal slowdown.',
    category: 'Inventory Allocation',
    evidenceCount: 5,
    lastObserved: 'Jul 2026',
    confidence: 86,
    ruleSummary: 'Shifting units from low-demand depots to high-run-rate tech corridors yields a 2.4x ROI over local markdowns, factoring freight transit cost.',
    supportingCases: ['Case #87 (Aug 2023)', 'Case #128 (Mar 2025)'],
    impactMetric: '₹42L saved write-downs',
    status: 'Active Rule'
  },
  {
    id: 'mem-03',
    statement: 'Discounts above 20% significantly reduced margin without proportional increases in long-term demand.',
    category: 'Margin Protection',
    evidenceCount: 9,
    lastObserved: 'Jun 2026',
    confidence: 94,
    ruleSummary: 'Direct discounts exceeding 20% trigger severe price perception destruction and distributor price protection claims, generating negligible demand elasticity beyond 18%.',
    supportingCases: ['Case #51 (Mar 2023)', 'Case #79 (Nov 2024)', 'Case #147 (May 2026)'],
    impactMetric: '-28% margin destruction risk',
    status: 'Active Rule'
  },
  {
    id: 'mem-04',
    statement: 'Pre-announcing clearance promotions 14 days in advance increases channel partner sell-through by 28%.',
    category: 'Channel Strategy',
    evidenceCount: 4,
    lastObserved: 'Sep 2026',
    confidence: 83,
    ruleSummary: 'Providing modern trade and tier-1 distributor accounts a 14-day advance window secures dedicated end-cap retail positioning and eliminates return liabilities.',
    supportingCases: ['Case #104 (Jan 2024)', 'Case #112 (Aug 2024)'],
    impactMetric: '+28% partner velocity',
    status: 'Active Rule'
  },
  {
    id: 'mem-05',
    statement: 'Reallocating surplus inventory to Tier-2 North metros achieves 1.4x faster velocity with zero brand erosion.',
    category: 'Inventory Allocation',
    evidenceCount: 6,
    lastObserved: 'Aug 2026',
    confidence: 88,
    ruleSummary: 'Tier-2 urban distribution centers exhibit less price sensitivity and higher organic retail pull for certified electronics hardware.',
    supportingCases: ['Case #87 (Aug 2023)', 'Case #128 (Mar 2025)'],
    impactMetric: '1.4x faster unit turnaround',
    status: 'Active Rule'
  },
  {
    id: 'mem-06',
    statement: 'Adding 1-year extended warranty to aging stock converts 34% more hesitation buyers than an equivalent ₹300 price discount.',
    category: 'Pricing & Bundling',
    evidenceCount: 8,
    lastObserved: 'Sep 2026',
    confidence: 89,
    ruleSummary: 'Service-backed value packaging converts consumer doubt into trust at an actuarial delivery cost of under ₹75 per unit.',
    supportingCases: ['Case #139 (Dec 2025)'],
    impactMetric: '+34% checkout conversion',
    status: 'Validating'
  }
];

export const PATTERN_INSIGHTS: PatternInsight[] = [
  {
    id: 'pat-01',
    section: 'Pricing Patterns',
    title: 'Bundle Value Preservation Principle',
    observation: 'Bundle promotions preserve 64% more gross margin than equivalent percentage price cuts across consumer electronics SKUs.',
    confidence: 93,
    sampleSize: '24 Historical Crises Analyzed',
    historicalEvidence: 'Across Cases #104, #112, and #139, bundle structures maintained average order value above ₹1,150 while flat discounts dragged unit realization below ₹780.',
    actionGuideline: 'Always test bundle packaging before approving straight discounts exceeding 12%.',
    tag: 'Pricing Rule',
    supportingCaseIds: ['case-104', 'case-112', 'case-139']
  },
  {
    id: 'pat-02',
    section: 'Customer Behavior',
    title: 'Southern Regional Bundle Receptivity',
    observation: 'Customers in South India respond 1.8x better to bundle promotions than direct discounts.',
    confidence: 91,
    sampleSize: '16 Regional Campaigns',
    historicalEvidence: 'Case #128 demonstrated 71% clearance in South hubs using companion bundles at standard price, whereas identical SKU discount in North showed low responsiveness.',
    actionGuideline: 'Prioritize value bundling and multi-product bundles when addressing excess inventory in Bengaluru, Chennai, and Hyderabad fulfillment zones.',
    tag: 'Customer Preference',
    supportingCaseIds: ['case-128', 'case-104']
  },
  {
    id: 'pat-03',
    section: 'Inventory Patterns',
    title: 'The 75-Day Aging Cliff',
    observation: 'Inventory remaining unsold past 75 days faces a 3.4x higher probability of total liquidation write-down.',
    confidence: 95,
    sampleSize: '41 Stagnant Inventory Audits',
    historicalEvidence: 'Historical records show carrying costs and dealer pushback compound non-linearly once product age exceeds 75 days, escalating write-down expenses.',
    actionGuideline: 'Trigger automated intervention protocols at Day 60 to prevent reaching the 75-day terminal risk cliff.',
    tag: 'Inventory Threshold',
    supportingCaseIds: ['case-064', 'case-079']
  },
  {
    id: 'pat-04',
    section: 'Regional Patterns',
    title: 'Inter-Hub Dynamic Supply Balancing',
    observation: 'Inter-regional freight redistribution costs average 3.2% of MSRP, vs 18–30% loss from local emergency markdowns.',
    confidence: 88,
    sampleSize: '12 Freight Transfer Audits',
    historicalEvidence: 'Case #87 and Case #128 proved that routing stock across zones saved ₹80L in combined inventory markdowns at a freight cost of ₹10L.',
    actionGuideline: 'Run regional demand variance analysis before authorizing local price cuts on national SKU lines.',
    tag: 'Logistics Optimization',
    supportingCaseIds: ['case-087', 'case-128']
  },
  {
    id: 'pat-05',
    section: 'Seasonal Patterns',
    title: 'Post-Monsoon Demand Rebound Variance',
    observation: 'Southern retail centers recover sales run-rates 18 days earlier than Northern distributor channels post-monsoon.',
    confidence: 85,
    sampleSize: '3 Seasonal Cycles (2023–2025)',
    historicalEvidence: 'Demand curves across Case #87 and historical sales registries verify consistent early consumer spending in South tech corridors.',
    actionGuideline: 'Allocate early seasonal inventory batches southwards during the August–September transition window.',
    tag: 'Seasonal Dynamics',
    supportingCaseIds: ['case-087', 'case-112']
  }
];

export const NOTIFICATION_ITEMS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Product X inventory crossed risk threshold',
    desc: '48,000 units are now at 90-day runway limit. Monthly sales run rate is 5,000 units.',
    time: '12m ago',
    type: 'alert',
    unread: true,
    relatedTab: 'decision-center'
  },
  {
    id: 'notif-2',
    title: 'New historical pattern detected',
    desc: 'HindSight synthesized evidence: Bundle promotions in South India yield 1.8x higher response.',
    time: '1h ago',
    type: 'memory',
    unread: true,
    relatedTab: 'memory'
  },
  {
    id: 'notif-3',
    title: 'Simulation completed for Scenario B',
    desc: '15% Targeted Discount + Bundle model projected 72% clearance with ₹3.60 Cr revenue.',
    time: '3h ago',
    type: 'simulation',
    unread: false,
    relatedTab: 'simulations'
  },
  {
    id: 'notif-4',
    title: 'Recommendation updated after new sales data',
    desc: 'Product X run rate adjusted to 5,000 units/mo based on latest ERP warehouse sync.',
    time: '5h ago',
    type: 'strategy',
    unread: false,
    relatedTab: 'decision-center'
  }
];
