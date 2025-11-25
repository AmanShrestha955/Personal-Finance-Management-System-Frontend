"use client";

import { NextPage } from "next";
import Link from "next/link";
import backgroundImage from "../../public/auth_image.jpg";
import { useForm, SubmitHandler } from "react-hook-form";
import GoogleIcon from "@/component/icons/google";
import { SignUpData, SignUpForm } from "@/types/type";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@/utils/request";
import { Loader2 } from "lucide-react";

// interface Props {}

const Page: NextPage = () => {
  const { register, handleSubmit } = useForm<SignUpForm>();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: SignUpForm) =>
      postData<SignUpForm, SignUpData>("/auth/signup", data),
    onSuccess: (data) => {
      console.log("Sign up successful:", data);
    },
    onError: (error) => {
      console.error("Sign up failed:", error);
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
                className="font-medium text-text-1000 placeholder-text-600 font-nunitosans p-sm border border-background-200 rounded-md focus:outline-none focus:border-[3px] focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(0,0,0,0.19)] transition-all duration-50"
              />
            </div>
            <div className="flex flex-col gap-xs">
              <p className="font-nunitosans font-bold text-caption text-text-600 leading-[100%]">
                Email
              </p>
              <input
                type="text"
                placeholder="Email"
                {...register("email")}
                className="font-medium text-text-1000 placeholder-text-600 font-nunitosans p-sm border border-background-200 rounded-md focus:outline-none focus:border-[3px] focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(0,0,0,0.19)] transition-all duration-50"
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
                className="font-medium text-text-1000 placeholder-text-600 font-nunitosans p-sm border border-background-200 rounded-md focus:outline-none focus:border-[3px] focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(0,0,0,0.19)] transition-all duration-50"
              />
            </div>
            <div className="flex flex-col gap-xs">
              <p className="font-nunitosans font-bold text-caption text-text-600 leading-[100%]">
                Confirm Password
              </p>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className="font-medium text-text-1000 placeholder-text-600 font-nunitosans p-sm border border-background-200 rounded-md focus:outline-none focus:border-[3px] focus:border-primary-500 focus:shadow-[0_0_0_2px_rgba(0,0,0,0.19)] transition-all duration-50"
              />
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
            <div className="w-full h-px bg-background-300"></div>
            <p className="text-caption font-bold font-nunitosans text-text-600 leading-[100%]">
              OR
            </p>
            <div className="w-full h-px bg-background-300"></div>
          </div>
          {/* google sign up button */}
          <button className="flex flex-row items-center py-xs px-sm border border-background-200 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_2px_6px_-2px_rgba(0,0,0,0.19)] cursor-pointer hover:shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_2px_6px_-2px_rgba(0,0,0,0.25)] active:shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_1px_3px_-1px_rgba(0,0,0,0.15)] transition-all duration-150">
            <GoogleIcon />{" "}
            <p className="flex-1 text-center font-nunitosans font-medium text-body leading-[130%]">
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
