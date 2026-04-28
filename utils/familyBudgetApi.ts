import { getData, postData, putData, deleteData } from "./request";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type BudgetStatus = "on-track" | "warning" | "exceeded";

export interface FamilyBudget {
  _id: string;
  userId: string;
  familyId: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  alertThreshold: number;
  month: string;
  isActive: boolean;
  visibility: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyBudgetSummaryItem {
  _id: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  spentPercentage: number;
  alertThreshold: number;
  status: BudgetStatus;
  month: string;
}

export interface CreateFamilyBudgetPayload {
  category: string;
  budgetAmount: number;
  alertThreshold?: number;
}

export interface UpdateFamilyBudgetPayload {
  category?: string;
  budgetAmount?: number;
  alertThreshold?: number;
  isActive?: boolean;
}

// ─────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────

/** POST /api/families/:familyId/budgets — Owner only */
export const createFamilyBudget = async (
  familyId: string,
  payload: CreateFamilyBudgetPayload,
): Promise<FamilyBudget> => {
  const response = await postData<
    CreateFamilyBudgetPayload,
    {
      message: string;
      messageStatus: string;
      data: FamilyBudget;
      calculatedSpent: number;
    }
  >(`/families/${familyId}/budgets`, payload);
  return response.data;
};

/** GET /api/families/:familyId/budgets — Any member */
export const getFamilyBudgets = async (
  familyId: string,
): Promise<FamilyBudget[]> => {
  const response = await getData<
    null,
    { message: string; messageStatus: string; data: FamilyBudget[] }
  >(`/families/${familyId}/budgets`);
  return response.data;
};

/** GET /api/families/:familyId/budgets/summary — Any member */
export const getFamilyBudgetSummary = async (
  familyId: string,
): Promise<FamilyBudgetSummaryItem[]> => {
  const response = await getData<
    null,
    { message: string; messageStatus: string; data: FamilyBudgetSummaryItem[] }
  >(`/families/${familyId}/budgets/summary`);
  return response.data;
};

/** GET /api/families/:familyId/budgets/category/:category — Any member */
export const getFamilyBudgetByCategory = async (
  familyId: string,
  category: string,
): Promise<FamilyBudget> => {
  const response = await getData<
    null,
    { message: string; messageStatus: string; data: FamilyBudget }
  >(`/families/${familyId}/budgets/category/${category}`);
  return response.data;
};

/** GET /api/families/:familyId/budgets/:budgetId — Any member */
export const getFamilyBudgetById = async (
  familyId: string,
  budgetId: string,
): Promise<FamilyBudget> => {
  const response = await getData<
    null,
    { message: string; messageStatus: string; data: FamilyBudget }
  >(`/families/${familyId}/budgets/${budgetId}`);
  return response.data;
};

/** PUT /api/families/:familyId/budgets/:budgetId — Owner only */
export const updateFamilyBudget = async (
  familyId: string,
  budgetId: string,
  payload: UpdateFamilyBudgetPayload,
): Promise<FamilyBudget> => {
  const response = await putData<
    UpdateFamilyBudgetPayload,
    { message: string; messageStatus: string; data: FamilyBudget }
  >(`/families/${familyId}/budgets/${budgetId}`, payload);
  return response.data;
};

/** DELETE /api/families/:familyId/budgets/:budgetId — Owner only */
export const deleteFamilyBudget = async (
  familyId: string,
  budgetId: string,
): Promise<string> => {
  const response = await deleteData<{ message: string }>(
    `/families/${familyId}/budgets/${budgetId}`,
  );
  return response.message;
};
