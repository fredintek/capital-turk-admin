import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capital Turk Dashboard",
  description: "Capital Turk CMS Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* HEADER */}
      <div>NAVBAR</div>

      {/* CHILDREN */}
      <main className="">
        <div>SIDEBAR</div>
        {children}
      </main>
    </>
  );
}
