"use client";

import { NextPage } from "next";
import Link from "next/link";
import backgroundImage from "../../public/auth_image.jpg";
import { useForm, SubmitHandler } from "react-hook-form";
import GoogleIcon from "@/component/icons/google";
import { LoginData, SignInForm } from "@/types/type";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@/utils/request";
import { useRouter } from "next/navigation";

const Page: NextPage = () => {
  const navigation = useRouter();
  const { register, handleSubmit } = useForm<SignInForm>();
  const mutation = useMutation({
    mutationFn: async (data: SignInForm) =>
      postData<SignInForm, LoginData>("/auth/login", data),
    onSuccess: (data) => {
      console.log("Sign in successful:", data);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      navigation.push("/dashboard");
    },
    onError: (error) => {
      console.error("Sign in failed:", error);
    },
  });

  const onSubmit: SubmitHandler<SignInForm> = (data) => {
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 w-screen h-screen p-sm bg-background-100">
      {/* left side */}
      <div className="flex-1">
        <div className="flex flex-col px-3xl py-2xl lg:px-6xl lg:py-5xl gap-md">
          {/* need to put font family here */}
          <div className="flex flex-col gap-xs">
            <h1 className="text-heading2 font-sansation font-bold text-text-1000 leading-[100%]">
              Welcome Back
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
              className="font-nunitosans font-bold text-text-100 text-body py-sm rounded-lg bg-primary-500 hover:bg-primary-600 active:bg-primary-800 transition-all duration-150"
            >
              Sign in
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
              Sign in with google
            </p>
          </button>
          <p className="text-caption text-center font-nunitosans font-medium text-text-1000 leading-[100%]">
            Don’t Have a Account?{" "}
            <Link
              href="/sign-up"
              className="text-primary-400 font-bold hover:underline"
            >
              Register Now
            </Link>
          </p>
        </div>
      </div>
      {/* right side */}
      <div className="flex-1 rounded-lg bg-primary-500 relative hidden lg:flex">
        {/* image and blur effect */}
        <div
          className="absolute opacity-20 w-full h-full rounded-lg bg-cover bg-center blur-[2px]"
          style={{
            backgroundImage: `url(${backgroundImage.src})`,
          }}
        ></div>
        <div className="flex flex-col justify-end py-5xl px-md gap-sm text-white">
          <h1 className="font-sansation font-bold text-heading leading-[100%]">
            Every rupee counts.
            <br />
            Start tracking where it goes, and soon you’ll see where it can take
            you.
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

export default Page;
