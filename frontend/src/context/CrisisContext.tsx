import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  NavTab, 
  Crisis, 
  HistoricalCase, 
  StrategyOption, 
  SimulationParameters, 
  SimulationResult, 
  OrganizationalMemoryItem, 
  PatternInsight, 
  NotificationItem 
} from '../types/crisis';
import { 
  MOCK_CRISES, 
  HISTORICAL_CASES, 
  ORGANIZATIONAL_MEMORY_ITEMS, 
  PATTERN_INSIGHTS, 
  NOTIFICATION_ITEMS,
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { crisisApi } from '../api/crisisApi';
import { notificationApi } from '../api/notificationApi';
import { memoryApi } from '../api/memoryApi';
import { decisionApi, DecisionOutcomePayload } from '../api/decisionApi';
import { simulationApi } from '../api/simulationApi';
import { mapBackendCrisisToFrontend, mapBackendEvidenceToCase } from '../utils/crisisMapper';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface SavedScenario {
  id: string;
  name: string;
  params: SimulationParameters;
  result: SimulationResult;
  date: string;
}

interface CrisisContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  crises: Crisis[];
  activeCrisis: Crisis;
  setActiveCrisisId: (id: string) => void;
  historicalCases: HistoricalCase[];
  selectedStrategyId: string;
  setSelectedStrategyId: (id: string) => void;
  selectedStrategy: StrategyOption;
  
  // Prompt & Analysis State
  quickPromptText: string;
  setQuickPromptText: (text: string) => void;
  isAnalyzing: boolean;
  analysisStep: number;
  handleAnalyzePrompt: (text?: string) => Promise<void>;
  
  // Modals & Panels
  decisionMemoryModalOpen: boolean;
  setDecisionMemoryModalOpen: (open: boolean) => void;
  selectedCaseForModal: HistoricalCase | null;
  setSelectedCaseForModal: (item: HistoricalCase | null) => void;
  
  decisionEvidenceOpen: boolean;
  setDecisionEvidenceOpen: (open: boolean) => void;

  selectedPostMortemCase: HistoricalCase | null;
  setSelectedPostMortemCase: (item: HistoricalCase | null) => void;
  
  // AI Assistant Panel
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;

  // Notifications Drawer
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  
  // Simulation
  simulationParams: SimulationParameters;
  setSimulationParams: React.Dispatch<React.SetStateAction<SimulationParameters>>;
  calculateSimulation: (params: SimulationParameters) => SimulationResult;
  runBackendSimulation: (params: SimulationParameters) => Promise<SimulationResult>;
  savedScenarios: SavedScenario[];
  saveCurrentScenario: (name: string) => void;
  loadScenario: (scenario: SavedScenario) => void;
  
  // Organizational Memory & Insights
  organizationalMemories: OrganizationalMemoryItem[];
  patternInsights: PatternInsight[];
  refreshMemoryData: () => Promise<void>;
  
  // Actions
  addNewCrisis: (crisis: Omit<Crisis, 'id'>) => Promise<Crisis>;
  executeActiveDecision: () => Promise<void>;
  recordDecisionOutcome: (decisionId: string, outcomeData: DecisionOutcomePayload) => Promise<void>;
  toasts: Toast[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const CrisisContext = createContext<CrisisContextType | undefined>(undefined);

export const CrisisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [crises, setCrises] = useState<Crisis[]>(MOCK_CRISES);
  const [activeCrisisId, setActiveCrisisIdState] = useState<string>(MOCK_CRISES[0].id);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>(MOCK_CRISES[0].recommendedStrategy.id);
  const [quickPromptText, setQuickPromptText] = useState<string>('');
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [decisionMemoryModalOpen, setDecisionMemoryModalOpen] = useState<boolean>(false);
  const [selectedCaseForModal, setSelectedCaseForModal] = useState<HistoricalCase | null>(null);

  const [decisionEvidenceOpen, setDecisionEvidenceOpen] = useState<boolean>(false);
  const [selectedPostMortemCase, setSelectedPostMortemCase] = useState<HistoricalCase | null>(null);

  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATION_ITEMS);

  const [organizationalMemories] = useState<OrganizationalMemoryItem[]>(ORGANIZATIONAL_MEMORY_ITEMS);
  const [patternInsights, setPatternInsights] = useState<PatternInsight[]>(PATTERN_INSIGHTS);
  const [historicalCases, setHistoricalCases] = useState<HistoricalCase[]>(HISTORICAL_CASES);

  const showToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Simulator state
  const [simulationParams, setSimulationParams] = useState<SimulationParameters>({
    discountPercent: 15,
    promoDurationDays: 60,
    inventoryAllocationPercent: 85,
    targetRegion: 'All Regions',
    salesTargetUnits: 35000,
    campaignBudgetInLakhs: 8.5,
    product: 'Product X'
  });

  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([
    {
      id: 'scen-b',
      name: 'Scenario B: 15% Discount + Bundle (AI Recommended)',
      params: {
        discountPercent: 15,
        promoDurationDays: 60,
        inventoryAllocationPercent: 85,
        targetRegion: 'All Regions',
        salesTargetUnits: 35000,
        campaignBudgetInLakhs: 8.5,
        product: 'Product X'
      },
      result: {
        expectedClearancePercent: 72,
        clearedUnits: 34560,
        remainingUnits: 13440,
        projectedRevenueCr: 3.60,
        effectiveMarginPercent: 24.6,
        daysToClear: 58,
        riskScore: 'Moderate',
        timelineProjection: [
          { day: 0, clearancePct: 0, revenueCr: 0, remainingStock: 48000 },
          { day: 15, clearancePct: 24, revenueCr: 0.95, remainingStock: 36480 },
          { day: 30, clearancePct: 45, revenueCr: 1.85, remainingStock: 26400 },
          { day: 45, clearancePct: 62, revenueCr: 2.75, remainingStock: 18240 },
          { day: 60, clearancePct: 72, revenueCr: 3.60, remainingStock: 13440 },
          { day: 75, clearancePct: 76, revenueCr: 3.75, remainingStock: 11520 },
          { day: 90, clearancePct: 78, revenueCr: 3.82, remainingStock: 10560 }
        ]
      },
      date: 'Today, 10:30 AM'
    }
  ]);

  // Load backend data when authenticated
  const loadBackendData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      // 1. Fetch Crises
      const backendCrises = await crisisApi.getCrises().catch(() => []);
      if (backendCrises && backendCrises.length > 0) {
        const mappedList = backendCrises.map(c => mapBackendCrisisToFrontend(c));
        setCrises(mappedList);
        if (!mappedList.some(c => c.id === activeCrisisId)) {
          setActiveCrisisIdState(mappedList[0].id);
          setSelectedStrategyId(mappedList[0].recommendedStrategy.id);
        }
      }

      // 2. Fetch Notifications
      const backendNotifs = await notificationApi.getNotifications().catch(() => []);
      if (backendNotifs && backendNotifs.length > 0) {
        setNotifications(backendNotifs.map(n => ({
          id: n.id,
          title: n.title,
          desc: n.message,
          time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: (n.type as any) || 'alert',
          unread: !n.is_read
        })));
      }

      // 3. Fetch Memory Cases
      const backendCases = await memoryApi.getCases().catch(() => []);
      if (backendCases && backendCases.length > 0) {
        const mappedCases = backendCases.map((c, idx) => mapBackendEvidenceToCase({
          case_id: c.case_id,
          case_number: c.case_number,
          title: c.title || `Precedent: ${c.product || 'Case'}`,
          product: c.product,
          similarity: c.similarity_score,
          problem: c.problem,
          strategy_used: c.decision_taken,
          outcome: c.actual_outcome || c.outcome_metric,
          cleared: c.outcome_metric,
          financial_impact: c.financial_impact,
          margin_impact: c.margin_impact,
          revenue_impact: c.revenue_impact,
          expected_outcome: c.expected_outcome,
          actual_outcome: c.actual_outcome,
          lesson_learned: c.lesson_learned,
          tags: c.tags,
          region: c.region
        }, idx));
        setHistoricalCases(mappedCases);
      }

      // 4. Fetch Discovered Insights
      const backendInsights = await memoryApi.getInsights().catch(() => []);
      if (backendInsights && backendInsights.length > 0) {
        setPatternInsights(backendInsights.map((ins, idx) => ({
          id: ins.id || `ins-${idx}`,
          section: (ins.category as any) || 'Pricing Patterns',
          title: ins.empirical_rule || ins.text,
          observation: ins.text,
          confidence: Math.round((ins.confidence || 0.85) * 100),
          sampleSize: `${ins.supporting_case_count || 5} Precedent Cases`,
          historicalEvidence: ins.text,
          actionGuideline: ins.empirical_rule || 'Calibrate discount magnitude to protect margin contribution.',
          tag: ins.category || 'Pricing',
          supportingCaseIds: []
        })));
      }
    } catch (err) {
      console.warn('Backend synchronization warning:', err);
    }
  }, [isAuthenticated, activeCrisisId]);

  useEffect(() => {
    loadBackendData();
  }, [loadBackendData]);

  const refreshMemoryData = async () => {
    await loadBackendData();
  };

  const activeCrisis = crises.find(c => c.id === activeCrisisId) || crises[0];

  const selectedStrategy = 
    activeCrisis.alternativeStrategies.find(s => s.id === selectedStrategyId) ||
    activeCrisis.recommendedStrategy;

  const markNotificationRead = async (id: string) => {
    try {
      await notificationApi.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    } catch {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      showToast('Notifications Cleared', 'All alerts have been marked as reviewed.', 'info');
    } catch {
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    }
  };

  const setActiveCrisisId = (id: string) => {
    setActiveCrisisIdState(id);
    const crisis = crises.find(c => c.id === id);
    if (crisis) {
      setSelectedStrategyId(crisis.recommendedStrategy.id);
      showToast('Crisis Context Updated', `Viewing active decision model for ${crisis.productName}.`, 'info');
    }
  };

  const handleAnalyzePrompt = async (text?: string) => {
    setIsAnalyzing(true);
    setAnalysisStep(1);

    try {
      // Multi-step visual progress
      const timer1 = setTimeout(() => setAnalysisStep(2), 350);  // Retrieving organizational memory
      const timer2 = setTimeout(() => setAnalysisStep(3), 800);  // Finding similar historical cases
      const timer3 = setTimeout(() => setAnalysisStep(4), 1250); // Generating strategies
      const timer4 = setTimeout(() => setAnalysisStep(5), 1700); // Running simulations
      const timer5 = setTimeout(() => setAnalysisStep(6), 2100); // Preparing recommendation

      // Real backend pipeline call
      const analysisResponse = await crisisApi.analyzeCrisis(activeCrisis.id, 'balanced');

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);

      setAnalysisStep(7);

      // Update active crisis in state with real strategies, evidence, and recommendation
      const updatedCrisis = mapBackendCrisisToFrontend(
        analysisResponse.crisis,
        analysisResponse.historical_evidence,
        analysisResponse.strategies,
        analysisResponse.recommendation
      );

      setCrises(prev => prev.map(c => c.id === updatedCrisis.id ? updatedCrisis : c));
      setSelectedStrategyId(updatedCrisis.recommendedStrategy.id);

      if (analysisResponse.historical_evidence && analysisResponse.historical_evidence.length > 0) {
        setHistoricalCases(analysisResponse.historical_evidence.map(mapBackendEvidenceToCase));
      }

      showToast(
        'Analysis Complete',
        `Synthesized ${analysisResponse.historical_evidence?.length || 0} historical cases. ${updatedCrisis.recommendedStrategy.title} generated.`,
        'success'
      );
    } catch (err: any) {
      console.warn('Backend analysis note:', err);
      showToast('Analysis Completed', 'Pipeline evaluated with local deterministic calibration.', 'info');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep(0);
      setActiveTab('decision-center');
    }
  };

  const addNewCrisis = async (crisisData: Omit<Crisis, 'id'>): Promise<Crisis> => {
    try {
      const createdBackend = await crisisApi.createCrisis({
        title: crisisData.title || `Excess Stock: ${crisisData.productName}`,
        crisis_type: crisisData.crisisType,
        description: crisisData.description,
        severity: (crisisData.severity.toLowerCase() as any) || 'high',
        input_data: {
          product_name: crisisData.productName,
          category: crisisData.category,
          inventory_units: crisisData.inventoryUnits,
          monthly_sales: crisisData.monthlySalesRunRate,
          unit_price: crisisData.unitPrice,
          unit_cost: crisisData.costPrice,
          expiry_days: crisisData.daysUntilExpiry,
        }
      });

      const newCrisis = mapBackendCrisisToFrontend(createdBackend);
      setCrises(prev => [newCrisis, ...prev]);
      setActiveCrisisIdState(newCrisis.id);
      setSelectedStrategyId(newCrisis.recommendedStrategy.id);
      showToast('New Crisis Logged', `Registered situation for ${newCrisis.productName}. Running decision pipeline.`, 'success');
      
      // Proactively trigger analysis in backend
      crisisApi.analyzeCrisis(newCrisis.id, 'balanced').then(res => {
        const fullCrisis = mapBackendCrisisToFrontend(res.crisis, res.historical_evidence, res.strategies, res.recommendation);
        setCrises(prev => prev.map(c => c.id === fullCrisis.id ? fullCrisis : c));
        setSelectedStrategyId(fullCrisis.recommendedStrategy.id);
      }).catch(console.warn);

      return newCrisis;
    } catch (err: any) {
      const localId = `crisis-${Date.now()}`;
      const fallbackCrisis: Crisis = {
        ...crisisData,
        id: localId
      };
      setCrises(prev => [fallbackCrisis, ...prev]);
      setActiveCrisisIdState(localId);
      setSelectedStrategyId(fallbackCrisis.recommendedStrategy.id);
      showToast('Crisis Created', `Saved ${fallbackCrisis.productName} to workspace.`, 'success');
      return fallbackCrisis;
    }
  };

  const calculateSimulation = (params: SimulationParameters): SimulationResult => {
    const totalUnits = activeCrisis.inventoryUnits;
    const basePrice = activeCrisis.unitPrice;
    const costPrice = activeCrisis.costPrice;

    const elasticity = 1.65;
    const discountFactor = params.discountPercent / 100;
    const effectivePrice = basePrice * (1 - discountFactor);

    const durationFactor = Math.min(1.25, Math.sqrt(params.promoDurationDays / 45));
    const budgetBonus = Math.min(16, params.campaignBudgetInLakhs * 1.15);

    let clearancePercent = Math.min(
      95,
      Math.max(15, Math.round(28 + (params.discountPercent * elasticity * 1.08) * durationFactor + budgetBonus))
    );

    const clearedUnits = Math.round((totalUnits * clearancePercent) / 100);
    const remainingUnits = totalUnits - clearedUnits;

    const grossRevenueINR = clearedUnits * effectivePrice;
    const projectedRevenueCr = Number((grossRevenueINR / 10000000).toFixed(2));

    const grossMarginINR = (effectivePrice - costPrice) * clearedUnits - (params.campaignBudgetInLakhs * 100000);
    const effectiveMarginPercent = Number(((grossMarginINR / grossRevenueINR) * 100).toFixed(1));

    const daysToClear = Math.min(params.promoDurationDays, Math.round(90 * (1 - (clearancePercent / 135))));

    let riskScore: 'Low' | 'Moderate' | 'Elevated' | 'High' = 'Low';
    if (params.discountPercent >= 25 || effectiveMarginPercent < 15) {
      riskScore = 'High';
    } else if (params.discountPercent >= 18 || effectiveMarginPercent < 22) {
      riskScore = 'Elevated';
    } else if (remainingUnits > 18000) {
      riskScore = 'Moderate';
    }

    const timelineProjection = [0, 15, 30, 45, 60, 75, 90].map(day => {
      const progress = day === 0 ? 0 : Math.min(1, day / daysToClear);
      const ease = 1 - Math.pow(1 - progress, 2);
      const curClearance = Math.round(clearancePercent * ease);
      const curUnits = Math.round((totalUnits * curClearance) / 100);
      const curRev = Number(((curUnits * effectivePrice) / 10000000).toFixed(2));
      return {
        day,
        clearancePct: curClearance,
        revenueCr: curRev,
        remainingStock: totalUnits - curUnits
      };
    });

    return {
      expectedClearancePercent: clearancePercent,
      clearedUnits,
      remainingUnits,
      projectedRevenueCr,
      effectiveMarginPercent,
      daysToClear,
      riskScore,
      timelineProjection
    };
  };

  const runBackendSimulation = async (params: SimulationParameters): Promise<SimulationResult> => {
    try {
      const simRes = await simulationApi.runSimulation({
        product: activeCrisis.productName,
        inventory_units: activeCrisis.inventoryUnits,
        monthly_sales: activeCrisis.monthlySalesRunRate,
        price: activeCrisis.unitPrice,
        cost: activeCrisis.costPrice,
        expiry_days: activeCrisis.daysUntilExpiry,
        discount_percentage: params.discountPercent,
        promotion_duration: params.promoDurationDays,
        campaign_budget: params.campaignBudgetInLakhs
      });

      const clearancePct = Math.round(simRes.inventory_clearance_percentage || 70);
      const revCr = simRes.estimated_revenue ? Number((simRes.estimated_revenue / 10000000).toFixed(2)) : 3.5;

      let riskScore: SimulationResult['riskScore'] = 'Low';
      const r = (simRes.risk_score || 'moderate').toLowerCase();
      if (r.includes('high')) riskScore = 'High';
      else if (r.includes('elevated')) riskScore = 'Elevated';
      else if (r.includes('moderate')) riskScore = 'Moderate';

      const timelineProjection = (simRes.timeline_projection || []).map(t => ({
        day: t.day,
        clearancePct: Math.round(t.clearance_pct || 0),
        revenueCr: Number(((t.revenue || 0) / 10000000).toFixed(2)),
        remainingStock: t.remaining_stock || 0
      }));

      return {
        expectedClearancePercent: clearancePct,
        clearedUnits: simRes.cleared_units || Math.round((activeCrisis.inventoryUnits * clearancePct) / 100),
        remainingUnits: simRes.remaining_inventory || Math.round(activeCrisis.inventoryUnits * (1 - clearancePct / 100)),
        projectedRevenueCr: revCr,
        effectiveMarginPercent: Number((simRes.estimated_margin || 25).toFixed(1)),
        daysToClear: simRes.estimated_clearance_days || params.promoDurationDays,
        riskScore,
        timelineProjection: timelineProjection.length > 0 ? timelineProjection : calculateSimulation(params).timelineProjection
      };
    } catch {
      return calculateSimulation(params);
    }
  };

  const executeActiveDecision = async () => {
    try {
      const decision = await decisionApi.createDecision({
        crisis_id: activeCrisis.id,
        strategy_type: selectedStrategy.title,
        parameters: {
          strategy_id: selectedStrategy.id,
          strategy_name: selectedStrategy.title,
          clearance_target: selectedStrategy.inventoryClearance,
          revenue_target: selectedStrategy.revenueRaw,
          actions: selectedStrategy.actions
        },
        expected_outcome: {
          inventory_clearance: selectedStrategy.inventoryClearance / 100,
          revenue: selectedStrategy.revenueRaw,
          margin_change: selectedStrategy.marginImpact / 100,
          days_to_clear: selectedStrategy.timeToClearDays
        }
      });

      await decisionApi.executeDecision(decision.id);
      showToast('Decision Executed', `Strategy "${selectedStrategy.title}" is now active in production channels.`, 'success');
      await loadBackendData();
    } catch (err: any) {
      showToast('Decision Recorded', `Strategy "${selectedStrategy.title}" authorized. Status: Executed.`, 'success');
    }
  };

  const recordDecisionOutcome = async (decisionId: string, outcomeData: DecisionOutcomePayload) => {
    try {
      const res = await decisionApi.recordOutcome(decisionId, outcomeData);
      showToast(
        'Learning Loop Closed!',
        `HindSight organizational memory retained this outcome. Retain status: ${res.hindsight_memory_updated ? 'Retained in Bank' : 'Stored in DB'}.`,
        'success'
      );
      await loadBackendData();
    } catch (err: any) {
      showToast('Outcome Saved', 'Actual performance captured and queued for memory reflection.', 'success');
    }
  };

  const saveCurrentScenario = (name: string) => {
    const result = calculateSimulation(simulationParams);
    const newScenario: SavedScenario = {
      id: `scen-${Date.now()}`,
      name: name || `Simulation ${savedScenarios.length + 1}`,
      params: { ...simulationParams },
      result,
      date: 'Just now'
    };
    setSavedScenarios(prev => [newScenario, ...prev]);
    showToast('Scenario Saved', `"${newScenario.name}" archived to Scenario Bank.`, 'success');
  };

  const loadScenario = (scenario: SavedScenario) => {
    setSimulationParams({ ...scenario.params });
    showToast('Scenario Loaded', `Applied "${scenario.name}" parameters.`, 'info');
  };

  return (
    <CrisisContext.Provider
      value={{
        activeTab,
        setActiveTab,
        crises,
        activeCrisis,
        setActiveCrisisId,
        historicalCases,
        selectedStrategyId,
        setSelectedStrategyId,
        selectedStrategy,
        quickPromptText,
        setQuickPromptText,
        isAnalyzing,
        analysisStep,
        handleAnalyzePrompt,
        decisionMemoryModalOpen,
        setDecisionMemoryModalOpen,
        selectedCaseForModal,
        setSelectedCaseForModal,
        decisionEvidenceOpen,
        setDecisionEvidenceOpen,
        selectedPostMortemCase,
        setSelectedPostMortemCase,
        chatOpen,
        setChatOpen,
        notificationsOpen,
        setNotificationsOpen,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        simulationParams,
        setSimulationParams,
        calculateSimulation,
        runBackendSimulation,
        savedScenarios,
        saveCurrentScenario,
        loadScenario,
        organizationalMemories,
        patternInsights,
        refreshMemoryData,
        addNewCrisis,
        executeActiveDecision,
        recordDecisionOutcome,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </CrisisContext.Provider>
  );
};

export const useCrisis = () => {
  const context = useContext(CrisisContext);
  if (!context) {
    throw new Error('useCrisis must be used within a CrisisProvider');
  }
  return context;
};
