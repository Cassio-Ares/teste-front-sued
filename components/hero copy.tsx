import React from "react";
import { Download, Link } from "lucide-react";
import Image from "next/image";
import Logo from "/public/assets/images/sued-logo.png";

const Hero = () => {
  return (
    <div
      id="hero"
      className="bg-hero bg-cover lg:bg-contain h-full lg:h-screen lg:p-10 flex flex-col-reverse items-center justify-center lg:flex-row lg:justify-evenly lg:items-center w-full mb-20 "
    >
      <div className="flex flex-col justify-center items-center lg:w-1/2 ">
        <div className="flex flex-col items-center lg:items-start ">
          <h1 className="text-3xl text-gray-900 text-center px-1 lg:px-0 font-bold lg:text-[58px] lg:w-[563px] lg:leading-none lg:text-start">
            Revolucione a Gestão da merenda escolar no seu município
          </h1>
          <p className="mt-5 text-base lg:text-lg px-4 lg:px-0 text-center lg:w-[563px] lg:text-start">
            Reduza desperdícios, otimize recursos e garanta uma alimentação de
            qualidade para os alunos com a SUED-Governo, a plataforma completa
            para merenda escolar.
          </p>
          <div className="flex lg:w-[600px] mt-6 gap-4">
            <a
              href="#whatslink"
              className="flex bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 lg:px-7 lg:py-4 text-base lg:text-lg h-fit rounded-lg transition-all duration-500 "
            >
              Saiba mais
            </a>
            {/* <a
              href="#"
              className="flex bg-gray-600 hover:bg-gray-800 text-white font-semibold px-4 py-2 lg:px-7 lg:py-4 lg:text-lg h-fit rounded-lg transition-all duration-500 "
            >
              <Download className="mr-2" /> Quero me cadastrar
            </a> */}
          </div>
        </div>
      </div>
      <div className="hidden lg:flex -mb-20 lg:-mb-0  lg:py-0 bg-transparent flex-col lg:flex-row w-[30%] justify-center items-center lg:items-center lg:justify-center ">
        <div className="lg:w-[100%] flex lg:items-center lg:justify-center">
          <Image
            className="hidden lg:flex lg:items-center lg:justify-center lg:w-[400px] lg:min-w-[400px] h-[500px] lg:-mb-6 rounded-xl"
            src={Logo}
            width={400}
            height={400}
            quality={100}
            alt="hero-img"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
