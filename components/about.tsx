import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import Logo from "/public/assets/images/sued-logo.png";

const About = () => {
  return (
    <div className=" flex flex-col items-center justify-center lg:flex-row lg:justify-evenly lg:gap-10 w-full py-14 mt-10">
      <div className="flex flex-col mx-10 lg:mx-10" id="coabout">
        <Image
          src={Logo}
          className="rounded-3xl w-[300px] lg:w-[450px] "
          width={0}
          height={0}
          quality={100}
          alt="hero-img"
        />
      </div>

      <div className="mx-4 flex flex-col items-center justify-center lg:items-start mt-10">
        <p className="text-center lg:text-start text-orange-500 font-bold pb-5">
          Sobre nós
        </p>

        <div className="flex flex-col lg:w-[560px] ">
          <h1 className="pb-5 text-2xl text-center font-semibold lg:text-4xl lg:text-start">
            O que é a SUED-Governo?
          </h1>

          <p className="pb-5 text-justify lg:text-lg">
            A SUED-Governo é uma plataforma inovadora que auxilia prefeituras e
            gestores públicos a eliminarem desperdícios na produção de merenda
            escolar. Com ferramentas avançadas de controle, ela facilita a
            elaboração de fichas técnicas, gestão de estoque e gera relatórios
            digitais que atendem às exigências de publicidade obrigatória.
          </p>
        </div>
        {/* <Link href="#apply">
          <Button className="bg-green-400 text-black flex justify-center items-center lg:justify-start  hover:bg-yellow-500 px-8 py-6 rounded-full font-semibold lg:text-lg lg:hover:-translate-y-2 transition-transform duration-700">
            sfdf
          </Button>
        </Link> */}
      </div>
    </div>
  );
};

export default About;
