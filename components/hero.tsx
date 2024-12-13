import React from "react";

const Hero = () => {
  return (
    <div
      id="hero"
      className=" flex flex-col bg-orange-50 items-center lg:flex-row lg:justify-evenly lg:items-end w-full pt-24 lg:pt-0 lg:pb-10"
    >
      <div className="flex flex-col justify-evenly items-center w-full">
        <div className="flex flex-col items-center lg:items-center mt-1 lg:mt-20 lg:mb-8">
          <p className="text-center lg:text-start bg-orange-100 w-fit px-4 py-2 rounded-full text-orange-600 font-bold mb-5">
            A revolução chegou
          </p>

          <h1 className="text-3xl text-center px-1 lg:px-0 font-bold lg:text-[60px] lg:w-[800px] lg:leading-none lg:text-center">
            Revolucione a gestão da merenda escolar
          </h1>
          <p className="mt-5 text-base lg:text-lg px-4 lg:px-0 text-center lg:w-[800px]">
            Reduza desperdícios, otimize recursos e garanta uma alimentação de
            qualidade para os alunos com a SUED-Governo, a plataforma completa
            para merenda escolar para os municípios.
          </p>
        </div>
        <div className="flex mt-4 mb-6 gap-4">
          <a
            href="#coabout"
            className="flex bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-3 lg:px-7 lg:py-4 lg:text-lg h-fit rounded-lg"
          >
            Saiba mais
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
