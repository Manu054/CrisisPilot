export type NavTab = 
  | 'overview' 
  | 'new-crisis' 
  | 'inventory' 
  | 'decision-center' 
  | 'simulations' 
  | 'past-decisions' 
  | 'memory' 
  | 'insights' 
  | 'reports' 
  | 'settings';

export type CrisisType = 
  | 'excess_inventory' 
  | 'falling_sales' 
  | 'competitor_price_cut' 
  | 'seasonal_demand' 
  | 'product_underperformance'
  | 'regional_imbalance'
  | 'overstocking'
  | 'discount_decision'
  | 'promotion_decision';

export interface StrategyOption {
  id: string;
  title: string;
  badge?: string;
  isRecommended?: boolean;
  inventoryClearance: number; // e.g. 72%
  marginImpact: number; // e.g. -18%
  estimatedRevenue: string; // e.g. "₹3.6 Cr"
  revenueRaw: number; // numeric for calculations
  timeToClearDays: number; // e.g. 60
  customerRetention: 'High' | 'Medium' | 'Low';
  riskLevel: 'Low' | 'Low-Med' | 'Moderate' | 'High';
  description: string;
  whyChosen?: string;
  actions: string[];
}

export interface HistoricalCase {
  id: string;
  caseNumber: number;
  date: string;
  title: string;
  crisisType: CrisisType;
  product: string;
  similarityScore: number; // 0 - 100
  problem: string;
  decisionTaken: string;
  outcomeMetric: string;
  status: 'Successful' | 'Suboptimal' | 'Partial Success' | 'Low Margin';
  financialImpact: string;
  marginImpact: string;
  revenueImpact: string;
  expectedOutcome: string;
  actualOutcome: string;
  lessonLearned: string;
  tags: string[];
  region?: string;
  fullPostMortem?: {
    context: string;
    actionTimeline: string[];
    whatWorked: string[];
    whatFailed: string[];
    reusabilityScore: string;
  };
}

export interface InventoryDistribution {
  available: number;
  inTransit: number;
  committed: number;
  returned: number;
}

export interface Crisis {
  id: string;
  title: string;
  productName: string;
  category: string;
  crisisType: CrisisType;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  impactAmount: string; // e.g. "₹48L"
  status: 'Needs Decision' | 'Under Analysis' | 'Strategy Ready' | 'In Simulation' | 'Resolved';
  lastUpdated: string;
  inventoryUnits: number;
  monthlySalesRunRate: number;
  unitPrice: number;
  currencySymbol: string;
  costPrice: number;
  daysUntilExpiry: number;
  description: string;
  inventoryBreakdown: InventoryDistribution;
  recommendedStrategy: StrategyOption;
  alternativeStrategies: StrategyOption[];
  similarHistoricalCases: HistoricalCase[];
  regions: {
    name: string;
    stock: number;
    demandIndex: number; // 1-100
  }[];
}

export interface SimulationParameters {
  discountPercent: number;
  promoDurationDays: number;
  inventoryAllocationPercent: number;
  targetRegion: string;
  salesTargetUnits: number;
  campaignBudgetInLakhs: number;
  product: string;
}

export interface SimulationResult {
  expectedClearancePercent: number;
  clearedUnits: number;
  remainingUnits: number;
  projectedRevenueCr: number;
  effectiveMarginPercent: number;
  daysToClear: number;
  riskScore: 'Low' | 'Moderate' | 'Elevated' | 'High';
  timelineProjection: {
    day: number;
    clearancePct: number;
    revenueCr: number;
    remainingStock: number;
  }[];
}

export interface OrganizationalMemoryItem {
  id: string;
  statement: string;
  category: 'Pricing & Bundling' | 'Inventory Allocation' | 'Seasonal Dynamics' | 'Margin Protection' | 'Channel Strategy';
  evidenceCount: number;
  lastObserved: string;
  confidence: number;
  ruleSummary: string;
  supportingCases: string[];
  impactMetric: string;
  status: 'Active Rule' | 'Validating' | 'Evolving';
}

export interface PatternInsight {
  id: string;
  section: 'Pricing Patterns' | 'Inventory Patterns' | 'Regional Patterns' | 'Seasonal Patterns' | 'Customer Behavior';
  title: string;
  observation: string;
  confidence: number;
  sampleSize: string;
  historicalEvidence: string;
  actionGuideline: string;
  tag: string;
  supportingCaseIds: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'alert' | 'memory' | 'simulation' | 'strategy';
  unread: boolean;
  relatedTab?: NavTab;
}
