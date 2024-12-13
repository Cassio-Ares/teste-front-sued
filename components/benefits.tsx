import React from "react";
import Image from "next/image";
import { BanknoteIcon, Clock, HandCoinsIcon } from "lucide-react";
import Logo from "/public/assets/images/sued-logo.png";

const Benefits = () => {
  return (
    <div className="flex flex-col-reverse bg-gray-50 items-center justify-center lg:flex-row lg:justify-evenly lg:gap-10 p-10 lg:py-20">
      <div className="mx-4 flex flex-col items-center justify-center lg:items-start ">
        <h3 className="text-center lg:text-start text-orange-500 font-bold pt-5 pb-5">
          Benefícios
        </h3>

        <div className="flex flex-col lg:w-[560px] ">
          <h1 className="pb-5 text-2xl text-center font-semibold lg:text-4xl lg:text-start ">
            Razões para escolher a SUED
          </h1>
        </div>
        <div className="flex flex-col lg:w-[800px]">
          <div className="flex flex-col gap-8 lg:flex-row ">
            <div className="flex mt-4 flex-col justify-start items-start lg:justify-start gap-4 lg:w-full">
              <div className="flex  bg-orange-500 px-4 py-4 items-start justify-start rounded-full">
                <BanknoteIcon width={24} height={24} color="white" />
              </div>
              <h2 className="font-bold text-2xl">Eliminação do desperdício</h2>
              <p className="text-start">
                {" "}
                Controle rigoroso da produção para reduzir perdas e otimizar os
                recursos públicos.
              </p>
            </div>
            <div className="flex mt-4  flex-col justify-start items-start lg:justify-start gap-4 w-full">
              <div className="flex  bg-orange-500 px-4 py-4 items-start justify-start rounded-full">
                <Clock width={24} height={24} color="white" />
              </div>
              <h2 className="font-bold text-2xl">
                Fichas Técnicas Automatizadas
              </h2>
              <p className="text-start ">
                Gere fichas com receitas detalhadas, valores nutricionais e
                custos.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-8 lg:flex-row ">
            <div className="flex mt-4  flex-col justify-start items-start lg:justify-start gap-4">
              <div className="flex  bg-orange-500 px-4 py-4 items-start justify-start rounded-full ">
                <HandCoinsIcon width={24} height={24} color="white" />
              </div>
              <h2 className="font-bold text-2xl">
                Gestão Nutricional Avançada
              </h2>
              <p className="text-start ">
                Planeje cardápios que atendem às normas do PNAE.
              </p>
            </div>
            <div className="flex mt-4  flex-col justify-start items-start lg:justify-start gap-4">
              <div className="flex  bg-orange-500 px-4 py-4 items-start justify-start rounded-full ">
                <HandCoinsIcon width={24} height={24} color="white" />
              </div>
              <h2 className="font-bold text-2xl">Relatórios Personalizados</h2>
              <p className="text-start ">
                Gere análises detalhadas para tomada de decisões.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col mx-10 lg:mx-10  ">
        <Image
          className="rounded-3xl w-[250px] lg:w-[450px] "
          src={Logo}
          width={0}
          height={0}
          quality={100}
          alt="hero-img"
        />
      </div>
    </div>
  );
};

export default Benefits;
