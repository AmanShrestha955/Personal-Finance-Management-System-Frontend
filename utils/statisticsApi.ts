import { TimeFilter, TimeOptionsDataType } from "@/types/type";
import { getData } from "./request";
import { getExpensesByTimePeriod, getRecentMonthTransactions } from "./homeApi";
import { getSavingGoals } from "./savingGoalApi";

export type MoneyHighlightsResponse = {
  success: boolean;
  period: TimeOptionsDataType;

  dateRange: {
    start: string; // ISO date string
    end: string; // ISO date string
  };

  data: {
    totalIncome: FinancialMetric;
    totalExpenses: FinancialMetric;
    totalSavings: FinancialMetric;
    transactions: TransactionsMetric;
  };

  comparison: {
    currentPeriod: PeriodComparison;
    previousPeriod: PreviousPeriodComparison;
  };
};

type FinancialMetric = {
  amount: number;
  formatted: string;
  change: {
    value: string; // e.g. "+100%"
    color: "green" | "red";
    rawValue: number;
  };
  label: string;
};

type TransactionsMetric = {
  count: number;
  period: TimeOptionsDataType;
  label: string;
};

type PeriodComparison = {
  income: number;
  expenses: number;
  savings: number;
  net: number;
};

type PreviousPeriodComparison = {
  income: number;
  expenses: number;
  net: number;
};

type IncomeVsExpensesResponse = {
  message: string;
  period: string;
  periodType: "month" | "week" | "day";

  dateRange: {
    from: string; // YYYY-MM-DD
    to: string; // YYYY-MM-DD
  };

  data: IncomeVsExpensesItem[];
};

export type IncomeVsExpensesItem = {
  day?: string;
  week?: string;
  month?: string;
  income: number;
  expenses: number;
};

export type FinancialHealthResponse = {
  success: boolean;
  message: string;

  period: {
    month: string; // e.g. "February"
    year: number; // e.g. 2026
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
  };

  // ✨ NEW: Overall Financial Health Score
  overallHealthScore: {
    score: number; // 0-100
    outOf: number; // 100
    status: OverallStatus; // "Excellent" | "Good" | "Fair" | "Needs Improvement"
    description: string;
  };

  metrics: {
    savingsRate: HealthMetric;
    spendingControl: HealthMetric;
    budgetAdherence: HealthMetric;
  };

  summary: FinancialSummary;

  categoryBreakdown: CategoryHealth[];
};

type HealthMetric = {
  value: number; // usually percentage (0–100)
  label: string;
  description: string;
  weight: string; // e.g. "35%" - NEW: shows metric weight in overall score
  status: MetricStatus; // "excellent" | "good" | "warning" | "needs improvement" | "over budget"
};

type FinancialSummary = {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  totalBudget: number;
  budgetRemaining: number;
  categoriesWithinBudget: number;
  totalCategories: number;
};

type CategoryHealth = {
  category: string;
  budgetAmount: number;
  spentAmount: number;
  remaining: number;
  percentage: number; // % spent
  isWithinBudget: boolean;
  status: CategoryStatus; // "good" | "warning" | "exceeded"
};

// ============================================
// NEW: Status Type Definitions
// ============================================

// Overall health score status
type OverallStatus = "Excellent" | "Good" | "Fair" | "Needs Improvement";

// Individual metric status (lowercase from API)
type MetricStatus =
  | "excellent"
  | "good"
  | "warning"
  | "needs improvement"
  | "over budget";

// Category status
type CategoryStatus = "good" | "warning" | "exceeded";

type BudgetDetail = {
  _id: string;
  userId: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  alertThreshold: number;
  month: Date;
  isActive: boolean;
};
type BudgetData = {
  message: string;
  data: BudgetDetail[];
};

export const getMoneyHighlights = async (period: TimeOptionsDataType) => {
  const response = await getData<null, MoneyHighlightsResponse>(
    `/stats/money-highlights?period=${period}`,
  );
  return response.data;
};

export const getIncomeExpenseComparison = async ({
  key,
  timeRange,
}: TimeFilter) => {
  const response = await getData<null, IncomeVsExpensesResponse>(
    `/stats/income-expense-comparison?${key}=${timeRange}`,
  );
  return response.data;
};

export const getFinancialHealthMetrics = async () => {
  const response = await getData<null, FinancialHealthResponse>(
    `/stats/financial-health`,
  );
  return response;
};

export const getBudgets = async () => {
  const response = await getData<null, BudgetData>("/budgets/");
  return response.data;
};

export { getExpensesByTimePeriod };

export { getRecentMonthTransactions };

export { getSavingGoals };
