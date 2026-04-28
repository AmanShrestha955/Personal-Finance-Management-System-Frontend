"use client";

import { NextPage } from "next";
import Link from "next/link";
import backgroundImage from "../../public/auth_image.jpg";
import { useForm, SubmitHandler, set } from "react-hook-form";
import GoogleIcon from "@/component/icons/google";
import { SignUpData, SignUpForm } from "@/types/type";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@/utils/request";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { AxiosError } from "axios";

// interface Props {}

const Page: NextPage = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<SignUpForm>();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SignUpForm) =>
      postData<SignUpForm, SignUpData>("/auth/signup", data),
    onSuccess: (data) => {
      console.log("Sign up successful:", data);
      reset();
      setErrorMessage("");
      setEmailSent(true);
    },
    onError: (error: AxiosError | any) => {
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    },
  });

  const onSubmit: SubmitHandler<SignUpForm> = (data) => {
    console.log(data);
    if (data.password !== data.confirmPassword) {
      console.log("Password dose not match");
      return;
    }
    mutate(data);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 w-screen min-h-screen bg-background-100">
      {/* left side */}
      <div className="flex-1">
        <div className="flex flex-col px-3xl py-2xl lg:px-6xl lg:pt-5xl gap-md">
          {/* need to put font family here */}
          {emailSent && (
            <div className="flex flex-row items-start gap-sm p-sm rounded-lg bg-blue-50 border border-blue-200">
              <svg
                className="w-5 h-5 text-blue-500 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 7.5-9.75-7.5"
                />
              </svg>
              <div className="flex flex-col gap-0.5">
                <p className="font-nunitosans font-bold text-caption text-blue-700 leading-[100%]">
                  Check your email
                </p>
                <p className="font-nunitosans font-medium text-caption text-blue-600 leading-[150%]">
                  We've sent a verification link to your inbox. Please check
                  your email to activate your account.
                </p>
              </div>
            </div>
          )}
          {errorMessage && (
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
              <div className="flex flex-col gap-0.5">
                <p className="font-nunitosans font-bold text-caption text-red-700 leading-[100%]">
                  Sign up failed
                </p>
                <p className="font-nunitosans font-medium text-caption text-red-600 leading-[150%]">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-xs">
            <h1 className="text-heading2 font-sansation font-bold text-text-1000 leading-[100%]">
              Get Started Now
            </h1>
            <p className="text-text-1000 font-nunitosans font-medium leading-[100%]">
              Enter your credentials to access your account.
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-md"
          >
            <div className="flex flex-col gap-xs">
              <p className="font-nunitosans font-bold text-caption text-text-600 leading-[100%]">
                Username
              </p>
              <input
                type="text"
                placeholder="Username"
                {...register("name")}
                className="font-medium text-text-1000 placeholder-text-600 font-nunitosans p-sm border border-text-300 rounded-md focus:outline-none focus:border-[3px] focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(0,0,0,0.19)] transition-all duration-50"
              />
            </div>
            <div className="flex flex-col gap-xs">
              <p className="font-nunitosans font-bold text-caption text-text-600 leading-[100%]">
                Email
              </p>
              <input
                type="text"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className="font-medium text-text-1000 placeholder-text-600 font-nunitosans p-sm border border-text-300 rounded-md focus:outline-none focus:border-[3px] focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(0,0,0,0.19)] transition-all duration-50"
              />
              {errors.email && (
                <p className="font-nunitosans text-caption text-red-500 leading-[100%]">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-xs">
              <p className="font-nunitosans font-bold text-caption text-text-600 leading-[100%]">
                Password
              </p>
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  maxLength: {
                    value: 32,
                    message: "Password must be at most 32 characters",
                  },
                })}
                className="font-medium text-text-1000 placeholder-text-600 font-nunitosans p-sm border border-text-300 rounded-md focus:outline-none focus:border-[3px] focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(0,0,0,0.19)] transition-all duration-50"
              />
              {errors.password && (
                <p className="font-nunitosans text-caption text-red-500 leading-[100%]">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-xs">
              <p className="font-nunitosans font-bold text-caption text-text-600 leading-[100%]">
                Confirm Password
              </p>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match",
                })}
                className="font-medium text-text-1000 placeholder-text-600 font-nunitosans p-sm border border-text-300 rounded-md focus:outline-none focus:border-[3px] focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(0,0,0,0.19)] transition-all duration-50"
              />
              {errors.confirmPassword && (
                <p className="font-nunitosans text-caption text-red-500 leading-[100%]">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              disabled={isPending}
              type="submit"
              className="font-nunitosans font-bold text-text-100 text-body py-sm rounded-lg bg-primary-500 hover:bg-primary-600 active:bg-primary-800 transition-all duration-150"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign Up"
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
          {/* google sign up button */}
          <button className="flex flex-row items-center py-xs px-sm border border-text-300 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_2px_6px_-2px_rgba(0,0,0,0.19)] cursor-pointer hover:shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_2px_6px_-2px_rgba(0,0,0,0.25)] active:shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_1px_3px_-1px_rgba(0,0,0,0.15)] transition-all duration-150">
            <GoogleIcon />{" "}
            <p className="flex-1 text-center font-nunitosans font-medium text-text-1000 text-body leading-[130%]">
              Sign up with google
            </p>
          </button>
          <p className="text-caption text-center font-nunitosans font-medium text-text-1000 leading-[100%]">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary-400 font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
      {/* right side */}
      <div className="flex-1 rounded-lg m-sm bg-primary-500 relative hidden lg:flex">
        {/* image and blur effect */}
        <div
          className="absolute opacity-20 w-full h-full rounded-lg bg-cover bg-center blur-[2px]"
          style={{
            backgroundImage: `url(${backgroundImage.src})`,
          }}
        ></div>
        <div className="flex flex-col justify-end py-5xl px-md gap-sm text-white">
          <h1 className="font-sansation font-bold text-heading leading-[100%]">
            Your journey to financial
            <br /> clarity continues here.
          </h1>
          <p className="font-nunitosans font-medium text-caption">
            Stay in control of your expenses, track progress, and keep building
            better money habits every day.
            <br /> Every login brings you closer to financial peace of mind.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
