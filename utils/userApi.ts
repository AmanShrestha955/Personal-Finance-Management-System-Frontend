import { getData, putData, deleteData } from "./request";

// ============================================
// Types
// ============================================

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export type UserResponse = {
  success: boolean;
  data: User;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  gender: Gender | null;
  photo: string | null;
  provider: "local" | "google";
  providerId: string | null;
  isVerified: boolean;
  isOnboarded: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type UpdateUserPayload = {
  name?: string;
  phoneNumber?: string;
  gender?: Gender;
  photo?: File; // for multipart/form-data upload
};

export type DeleteUserResponse = {
  success: boolean;
  message: string;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse = {
  success: boolean;
  message: string;
};
// ============================================
// API Functions
// ============================================

export const getUser = async () => {
  const response = await getData<null, UserResponse>("/users/me");
  return response.data;
};

export const updateUser = async (payload: UpdateUserPayload) => {
  const formData = new FormData();

  if (payload.name) formData.append("name", payload.name);
  if (payload.phoneNumber) formData.append("phoneNumber", payload.phoneNumber);
  if (payload.gender) formData.append("gender", payload.gender);
  if (payload.photo) formData.append("photo", payload.photo);

  const response = await putData<FormData, UserResponse>("/users/me", formData);
  return response.data;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const response = await putData<ChangePasswordPayload, ChangePasswordResponse>(
    "/users/me/change-password",
    payload,
  );
  return response;
};

export const deleteUser = async () => {
  const response = await deleteData<DeleteUserResponse>("/users/me");
  return response;
};
