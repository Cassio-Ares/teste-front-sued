"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { informationError } from "@/components/informationError";
import { InputSelect } from "@/components/inputSelect";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/connect/api";
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
  { label: "Domingo", value: 1 },
  { label: "Segunda-feira", value: 2 },
  { label: "Terca-feira", value: 3 },
  { label: "Quarta-feira", value: 4 },
  { label: "Quinta-feira", value: 5 },
  { label: "Sexta-feira", value: 6 },
  { label: "Sábado", value: 7 },
];
const mealType = [
  { label: "Lanche da Manhã", value: "MorningSnack" },
  { label: "Almoço", value: "Lunch" },
  { label: "Lanche da Tarde", value: "AfternoonSnack" },
  { label: "Lanche da Noite", value: "NightSnack" },
  { label: "Lanche Periodo Integral Manha", value: "FullPeriodMealMorning" },
  { label: "Lanche Periodo Integral Tarde", value: "FullPeriodMealAfternoon" },
];

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

  //school
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

  //menu
  const [menu, setMenu] = useState<any>("");
  const [searchMenu, setSearchMenu] = useState<any[]>([]);

  useEffect(() => {
    if (menu.length >= 1) {
      fetchDataMenu();
    }
  }, [menu]);

  const fetchDataMenu = useCallback(async () => {
    // console.log("Selected School:", selectedSchool);
    // console.log("Menu value:", menu);
    // console.log("Params being sent:", {
    //   school_id: selectedSchool?.id,
    //   month: menu,
    //   year: new Date().getFullYear(),
    // });

    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/menus", {
        params: {
          //school_id: selectedSchool?.id,
          school_id: String(selectedSchool?.id),
          month: menu,
          year: new Date().getFullYear(),
        },
      });

      const formattedData = response.data.data.map((item: any) => ({
        id: item.id, // Include the ID in the formatted data
        formattedLabel: `Mês: ${item.month}, Tipo: ${
          item.week_type === "ODD" ? "Ímpar" : "Par"
        }`,
        week_type: item.week_type, // Include the week type for filtering
      }));

      setSearchMenu(formattedData);
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  }, [menu, selectedSchool]);

  const handleMenuSelect = (selectedId: number) => {
    if (!selectedId) {
      setMenuItems((prev) => ({ ...prev, menu_id: "" }));
      return;
    }

    // Find the selected menu item
    const selectedMenuItem = searchMenu.find((item) => item.id === selectedId);

    if (selectedMenuItem) {
      setMenuItems((prev) => ({
        ...prev,
        menu_id: selectedMenuItem.id,
      }));
    }
  };

  //recipe
  const [recipeSearch, setRecipeSearch] = useState("");

  const {
    data: searchRecipe,
    loading: searchRecipeLoading,
    error: searchRecipeError,
    setQuery: setQueryRecipe,
  } = useSearch<any>("recipes", recipeSearch);

  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [resetRecipeInput, setResetRecipeInput] = useState(false);

  const handleRecipeSelect = (recipeId: number) => {
    if (recipeId === null) {
      setMenuItems((prevMenuItems) => ({
        ...prevMenuItems,
        recipe_id: "",
      }));
      return;
    }
    const recipe = searchRecipe?.find((r) => r.id === recipeId);
    if (recipe) {
      setMenuItems((prevMenuItems) => ({
        ...prevMenuItems,
        recipe_id: recipe.id,
      }));
    }
  };

  const {
    data: dataPost,
    loading: postLoading,
    error: postError,
    postData: createPost,
  } = usePost<any>("menu_items");

  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const [resetMenuInput, setResetMenuInput] = useState(false);

  // const createMenuItem = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   try {
  //     const response = await createPost(menuItems);

  //     console.log("response:", response);

  //     toast.success(response?.message);

  //     setMenuItems({
  //       school_id: "",
  //       menu_id: "",
  //       recipe_id: "",
  //       weekday: "",
  //       meal_type: "",
  //       additional_notes: "",
  //     });

  //     setSelectedSchool(null);
  //     setSelectedRecipe(null);
  //     setSelectedMenu(null);

  //     setResetSchoolInput(true);
  //     setResetRecipeInput(true);
  //     setResetMenuInput(true);

  //     setTimeout(() => {
  //       setResetSchoolInput(false);
  //       setResetRecipeInput(false);
  //       setResetMenuInput(false);
  //     }, 0);

  //     setSchoolSearch("");
  //     setRecipeSearch("");
  //     setMenu("");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const createMenuItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await createPost(menuItems);

      toast.success(response?.message);

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

      setResetSchoolInput(true);
      setResetRecipeInput(true);
      setResetMenuInput(true);

      setTimeout(() => {
        setResetSchoolInput(false);
        setResetRecipeInput(false);
        setResetMenuInput(false);
      }, 100); // Atraso de 100ms para garantir que o reset seja aplicado corretamente

      setSchoolSearch("");
      setRecipeSearch("");
      setMenu("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!selectedSchool) {
      setMenu((prevMenu) => ({
        ...prevMenu,
        state_id: 0,
        city_id: 0,
        school_id: 0,
        month_weeks: "",
        observations: "",
      }));
    }
  }, [selectedSchool]);

  console.log("menu_item", menuItems);

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
      <h1 className="text-3xl font-bold">Criar Novo Menu</h1>
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

        <div className="flex w-full flex-col gap-2">
          <Label>Escolha um periodo</Label>
          <InputSelect
            options={searchMenu}
            value={menuItems.menu_id}
            onChange={selectedSchool ? handleMenuSelect : undefined}
            onSearchChange={
              selectedSchool ? (searchTerm) => setMenu(searchTerm) : undefined
            }
            placeholder="Selecione um Mês ex: 10"
            forceReset={resetMenuInput}
            field="formattedLabel"
            disabled={!selectedSchool}
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label>Escolha um Receita</Label>
          <InputSelect
            options={searchRecipe}
            value={selectedRecipe?.id}
            onChange={selectedSchool ? handleRecipeSelect : undefined}
            onSearchChange={
              selectedSchool ? (query) => setQueryRecipe(query) : undefined
            }
            placeholder="Selecione uma Receita"
            forceReset={resetRecipeInput}
            disabled={!selectedSchool}
            field="name"
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label>Dia da semana</Label>
          <Select
            value={menuItems.weekday?.toString() || ""}
            onValueChange={
              selectedSchool
                ? (value) =>
                    setMenuItems((prev: any) => ({
                      ...prev,
                      weekday: value !== "" ? parseInt(value) : "",
                    }))
                : undefined
            }
          >
            <SelectTrigger
              className={!selectedSchool ? "cursor-not-allowed opacity-80" : ""}
              disabled={!selectedSchool}
            >
              {/* <SelectValue placeholder="Escolha um dia da semana" /> */}
              {weekDay.find((day) => day.value === menuItems.weekday)?.label ||
                "Escolha um dia da semana"}
            </SelectTrigger>
            <SelectContent>
              {weekDay.map((day) => (
                <SelectItem key={day.value} value={day.value.toString()}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Label>Tipo de refeição</Label>
          <Select
            value={menuItems.meal_type}
            onValueChange={
              selectedSchool
                ? (value) =>
                    setMenuItems((prev) => ({ ...prev, meal_type: value }))
                : undefined
            }
          >
            <SelectTrigger
              className={!selectedSchool ? "cursor-not-allowed opacity-80" : ""}
              disabled={!selectedSchool}
            >
              <SelectValue placeholder="Escolha um tipo de refeição" />
            </SelectTrigger>
            <SelectContent>
              {mealType.map((meal) => (
                <SelectItem key={meal.value} value={meal.value}>
                  {meal.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Label>Observações</Label>
          <Card className="p-4">
            <Textarea
              value={menuItems.additional_notes}
              onChange={(e) =>
                setMenuItems({ ...menuItems, additional_notes: e.target.value })
              }
              placeholder="Observações"
              rows={6}
            />
          </Card>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Criando..." : "Enviar"}
        </Button>
      </form>
    </div>
  );
};

export default NewMenu;

// "use client";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import React, { useCallback, useEffect, useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { informationError } from "@/components/informationError";
// import { InputSelect } from "@/components/inputSelect";
// import { Card } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { api } from "@/connect/api";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";

// import { usePost } from "./../../../../hook/usePost";
// import { useSearch } from "./../../../../hook/useSearch";

// interface MenuItems {
//   school_id: string;
//   menu_id: string;
//   recipe_id: string;
//   weekday: number | "";
//   meal_type: string | "";
//   additional_notes: string;
// }

// const weekDay = [
//   { label: "Domingo", value: 1 },
//   { label: "Segunda-feira", value: 2 },
//   { label: "Terca-feira", value: 3 },
//   { label: "Quarta-feira", value: 4 },
//   { label: "Quinta-feira", value: 5 },
//   { label: "Sexta-feira", value: 6 },
//   { label: "Sábado", value: 7 },
// ];
// const mealType = [
//   { label: "Lanche da Manhã", value: "MorningSnack" },
//   { label: "Almoço", value: "Lunch" },
//   { label: "Lanche da Tarde", value: "AfternoonSnack" },
//   { label: "Lanche da Noite", value: "NightSnack" },
//   { label: "Lanche Periodo Integral Manha", value: "FullPeriodMealMorning" },
//   { label: "Lanche Periodo Integral Tarde", value: "FullPeriodMealAfternoon" },
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
//     setLoading(true);
//     setError(null);

//     try {
//       // Fazendo a requisição para obter os menus
//       const response = await api.get("/menus", {
//         params: {
//           school_id: selectedSchool?.id, // Usando o selectedSchool para filtrar os menus pela escola
//           month: menu, // Utilizando o mês selecionado
//           year: new Date().getFullYear(), // Usando o ano atual
//         },
//       });

//       console.log("response", response);

//       // Formatação dos dados recebidos
//       const formattedData = response.data.data.map((item: any) => ({
//         formattedLabel:  `Mês: ${item.month},
//                           Tipo: ${item.week_type === "ODD" ? "Impar" : "Par"}`,
//       }));

//       console.log("formattedData", formattedData);

//       // Atualizando o estado com os menus formatados
//       setSearchMenu(formattedData);

//       // Definindo o menu_id se houver dados
//       if (response.data.data.length > 0) {
//         const menuData = response?.data?.data[0];
//         setMenuItems((prevMenuItems) => ({
//           ...prevMenuItems,
//           menu_id: menuData.id,
//         }));
//       }
//     } catch (error) {
//       informationError(error);
//     } finally {
//       setLoading(false);
//     }
//   }, [menu, selectedSchool]);

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

//   const handleRecipeSelect = (recipeId: number) => {
//     if (recipeId === null) {
//       setMenuItems((prevMenuItems) => ({
//         ...prevMenuItems,
//         recipe_id: "",
//       }));
//       return;
//     }
//     const recipe = searchRecipe?.find((r) => r.id === recipeId);
//     if (recipe) {
//       setMenuItems((prevMenuItems) => ({
//         ...prevMenuItems,
//         recipe_id: recipe.id,
//       }));
//     }
//   };

//   const {
//     data: dataPost,
//     loading: postLoading,
//     error: postError,
//     postData: createPost,
//   } = usePost<any>("menu_items");

//   const [selectedMenu, setSelectedMenu] = useState<any>(null);
//   const [resetMenuInput, setResetMenuInput] = useState(false);

//   // const createMenuItem = async (event: React.FormEvent<HTMLFormElement>) => {
//   //   event.preventDefault();
//   //   try {
//   //     const response = await createPost(menuItems);

//   //     console.log("response:", response);

//   //     toast.success(response?.message);

//   //     setMenuItems({
//   //       school_id: "",
//   //       menu_id: "",
//   //       recipe_id: "",
//   //       weekday: "",
//   //       meal_type: "",
//   //       additional_notes: "",
//   //     });

//   //     setSelectedSchool(null);
//   //     setSelectedRecipe(null);
//   //     setSelectedMenu(null);

//   //     setResetSchoolInput(true);
//   //     setResetRecipeInput(true);
//   //     setResetMenuInput(true);

//   //     setTimeout(() => {
//   //       setResetSchoolInput(false);
//   //       setResetRecipeInput(false);
//   //       setResetMenuInput(false);
//   //     }, 0);

//   //     setSchoolSearch("");
//   //     setRecipeSearch("");
//   //     setMenu("");
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   const createMenuItem = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     try {
//       const response = await createPost(menuItems);

//       toast.success(response?.message);

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

//         <div className="flex w-full flex-col gap-2">
//           <Label>Escolha um periodo</Label>
//           <InputSelect
//             options={searchMenu || []}
//             value={menuItems.menu_id}
//             onChange={
//               selectedSchool
//                 ? (value) => setMenu({ ...menuItems, menu_id: value })
//                 : undefined
//             }
//             onSearchChange={
//               selectedSchool ? (searchTerm) => setMenu(searchTerm) : undefined
//             }
//             placeholder="Selecione um Mês ex: 10"
//             forceReset={resetMenuInput}
//             field="formattedLabel"
//             // className={`rounded-md border ${
//             //   !selectedSchool && "cursor-not-allowed opacity-80"
//             // }`}
//             disabled={!selectedSchool} // Pode variar dependendo da biblioteca
//           />
//         </div>

//         <div className="flex w-full flex-col gap-2">
//           <Label>Escolha um Receita</Label>
//           <InputSelect
//             options={searchRecipe}
//             value={selectedRecipe?.id}
//             onChange={selectedSchool ? handleRecipeSelect : undefined}
//             onSearchChange={
//               selectedSchool ? (query) => setQueryRecipe(query) : undefined
//             }
//             placeholder="Selecione uma Receita"
//             forceReset={resetRecipeInput}
//             disabled={!selectedSchool}
//             field="name"
//           />
//         </div>

//         <div className="flex w-full flex-col gap-2">
//           <Label>Dia da semana</Label>
//           <Select
//             value={menuItems.weekday?.toString() || ""}
//             onValueChange={
//               selectedSchool
//                 ? (value) =>
//                     setMenuItems((prev: any) => ({
//                       ...prev,
//                       weekday: value !== "" ? parseInt(value) : "",
//                     }))
//                 : undefined
//             }
//           >
//             <SelectTrigger
//               className={!selectedSchool ? "cursor-not-allowed opacity-80" : ""}
//               disabled={!selectedSchool}
//             >
//               {/* <SelectValue placeholder="Escolha um dia da semana" /> */}
//               {weekDay.find((day) => day.value === menuItems.weekday)?.label ||
//                 "Escolha um dia da semana"}
//             </SelectTrigger>
//             <SelectContent>
//               {weekDay.map((day) => (
//                 <SelectItem key={day.value} value={day.value.toString()}>
//                   {day.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="flex w-full flex-col gap-2">
//           <Label>Tipo de refeição</Label>
//           <Select
//             value={menuItems.meal_type}
//             onValueChange={
//               selectedSchool
//                 ? (value) =>
//                     setMenuItems((prev) => ({ ...prev, meal_type: value }))
//                 : undefined
//             }
//           >
//             <SelectTrigger
//               className={!selectedSchool ? "cursor-not-allowed opacity-80" : ""}
//               disabled={!selectedSchool}
//             >
//               <SelectValue placeholder="Escolha um tipo de refeição" />
//             </SelectTrigger>
//             <SelectContent>
//               {mealType.map((meal) => (
//                 <SelectItem key={meal.value} value={meal.value}>
//                   {meal.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="flex w-full flex-col gap-2">
//           <Label>Observações</Label>
//           <Card className="p-4">
//             <Textarea
//               value={menuItems.additional_notes}
//               onChange={(e) =>
//                 setMenuItems({ ...menuItems, additional_notes: e.target.value })
//               }
//               placeholder="Observações"
//               rows={6}
//             />
//           </Card>
//         </div>

//         <Button type="submit" disabled={loading} className="w-full">
//           {loading ? "Criando..." : "Enviar"}
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default NewMenu;
