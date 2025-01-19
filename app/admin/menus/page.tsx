"use client";

import { informationError } from "@/components/informationError";
import { InputSelect } from "@/components/inputSelect";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/connect/api";
import { useSearch } from "@/hook/useSearch";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

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

  console.log(selectedSchool?.name);

  const fetchMenus = async (selectedDate: Date) => {
    if (!selectedSchool) {
      toast.error("Selecione uma escola");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();

      const response = await api.get("/menus", {
        params: {
          month,
          year,
          schoolId: selectedSchool.id,
        },
      });

      setMenus(response.data.data);

      setIsDialogOpen(true);
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSchool) {
      fetchMenus(new Date());
    }
  }, [selectedSchool]);

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
        </div>
      </div>
    </div>
  );
};

export default Menus;

// <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
// <DialogContent className="max-w-xl">
//   <DialogHeader>
//     <DialogTitle>
//       {selectedDateMenus?.date && formatDate(selectedDateMenus.date)}
//     </DialogTitle>
//   </DialogHeader>

//   <div className="space-y-4">
//     {selectedDateMenus?.items?.length > 0 ? (
//       selectedDateMenus.items.map((item: any, index: number) => (
//         <div>
//           <div
//             key={index}
//             className="p-4 rounded-lg bg-orange-50 border border-orange-200"
//           >
//             <div className="flex justify-between items-start mb-2">
//               <h3 className="font-semibold text-orange-800">
//                 {MealTypeLabels[item.meal_type]}
//               </h3>
//             </div>

//             <div className="text-gray-700">
//               {/* <p className="font-medium">{item.recipe_name}</p> */}
//               <div className="flex justify-between items-center mt-2">
//                 <p className="font-medium">{item.recipe_name}</p>
//                 {item.recipe_id && (
//                   <Link
//                     //href={`/admin/menus/menudetails/${item.recipe_id}?data=${encodedData}`}
//                     href={`/admin/menus/menudetails/${
//                       item.recipe_id
//                     }?data=${encodeURIComponent(
//                       JSON.stringify({
//                         date: selectedDateMenus.date,
//                         schoolId: selectedSchool.id,
//                         schoolName: selectedSchool.name,
//                         items: selectedDateMenus.items.filter(
//                           (menuItem: any) =>
//                             menuItem.recipe_id === item.recipe_id
//                         ),
//                       })
//                     )}`}
//                   >
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="text-gray-500 hover:text-gray-700"
//                     >
//                       <Eye />
//                     </Button>
//                   </Link>
//                 )}
//               </div>
//               {item.estimated_portions && (
//                 <p className="text-sm mt-1">
//                   Porções estimadas: {item.estimated_portions}
//                 </p>
//               )}
//               {item.additional_notes && (
//                 <p className="text-sm mt-2 text-gray-600">
//                   Observações: {item.additional_notes}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* <DialogTrigger>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="text-red-500 hover:text-red-700"
//             >
//               <Trash />
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Deseja remover o cardápio?</DialogTitle>
//               <DialogDescription>
//                 Essa ação não poderá ser desfeita.
//               </DialogDescription>
//             </DialogHeader>
//             <DialogFooter>
//               <Button
//                 variant="destructive"
//                 onClick={() => removeItem(recipe.id || 0)}
//               >
//                 Remover
//               </Button>
//             </DialogFooter>
//           </DialogContent> */}
//         </div>
//       ))
//     ) : (
//       <div className="text-center text-gray-500 py-4">
//         Nenhum cardápio encontrado para esta data
//       </div>
//     )}
//   </div>
// </DialogContent>
// </Dialog>
