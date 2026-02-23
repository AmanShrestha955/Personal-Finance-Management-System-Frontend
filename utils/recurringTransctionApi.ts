import { getData, postData, putData, patchData, deleteData } from "./request";

// ============================================
// Types
// ============================================

export type TransactionType = "income" | "expense";

export type Frequency = "daily" | "weekly" | "monthly" | "yearly";

export type PaymentMethod = "Cash" | "Credit Card" | "Debit Card" | "e-Wallet";

export type RecurringTransaction = {
  _id: string;
  userId: string;
  accountId: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  paymentMethod: PaymentMethod;
  description: string | null;
  frequency: Frequency;
  startDate: string; // ISO date string
  endDate: string | null; // null = runs indefinitely
  nextRunDate: string; // ISO date string
  isActive: boolean;
  lastRunDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RecurringTransactionResponse = {
  message: string;
  data: RecurringTransaction;
};

export type RecurringTransactionsResponse = {
  message: string;
  data: RecurringTransaction[];
};

export type CreateRecurringTransactionPayload = {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  paymentMethod: PaymentMethod;
  frequency: Frequency;
  startDate: string; // "YYYY-MM-DD"
  description?: string;
  endDate?: string; // "YYYY-MM-DD" — omit for indefinite
};

export type UpdateRecurringTransactionPayload = {
  title?: string;
  amount?: number;
  type?: TransactionType;
  category?: string;
  paymentMethod?: PaymentMethod;
  description?: string;
  frequency?: Frequency;
  startDate?: string;
  endDate?: string | null; // pass null to remove end date
  isActive?: boolean;
};

export type ToggleRecurringTransactionResponse = {
  message: string; // "Recurring transaction activated/paused successfully"
  data: RecurringTransaction;
};

export type DeleteRecurringTransactionResponse = {
  message: string;
};

// ============================================
// API Functions
// ============================================

export const createRecurringTransaction = async (
  payload: CreateRecurringTransactionPayload,
) => {
  const response = await postData<
    CreateRecurringTransactionPayload,
    RecurringTransactionResponse
  >("/recurring-transactions", payload);
  return response;
};

export const getRecurringTransactions = async () => {
  const response = await getData<null, RecurringTransactionsResponse>(
    "/recurring-transactions",
  );
  return response;
};

export const getRecurringTransactionById = async (recurringId: string) => {
  const response = await getData<null, RecurringTransactionResponse>(
    `/recurring-transactions/${recurringId}`,
  );
  return response;
};

export const updateRecurringTransaction = async (
  recurringId: string,
  payload: UpdateRecurringTransactionPayload,
) => {
  const response = await putData<
    UpdateRecurringTransactionPayload,
    RecurringTransactionResponse
  >(`/recurring-transactions/${recurringId}`, payload);
  return response;
};

export const toggleRecurringTransaction = async (recurringId: string) => {
  const response = await patchData<null, ToggleRecurringTransactionResponse>(
    `/recurring-transactions/${recurringId}/toggle`,
  );
  return response;
};

export const deleteRecurringTransaction = async (recurringId: string) => {
  const response = await deleteData<DeleteRecurringTransactionResponse>(
    `/recurring-transactions/${recurringId}`,
  );
  return response;
};
