import { getData, postData, patchData } from "./request";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type TransferStatus = "pending" | "confirmed" | "cancelled";

export interface TransferUser {
  _id: string;
  name: string;
  email: string;
  photo?: string;
}

export interface FamilyTransfer {
  _id: string;
  familyId: string;
  fromUser: TransferUser;
  toUser: TransferUser;
  amount: number;
  note?: string;
  transferDate: string;
  status: TransferStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransferPayload {
  familyId: string;
  toUser: string;
  amount: number;
  note?: string;
  transferDate?: string;
}

// ─────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────

/** POST /api/family-transfers — Any family member can create a transfer */
export const createTransfer = async (
  payload: CreateTransferPayload,
): Promise<FamilyTransfer> => {
  const response = await postData<
    CreateTransferPayload,
    { message: string; transfer: FamilyTransfer }
  >(`/family-transfers`, payload);
  return response.transfer;
};

/** GET /api/family-transfers/family/:familyId — All transfers in the family (members only) */
export const getFamilyTransfers = async (
  familyId: string,
  status?: TransferStatus,
): Promise<FamilyTransfer[]> => {
  const query = status ? `?status=${status}` : "";
  const response = await getData<null, { transfers: FamilyTransfer[] }>(
    `/family-transfers/family/${familyId}${query}`,
  );
  return response.transfers;
};

/** GET /api/family-transfers/my/:familyId — Transfers where logged-in user is sender or receiver */
export const getMyTransfers = async (
  familyId: string,
): Promise<FamilyTransfer[]> => {
  const response = await getData<null, { transfers: FamilyTransfer[] }>(
    `/family-transfers/my/${familyId}`,
  );
  return response.transfers;
};

/** PATCH /api/family-transfers/:transferId/confirm — Receiver confirms */
export const confirmTransfer = async (
  transferId: string,
): Promise<FamilyTransfer> => {
  const response = await patchData<
    undefined,
    { message: string; transfer: FamilyTransfer }
  >(`/family-transfers/${transferId}/confirm`);
  return response.transfer;
};

/** PATCH /api/family-transfers/:transferId/cancel — Sender cancels */
export const cancelTransfer = async (
  transferId: string,
): Promise<FamilyTransfer> => {
  const response = await patchData<
    undefined,
    { message: string; transfer: FamilyTransfer }
  >(`/family-transfers/${transferId}/cancel`);
  return response.transfer;
};
