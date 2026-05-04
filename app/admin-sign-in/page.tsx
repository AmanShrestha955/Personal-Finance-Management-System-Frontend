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
import { useState } from "react";

const AdminSignInPage: NextPage = () => {
  const navigation = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignInForm>();
  const rememberMe = watch("rememberMe");

  const mutation = useMutation({
    mutationFn: async (data: SignInForm) =>
      postData<SignInForm, LoginData>("/auth/admin-login", data),
    onSuccess: (data) => {
      console.log("Admin sign in successful:", data);
      setErrorMessage("");
      if (data.token) {
        if (rememberMe) {
          Cookies.set("adminToken", data.token, { expires: 30 });
          Cookies.set("userRole", "admin", { expires: 30 });
        } else {
          Cookies.set("adminToken", data.token, { expires: 1 });
          Cookies.set("userRole", "admin", { expires: 1 });
        }
      }
      const redirect = searchParams.get("redirect") || "/admin";
      navigation.push(redirect);
    },
    onError: (error: any) => {
      console.error("Admin sign in failed:", error);
      const message =
        error?.response?.data?.message || "Login failed. Please try again.";
      setErrorMessage(message);
    },
  });

  const onSubmit: SubmitHandler<SignInForm> = (data) => {
    console.log("[Admin Sign-In] Submitting form with email:", data.email);
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 w-screen h-screen p-sm bg-background-100">
      {/* left side */}
      <div className="flex-1">
        <div className="flex flex-col px-3xl py-2xl lg:px-6xl lg:py-5xl gap-md">
          <div className="flex flex-col gap-xs">
            <h1 className="text-heading2 font-sansation font-bold text-text-1000 leading-[100%]">
              Admin Portal
            </h1>
            <p className="text-text-1000 font-nunitosans font-medium leading-[100%]">
              Enter your admin credentials to access the administration
              dashboard.
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-md"
          >
            <div className="flex flex-col gap-xs">
              <p className="font-nunitosans font-bold text-caption text-text-600 leading-[100%]">
                Admin Email
              </p>
              <input
                type="email"
                placeholder="admin@example.com"
                {...register("email", { required: "Email is required" })}
                className="font-medium text-text-1000 placeholder-text-600 font-nunitosans p-sm border border-text-300 rounded-md focus:outline-none focus:border-[3px] focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(0,0,0,0.19)] transition-all duration-50"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-xs">
              <p className="font-nunitosans font-bold text-caption text-text-600 leading-[100%]">
                Password
              </p>
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="font-medium text-text-1000 placeholder-text-600 font-nunitosans p-sm border border-text-300 rounded-md focus:outline-none focus:border-[3px] focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(0,0,0,0.19)] transition-all duration-50"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-700 font-nunitosans text-sm">
                    {errorMessage}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-row justify-between items-center">
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
                className="font-nunitosans font-bold text-caption text-primary-500 leading-[100%] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-primary-500 text-white font-bold py-sm px-md rounded-md hover:bg-primary-600 disabled:opacity-50 transition-all duration-200"
            >
              {mutation.isPending ? "Signing in..." : "Sign In as Admin"}
            </button>
          </form>
          <div className="flex flex-row gap-xs items-center">
            <p className="font-nunitosans font-medium text-caption text-text-600 leading-[100%]">
              Back to user portal?
            </p>
            <Link
              href="/sign-in"
              className="font-nunitosans font-bold text-caption text-primary-500 leading-[100%] hover:underline"
            >
              User Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* right side - hidden on mobile */}
      <div className="flex-1 rounded-lg bg-primary-500 relative hidden lg:flex">
        <div
          className="flex-1 hidden lg:block bg-cover rounded-2xlabsolute opacity-20 w-full h-full rounded-lg bg-center blur-[2px]"
          style={{
            backgroundImage: `url(${backgroundImage.src})`,
          }}
        />
      </div>
    </div>
  );
};

export default AdminSignInPage;
