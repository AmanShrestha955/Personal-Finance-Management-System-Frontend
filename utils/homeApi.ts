import { Category, TransactionDetail, TransactionType } from "@/types/type";
import { getData } from "./request";

// Types

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface ExpenseTimelineItem {
  day?: string;
  week?: string;
  month?: string;
  amount: number;
}

export interface AccountSummary {
  totalBalance: number;
  thisMonth: {
    income: number;
    expenses: number;
    balance: number;
  };
  monthChanges: {
    income: {
      amount: number;
      percentage: number;
      trend: "up" | "down" | "stable";
    };
    expenses: {
      amount: number;
      percentage: number;
      trend: "up" | "down" | "stable";
    };
    balance: {
      amount: number;
      percentage: number;
      trend: "up" | "down" | "stable";
    };
  };
}

export interface Top5ExpenseCategory {
  category: Category;
  amount: number;
}

export interface Top5ExpensesResponse {
  message: string;
  period: string;
  dateRange: {
    from: string;
    to: string;
  } | null;
  data: Top5ExpenseCategory[];
}

export type TimeFilter =
  | {
      key: "week";
      timeRange: "1";
    }
  | {
      key: "month";
      timeRange: "1" | "3" | "6";
    }
  | {
      key: "year";
      timeRange: "1";
    };

// API Functions
export const getTop5Expenses = async ({
  key,
  timeRange,
}: TimeFilter): Promise<Top5ExpenseCategory[]> => {
  const response = await getData<null, Top5ExpensesResponse>(
    `/stats/top5?${key}=${timeRange}`,
  );
  return response.data;
};

export const getExpensesByTimePeriod = async (
  { key, timeRange }: TimeFilter,
  type: TransactionType,
): Promise<ExpenseTimelineItem[]> => {
  const response = await getData<null, ApiResponse<ExpenseTimelineItem[]>>(
    `/stats/expenses-timeline?${key}=${timeRange}&type=${type}`,
  );
  return response.data;
};

export const getAccountSummaryData = async (): Promise<AccountSummary> => {
  const response = await getData<null, ApiResponse<AccountSummary>>(
    `/stats/account-summary`,
  );
  return response.data;
};

export const getRecentMonthTransactions = async () => {
  const response = await getData<null, ApiResponse<TransactionDetail[]>>(
    `/transactions/recent-month`,
  );
  return response.data;
};
