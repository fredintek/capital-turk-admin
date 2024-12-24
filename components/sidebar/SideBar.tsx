"use client";
import { useLogoutMutation } from "@/redux/api/authApiSlice";
import { RootState } from "@/redux/store";
import {
  AppstoreFilled,
  CalendarFilled,
  LogoutOutlined,
  MessageFilled,
  NotificationFilled,
  SmileFilled,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import FormLoadingSpinner from "../loaders/FormLoadingSpinner";

type Props = {};

const sidebarLinks = [
  {
    title: "Fun",
    icon: <SmileFilled className="text-lg" />,
    href: "/dashboard/fun",
  },
  {
    title: "Showcase",
    icon: <AppstoreFilled className="text-lg" />,
    href: "/dashboard/showcase",
  },
  {
    title: "Today",
    icon: <CalendarFilled className="text-lg" />,
    href: "/dashboard/today",
  },
  {
    title: "Communication",
    icon: <MessageFilled className="text-lg" />,
    href: "/dashboard/communication",
  },
  {
    title: "Broadcast",
    icon: <NotificationFilled className="text-lg" />,
    href: "/dashboard/broadcast",
  },
];

const SideBar = (props: Props) => {
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const pathname = usePathname();
  const [logout, { isError, isLoading, isSuccess, error, data }] =
    useLogoutMutation(undefined);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
    }

    if (isError) {
      const customError = error as { data: any; status: number };
      toast.error(customError.data.message);
    }
  }, [isSuccess, isError, error, data]);

  return (
    <div
      className={`fixed flex left-0 h-[calc(100vh-83.6px)] w-64 bg-[#0d0d1f] transform transition-transform duration-300 z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 px-2 pt-6 pb-4`}
    >
      {/* Inner Content */}
      <div className="w-full h-full flex flex-col gap-4 pb-2">
        <div className="h-[calc(100%-52px)] flex flex-col gap-4 pr-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className={`flex gap-2 items-center text-white py-4 pl-2 border rounded-lg transition duration-300 ${
                pathname?.startsWith(link.href)
                  ? "bg-red-500"
                  : "hover:bg-gray-600"
              }`}
            >
              {link.icon}
              <p>{link.title}</p>
            </Link>
          ))}
        </div>
        {/* Add more links as needed */}
        <div
          onClick={() => logout(undefined)}
          className="flex gap-2 items-center mt-auto bg-gray-600 transition duration-300 hover:bg-red-500 text-white py-3 pl-2 rounded-lg text-lg cursor-pointer font-semibold"
        >
          <LogoutOutlined className="" />
          <p>Logout</p>
          {isLoading && <FormLoadingSpinner />}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
