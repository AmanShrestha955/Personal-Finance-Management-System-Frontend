"use client";
import Input from "@/component/Input";
import { BackendErrorResponse } from "@/types/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getMyFamily,
  inviteMember,
  removeMember,
  cancelInvite,
  InviteMemberPayload,
  FamilyMember,
  PendingInvite,
} from "@/utils/familyApi";
import { useNotification } from "@/hooks/NotificationContext";

const Page: NextPage = () => {
  const { addNotification } = useNotification();
  const navigation = useRouter();
  const queryClient = useQueryClient();

  // ── Fetch family ──────────────────────────────
  const {
    data: family,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["family"],
    queryFn: getMyFamily,
  });

  // ── Invite form ───────────────────────────────
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<InviteMemberPayload>({
    defaultValues: { email: "" },
  });

  // ── Track which member/invite is being actioned ──
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [cancellingInviteId, setCancellingInviteId] = useState<string | null>(
    null,
  );

  // ── Invite mutation ───────────────────────────
  const inviteMutation = useMutation({
    mutationFn: async (data: InviteMemberPayload) => {
      return await inviteMember(family!._id, data);
    },
    onSuccess: (message) => {
      console.log("Invite sent: ", message);
      addNotification("success", "Invite Sent", message);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["family"] });
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      addNotification("error", "Invite Member", message);
      console.log("Error sending invite: ", message);
    },
  });

  // ── Remove member mutation ─────────────────────
  const removeMutation = useMutation({
    mutationFn: async (memberId: string) => {
      return await removeMember(family!._id, memberId);
    },
    onSuccess: (message) => {
      console.log("Member removed: ", message);
      addNotification("success", "Member Removed", message);
      setRemovingMemberId(null);
      queryClient.invalidateQueries({ queryKey: ["family"] });
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      addNotification("error", "Remove Member", message);
      setRemovingMemberId(null);
      console.log("Error removing member: ", message);
    },
  });

  // ── Cancel invite mutation ─────────────────────
  const cancelMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      return await cancelInvite(family!._id, inviteId);
    },
    onSuccess: (message) => {
      console.log("Invite cancelled: ", message);
      addNotification("success", "Invite Cancelled", message);
      setCancellingInviteId(null);
      queryClient.invalidateQueries({ queryKey: ["family"] });
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      addNotification("error", "Cancel Invite", message);
      setCancellingInviteId(null);
      console.log("Error cancelling invite: ", message);
    },
  });

  const onInviteSubmit = (data: InviteMemberPayload) => {
    inviteMutation.mutate(data);
  };

  const handleRemoveMember = (member: FamilyMember) => {
    setRemovingMemberId(member._id);
    removeMutation.mutate(member._id);
  };

  const handleCancelInvite = (invite: PendingInvite) => {
    setCancellingInviteId(invite._id);
    cancelMutation.mutate(invite._id);
  };

  useEffect(() => {
    family && console.log("Loaded family: ", family);
  }, [family]);

  // ── Loading / error states ─────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="font-nunitosans text-body text-text-1000">
          Loading family...
        </p>
      </div>
    );
  }

  if (isError || !family) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="font-nunitosans text-body text-red-500">
          Could not load your family. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-md mt-8 mr-[32px]">
      {/* ── Left: Invite form + member list ── */}
      <div className="flex-1 flex flex-col gap-xl">
        {/* Header */}
        <div className="flex flex-col gap-md">
          <h1 className="font-sansation font-bold text-heading text-text-1000 leading-[100%]">
            Manage Members
          </h1>
          <p className="font-sansation text-body tracking-[5%] text-text-1000">
            Invite new members to <b>{family.name}</b> or manage existing ones.
          </p>
        </div>

        {/* Invite form */}
        <form
          onSubmit={handleSubmit(onInviteSubmit)}
          className="flex flex-col gap-lg"
        >
          <div className="flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Invite by Email
            </p>
            <div className="flex flex-row gap-md items-start">
              <div className="flex-1 flex flex-col gap-xxs">
                <Input
                  placeholder="eg. john@example.com"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={inviteMutation.isPending}
                className="font-nunitosans font-bold text-text-100 text-body py-xs px-md rounded-sm bg-primary-500 hover:bg-primary-600 active:bg-primary-800 shadow-effect-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {inviteMutation.isPending ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </div>
        </form>

        {/* Current Members */}
        <div className="flex flex-col gap-md">
          <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
            Current Members
          </p>

          {family.members.length === 0 ? (
            <p className="font-nunitosans text-body text-text-1000 opacity-50">
              No members yet.
            </p>
          ) : (
            <div className="flex flex-col gap-sm">
              {family.members.map((member) => (
                <div
                  key={member._id}
                  className="flex flex-row items-center justify-between px-md py-sm rounded-md border border-card-200 bg-card-100 shadow-effect-2"
                >
                  <div className="flex flex-row items-center gap-md">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-card-200 flex items-center justify-center overflow-hidden shrink-0">
                      {member.user?.photo ? (
                        <Image
                          width={40}
                          height={40}
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${
                            member.user.photo
                          }`}
                          alt={member.user.name}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="font-nunitosans font-bold text-body text-text-1000">
                          {member.user?.name?.[0]?.toUpperCase() ?? "?"}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-0.5">
                      <p className="font-nunitosans font-bold text-body text-text-1000">
                        {member.user?.name ?? member.email}
                      </p>
                      <p className="font-nunitosans text-caption text-text-1000 opacity-60">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-md">
                    <span
                      className={`inline-block px-sm py-0.5 rounded-full text-caption font-nunitosans font-medium text-text-100 ${
                        member.role === "owner" ? "bg-tag-1" : "bg-tag-2"
                      }`}
                    >
                      {member.role === "owner" ? "Owner" : "Member"}
                    </span>

                    {/* Only show remove for non-owners */}
                    {member.role !== "owner" && (
                      <button
                        type="button"
                        disabled={
                          removingMemberId === member._id &&
                          removeMutation.isPending
                        }
                        onClick={() => handleRemoveMember(member)}
                        className="font-nunitosans font-bold text-caption py-[4px] px-sm rounded-sm border border-card-200 bg-card-100 hover:bg-card-200 active:bg-card-300 text-text-1000 shadow-effect-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {removingMemberId === member._id &&
                        removeMutation.isPending
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Invites */}
        <div className="flex flex-col gap-md">
          <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
            Pending Invites
          </p>

          {family.pendingInvites.length === 0 ? (
            <p className="font-nunitosans text-body text-text-1000 opacity-50">
              No pending invites.
            </p>
          ) : (
            <div className="flex flex-col gap-sm">
              {family.pendingInvites.map((invite) => (
                <div
                  key={invite._id}
                  className="flex flex-row items-center justify-between px-md py-sm rounded-md border border-card-200 bg-card-100 shadow-effect-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="font-nunitosans font-bold text-body text-text-1000">
                      {invite.email}
                    </p>
                    <p className="font-nunitosans text-caption text-text-1000 opacity-60">
                      Expires:{" "}
                      {new Date(invite.tokenExpires).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "short", day: "numeric" },
                      )}
                    </p>
                  </div>

                  <div className="flex flex-row items-center gap-md">
                    <span className="inline-block px-sm py-0.5 rounded-full bg-tag-2 text-caption font-nunitosans font-medium text-text-100">
                      Pending
                    </span>
                    <button
                      type="button"
                      disabled={
                        cancellingInviteId === invite._id &&
                        cancelMutation.isPending
                      }
                      onClick={() => handleCancelInvite(invite)}
                      className="font-nunitosans font-bold text-caption py-[4px] px-sm rounded-sm border border-card-200 bg-card-100 hover:bg-card-200 active:bg-card-300 text-text-1000 shadow-effect-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingInviteId === invite._id &&
                      cancelMutation.isPending
                        ? "Cancelling..."
                        : "Cancel"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back button */}
        <div className="flex flex-row justify-end items-center">
          <button
            type="button"
            onClick={() => navigation.push("/dashboard/family-management")}
            className="font-nunitosans font-bold text-text-1000 text-body py-xs px-md rounded-sm border border-card-200 bg-card-100 hover:bg-card-200 active:bg-card-300 shadow-effect-2 transition-all duration-150"
          >
            Back
          </button>
        </div>
      </div>

      {/* ── Right: Info panel + summary ── */}
      <div className="flex flex-col gap-md">
        {/* Note */}
        <div className="flex flex-col gap-md py-lg px-md w-[442px] min-w-[300px] rounded-md bg-card-200">
          <h4 className="font-nunitosans font-bold text-text-1000 text-heading3">
            Important Note
          </h4>
          <p className="font-nunitosans text-text-1000 text-body leading-[110%]">
            Only the family owner can invite or remove members. Invited members
            will receive an email with an acceptance link. Invites expire after
            a set period — cancel them anytime if no longer needed.
          </p>
        </div>

        {/* Summary card */}
        <div className="flex flex-col gap-md py-lg px-md max-w-[442px] rounded-md border border-card-200 bg-card-100 text-text-1000 shadow-effect-2">
          <h4 className="font-nunitosans font-bold text-heading3">
            Family Summary
          </h4>
          <div className="flex flex-col gap-xxs">
            <p className="font-nunitosans font-normal">
              Family: <b>{family.name}</b>
            </p>
            <p className="font-nunitosans font-normal">
              Owner: <b>{family.owner.name}</b>
            </p>
            <div className="flex items-center gap-xxs mt-xxs flex-wrap">
              <span className="inline-block px-sm py-0.5 rounded-full bg-tag-1 text-caption font-nunitosans font-medium text-text-100">
                {family.members.length}{" "}
                {family.members.length === 1 ? "Member" : "Members"}
              </span>
              <span className="inline-block px-sm py-0.5 rounded-full bg-tag-2 text-caption font-nunitosans font-medium text-text-100">
                {family.pendingInvites.length} Pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
