"use client";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/utils/request";
import { useEffect } from "react";
import React from "react";
import Link from "next/link";

interface Props {
  params: Promise<{ token: string }>;
}

const Page = ({ params }: Props) => {
  const { token } = React.use(params);

  const { data, error, isLoading } = useQuery({
    queryKey: ["verifyToken", token],
    queryFn: () =>
      getData<null, { message: string; error?: string }>(
        `/auth/verify-email/${token}`,
      ),
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="w-screen min-h-screen bg-background-100 flex items-center justify-center px-md">
      <div className="w-full max-w-[500px] bg-text-100 rounded-2xl p-4xl flex flex-col items-center gap-xl shadow-effect-2">
        {/* ── LOADING ── */}
        {isLoading && (
          <>
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-primary-500 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-xs text-center">
              <h1 className="text-heading2 font-sansation font-bold text-text-1000 leading-[100%]">
                Verifying your email
              </h1>
              <p className="font-nunitosans font-medium text-body text-text-600 leading-[150%]">
                Please wait while we confirm your email address…
              </p>
            </div>
            <div className="flex flex-row items-start gap-sm p-sm rounded-lg bg-tag-2 border border-secondary-200 w-full text-left">
              <svg
                className="w-5 h-5 text-secondary-500 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
              <div className="flex flex-col gap-0.5">
                <p className="font-nunitosans font-bold text-caption text-secondary-700 leading-[100%]">
                  This may take a moment
                </p>
                <p className="font-nunitosans font-medium text-caption text-secondary-600 leading-[150%]">
                  Do not close or refresh this page.
                </p>
              </div>
            </div>
          </>
        )}

        {/* ── ERROR ── */}
        {!isLoading && error && (
          <>
            <div className="w-20 h-20 rounded-full bg-card-100 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-xs text-center">
              <h1 className="text-heading2 font-sansation font-bold text-text-1000 leading-[100%]">
                Verification failed
              </h1>
              <p className="font-nunitosans font-medium text-body text-text-600 leading-[150%]">
                This link may have expired or is invalid.
              </p>
            </div>
            <div className="flex flex-row items-start gap-sm p-sm rounded-lg bg-red-100 border border-red-300 w-full text-left">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <div className="flex flex-col gap-0.5">
                <p className="font-nunitosans font-bold text-caption text-red-600 leading-[100%]">
                  Something went wrong
                </p>
                <p className="font-nunitosans font-medium text-caption text-red-500 leading-[150%]">
                  Verification failed. Please try signing up again or contact
                  support.
                </p>
              </div>
            </div>
            <Link
              href="/sign-up"
              className="w-full text-center font-nunitosans font-bold text-text-100 text-body py-sm rounded-lg bg-primary-500 hover:bg-primary-600 active:bg-primary-800 transition-all duration-150"
            >
              Back to Sign Up
            </Link>
          </>
        )}

        {/* ── SUCCESS ── */}
        {!isLoading && !error && data && (
          <>
            <div className="w-20 h-20 rounded-full bg-tag-1 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-xs text-center">
              <h1 className="text-heading2 font-sansation font-bold text-text-1000 leading-[100%]">
                Email verified!
              </h1>
              <p className="font-nunitosans font-medium text-body text-text-600 leading-[150%]">
                {data.message ??
                  "Your account has been successfully activated. You're all set!"}
              </p>
            </div>
            <div className="flex flex-row items-start gap-sm p-sm rounded-lg bg-tag-1 border border-primary-200 w-full text-left">
              <svg
                className="w-5 h-5 text-primary-500 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex flex-col gap-0.5">
                <p className="font-nunitosans font-bold text-caption text-primary-700 leading-[100%]">
                  Verification successful
                </p>
                <p className="font-nunitosans font-medium text-caption text-primary-600 leading-[150%]">
                  You can now sign in and start tracking your finances.
                </p>
              </div>
            </div>
            <Link
              href="/sign-in"
              className="w-full text-center font-nunitosans font-bold text-text-100 text-body py-sm rounded-lg bg-primary-500 hover:bg-primary-600 active:bg-primary-800 transition-all duration-150"
            >
              Go to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
