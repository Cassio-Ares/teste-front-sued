"use client";
import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { api } from "@/connect/api";

import InputSelect from "@/components/inputSelect";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePost } from "./../../../../hook/usePost";
import { useSearch } from "./../../../../hook/useSearch";

interface MenuItems {
  school_id: string;
  menu_id: string;
  recipe_id: string;
  weekday: number | "";
  meal_type: string | "";
  additional_notes: string;
}

const weekDay = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

const mealType = [
  { label: "Lanche da Manhã", value: "MorningSnack" },
  { label: "Almoço", value: "Lunch" },
  { label: "Lanche da Tarde", value: "AfternoonSnack" },
  { label: "Lanche da Noite", value: "NightSnack" },
  { label: "Lanche Especial", value: "SpecialSnack" },
  { label: "Almoco Especial", value: "SpecialLunch" },
  { label: "Lanche Extra", value: "ExtraSnack" },
];

//TODO ajustar para poder alterar aqui as receitas

const NewMenu = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItems>({
    school_id: "",
    menu_id: "",
    recipe_id: "",
    weekday: "",
    meal_type: "",
    additional_notes: "",
  });

  // School states and handlers
  const [schoolSearch, setSchoolSearch] = useState<string>("");
  const {
    data: searchSchool,
    loading: schoolLoading,
    error: schoolError,
    setQuery: setQuerySchool,
  } = useSearch<any>("schools", schoolSearch);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [resetSchoolInput, setResetSchoolInput] = useState(false);

  const handleSchoolSelect = (schoolId: number) => {
    if (schoolId === null) {
      setSelectedSchool(null);
      setMenuItems((prevMenuItems) => ({
        ...prevMenuItems,
        school_id: "",
      }));
      return;
    }

    const school = searchSchool?.find((s) => s.id === schoolId);
    if (school) {
      setSelectedSchool(school);
      setMenuItems((prevMenuItems) => ({
        ...prevMenuItems,
        school_id: school.id,
      }));
    }
  };

  // Menu states and handlers
  const [menu, setMenu] = useState<string>("");
  const [searchMenu, setSearchMenu] = useState<any[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const [resetMenuInput, setResetMenuInput] = useState(false);

  useEffect(() => {
    if (menu.length >= 1) {
      fetchDataMenu();
    }
  }, [menu]);

  const fetchDataMenu = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/menus", {
        params: {
          school_id: String(selectedSchool?.id),
          month: menu,
          year: new Date().getFullYear(),
        },
      });

      console.log("Response menus", response);

      const formattedData = response.data.data.map((item: any) => ({
        id: item.id,
        formattedLabel: `Mês: ${item.month}, Tipo: ${
          item.week_type === "ODD" ? "Ímpar" : "Par"
        }`,
        week_type: item.week_type,
      }));

      setSearchMenu(formattedData);
    } catch (error: any) {
      setError(error.message);
      toast.error("Erro ao buscar menus");
    } finally {
      setLoading(false);
    }
  }, [menu, selectedSchool]);

  console.log("searchMenu", searchMenu);
  console.log("menu", menu);

  const handleMenuSelect = (selectedId: number) => {
    if (!selectedId) {
      setMenuItems((prev) => ({ ...prev, menu_id: "" }));
      return;
    }

    const selectedMenuItem = searchMenu.find((item) => item.id === selectedId);
    if (selectedMenuItem) {
      setMenuItems((prev) => ({
        ...prev,
        menu_id: selectedMenuItem.id,
      }));
    }
  };

  // Recipe states and handlers
  const [recipeSearch, setRecipeSearch] = useState("");
  const {
    data: searchRecipe,
    loading: searchRecipeLoading,
    error: searchRecipeError,
    setQuery: setQueryRecipe,
  } = useSearch<any>("recipes", recipeSearch);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [resetRecipeInput, setResetRecipeInput] = useState(false);
  const [selections, setSelections] = useState<Record<string, any>>({});

  const handleRecipeSelect = (
    recipeId: number,
    weekdayIndex: number,
    mealType: string
  ) => {
    if (recipeId === null) {
      const newSelections = { ...selections };
      delete newSelections[`${weekdayIndex}-${mealType}`];
      setSelections(newSelections);
      return;
    }

    const recipe = searchRecipe?.find((r) => r.id === recipeId);
    if (recipe) {
      setSelections((prev) => ({
        ...prev,
        [`${weekdayIndex}-${mealType}`]: {
          recipe_id: recipe.id,
          weekday: weekdayIndex,
          meal_type: mealType,
        },
      }));
    }
  };

  const prepareMenuItems = (): MenuItems[] => {
    return Object.values(selections).map((selection) => ({
      school_id: String(menuItems.school_id),
      menu_id: String(menuItems.menu_id),
      recipe_id: String(selection.recipe_id),
      weekday: selection.weekday,
      meal_type: selection.meal_type,
      additional_notes: menuItems.additional_notes || "",
    }));
  };

  // API Post hook
  const {
    data: dataPost,
    loading: postLoading,
    error: postError,
    postData: createPost,
  } = usePost<any>("menu_items");

  const createMenuItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const menuItemsToSend = prepareMenuItems();

      console.log("menuItemsToSend", menuItemsToSend);

      if (menuItemsToSend.length === 0) {
        toast.warning("Por favor, selecione pelo menos uma receita");
        return;
      }

      for (const item of menuItemsToSend) {
        await createPost(item);
      }

      toast.success("Menu criado com sucesso!");

      // Reset form
      setMenuItems({
        school_id: "",
        menu_id: "",
        recipe_id: "",
        weekday: "",
        meal_type: "",
        additional_notes: "",
      });

      setSelectedSchool(null);
      setSelectedRecipe(null);
      setSelectedMenu(null);
      setSelections({});

      // Reset inputs
      setResetSchoolInput(true);
      setResetRecipeInput(true);
      setResetMenuInput(true);

      setTimeout(() => {
        setResetSchoolInput(false);
        setResetRecipeInput(false);
        setResetMenuInput(false);
      }, 100);

      setSchoolSearch("");
      setRecipeSearch("");
      setMenu("");
    } catch (error: any) {
      toast.error("Erro ao criar menu: " + error.message);
    }
  };

  // Effect to reset menu when school changes
  useEffect(() => {
    if (!selectedSchool) {
      setMenuItems((prevMenu) => ({
        ...prevMenu,
        menu_id: "",
      }));
      setSelections({});
    }
  }, [selectedSchool]);

  console.log("menuItems", menuItems);

  return (
    <div className="flex w-full flex-col justify-start gap-4">
      <div className="flex justify-start gap-4 md:justify-end mb-4">
        <Link href="/admin/menus">
          <Button
            variant="outline"
            className="text-orange-500 hover:text-orange-600 font-bold"
          >
            <ArrowLeft /> Voltar
          </Button>
        </Link>
        <ToastContainer />
      </div>

      <h1 className="text-3xl font-bold">Organizar Menu</h1>

      <form onSubmit={createMenuItem} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label>Nome da Instituição</Label>
          <InputSelect
            options={searchSchool}
            value={selectedSchool?.id}
            onChange={handleSchoolSelect}
            onSearchChange={(query) => setQuerySchool(query)}
            placeholder="Selecione uma Instituição"
            forceReset={resetSchoolInput}
            field="name"
          />
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border">
                  <InputSelect
                    options={searchMenu}
                    value={menuItems.menu_id}
                    onChange={selectedSchool ? handleMenuSelect : undefined}
                    onSearchChange={
                      selectedSchool
                        ? (searchTerm) => setMenu(searchTerm)
                        : undefined
                    }
                    placeholder="Selecione um Mês ex: 10"
                    forceReset={resetMenuInput}
                    field="formattedLabel"
                    disabled={!selectedSchool}
                  />
                </th>
                {weekDay.map((day, index) => (
                  <th key={day} className="p-2 border bg-gray-100 font-medium">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mealType.map((meal) => (
                <tr key={meal.value}>
                  <td className="p-2 border bg-gray-50 font-medium">
                    {meal.label}
                  </td>
                  {weekDay.map((day, index) => (
                    <td key={`${day}-${meal.value}`} className="p-2 border">
                      <InputSelect
                        options={searchRecipe}
                        value={
                          selections[`${index}-${meal.value}`]?.recipe_id || ""
                        }
                        onChange={(recipeId) =>
                          handleRecipeSelect(recipeId, index, meal.value)
                        }
                        onSearchChange={(query) => setQueryRecipe(query)}
                        placeholder="Selecione uma Receita"
                        forceReset={resetRecipeInput}
                        disabled={!selectedSchool || !menuItems.menu_id}
                        field="name"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 font-bold"
            disabled={postLoading}
          >
            {postLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewMenu;

// interface MenuItems {
//   school_id: string;
//   menu_id: string;
//   recipe_id: string;
//   weekday: number | "";
//   meal_type: string | "";
//   additional_notes: string;
// }

// const weekDay = [
//   "Segunda",
//   "Terça",
//   "Quarta",
//   "Quinta",
//   "Sexta",
//   "Sábado",
//   "Domingo",
// ];

// const mealType = [
//   { label: "Lanche da Manhã", value: "MorningSnack" },
//   { label: "Almoço", value: "Lunch" },
//   { label: "Lanche da Tarde", value: "AfternoonSnack" },
//   { label: "Lanche da Noite", value: "NightSnack" },
//   { label: "Lanche Especial", value: "SpecialSnack" },
//   { label: "Almoco Especial", value: "SpecialLunch" },
//   { label: "Lanche Extra", value: "ExtraSnack" },
// ];

// const NewMenu = () => {
//   const [open, setOpen] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [menuItems, setMenuItems] = useState<MenuItems>({
//     school_id: "",
//     menu_id: "",
//     recipe_id: "",
//     weekday: "",
//     meal_type: "",
//     additional_notes: "",
//   });

//   //school
//   const [schoolSearch, setSchoolSearch] = useState<string>("");

//   const {
//     data: searchSchool,
//     loading: schoolLoading,
//     error: schoolError,
//     setQuery: setQuerySchool,
//   } = useSearch<any>("schools", schoolSearch);

//   const [selectedSchool, setSelectedSchool] = useState<any>(null);
//   const [resetSchoolInput, setResetSchoolInput] = useState(false);

//   const handleSchoolSelect = (schoolId: number) => {
//     if (schoolId === null) {
//       setSelectedSchool(null);
//       setMenuItems((prevMenuItems) => ({
//         ...prevMenuItems,
//         school_id: "",
//       }));
//       return;
//     }

//     const school = searchSchool?.find((s) => s.id === schoolId);
//     if (school) {
//       setSelectedSchool(school);
//       setMenuItems((prevMenuItems) => ({
//         ...prevMenuItems,
//         school_id: school.id,
//       }));
//     }
//   };

//   //menu
//   const [menu, setMenu] = useState<any>("");
//   const [searchMenu, setSearchMenu] = useState<any[]>([]);

//   useEffect(() => {
//     if (menu.length >= 1) {
//       fetchDataMenu();
//     }
//   }, [menu]);

//   const fetchDataMenu = useCallback(async () => {
//     // console.log("Selected School:", selectedSchool);
//     // console.log("Menu value:", menu);
//     // console.log("Params being sent:", {
//     //   school_id: selectedSchool?.id,
//     //   month: menu,
//     //   year: new Date().getFullYear(),
//     // });

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await api.get("/menus", {
//         params: {
//           //school_id: selectedSchool?.id,
//           school_id: String(selectedSchool?.id),
//           month: menu,
//           year: new Date().getFullYear(),
//         },
//       });

//       const formattedData = response.data.data.map((item: any) => ({
//         id: item.id, // Include the ID in the formatted data
//         formattedLabel: `Mês: ${item.month}, Tipo: ${
//           item.week_type === "ODD" ? "Ímpar" : "Par"
//         }`,
//         week_type: item.week_type, // Include the week type for filtering
//       }));

//       setSearchMenu(formattedData);
//     } catch (error) {
//       informationError(error);
//     } finally {
//       setLoading(false);
//     }
//   }, [menu, selectedSchool]);

//   const handleMenuSelect = (selectedId: number) => {
//     if (!selectedId) {
//       setMenuItems((prev) => ({ ...prev, menu_id: "" }));
//       return;
//     }

//     // Find the selected menu item
//     const selectedMenuItem = searchMenu.find((item) => item.id === selectedId);

//     if (selectedMenuItem) {
//       setMenuItems((prev) => ({
//         ...prev,
//         menu_id: selectedMenuItem.id,
//       }));
//     }
//   };

//   //recipe
//   const [recipeSearch, setRecipeSearch] = useState("");

//   const {
//     data: searchRecipe,
//     loading: searchRecipeLoading,
//     error: searchRecipeError,
//     setQuery: setQueryRecipe,
//   } = useSearch<any>("recipes", recipeSearch);

//   const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
//   const [resetRecipeInput, setResetRecipeInput] = useState(false);
//   const [selections, setSelections] = useState({});

//   const handleRecipeSelect = (
//     recipeId: number,
//     day: string,
//     mealType: string
//   ) => {
//     if (recipeId === null) {
//       // Remove a seleção se for null
//       const newSelections = { ...selections };
//       delete newSelections[`${day}-${mealType}`];
//       setSelections(newSelections);
//       return;
//     }
//     const recipe = searchRecipe?.find((r) => r.id === recipeId);

//     if (recipe) {
//       // Atualiza as seleções com os novos dados
//       setSelections((prev) => ({
//         ...prev,
//         [`${day}-${mealType}`]: {
//           // recipe_id: recipeId,
//           // weekday: day,
//           // meal_type: mealType,
//           recipe_id: recipe.id,
//           weekday: day,
//           meal_type: mealType,
//         },
//       }));
//     }
//   };

//   const prepareMenuItems = (): MenuItems[] => {
//     return Object.values(selections).map((selection: any) => ({
//       school_id: String(menuItems.school_id),
//       menu_id: String(menuItems.menu_id),
//       recipe_id: String(selection.recipe_id),
//       weekday: selection.weekday,
//       meal_type: selection.meal_type,
//       additional_notes: menuItems.additional_notes || "",
//     }));
//   };

//   // const handleRecipeSelect = (recipeId: number) => {
//   //   if (recipeId === null) {
//   //     setMenuItems((prevMenuItems) => ({
//   //       ...prevMenuItems,
//   //       recipe_id: "",
//   //     }));
//   //     return;
//   //   }
//   //   const recipe = searchRecipe?.find((r) => r.id === recipeId);
//   //   if (recipe) {
//   //     setMenuItems((prevMenuItems) => ({
//   //       ...prevMenuItems,
//   //       recipe_id: recipe.id,
//   //     }));
//   //   }
//   // };

//   const {
//     data: dataPost,
//     loading: postLoading,
//     error: postError,
//     postData: createPost,
//   } = usePost<any>("menu_items");

//   const [selectedMenu, setSelectedMenu] = useState<any>(null);
//   const [resetMenuInput, setResetMenuInput] = useState(false);

//   const createMenuItem = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     try {
//       const menuItemsToSend = prepareMenuItems();

//       console.log("menuItemsToSend", menuItemsToSend);

//       for (const item of menuItemsToSend) {
//         await createPost(item);
//         // toast.success(response?.message);
//       }

//       setMenuItems({
//         school_id: "",
//         menu_id: "",
//         recipe_id: "",
//         weekday: "",
//         meal_type: "",
//         additional_notes: "",
//       });

//       setSelectedSchool(null);
//       setSelectedRecipe(null);
//       setSelectedMenu(null);

//       setResetSchoolInput(true);
//       setResetRecipeInput(true);
//       setResetMenuInput(true);

//       setTimeout(() => {
//         setResetSchoolInput(false);
//         setResetRecipeInput(false);
//         setResetMenuInput(false);
//       }, 100); // Atraso de 100ms para garantir que o reset seja aplicado corretamente

//       setSchoolSearch("");
//       setRecipeSearch("");
//       setMenu("");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (!selectedSchool) {
//       setMenu((prevMenu) => ({
//         ...prevMenu,
//         state_id: 0,
//         city_id: 0,
//         school_id: 0,
//         month_weeks: "",
//         observations: "",
//       }));
//     }
//   }, [selectedSchool]);

//   console.log("menu_item", menuItems);

//   return (
//     <div className="flex w-full flex-col justify-start gap-4">
//       <div className="flex justify-start gap-4 md:justify-end mb-4">
//         <Link href="/admin/menus">
//           <Button
//             variant="outline"
//             className="text-orange-500 hover:text-orange-600 font-bold"
//           >
//             <ArrowLeft /> Voltar
//           </Button>
//         </Link>
//         <ToastContainer />
//       </div>
//       <h1 className="text-3xl font-bold">Criar Novo Menu</h1>
//       <form onSubmit={createMenuItem} className="space-y-4">
//         <div className="flex flex-col gap-2">
//           <Label>Nome da Instituição</Label>
//           <InputSelect
//             options={searchSchool}
//             value={selectedSchool?.id}
//             onChange={handleSchoolSelect}
//             onSearchChange={(query) => setQuerySchool(query)}
//             placeholder="Selecione uma Instituição"
//             forceReset={resetSchoolInput}
//             field="name"
//           />
//         </div>

//         {/* <div className="flex w-full flex-col gap-2">
//           <Label>Escolha um periodo</Label>
//           <InputSelect
//             options={searchMenu}
//             value={menuItems.menu_id}
//             onChange={selectedSchool ? handleMenuSelect : undefined}
//             onSearchChange={
//               selectedSchool ? (searchTerm) => setMenu(searchTerm) : undefined
//             }
//             placeholder="Selecione um Mês ex: 10"
//             forceReset={resetMenuInput}
//             field="formattedLabel"
//             // disabled={!selectedSchool}
//           />
//         </div> */}
//         <div className="overflow-x-auto mb-4">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr>
//                 <th className="p-2 border">
//                   <InputSelect
//                     options={searchMenu}
//                     value={menuItems.menu_id}
//                     onChange={selectedSchool ? handleMenuSelect : undefined}
//                     onSearchChange={
//                       selectedSchool
//                         ? (searchTerm) => setMenu(searchTerm)
//                         : undefined
//                     }
//                     placeholder="Selecione um Mês ex: 10"
//                     forceReset={resetMenuInput}
//                     field="formattedLabel"
//                     // disabled={!selectedSchool}
//                   />
//                 </th>
//                 {weekDay.map((day) => (
//                   <th key={day} className="p-2 border bg-gray-100 font-medium">
//                     {day}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {mealType.map((meal) => (
//                 <tr key={meal.value}>
//                   <td className="p-2 border bg-gray-50 font-medium">
//                     {meal.label}
//                   </td>
//                   {weekDay.map((day) => (
//                     <td key={`${day}-${meal.value}`} className="p-2 border">
//                       <InputSelect
//                         options={searchRecipe}
//                         value={selectedRecipe?.id}
//                         onChange={
//                           selectedSchool ? handleRecipeSelect : undefined
//                         }
//                         onSearchChange={
//                           selectedSchool
//                             ? (query) => setQueryRecipe(query)
//                             : undefined
//                         }
//                         placeholder="Selecione uma Receita"
//                         forceReset={resetRecipeInput}
//                         disabled={!selectedSchool}
//                         field="name"
//                       />
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="flex justify-end">
//           <Button
//             type="submit"
//             className="bg-orange-500 hover:bg-orange-600 font-bold"
//           >
//             Salvar
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default NewMenu;
