"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import HomeIcon from "@/component/icons/home";
import FamilyManagementIcon from "@/component/icons/familyManagement";
import SettingIcon from "@/component/icons/setting";
import TransactionManagementIcon from "@/component/icons/transactionManagement";
import SavingIcon from "@/component/icons/saving";
import StatisticsIcon from "@/component/icons/statistics";
import NotificationIcon from "@/component/icons/notification";
import { useRouter } from "next/navigation";
import LogoutIcon from "@/component/icons/logout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const currentSection = pathname.split("/")[2] || "home";
  const navData = [
    {
      path: "home",
      label: "Home",
      icon: HomeIcon,
    },
    {
      path: "family-management",
      label: "Family Management",
      icon: FamilyManagementIcon,
    },
    {
      path: "setting",
      label: "Setting",
      icon: SettingIcon,
    },
    {
      path: "transaction-management",
      label: "Transaction Management",
      icon: TransactionManagementIcon,
    },
    {
      path: "saving",
      label: "Saving",
      icon: SavingIcon,
    },
    {
      path: "statistics",
      label: "Statistics",
      icon: StatisticsIcon,
    },
    {
      path: "notification",
      label: "Notification",
      icon: NotificationIcon,
    },
  ];
  const handleNavigationChange = (path: string) => {
    router?.push(`/dashboard/${path}`);
  };
  return (
    <div className="flex flex-row gap-9 bg-background-100">
      <div className="h-screen w-[100px] relative">
        <nav className="group/nav flex w-[100px] hover:w-[272px] flex-col h-full bg-white transition-[width] duration-600">
          <div className="flex flex-col justify-between h-full pb-2.5 px-md">
            <div className="flex flex-col pt-[64px] gap-[60px]">
              <Image
                src="/auth_image.png"
                alt="logo"
                width={64}
                height={64}
                className=" size-[64px] bg-green-300 rounded-md"
              />
              <ul className="flex flex-col mx-[12px] group-hover/nav:mx-0 gap-xxs group-hover/nav:items-start transition-[margin] duration-300">
                {navData.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={index}
                      className={`group/items flex flex-row gap-sm group-hover/nav:w-full hover:bg-primary-400 transition-[background-color] duration-300  rounded-md ${
                        currentSection === item.path
                          ? "bg-primary-100 text-white"
                          : "bg-white text-text-700"
                      }`}
                    >
                      <input
                        onChange={() => handleNavigationChange(item.path)}
                        type="radio"
                        name="dashboard-option"
                        id={item.path}
                        checked={currentSection === item.path} // <-- AUTO CHECK
                        className="hidden"
                      />
                      <label
                        htmlFor={item.path}
                        className="cursor-pointer flex flex-row gap-sm p-2.5 h-full w-full"
                      >
                        <Icon
                          className={`${
                            currentSection === item.path
                              ? "text-white"
                              : "text-black"
                          } group-hover/items:text-white transition-colors duration-300`}
                        />
                        <p className=" w-0 hidden overflow-hidden group-hover/nav:block group-hover/nav:w-full whitespace-nowrap group-hover/items:text-white transition-all transition-discrete duration-300">
                          {item.label}
                        </p>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
            <button className="flex flex-row gap-sm bg-white hover:bg-red-500 p-2.5 rounded-md text-red-500 hover:text-white transition-all duration-300 mx-[12px] group-hover/nav:mx-0">
              <LogoutIcon className="w-6 h-6" />
              <p className="w-0 text-start hidden overflow-hidden group-hover/nav:block group-hover/nav:w-full whitespace-nowrap hover:text-white transition-all transition-discrete duration-300">
                Logout
              </p>
            </button>
          </div>
        </nav>
      </div>
      {children}
    </div>
    // <div className="w-screen h-screen">{children}</div>
  );
}
