"use client";

import { NextPage } from "next";
import Link from "next/link";
import backgroundImage from "../../public/auth_image.jpg";
import { useForm, SubmitHandler } from "react-hook-form";
import GoogleIcon from "@/component/icons/google";
import { LoginData, SignInForm } from "@/types/type";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@/utils/request";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useGoogleLogin } from "@react-oauth/google";
import { useState, Suspense } from "react";
import { Loader2 } from "lucide-react";

const PageContent: NextPage = () => {
  const navigation = useRouter();
  const searchParams = useSearchParams();
  const [googleError, setGoogleError] = useState("");
  const { register, handleSubmit, watch } = useForm<SignInForm>();
  const rememberMe = watch("rememberMe");

  // ── Email / Password login ────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: async (data: SignInForm) =>
      postData<SignInForm, LoginData>("/auth/login", data),
    onSuccess: (data) => {
      console.log("Sign in successful:", data);
      if (data.token) {
        if (rememberMe) {
          Cookies.set("token", data.token, { expires: 30 });
        } else {
          Cookies.set("token", data.token, { expires: 1 });
        }
      }
      if (!data.isOnboarded) {
        navigation.push("/set-up");
      }
      const redirect = searchParams.get("redirect") || "/dashboard";
      navigation.push(redirect);
    },
    onError: (error: any) => {
      console.error("Sign in failed:", error);
    },
  });

  const onSubmit: SubmitHandler<SignInForm> = (data) => {
    mutation.mutate(data);
  };

  // ── Google login ──────────────────────────────────────────────────────────
  const googleLoginMutation = useMutation({
    mutationFn: async (accessToken: string) =>
      postData<{ accessToken: string }, LoginData>("/auth/google", {
        accessToken,
      }),
    onSuccess: (data) => {
      console.log("Google sign-in successful:", data);
      if (data.token) {
        Cookies.set("token", data.token, { expires: 30 });
      }
      if (!data.isOnboarded) {
        navigation.push("/set-up");
        return;
      }
      const redirect = searchParams.get("redirect") || "/dashboard";
      navigation.push(redirect);
    },
    onError: (error: any) => {
      setGoogleError(
        error.response?.data?.message ||
          "Google sign-in failed. Please try again.",
      );
    },
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setGoogleError("");
      googleLoginMutation.mutate(tokenResponse.access_token);
    },
    onError: () => {
      setGoogleError("Google sign-in was cancelled or failed.");
    },
  });

  return (
    <div className="flex flex-col lg:flex-row gap-0 w-screen h-screen p-sm bg-background-100">
      {/* left side */}
      <div className="flex-1">
        <div className="flex flex-col px-3xl py-2xl lg:px-6xl lg:py-5xl gap-md">
          <div className="flex flex-col gap-xs">
            <h1 className="text-heading2 font-sansation font-bold text-text-1000 leading-[100%]">
              Welcome Back
            </h1>
            <p className="text-text-1000 font-nunitosans font-medium leading-[100%]">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Error from normal login */}
          {mutation.isError && (
            <div className="flex flex-row items-start gap-sm p-sm rounded-lg bg-red-50 border border-red-200">
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
              <p className="font-nunitosans font-medium text-caption text-red-600 leading-[150%]">
                {(mutation.error as any)?.response?.data?.message ||
                  "Invalid email or password."}
              </p>
            </div>
          )}

          {/* Google error */}
          {googleError && (
            <div className="flex flex-row items-start gap-sm p-sm rounded-lg bg-red-50 border border-red-200">
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
              <p className="font-nunitosans font-medium text-caption text-red-600 leading-[150%]">
                {googleError}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-md"
          >
            <div className="flex flex-col gap-xs">
              <p className="font-nunitosans font-bold text-caption text-text-600 leading-[100%]">
                Email
              </p>
              <input
                type="text"
                placeholder="Email"
                {...register("email")}
                className="font-medium text-text-1000 placeholder-text-600 font-nunitosans p-sm border border-text-300 rounded-md focus:outline-none focus:border-[3px] focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(0,0,0,0.19)] transition-all duration-50"
              />
            </div>
            <div className="flex flex-col gap-xs">
              <p className="font-nunitosans font-bold text-caption text-text-600 leading-[100%]">
                Password
              </p>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="font-medium text-text-1000 placeholder-text-600 font-nunitosans p-sm border border-text-300 rounded-md focus:outline-none focus:border-[3px] focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(0,0,0,0.19)] transition-all duration-50"
              />
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-xs items-center">
                <input
                  type="checkbox"
                  id="remember"
                  {...register("rememberMe")}
                  className="w-4 h-4 accent-primary-500 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="font-nunitosans font-bold text-text-600 text-caption leading-[100%] cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-caption font-nunitosans text-primary-500 font-bold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex justify-center items-center font-nunitosans font-bold text-text-100 text-body py-sm rounded-lg bg-primary-500 hover:bg-primary-600 active:bg-primary-800 transition-all duration-150 disabled:opacity-70"
            >
              {mutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* --- or --- */}
          <div className="flex flex-row gap-sm items-center">
            <div className="w-full h-px bg-text-300"></div>
            <p className="text-caption font-bold font-nunitosans text-text-600 leading-[100%]">
              OR
            </p>
            <div className="w-full h-px bg-text-300"></div>
          </div>

          {/* Google sign in button */}
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={googleLoginMutation.isPending}
            className="flex flex-row items-center py-xs px-sm border border-text-300 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_2px_6px_-2px_rgba(0,0,0,0.19)] cursor-pointer hover:shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_2px_6px_-2px_rgba(0,0,0,0.25)] active:shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_1px_3px_-1px_rgba(0,0,0,0.15)] transition-all duration-150 disabled:opacity-70"
          >
            {googleLoginMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              <>
                <GoogleIcon />
                <p className="flex-1 text-center font-nunitosans font-medium text-text-1000 text-body leading-[130%]">
                  Sign in with Google
                </p>
              </>
            )}
          </button>

          <p className="text-caption text-center font-nunitosans font-medium text-text-1000 leading-[100%]">
            Don&apos;t Have a Account?{" "}
            <Link
              href="/sign-up"
              className="text-primary-400 font-bold hover:underline"
            >
              Register Now
            </Link>
          </p>
          <div className="border-t border-text-300 pt-md">
            <p className="text-caption text-center font-nunitosans font-medium text-text-600 leading-[100%]">
              Admin?{" "}
              <Link
                href="/admin-sign-in"
                className="text-primary-500 font-bold hover:underline"
              >
                Sign in to Admin Portal
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <div className="flex-1 rounded-lg bg-primary-500 relative hidden lg:flex">
        <div
          className="absolute opacity-20 w-full h-full rounded-lg bg-cover bg-center blur-[2px]"
          style={{ backgroundImage: `url(${backgroundImage.src})` }}
        ></div>
        <div className="flex flex-col justify-end py-5xl px-md gap-sm text-white">
          <h1 className="font-sansation font-bold text-heading leading-[100%]">
            Every rupee counts.
            <br />
            Start tracking where it goes, and soon you&apos;ll see where it can
            take you.
          </h1>
          <p className="font-nunitosans font-medium text-caption">
            Small steps in managing your daily expenses can lead to big
            financial freedom. With Smart Personal Finance Tracker, you can
            visualize your spending, set realistic budgets, and make confident
            money decisions.
            <br />
            Stay mindful, stay organized — and watch your savings grow.
          </p>
        </div>
      </div>
    </div>
  );
};

const Page: NextPage = () => {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
};

export default Page;
