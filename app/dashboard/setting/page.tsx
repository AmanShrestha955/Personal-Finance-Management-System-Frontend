"use client";
import { getMoneyHighlights } from "@/utils/statisticsApi";
import { getUser } from "@/utils/userApi";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Lock,
  PersonStanding,
  PersonStandingIcon,
  TrendingDown,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// interface Props {}

const Page: NextPage = ({}) => {
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = getUser();
      return response;
    },
  });
  const { data: moneyHighlightsData } = useQuery({
    queryKey: ["money-highlights"],
    queryFn: async () => {
      const response = await getMoneyHighlights("This Month");
      return response;
    },
  });

  useEffect(() => {
    console.log("user Data: ", userData);
  }, [userData]);
  const router = useRouter();
  return (
    <div className="w-full overflow-y-auto py-2xl px-xl flex flex-col bg-background-100 gap-xl ">
      <div className="flex flex-row justify-between items-end">
        <h1 className="font-sansation text-heading font-semibold">Profile</h1>
      </div>
      {/* first row */}
      <div className="flex flex-row gap-md ">
        {/* card */}
        <div className="flex flex-col flex-1 gap-xl font-nunitosans bg-card-100 rounded-xl p-lg min-w-[400px] shadow-effect-2">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col text-body">
              <p className="text-text-700">Total Spend This Month</p>
              <p className="text-text-1000">
                {moneyHighlightsData?.totalExpenses.formatted}
              </p>
            </div>
            <div className="size-[48px] rounded-lg bg-green-600 flex justify-center items-center">
              <Wallet size={24} className="text-white" />
            </div>
          </div>
          <div
            className={`flex flex-row text-body ${moneyHighlightsData?.totalExpenses.change.color === "green" ? "text-green-600" : "text-red-600"} items-center gap-0.5`}
          >
            <TrendingUp size={18} />
            <p>
              {moneyHighlightsData?.totalExpenses.change.value} vs last month
            </p>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-xl font-nunitosans bg-card-100 rounded-xl p-lg min-w-[400px] shadow-effect-2">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col text-body">
              <p className="text-text-700">Total Income</p>
              <p className="text-text-1000">
                {moneyHighlightsData?.totalIncome.formatted}
              </p>
            </div>
            <div className="size-[48px] rounded-lg bg-secondary-500 flex justify-center items-center text-white">
              <TrendingUp size={24} />
            </div>
          </div>
          <div
            className={`flex flex-row text-body ${moneyHighlightsData?.totalIncome.change.color === "green" ? "text-green-600" : "text-red-600"} items-center gap-0.5`}
          >
            <TrendingUp size={18} />
            <p>{moneyHighlightsData?.totalIncome.change.value} vs last month</p>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-xl font-nunitosans bg-card-100 rounded-xl p-lg min-w-[400px] shadow-effect-2">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col text-body">
              <p className="text-text-700">Savings This Month</p>
              <p className="text-text-1000">
                {moneyHighlightsData?.totalSavings.formatted}
              </p>
            </div>
            <div className="size-[48px] rounded-lg bg-purple-700 flex justify-center items-center text-white">
              <TrendingDown size={24} />
            </div>
          </div>
          <div
            className={`flex flex-row text-body ${moneyHighlightsData?.totalSavings.change.color === "green" ? "text-green-600" : "text-red-600"} items-center gap-0.5`}
          >
            <TrendingUp size={18} />
            <p>
              {moneyHighlightsData?.totalSavings.change.value} vs last month
            </p>
          </div>
        </div>
      </div>
      {/* second row */}
      <div className="flex flex-row justify-between items-center py-lg px-xl rounded-xl shadow-effect-2 bg-card-100">
        <div className="flex flex-row gap-lg">
          <Image
            width={96}
            height={96}
            className="rounded-full size-[96px] bg-amber-200 object-cover"
            src={`${userData?.photo ? userData.photo : "/default_user.jpg"}`}
            alt="profile"
          />
          <div className="flex flex-col font-nunitosans">
            <p className="text-heading3 font-medium capitalize">
              {userData?.name}
            </p>
            <p className="text-body text-text-700">{userData?.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            router.push("/dashboard/setting/edit-profile");
          }}
          className="px-md py-xs rounded-md bg-primary-500 text-white active:bg-primary-700 hover:bg-primary-600 transition-all duration-200 cursor-pointer"
        >
          Edit profile
        </button>
      </div>
      {/* personal information */}
      <div className="flex flex-col gap-lg py-lg px-xl rounded-xl bg-card-100 shadow-effect-2 font-nunitosans">
        <div className="flex flex-row gap-sm items-center">
          {/* icon */}
          <div className="size-[48px] rounded-lg bg-green-600 text-white flex justify-center items-center">
            <User size={24} />
          </div>
          <h1 className="text-heading3 text-text-1000 font-semibold">
            Personal Information
          </h1>
        </div>
        <div className="h-px w-full bg-card-200"></div>
        {/* info */}
        <div className="flex flex-col gap-lg font-nunitosans">
          <div className="flex flex-row flex-1 gap-lg">
            <div className="flex flex-col flex-1 gap-xs">
              <p className="text-body text-text-1000">Full Name</p>
              <p className="text-body text-text-700 w-full p-xs border border-card-200 rounded-sm capitalize">
                {userData?.name}
              </p>
            </div>
            <div className="flex flex-col flex-1 gap-xs">
              <p className="text-body text-text-1000">Email</p>
              <p className="text-body text-text-700 w-full p-xs border border-card-200 rounded-sm">
                {userData?.email}
              </p>
            </div>
          </div>
          <div className="flex flex-row flex-1 gap-lg">
            <div className="flex flex-col flex-1 gap-xs">
              <p className="text-body text-text-1000">Phone Number</p>
              <p className="text-body text-text-700 w-full p-xs border border-card-200 rounded-sm">
                {userData?.phoneNumber || "98-XXXX-XXXX"}
              </p>
            </div>
            <div className="flex flex-col flex-1 gap-xs">
              <p className="text-body text-text-1000">Gender</p>
              <p className="text-body text-text-700 w-full p-xs border border-card-200 rounded-sm capitalize">
                {userData?.gender || "prefer not to say"}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* security */}
      <div className="flex flex-col gap-lg py-lg px-xl rounded-xl bg-card-100 shadow-effect-2 font-nunitosans">
        <div className="flex flex-row gap-sm items-center">
          {/* icon */}
          <div className="size-[48px] rounded-lg bg-green-600 text-white flex justify-center items-center">
            <Lock size={24} />
          </div>
          <h1 className="text-heading3 text-text-1000 font-semibold">
            Security
          </h1>
        </div>
        <div className="h-px w-full bg-card-200"></div>
        {/* change password */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <p className="text-body text-text-1000">Change Password</p>
            <p className="text-body text-text-700">
              Update your password to keep your account secure
            </p>
          </div>
          <button
            onClick={() => {
              router.push("/dashboard/setting/change-password");
            }}
            className="px-md py-xs rounded-full border-[0.5px] border-card-200 text-body text-text-1000 hover:bg-card-200 active:bg-card-300 bg-card-100 transition-all duration-200 cursor-pointer"
          >
            Change
          </button>
        </div>
      </div>
      {/* account */}
      <div className="flex flex-col gap-lg py-lg px-xl rounded-xl bg-card-100 shadow-effect-2 font-nunitosans">
        <div className="flex flex-row gap-sm items-center">
          {/* icon */}
          <div className="size-[48px] rounded-lg bg-green-600 text-white flex justify-center items-center">
            <AlertCircle size={24} />
          </div>
          <h1 className="text-heading3 text-text-1000 font-semibold">
            Account
          </h1>
        </div>
        <div className="h-px w-full bg-card-200"></div>
        {/* change password */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <p className="text-body text-red-600">Delete Account</p>
            <p className="text-body text-text-700">
              Permanently delete your account and all data
            </p>
          </div>
          <button
            onClick={() => {
              router.push("/dashboard/setting/delete-account");
            }}
            className="px-md py-xs rounded-full text-body text-red-600 hover:bg-card-200 active:bg-card-300 bg-card-100 transition-all duration-200 cursor-pointer"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
