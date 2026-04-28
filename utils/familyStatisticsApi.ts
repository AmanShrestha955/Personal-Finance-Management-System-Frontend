import { getData } from "./request";
import { TimeFilter } from "./homeApi";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface FamilyTopExpenseCategory {
  category: string;
  amount: number;
  transactionCount: number;
}

export interface FamilyAmountByPeriodItem {
  day?: string;
  week?: string;
  month?: string;
  amount: number;
}

// ─────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────

/**
 * GET /api/families/:familyId/stats/top-expenses
 * Top 5 expense categories for a given time period — any member
 */
export const getFamilyTop5Expenses = async (
  familyId: string,
  { key, timeRange }: TimeFilter,
): Promise<FamilyTopExpenseCategory[]> => {
  const response = await getData<
    null,
    {
      message: string;
      messageStatus: string;
      period: string;
      dateRange: { from: string; to: string } | null;
      data: FamilyTopExpenseCategory[];
    }
  >(`/families/${familyId}/stats/top-expenses?${key}=${timeRange}`);
  return response.data;
};

/**
 * GET /api/families/:familyId/stats/amount-by-period
 * Time-series income or expense breakdown — any member
 */
export const getFamilyAmountByPeriod = async (
  familyId: string,
  { key, timeRange }: TimeFilter,
  type: "income" | "expense",
): Promise<FamilyAmountByPeriodItem[]> => {
  const response = await getData<
    null,
    {
      message: string;
      messageStatus: string;
      period: string;
      type: string;
      dateRange: { from: string; to: string } | null;
      data: FamilyAmountByPeriodItem[];
    }
  >(
    `/families/${familyId}/stats/amount-by-period?${key}=${timeRange}&type=${type}`,
  );
  return response.data;
};
