import React from "react";

const HowWorks = () => {
  return (
    <div
      className="flex flex-col justify-center items-center mt-6 mx-4 lg:py-20"
      id="how-to-use"
    >
      <div className="flex flex-col justify-center items-center lg:mt-10 mb-12 gap-4">
        <span className="bg-orange-100 text-sm lg:text-base text-orange-500 px-4 py-1 rounded-full">
          facilidade para você
        </span>
        <div className="flex flex-col items-center text-center">
          <h1 className="font-bold text-center text-[26px] lg:text-[48px] text-gray-900">
            Simples e fácil, como tudo deve ser
          </h1>
          <p className="w-[70%]">
            O passo a passo mais simples que você já viu!
          </p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-10 mx-6 ">
        {/* Card-01 */}
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center w-16 h-16 rounded-lg bg-orange-500 ">
            <h2 className="font-bold text-xl lg:text-2xl text-white">1</h2>
          </div>
          <div className="flex flex-col text-center mt-6">
            <h2 className="font-bold text-lg lg:text-2xl text-gray-900">
              Cadastro de Insumos
            </h2>
            <p className="gray-500 font-medium lg:w-[311px]">
              Registre preços e quantidades disponíveis.
            </p>
          </div>
        </div>
        {/* End Card-01 */}
        {/* Card-02 */}
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center w-16 h-16 rounded-lg bg-orange-500 ">
            <h2 className="font-bold text-xl lg:text-2xl text-white">2</h2>
          </div>
          <div className="flex flex-col text-center mt-6">
            <h2 className="font-bold text-lg lg:text-2xl text-gray-900">
              Elaboração do Cardápio Digital
            </h2>
            <p className="gray-500 font-medium lg:w-[311px]">
              Planeje as refeições com base nas necessidades nutricionais e
              faixas etárias.
            </p>
          </div>
        </div>
        {/* End Card-02 */}
        {/* Card-03 */}
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center w-16 h-16 rounded-lg bg-orange-500 ">
            <h2 className="font-bold text-xl lg:text-2xl text-white">3</h2>
          </div>
          <div className="flex flex-col text-center mt-6">
            <h2 className="font-bold text-lg lg:text-2xl text-gray-900">
              Controle de Produção
            </h2>
            <p className="gray-500 font-medium lg:w-[311px]">
              Calcule custos, padronize porções e monitore rendimentos.
            </p>
          </div>
        </div>
        {/* End Card-03 */}
      </div>
    </div>
  );
};

export default HowWorks;
