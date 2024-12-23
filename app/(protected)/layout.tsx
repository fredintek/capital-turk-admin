"use client";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoader from "@/components/loaders/PageLoader";
import SideBar from "@/components/sidebar/SideBar";
import Navbar from "@/components/navbar/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authState.token) {
      setLoading(false);
    } else {
      router.replace(`/`);
    }
  }, [authState.token, router]);

  if (loading) {
    return (
      <div className="w-screen h-screen grid place-items-center">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] flex flex-col">
      <Navbar />

      {/* CHILDREN */}
      <main className="min-h-[calc(100vh-83.6px)] flex">
        <SideBar />
        <div className="p-4 bg-gray-300 flex-1">{children}</div>
      </main>
    </div>
  );
}
