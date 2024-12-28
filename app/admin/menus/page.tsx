"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { informationError } from "@/components/informationError";
import { InputSelect } from "@/components/inputSelect";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { api } from "@/connect/api";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useSearch } from "@/hook/useSearch";

const MealTypeLabels = {
  MorningSnack: "Lanche da Manhã",
  Lunch: "Almoço",
  AfternoonSnack: "Lanche da Tarde",
  NightSnack: "Lanche da Noite",
  FullPeriodMealMorning: "Lanche Integral - Manhã",
  FullPeriodMealAfternoon: "Lanche Integral - Tarde",
};

const Menus = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menus, setMenus] = useState<any>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDateMenus, setSelectedDateMenus] = useState<any>(null);

  //school
  const [schoolSearch, setSchoolSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  const {
    data: searchSchool,
    loading: searchSchoolLoading,
    error: searchSchoolError,
    setQuery: setQuerySchool,
  } = useSearch<any>("schools", schoolSearch);

  const handleSchoolSelect = (schoolId: number) => {
    const school = searchSchool?.find((s) => s.id === schoolId);
    if (school) {
      setSelectedSchool(school);
    }
  };

  const fetchMenus = async (selectedDate: Date) => {
    if (!selectedSchool) {
      toast.error("Selecione uma escola");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const day = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();

      const response = await api.get("/menus/menu_calendar", {
        params: {
          day,
          month,
          year,
          schoolId: selectedSchool.id,
        },
      });

      setMenus(response.data.data);

      // Preparar dados para o dialog
      const weekday = selectedDate.getDay() + 1; // 1-7 (domingo-sábado)
      const dayMenus = response.data.data[weekday] || [];

      setSelectedDateMenus({
        date: selectedDate,
        items: dayMenus,
      });

      setIsDialogOpen(true);
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      fetchMenus(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  console.log("selectedDateMenus", selectedDateMenus);

  return (
    <div className="flex flex-col justify-start gap-4 h-full">
      <ToastContainer />
      <h1 className="font-bold text-xl">Menus</h1>

      <div className="w-full flex row justify-between">
        <div className="flex">
          <Link href="/admin/menus/newmenu">
            <Button className="bg-orange-500 hover:bg-orange-600 font-bold">
              + Novo Menu
            </Button>
          </Link>
        </div>
        <div className="flex">
          <Link href="/admin/menus/new">
            <Button className="bg-orange-500 hover:bg-orange-600 font-bold">
              + Cardápio Menu
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex justify-center items-center w-full h-full">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Nome da Instituição</Label>
            <InputSelect
              options={searchSchool}
              value={selectedSchool?.id}
              onChange={handleSchoolSelect}
              onSearchChange={(query) => setSchoolSearch(query)}
              placeholder="Selecione uma Instituição"
              field="name"
            />
          </div>

          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDateMenus?.date && formatDate(selectedDateMenus.date)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedDateMenus?.items?.length > 0 ? (
              selectedDateMenus.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-orange-50 border border-orange-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-orange-800">
                      {MealTypeLabels[item.meal_type]}
                    </h3>
                  </div>

                  <div className="text-gray-700">
                    <p className="font-medium">{item.recipe_name}</p>
                    {item.estimated_portions && (
                      <p className="text-sm mt-1">
                        Porções estimadas: {item.estimated_portions}
                      </p>
                    )}
                    {item.additional_notes && (
                      <p className="text-sm mt-2 text-gray-600">
                        Observações: {item.additional_notes}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                Nenhum cardápio encontrado para esta data
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menus;

// import { informationError } from "@/components/informationError";
// import { InputSelect } from "@/components/inputSelect";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Label } from "@/components/ui/label";
// import { api } from "@/connect/api";
// import Link from "next/link";
// import { useCallback, useEffect, useState } from "react";
// import { ToastContainer } from "react-toastify";

// //hook
// import { useSearch } from "@/hook/useSearch";

// const Menus = () => {
//   const [date, setDate] = useState<Date | undefined>(undefined);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [menus, setMenus] = useState<any[]>([]);

//   //school
//   const [schoolSearch, setSchoolSearch] = useState("");

//   const {
//     data: searchSchool,
//     loading: searchSchoolLoading,
//     error: searchSchoolError,
//     setQuery: setQuerySchool,
//   } = useSearch<any>("schools", schoolSearch);

//   const [selectedSchool, setSelectedSchool] = useState<any>(null);
//   const [resetSchoolInput, setResetSchoolInput] = useState(false);

//   const handleSchoolSelect = (schoolId: number) => {
//     const school = searchSchool?.find((s) => s.id === schoolId);
//     if (school) {
//       setMenuItems((prevMenuItems) => ({
//         ...prevMenuItems,
//         school_id: school.id,
//       }));
//     }
//   };

//   const fetchMenus = async (selectedDate: Date) => {
//     // Verifica se escola e data estão selecionadas
//     if (!selectedSchool) {
//       informationError("Selecione uma escola");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       // Extrai dia, mês e ano da data selecionada
//       const day = selectedDate.getDate(); // Usando getDate() para obter o dia do mês
//       const month = selectedDate.getMonth() + 1; // getMonth() retorna 0-11, então soma 1 para ficar 1-12
//       const year = selectedDate.getFullYear();

//       const response = await api.get("/menus/menu_data", {
//         params: {
//           day,
//           month,
//           year,
//           schoolId: selectedSchool,
//         },
//       });

//       setMenus(response.data.data);
//     } catch (error) {
//       informationError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDateSelect = (selectedDate: Date | undefined) => {
//     if (selectedDate) {
//       setDate(selectedDate);
//       console.log("Calling fetchMenus with:", selectedDate);
//       fetchMenus(selectedDate);
//     }
//   };

//   // console.log('date', date);
//   // console.log('selectedSchool', selectedSchool);

//   console.log("menus", menus);

//   return (
//     <div className="flex flex-col justify-start gap-4 h-full">
//       <h1 className="font-bold text-xl">Menus</h1>

//       {/* Botões existentes */}
//       <div className="w-full flex row justify-between">
//         <div className="flex">
//           <Link href="/admin/menus/newmenu">
//             <Button className="bg-orange-500 hover:bg-orange-600 font-bold">
//               + Novo Menu
//             </Button>
//           </Link>
//           <ToastContainer />
//         </div>
//         <div className="flex">
//           <Link href="/admin/menus/new">
//             <Button className="bg-orange-500 hover:bg-orange-600 font-bold">
//               + Cardápio Menu
//             </Button>
//           </Link>
//           <ToastContainer />
//         </div>
//       </div>

//       <div className="flex justify-center items-center w-full h-full">
//         <div className="space-y-4">
//           <div className="flex flex-col gap-2">
//             <Label>Nome da Instituição </Label>
//             <InputSelect
//               options={searchSchool}
//               value={selectedSchool?.id}
//               onChange={handleSchoolSelect}
//               onSearchChange={(query) => setSchoolSearch(query)}
//               placeholder="Selecione uma Instituição"
//               field="name"
//             />
//           </div>

//           <Calendar
//             mode="single"
//             selected={date}
//             onSelect={handleDateSelect}
//             className="rounded-md border"
//           />
//         </div>
//       </div>

//       {/* Opcional: Exibição dos menus encontrados */}
//       {menus && menus.length > 0 && (
//         <div className="mt-4">
//           <h2 className="font-bold text-lg mb-2">Cardápios Encontrados</h2>
//           {menus.map((menu) => (
//             <div key={menu.id} className="border p-2 mb-2">
//               {/* Adicione aqui a exibição dos detalhes do menu */}
//               <pre>{JSON.stringify(menu, null, 2)}</pre>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Menus;
//http://localhost:3000/api/menus/menu_calendar?day=28&month=12&year=2024&schoolId=1
