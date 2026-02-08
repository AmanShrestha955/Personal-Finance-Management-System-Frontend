import { JSX } from "react";

export type TimeOptionsDataType =
  | "This Week"
  | "This Month"
  | "Last 3 Months"
  | "Last 6 Months"
  | "This Year";

export type SignInForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type SignUpForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginData = {
  token?: string;
  message: string;
  error?: string;
};

export type SignUpData = {
  message: string;
  error?: string;
};

export type TransactionDetail = {
  _id: string;
  userId: string;
  accountId: string;
  title: string;
  amount: number;
  category: string;
  transactionDate: Date;
  description?: string;
  type: string;
  note?: string;
  receipt?: string;
  tags?: string[];
};

export type OptionWithIcon = { text: string; icon: React.ComponentType };
export type OptionWithoutIcon = { text: string };
export type DropDownProps<T> = {
  options: T[];
  selectedOption: T;
  onSelect: (option: T) => void;
  isOpen: boolean;
  onToggle: () => void;
};

export type TransactionFormData = {
  title: string;
  type: TransactionType;
  amount: number;
  transactionDate: string;
  category: string;
  paymentMethod: string;
  description: string;
  tags: string[];
  receipt: FileList | null;
  note: string;
};
export type BackendErrorResponse = {
  message: string;
  error?: string;
};

export type TransactionFormResponseData = {
  message: string;
};

export type AccountResponseData = {
  data: {
    balance: number;
  }[];
};

export type BudgetData = {
  category: string;
  budgetAmount: number;
  spentAmount: number;
  alertThreshold: number;
};

export type AllBudgetResponseData = {
  message: string;
  data: BudgetData[];
};

export type BudgetFormResponseData = {
  message: string;
  data: BudgetData;
};

export type Category =
  | "Food & Dining"
  | "Transport"
  | "Shopping"
  | "Bills & Utilities"
  | "Rent/Housing"
  | "Entertainment"
  | "Healthcare"
  | "Personal Care"
  | "Savings"
  | "Education"
  | "Others";

export type TransactionType = "expense" | "income";

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
