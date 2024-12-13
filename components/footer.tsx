import Image from "next/image";
import React from "react";
import Logo from "/public/assets/images/sued-logo.png";

import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-orange-100 text-black w-full h-full flex flex-col justify-center items-start pl-6 gap-6 lg:justify-around lg:flex-row p-10 lg:px-6 lg:py-6 lg:gap-12 lg:pt-10 lg:pb-20">
      <div className="flex flex-col gap-4 justify-center items-center lg:items-center  ">
        <Image
          className="-ml-10"
          src={Logo}
          alt="logo"
          width={200}
          height={100}
        />
        <p className="text-black text-center  w-[320px]">
          A revolução da gestão da merenda escolar para o seu município
        </p>
      </div>
      <div className="flex flex-col ">
        <h3 className="font-bold text-xl">Menu</h3>
        <ul className="flex flex-col gap-2 mt-6">
          <li className="hover:text-orange-400  hover:transition duration-150">
            <Link href="#services"> Início</Link>
          </li>
          <li className="hover:text-orange-400 hover:transition duration-150">
            <Link href="#services"> Nossa solução</Link>
          </li>
          <li className="hover:text-orange-400 hover:transition duration-150">
            <Link href="#services"> Como funciona</Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-col ">
        <h3 className="font-bold text-xl">Contato</h3>
        <ul className="flex flex-col gap-2 mt-6">
          <li className="hover:text-orange-400 hover:transition duration-150 ">
            <a
              href="https://wa.me/5585997555937?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
              target="_blank"
            >
              85 99755-5937
            </a>
          </li>
          <li className="hover:text-orange-400  hover:transition duration-150 ">
            contato@sued.com.br
          </li>
        </ul>
      </div>
      <div className="flex flex-col">
        <h3 className="font-bold text-xl">Siga-nos</h3>
        <ul className="flex  gap-4 mt-6">{/* TODO: add social links  */}</ul>
      </div>
    </div>
  );
};

export default Footer;
