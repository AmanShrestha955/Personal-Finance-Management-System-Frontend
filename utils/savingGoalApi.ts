import { getData, postData, putData, deleteData } from "./request";

// Types
export interface SavingGoal {
  _id: string;
  userId: string;
  goalName: string;
  targetAmount: number;
  currentSaving: number;
  deadline: string;
  category: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavingGoalData {
  goalName: string;
  targetAmount: number;
  currentSaving?: number;
  deadline: string;
  category: string;
}

export interface UpdateSavingGoalData {
  goalName?: string;
  targetAmount?: number;
  currentSaving?: number;
  deadline?: string;
  category?: string;
  isCompleted?: boolean;
}

export interface UpdateProgressData {
  amount: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface StatisticWithChange {
  amount: number;
  percentageChange: number;
  difference: number;
}

export interface StatisticCount {
  count: number;
}

export interface SavingGoalStatsData {
  totalSaved: StatisticWithChange;
  totalGoals: StatisticCount;
  completedGoals: StatisticCount;
  remainingBalance: StatisticWithChange;
}

// API Functions
export const getSavingGoals = async (): Promise<SavingGoal[]> => {
  const response = await getData<null, ApiResponse<SavingGoal[]>>(
    "/savingGoals",
  );
  return response.data;
};

export const getSavingGoalsStats = async (): Promise<SavingGoalStatsData> => {
  const response = await getData<null, ApiResponse<SavingGoalStatsData>>(
    "/savingGoals/stats",
  );
  return response.data;
};

export const getSavingGoalById = async (
  goalId: string,
): Promise<SavingGoal> => {
  const response = await getData<null, ApiResponse<SavingGoal>>(
    `/savingGoals/${goalId}`,
  );
  return response.data;
};

export const getSavingGoalByCategory = async (
  category: string,
): Promise<SavingGoal> => {
  const response = await getData<null, ApiResponse<SavingGoal>>(
    `/savingGoals/category/${category}`,
  );
  return response.data;
};

export const createSavingGoal = async (
  data: CreateSavingGoalData,
): Promise<SavingGoal> => {
  const response = await postData<
    CreateSavingGoalData,
    ApiResponse<SavingGoal>
  >("/savingGoals", data);
  return response.data;
};

export const updateSavingGoal = async (
  goalId: string,
  data: UpdateSavingGoalData,
): Promise<SavingGoal> => {
  const response = await putData<UpdateSavingGoalData, ApiResponse<SavingGoal>>(
    `/savingGoals/${goalId}`,
    data,
  );
  return response.data;
};

export const updateSavingProgress = async (
  goalId: string,
  data: UpdateProgressData,
): Promise<SavingGoal> => {
  const response = await putData<UpdateProgressData, ApiResponse<SavingGoal>>(
    `/savingGoals/${goalId}/progress`,
    data,
  );
  return response.data;
};

export const deleteSavingGoal = async (goalId: string): Promise<void> => {
  await deleteData<ApiResponse<void>>(`/savingGoals/${goalId}`);
};
