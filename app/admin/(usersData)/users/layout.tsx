import Sidenav from "@/components/ui/sidenav";
// import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden ">
      <div className="w-full flex-none md:w-72 bg-gray-100/20 lg:block dark:bg-gray-800/40">
        <Sidenav />
      </div>
      <div className="flex flex-col p-6 md:overflow-y-auto md:p-8 md:w-full">
        {children}
      </div>
      {/* <Toaster /> */}
    </div>
  );
}
