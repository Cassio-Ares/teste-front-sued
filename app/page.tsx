"use client";

import About from "@/components/about";
import Hero from "@/components/hero";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import Logo from "/public/assets/images/sued-logo.png";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import Benefits from "@/components/benefits";
import HowWorks from "@/components/howWorks";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenuOnClick = (sectionId: string) => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="flex fixed items-center z-40 bg-white w-full lg:hidden px-6 py-6 shadow-lg">
        <a href="#" className="flex items-center font-bold">
          <img
            className="w-[80px] h-auto"
            src="/assets/images/sued-logo.png"
            alt="logo"
          />
        </a>

        <button
          onClick={toggleMenu}
          className="fixed flex items-center top-2 right-0 p-4 z-40 lg:hidden lg:bg-none rounded-lg"
        >
          <MenuIcon size={28} className="text-orange-500 font-bold" />
        </button>
      </div>

      <header className="h-12 md:h-24 px-8 md:px-12 lg:px-8 xl:px-28 flex gap-8 items-center bg-orange-50  text-white antialiased font-bold  lg:mb-0 lg:shadow-md ">
        <a href="/app/page.tsx" className="">
          <Image src={Logo} alt="logoo" width={100} height={100} />
        </a>

        <div
          className={`fixed lg:relative top-0 left-0 bg-orange-500  z-20 lg:bg-transparent  bg-opacity-95 text-center overflow-hidden transition-all duration-500 flex flex-col lg:flex-row gap-8 items-center justify-center w-full lg:h-full lg:opacity-100 ${
            isMenuOpen ? "h-full opacity-100" : "h-0 opacity-0"
          }`}
        >
          <nav className="lg:flex-1 justify-end flex gap-8 flex-col lg:flex-row lg:ml-16 text-black">
            <a
              className=" hover:text-orange-500 transition-all duration-500"
              href="/"
              onClick={() => closeMenuOnClick("#")}
            >
              Início
            </a>

            <a
              className="hover:text-orange-500 transition-all duration-500"
              href="#who"
              onClick={() => closeMenuOnClick("#about")}
            >
              Nossa solução
            </a>

            <a
              className="text-black hover:text-orange-500 transition-all duration-500"
              href="#reasons"
              onClick={() => closeMenuOnClick("#services")}
            >
              Como funciona
            </a>
            <a
              className="hover:text-orange-500 transition-all duration-500"
              href="#faq"
            >
              Contato
            </a>
          </nav>

          <div className="flex items-center flex-col gap-5 lg:flex-row lg:gap-4">
            <div className="flex">
              <a
                href="/admin"
                className="flex w-full px-8 py-4 bg-orange-500 rounded-md text-base font-semibold text-white hover:bg-orange-600 transition-all duration-500  hover:font-semibold"
                onClick={() => closeMenuOnClick("#hero")}
              >
                Acessar plataforma
              </a>
            </div>
          </div>
        </div>
      </header>
      <Hero />
      <About />
      <Benefits />
      <HowWorks />
      <Footer />
    </>
  );
}
