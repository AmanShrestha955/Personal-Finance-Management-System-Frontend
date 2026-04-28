import { getData, postData, putData, deleteData } from "./request";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type TransactionType = "income" | "expense";

export interface FamilyTransactionUser {
  _id: string;
  name: string;
  email: string;
}

export interface FamilyTransaction {
  _id: string;
  userId: FamilyTransactionUser;
  accountId: string;
  familyId: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  paymentMethod: string;
  transactionDate: string;
  description?: string;
  note?: string;
  receipt?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FamilyTransactionSummary {
  income: number;
  expense: number;
  incomeCount: number;
  expenseCount: number;
  balance: number;
}

export interface CreateFamilyTransactionPayload {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  paymentMethod: string;
  transactionDate?: string;
  description?: string;
  note?: string;
  tags?: string[];
  receipt?: File;
}

export interface FamilyTransactionResponse {
  message: string;
  messageStatus: "success" | "error";
  warning?: string;
  warningStatus?: "warning" | "danger";
  data: FamilyTransaction;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const buildTransactionFormData = (
  payload: Partial<CreateFamilyTransactionPayload>,
): FormData => {
  const formData = new FormData();
  if (payload.title) formData.append("title", payload.title);
  if (payload.amount !== undefined)
    formData.append("amount", String(payload.amount));
  if (payload.type) formData.append("type", payload.type);
  if (payload.category) formData.append("category", payload.category);
  if (payload.paymentMethod)
    formData.append("paymentMethod", payload.paymentMethod);
  if (payload.transactionDate)
    formData.append("transactionDate", payload.transactionDate);
  if (payload.description !== undefined)
    formData.append("description", payload.description);
  if (payload.note !== undefined) formData.append("note", payload.note);
  if (payload.tags) formData.append("tags", JSON.stringify(payload.tags));
  if (payload.receipt) formData.append("receipt", payload.receipt);
  return formData;
};

// ─────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────

/** POST /api/families/:familyId/transactions — Any member can create */
export const createFamilyTransaction = async (
  familyId: string,
  payload: CreateFamilyTransactionPayload,
): Promise<FamilyTransactionResponse> => {
  return postData<FormData, FamilyTransactionResponse>(
    `/families/${familyId}/transactions`,
    buildTransactionFormData(payload),
  );
};

/** GET /api/families/:familyId/transactions — Get all transactions */
export const getFamilyTransactions = async (
  familyId: string,
): Promise<FamilyTransaction[]> => {
  const response = await getData<
    null,
    { message: string; data: FamilyTransaction[] }
  >(`/families/${familyId}/transactions`);
  return response.data;
};

/** GET /api/families/:familyId/transactions/summary — Income / expense / balance totals */
export const getFamilyTransactionSummary = async (
  familyId: string,
): Promise<FamilyTransactionSummary> => {
  const response = await getData<
    null,
    { message: string; data: FamilyTransactionSummary }
  >(`/families/${familyId}/transactions/summary`);
  return response.data;
};

/** GET /api/families/:familyId/transactions/:transactionId — Get single transaction */
export const getFamilyTransactionById = async (
  familyId: string,
  transactionId: string,
): Promise<FamilyTransaction> => {
  const response = await getData<
    null,
    { message: string; data: FamilyTransaction }
  >(`/families/${familyId}/transactions/${transactionId}`);
  return response.data;
};

/** PUT /api/families/:familyId/transactions/:transactionId — Owner: any | Member: own only */
export const updateFamilyTransaction = async (
  familyId: string,
  transactionId: string,
  payload: Partial<CreateFamilyTransactionPayload>,
): Promise<FamilyTransactionResponse> => {
  return putData<FormData, FamilyTransactionResponse>(
    `/families/${familyId}/transactions/${transactionId}`,
    buildTransactionFormData(payload),
  );
};

/** DELETE /api/families/:familyId/transactions/:transactionId — Owner: any | Member: own only */
export const deleteFamilyTransaction = async (
  familyId: string,
  transactionId: string,
): Promise<string> => {
  const response = await deleteData<{ message: string }>(
    `/families/${familyId}/transactions/${transactionId}`,
  );
  return response.message;
};
