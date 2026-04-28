"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { acceptInvite } from "@/utils/familyApi";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const {
    data: family,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["invite-accept", token],
    queryFn: () => acceptInvite(token),
    enabled: !!token,
    retry: false,
  });

  const errorMessage = !token
    ? "No invite token was provided."
    : ((error as any)?.response?.data?.message ??
      "Something went wrong. Please try again.");

  return (
    <main className="min-h-screen bg-background-100 flex items-center justify-center px-md">
      <div className="bg-card-100 rounded-2xl shadow-effect-2 max-w-[700px] w-full p-10 text-center">
        {/* ── Loading ── */}
        {isLoading && !!token && (
          <div className="flex flex-col items-center gap-lg">
            <div className="w-14 h-14 rounded-full border-4 border-primary-100 border-t-primary-500 animate-spin" />
            <p className="font-nunitosans text-body text-text-500">
              Verifying your invitation…
            </p>
          </div>
        )}

        {/* ── Success ── */}
        {family && (
          <div className="flex flex-col items-center gap-lg">
            <div className="w-16 h-16 rounded-full bg-tag-1 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-xs">
              <h1 className="font-sansation text-heading2 text-text-900 font-bold">
                You're in!
              </h1>
              <p className="font-nunitosans text-body text-text-500">
                You've successfully joined{" "}
                <span className="font-semibold text-text-800">
                  {family.name}
                </span>
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/home")}
              className="mt-xs w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 transition-colors text-text-100 font-nunitosans text-body font-semibold py-sm rounded-lg"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* ── Error ── */}
        {(isError || !token) && !isLoading && (
          <div className="flex flex-col items-center gap-lg">
            <div className="w-16 h-16 rounded-full bg-tag-2 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-secondary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-xs">
              <h1 className="font-sansation text-heading2 text-text-900 font-bold">
                Invite Failed
              </h1>
              <p className="font-nunitosans text-body text-text-500">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/home")}
              className="mt-xs w-full bg-card-200 hover:bg-card-300 active:bg-card-400 transition-colors text-text-700 font-nunitosans text-body font-semibold py-sm rounded-lg"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;
