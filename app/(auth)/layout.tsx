"use client";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoader from "@/components/loaders/PageLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);

  // block access to login page if logged in
  useEffect(() => {
    if (authState.token) {
      // don't show login page
      router.replace("/dashboard");
    } else {
      // show login page
      setLoading(false);
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
    <div className="w-full h-[100vh] bg-login-bg">
      {/* LOGO */}
      <nav className="grid place-items-center">
        <div className="w-[180px] h-[100px]">
          <img
            src="/images/capital-turk-logo.png"
            className="w-full h-full object-contain"
            alt="logo"
          />
        </div>
      </nav>

      {/* LOGIN CONTAINER */}
      <section className="h-[calc(100vh-100px)] grid place-items-center">
        {children}
      </section>
    </div>
  );
}
