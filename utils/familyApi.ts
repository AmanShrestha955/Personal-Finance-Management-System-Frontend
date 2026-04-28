import { getData, postData, deleteData } from "./request";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type FamilyRole = "owner" | "member";

export interface FamilyMember {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    photo?: string;
  };
  email: string;
  role: FamilyRole;
  joinedAt: string;
}

export interface PendingInvite {
  _id: string;
  email: string;
  token: string;
  tokenExpires: string;
}

export interface Family {
  _id: string;
  name: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    photo?: string;
  };
  members: FamilyMember[];
  pendingInvites: PendingInvite[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFamilyPayload {
  name: string;
}

export interface InviteMemberPayload {
  email: string;
}

// ─────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────

/** POST /api/families — Create a new family */
export const createFamily = async (
  payload: CreateFamilyPayload,
): Promise<Family> => {
  const response = await postData<
    CreateFamilyPayload,
    { message: string; family: Family }
  >("/families", payload);
  return response.family;
};

/** GET /api/families/me — Get the logged-in user's family */
export const getMyFamily = async (): Promise<Family> => {
  const response = await getData<null, { family: Family }>("/families/me");
  return response.family;
};

/** POST /api/families/:familyId/invite — Owner invites a member by email */
export const inviteMember = async (
  familyId: string,
  payload: InviteMemberPayload,
): Promise<string> => {
  const response = await postData<InviteMemberPayload, { message: string }>(
    `/families/${familyId}/invite`,
    payload,
  );
  return response.message;
};

/** GET /api/families/invite/accept?token=... — Accept a pending invite */
export const acceptInvite = async (token: string): Promise<Family> => {
  const response = await getData<null, { message: string; family: Family }>(
    `/families/invite/accept?token=${token}`,
  );
  return response.family;
};

/** GET /api/families/invite/decline?token=... — Decline a pending invite */
export const declineInvite = async (token: string): Promise<string> => {
  const response = await getData<null, { message: string }>(
    `/families/invite/decline?token=${token}`,
  );
  return response.message;
};

/** DELETE /api/families/:familyId/members/:memberId — Owner removes a member */
export const removeMember = async (
  familyId: string,
  memberId: string,
): Promise<string> => {
  const response = await deleteData<{ message: string }>(
    `/families/${familyId}/members/${memberId}`,
  );
  return response.message;
};

/** DELETE /api/families/:familyId/invites/:inviteId — Owner cancels a pending invite */
export const cancelInvite = async (
  familyId: string,
  inviteId: string,
): Promise<string> => {
  const response = await deleteData<{ message: string }>(
    `/families/${familyId}/invites/${inviteId}`,
  );
  return response.message;
};
