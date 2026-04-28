import { getData, postData, putData, patchData, deleteData } from "./request";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface FamilySavingGoal {
  _id: string;
  userId: string;
  familyId: string;
  goalName: string;
  targetAmount: number;
  currentSaving: number;
  deadline: string;
  category: string;
  isCompleted: boolean;
  visibility: string;
  reminderEnabled: boolean;
  reminderDay: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilySavingGoalBreakdownItem {
  _id: string;
  goalName: string;
  category: string;
  targetAmount: number;
  currentSaving: number;
  remaining: number;
  progressPercentage: number;
  isCompleted: boolean;
  deadline: string;
}

export interface FamilySavingGoalStats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalSaved: number;
  totalTarget: number;
  overallProgress: number;
  goalBreakdown: FamilySavingGoalBreakdownItem[];
}

export interface CreateFamilySavingGoalPayload {
  goalName: string;
  targetAmount: number;
  deadline: string;
  category: string;
  reminderEnabled?: boolean;
  reminderDay?: string;
}

export interface UpdateFamilySavingGoalPayload {
  goalName?: string;
  targetAmount?: number;
  deadline?: string;
  category?: string;
  isCompleted?: boolean;
  reminderEnabled?: boolean;
  reminderDay?: string;
}

export interface SavingProgressTransaction {
  _id: string;
  userId: string;
  savingGoalId: string;
  familyId: string;
  amount: number;
  transactionType: "add" | "withdraw";
  balanceAfter: number;
}

// ─────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────

/** POST /api/families/:familyId/saving-goals — Owner only */
export const createFamilySavingGoal = async (
  familyId: string,
  payload: CreateFamilySavingGoalPayload,
): Promise<FamilySavingGoal> => {
  const response = await postData<
    CreateFamilySavingGoalPayload,
    { message: string; messageStatus: string; data: FamilySavingGoal }
  >(`/families/${familyId}/saving-goals`, payload);
  return response.data;
};

/** GET /api/families/:familyId/saving-goals — Any member */
export const getFamilySavingGoals = async (
  familyId: string,
): Promise<FamilySavingGoal[]> => {
  const response = await getData<
    null,
    { message: string; messageStatus: string; data: FamilySavingGoal[] }
  >(`/families/${familyId}/saving-goals`);
  return response.data;
};

/** GET /api/families/:familyId/saving-goals/stats — Any member */
export const getFamilySavingGoalStats = async (
  familyId: string,
): Promise<FamilySavingGoalStats> => {
  const response = await getData<
    null,
    { message: string; messageStatus: string; data: FamilySavingGoalStats }
  >(`/families/${familyId}/saving-goals/stats`);
  return response.data;
};

/** GET /api/families/:familyId/saving-goals/category/:category — Any member */
export const getFamilySavingGoalByCategory = async (
  familyId: string,
  category: string,
): Promise<FamilySavingGoal> => {
  const response = await getData<
    null,
    { message: string; messageStatus: string; data: FamilySavingGoal }
  >(`/families/${familyId}/saving-goals/category/${category}`);
  return response.data;
};

/** GET /api/families/:familyId/saving-goals/:goalId — Any member */
export const getFamilySavingGoalById = async (
  familyId: string,
  goalId: string,
): Promise<FamilySavingGoal> => {
  const response = await getData<
    null,
    { message: string; messageStatus: string; data: FamilySavingGoal }
  >(`/families/${familyId}/saving-goals/${goalId}`);
  return response.data;
};

/** PUT /api/families/:familyId/saving-goals/:goalId — Owner only (edit metadata) */
export const updateFamilySavingGoal = async (
  familyId: string,
  goalId: string,
  payload: UpdateFamilySavingGoalPayload,
): Promise<FamilySavingGoal> => {
  const response = await putData<
    UpdateFamilySavingGoalPayload,
    { message: string; messageStatus: string; data: FamilySavingGoal }
  >(`/families/${familyId}/saving-goals/${goalId}`, payload);
  return response.data;
};

/**
 * PATCH /api/families/:familyId/saving-goals/:goalId/progress — Any member
 * Pass a positive amount to contribute, negative to withdraw.
 */
export const updateFamilySavingProgress = async (
  familyId: string,
  goalId: string,
  amount: number,
): Promise<{
  savingGoal: FamilySavingGoal;
  transaction: SavingProgressTransaction;
}> => {
  const response = await patchData<
    { amount: number },
    {
      message: string;
      messageStatus: string;
      data: {
        savingGoal: FamilySavingGoal;
        transaction: SavingProgressTransaction;
      };
    }
  >(`/families/${familyId}/saving-goals/${goalId}/progress`, { amount });
  return response.data;
};

/** DELETE /api/families/:familyId/saving-goals/:goalId — Owner only */
export const deleteFamilySavingGoal = async (
  familyId: string,
  goalId: string,
): Promise<{ message: string; note?: string }> => {
  return deleteData<{ message: string; note?: string }>(
    `/families/${familyId}/saving-goals/${goalId}`,
  );
};
