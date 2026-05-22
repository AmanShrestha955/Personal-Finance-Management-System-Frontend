"use client";
import React, { useState } from "react";
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
import Cookies from "js-cookie";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const currentSection = pathname.split("/")[2] || "home";

  const navData = [
    { path: "home", label: "Home", icon: HomeIcon },
    {
      path: "family-management",
      label: "Family Management",
      icon: FamilyManagementIcon,
    },
    { path: "setting", label: "Setting", icon: SettingIcon },
    {
      path: "transaction-management",
      label: "Transaction Management",
      icon: TransactionManagementIcon,
    },
    { path: "saving", label: "Saving", icon: SavingIcon },
    { path: "statistics", label: "Statistics", icon: StatisticsIcon },
  ];

  const handleNavigationChange = (path: string) => {
    router?.push(`/dashboard/${path}`);
    setIsDrawerOpen(false);
  };

  const onLogOut = () => {
    Cookies.remove("token");
    router.push("/sign-in");
  };

  const NavItems = () => (
    <ul className="flex flex-col gap-xxs w-full">
      {navData.map((item, index) => {
        const Icon = item.icon;
        return (
          <li
            key={index}
            className={`group/items flex flex-row gap-sm w-full hover:bg-primary-400 transition-[background-color] duration-300 rounded-md ${
              currentSection === item.path
                ? "bg-primary-100 text-white"
                : "bg-white text-text-700"
            }`}
          >
            <input
              onChange={() => handleNavigationChange(item.path)}
              type="radio"
              name="dashboard-option"
              id={`${item.path}-nav`}
              checked={currentSection === item.path}
              className="hidden"
            />
            <label
              htmlFor={`${item.path}-nav`}
              className="cursor-pointer flex flex-row gap-sm p-2.5 h-full w-full items-center"
            >
              <Icon
                className={`shrink-0 ${
                  currentSection === item.path ? "text-white" : "text-black"
                } group-hover/items:text-white transition-colors duration-300`}
              />
              <p className="font-nunitosans whitespace-nowrap group-hover/items:text-white transition-colors duration-300">
                {item.label}
              </p>
            </label>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="flex flex-row w-full bg-background-100">
      {/* ── MOBILE/TABLET: hamburger button ── */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-effect-2"
      >
        <Menu size={22} className="text-text-1000" />
      </button>

      {/* ── MOBILE/TABLET: backdrop ── */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* ── MOBILE/TABLET: slide-in drawer ── */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-[272px] bg-white z-50 flex flex-col justify-between pb-2.5 px-md transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col pt-[40px] gap-[40px]">
          <div className="flex flex-row justify-between items-center">
            <Image
              src="/logo.jpg"
              alt="logo"
              width={48}
              height={48}
              unoptimized
              className="size-[48px] bg-green-300 rounded-md object-cover"
            />
            <button onClick={() => setIsDrawerOpen(false)}>
              <X size={20} className="text-text-700" />
            </button>
          </div>
          <NavItems />
        </div>
        <button
          onClick={onLogOut}
          className="flex flex-row gap-sm bg-white hover:bg-red-500 p-2.5 rounded-md text-red-500 hover:text-white transition-all duration-300"
        >
          <LogoutIcon className="w-6 h-6" />
          <p className="whitespace-nowrap">Logout</p>
        </button>
      </div>

      {/* ── DESKTOP: sticky collapsible sidebar ── */}
      <div className="hidden lg:block h-screen w-[100px] sticky top-0 z-50">
        <nav className="group/nav flex w-[100px] hover:w-[272px] flex-col h-full bg-white transition-[width] duration-300">
          <div className="flex flex-col justify-between h-full pb-2.5 px-md">
            <div className="flex flex-col pt-[64px] gap-[60px]">
              <Image
                src="/logo.jpg"
                alt="logo"
                width={64}
                height={64}
                unoptimized
                className="size-[64px] bg-green-300 rounded-md object-cover"
              />
              <ul className="flex flex-col mx-[12px] group-hover/nav:mx-0 gap-xxs group-hover/nav:items-start transition-[margin] duration-300">
                {navData.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={index}
                      className={`group/items flex flex-row gap-sm group-hover/nav:w-full hover:bg-primary-400 transition-[background-color] duration-300 rounded-md ${
                        currentSection === item.path
                          ? "bg-primary-100 text-white"
                          : "bg-white text-text-700"
                      }`}
                    >
                      <input
                        onChange={() => handleNavigationChange(item.path)}
                        type="radio"
                        name="dashboard-option-desktop"
                        id={`${item.path}-desktop`}
                        checked={currentSection === item.path}
                        className="hidden"
                      />
                      <label
                        htmlFor={`${item.path}-desktop`}
                        className="cursor-pointer flex flex-row gap-sm p-2.5 h-full w-full"
                      >
                        <Icon
                          className={`${
                            currentSection === item.path
                              ? "text-white"
                              : "text-black"
                          } group-hover/items:text-white transition-colors duration-300`}
                        />
                        <p className="w-0 hidden overflow-hidden group-hover/nav:block group-hover/nav:w-full font-nunitosans whitespace-nowrap group-hover/items:text-white transition-all transition-discrete duration-300">
                          {item.label}
                        </p>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
            <button
              onClick={onLogOut}
              className="flex flex-row gap-sm bg-white hover:bg-red-500 p-2.5 rounded-md text-red-500 hover:text-white transition-all duration-300 mx-[12px] group-hover/nav:mx-0"
            >
              <LogoutIcon className="w-6 h-6" />
              <p className="w-0 text-start hidden overflow-hidden group-hover/nav:block group-hover/nav:w-full whitespace-nowrap transition-all transition-discrete duration-300">
                Logout
              </p>
            </button>
          </div>
        </nav>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 min-w-0 pt-14 lg:pt-0">{children}</div>
    </div>
  );
}
