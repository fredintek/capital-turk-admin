"use client";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";

type Props = {};

const SideBar = (props: Props) => {
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  return (
    <div
      className={`fixed left-0 min-h-[calc(100vh-83.6px)] w-64 bg-[#0d0d1f] transform transition-transform duration-300 z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 p-4`}
    >
      {/* Inner Content */}
      <div className="bg-red-500 w-full h-full">
        <h1 className="text-white">Sidebar Content</h1>
      </div>
    </div>
  );
};

export default SideBar;
