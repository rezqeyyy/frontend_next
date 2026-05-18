export interface MetricData {
  title: string;
  amount: string;
  subtitle: string;
  subtext: string;
  type: "danger" | "warning" | "caution" | "success";
}

export interface RiskDistribution {
  level: "High Risk" | "Medium Risk" | "Low Risk";
  amount: string;
  percentage: number;
  colorClass: string;
  bgClass: string;
}

export interface DistributionSummary {
  totalRevenue: string;
  atRisk: string;
  protected: string;
}

export interface CustomerData {
  id: string;
  churnRisk: number;
  lastLogin: string;
  impactCustomers: number;
  impactTotal: string;
  totalSpent: string;
  potentialLoss: string;
  accountAge: string;
  churnFactors: string[];
  riskLevel: "high" | "medium" | "low";
}

export interface RetentionData {
  currentChurn: number;
  savedBy50Percent: string;
  annualSavings: string;
  roiPercentage: number;
}

export interface RecommendedAction {
  id: string;
  title: string;
  contribution: number;
  type: "alert" | "call" | "sparkle" | "target";
}

export interface RevenueDashboardData {
  metrics: MetricData[];
  distribution: RiskDistribution[];
  distributionSummary: DistributionSummary;
  highImpactCustomers: CustomerData[];
  retentionImpact: RetentionData;
  recommendedActions: RecommendedAction[];
}