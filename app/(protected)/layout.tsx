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
      <main className="h-[calc(100vh-83.6px)] flex">
        <SideBar />
        <div className="px-4 py-6 bg-gray-300 flex-1 h-full w-screen">
          <div className="h-full border overflow-hidden rounded-lg">
            <section className="bg-white h-full overflow-y-auto rounded-lg">
              {children}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
