"use client";
import { ChefHat, CookingPot, FileStack, LayoutDashboard, LogOutIcon, MenuIcon, Package, Utensils } from "lucide-react";
import Link from "next/link";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { removeToken } from "@/connect/api";
import { useState } from "react";

const Sidenav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExit = () => {
    removeToken();
  };

  return (
    <>
      <div className="flex w-full h-screen flex-col border-r lg:block dark:bg-gray-800/40">
        <div className="flex h-20 items-center justify-between px-4 md:h-20 w-screen md:w-full bg-orange-100">
          <div className="flex items-center justify-center md:w-full">
            <img className="flex w-[120px] h-auto" src="/assets/images/sued-logo.png" alt="logo" />
          </div>

          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger className="text-orange-500">
                <MenuIcon size={42} />
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="flex gap-3 items-center">
                    <img className="w-[90px]" src="/assets/images/sued-logo.png" alt="logo" />
                  </SheetTitle>
                  <SheetDescription className="text-base"></SheetDescription>

                  <ul className="antialiased flex flex-col md:flex-col gap-3 mt-4">
                    <li>
                      <small className="flex gap-2 mb-3">Dashboard</small>
                      <Link
                        className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
                        href="/admin/dashboard"
                      >
                        <SheetClose className="flex gap-2 w-full">
                          <LayoutDashboard size={18} /> Visão geral
                        </SheetClose>
                      </Link>
                    </li>
                    <li className="flex flex-col">
                      <small className="flex gap-2 mb-3">Ficha técnica</small>
                      <Link
                        className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
                        href="/admin/menus"
                      >
                        <SheetClose className="flex gap-2 w-full">
                          <Utensils size={18} /> Cardápios
                        </SheetClose>
                      </Link>
                      <Link
                        className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
                        href="/admin/ingredients"
                      >
                        <SheetClose className="flex gap-2 w-full">
                          <CookingPot size={18} /> Ingredientes
                        </SheetClose>
                      </Link>
                      <Link
                        className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
                        href="/admin/stock"
                      >
                        <SheetClose className="flex gap-2 w-full">
                          <Package size={18} /> Estoque
                        </SheetClose>
                      </Link>
                    </li>

                    <li className="md:block">
                      <Link
                        className="hover:bg-red-400 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-bold text-sm text-red-400 flex gap-2 md:mt-20 md:fixed md:bottom-10 md:w-64"
                        href="/admin"
                        onClick={handleExit}
                      >
                        <LogOutIcon size={18} /> Sair
                      </Link>
                    </li>
                  </ul>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div
          className={`hidden md:flex md:flex-col ml-4 bg-gray-50 ${
            isOpen ? "h-[calc(100vh-9rem)] overflow-y-auto" : ""
          }`}
        >
          <ul className="antialiased flex md:flex-col gap-3 mt-8">
            <li>
              <small className="flex gap-2 mb-3">Dashboard</small>
              <Link
                className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
                href="/admin/dashboard"
              >
                <LayoutDashboard size={18} /> Visão geral
              </Link>
            </li>
            <li className="flex flex-col">
              <small className="flex gap-2 mb-3">Ficha técnica</small>
              <Link
                className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
                href="/admin/menus"
              >
                <Utensils size={18} /> Cardápios
              </Link>
              <Link
                className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
                href="/admin/recipes"
              >
                <ChefHat size={18} /> Receitas
              </Link>
              <Link
                className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
                href="/admin/ingredients"
              >
                <CookingPot size={18} /> Ingredientes
              </Link>
              <Link
                className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
                href="/admin/stock"
              >
                <Package size={18} /> Estoque
              </Link>
            </li>
            <li className="flex flex-col ">
              <small className="flex gap-2 mb-3">Cadastros</small>
              <Accordion type="single" collapsible onValueChange={(value) => setIsOpen(value === "item-1")}>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2">
                    <FileStack size={18} />
                    Cadastros
                  </AccordionTrigger>
                  <AccordionContent>
                    <Link
                      className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
                      href="/admin/users"
                    >
                      <Package size={18} /> Usuario
                    </Link>
                  </AccordionContent>
                  <AccordionContent>
                    <Link
                      className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
                      href="/admin/institutions"
                    >
                      <Package size={18} /> Instituições
                    </Link>
                  </AccordionContent>
                  <AccordionContent>
                    <Link
                      className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
                      href="/admin/nutritionists"
                    >
                      <Package size={18} /> Nutricionista
                    </Link>
                  </AccordionContent>
                  <AccordionContent>
                    <Link
                      className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
                      href="/admin/states"
                    >
                      <Package size={18} /> Estado
                    </Link>
                  </AccordionContent>
                  <AccordionContent>
                    <Link
                      className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
                      href="/admin/cities"
                    >
                      <Package size={18} /> Cidade
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </li>
          </ul>
        </div>
        <div className="fixed bottom-0 hidden md:block w-1/6 px-4 py-3 border-t">
          <Link
            className="hover:bg-red-400 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-bold text-sm text-red-400 flex gap-2"
            href="/admin"
            onClick={handleExit}
          >
            <LogOutIcon size={18} /> Sair
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidenav;

// const Sidenav = () => {
//   return (
//     <>
//       <div className="flex w-full h-screen flex-col border-r lg:block dark:bg-gray-800/40">
//         <div className=" flex h-20 items-center justify-between px-4 md:h-20 w-screen md:w-full bg-orange-100">
//           <div className="flex items-center justify-center md:w-full ">
//             <img className="flex  w-[120px] h-auto " src="/assets/images/sued-logo.png" alt="logo" />
//           </div>

//           <div className="flex md:hidden">
//             <Sheet>
//               <SheetTrigger className="text-orange-500">
//                 <MenuIcon size={42} />
//               </SheetTrigger>
//               <SheetContent side="left">
//                 <SheetHeader>
//                   <SheetTitle className="flex gap-3 items-center">
//                     <img className="w-[90px]" src="/assets/images/sued-logo.png" alt="logo" />
//                   </SheetTitle>
//                   <SheetDescription className="text-base"></SheetDescription>

//                   <ul className="antialiased flex flex-col md:flex-col gap-3 mt-4">
//                     <li>
//                       <small className="flex gap-2 mb-3">Dashboard</small>
//                       <Link
//                         className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
//                         href="/admin/dashboard"
//                       >
//                         <SheetClose className="flex gap-2 w-full">
//                           <LayoutDashboard size={18} /> Visão geral
//                         </SheetClose>
//                       </Link>
//                     </li>
//                     <li className="flex flex-col">
//                       <small className="flex gap-2 mb-3">Ficha técnica</small>
//                       <Link
//                         className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
//                         href="/admin/menus"
//                       >
//                         <SheetClose className="flex gap-2 w-full">
//                           <Utensils size={18} /> Cardápios
//                         </SheetClose>
//                       </Link>
//                       {/* <Link
//                         className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
//                         href="/admin/technical-sheet"
//                       >
//                         <SheetClose className="flex gap-2 w-full">
//                           <ChefHat size={18} /> Ficha técnica
//                         </SheetClose>
//                       </Link> */}
//                       <Link
//                         className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
//                         href="/admin/ingredients"
//                       >
//                         <SheetClose className="flex gap-2 w-full">
//                           <CookingPot size={18} /> Ingredientes
//                         </SheetClose>
//                       </Link>
//                       <Link
//                         className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
//                         href="/admin/stock"
//                       >
//                         <SheetClose className="flex gap-2 w-full">
//                           <Package size={18} /> Estoque
//                         </SheetClose>
//                       </Link>
//                     </li>

//                     <li className="md:block">
//                       <Link
//                         className=" hover:bg-red-400 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-bold text-sm text-red-400 flex gap-2 md:mt-20 md:fixed md:bottom-10  md:w-64"
//                         href="/admin"
//                       >
//                         <LogOutIcon size={18} /> Sair
//                       </Link>
//                     </li>
//                   </ul>
//                 </SheetHeader>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>

//         <div className="hidden md:flex md:flex-col ml-4 bg-gray-50 mt-8 flex-1 overflow-y-auto">
//           <ul className="antialiased flex md:flex-col gap-3">
//             <li>
//               <small className="flex gap-2 mb-3">Dashboard</small>
//               <Link
//                 className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
//                 href="/admin/dashboard"
//               >
//                 <LayoutDashboard size={18} /> Visão geral
//               </Link>
//             </li>
//             <li className="flex flex-col">
//               <small className="flex gap-2 mb-3">Ficha técnica</small>
//               <Link
//                 className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
//                 href="/admin/menus"
//               >
//                 <Utensils size={18} /> Cardápios
//               </Link>
//               <Link
//                 className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
//                 href="/admin/recipes"
//               >
//                 <ChefHat size={18} /> Receitas
//               </Link>
//               <Link
//                 className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
//                 href="/admin/ingredients"
//               >
//                 <CookingPot size={18} /> Ingredientes
//               </Link>
//               <Link
//                 className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
//                 href="/admin/stock"
//               >
//                 <Package size={18} /> Estoque
//               </Link>
//             </li>
//             <li>
//               <small className="flex gap-2 mb-3">Cadastros</small>
//               <Accordion type="single" collapsible>
//                 <AccordionItem value="item-1">
//                   <AccordionTrigger>Cadastros</AccordionTrigger>
//                   <AccordionContent>
//                     <Link
//                       className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
//                       href="/admin/stock"
//                     >
//                       <Package size={18} /> Usuario
//                     </Link>
//                   </AccordionContent>
//                   <AccordionContent>
//                     <Link
//                       className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
//                       href="/admin/stock"
//                     >
//                       <Package size={18} /> Instituições
//                     </Link>
//                   </AccordionContent>
//                   <AccordionContent>
//                     <Link
//                       className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
//                       href="/admin/stock"
//                     >
//                       <Package size={18} /> Nutricionista
//                     </Link>
//                   </AccordionContent>
//                   <AccordionContent>
//                     <Link
//                       className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
//                       href="/admin/stock"
//                     >
//                       <Package size={18} /> Estado
//                     </Link>
//                   </AccordionContent>
//                   <AccordionContent>
//                     <Link
//                       className="hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-semibold text-slate-800 text-sm flex gap-2"
//                       href="/admin/stock"
//                     >
//                       <Package size={18} /> Cidade
//                     </Link>
//                   </AccordionContent>
//                 </AccordionItem>
//               </Accordion>
//             </li>
//           </ul>
//         </div>
//         <div className="hidden md:block px-4 py-3 border-t">
//           <Link
//             className="hover:bg-red-400 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-bold text-sm text-red-400 flex gap-2"
//             href="/admin"
//           >
//             <LogOutIcon size={18} /> Sair
//           </Link>
//         </div>

//         {/* <li className="hidden md:block">
//           <Link
//             className=" hover:bg-red-400 hover:text-white transition-all duration-500 ease-in-out rounded-md p-3 font-bold text-sm text-red-400 flex gap-2 md:mt-20 md:bottom-10  md:w-64"
//             href="/admin"
//           >
//             <LogOutIcon size={18} /> Sair
//           </Link>
//         </li> */}
//       </div>
//     </>
//   );
// };

// export default Sidenav;
