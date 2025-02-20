"use client";
import InputSelect from "@/components/inputSelect";
import { Button } from "@/components/ui/button";
import { useGetById } from "@/hook/useGetById";
import { usePost } from "@/hook/usePost";
import { useSearch } from "@/hook/useSearch";
import { useUpdate } from "@/hook/useUpdate";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

/**
 * completar update ver como dados ve
 *
 * rota http://localhost:3001/menus/:id
 */

interface MenuItems {
  school_id: string;
  menu_id: string;
  recipe_id: string;
  weekday: number | "";
  meal_type: string | "";
  additional_notes: string;
}

const weekDay = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const mealType = [
  { label: "Lanche da Manhã", value: "MorningSnack" },
  { label: "Almoço", value: "Lunch" },
  { label: "Lanche da Tarde", value: "AfternoonSnack" },
  { label: "Lanche da Noite", value: "NightSnack" },
  { label: "Lanche Especial", value: "SpecialSnack" },
  { label: "Almoco Especial", value: "SpecialLunch" },
  { label: "Lanche Extra", value: "ExtraSnack" },
];

const UpdateMenuPage = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<any>({
    school_id: "",
    menu_id: "",
    recipe_id: "",
    weekday: "",
    meal_type: "",
    additional_notes: "",
  });

  const params = useParams<{ id: string }>();

  // buscando menu por Id
  const {
    data: menuData,
    loading: menuLoading,
    error: menuError,
    fetchData: fetchDataMenuId,
  } = useGetById<any>(`menus`);

  useEffect(() => {
    const id = params.id;
    if (id) {
      fetchDataMenuId(id);
    }
  }, [params.id]);

  // buscando school por Id
  const {
    data: dataSchoolbyId,
    loading: schoolLoading,
    error: schoolError,
    fetchData: fetchDataSchoolById,
  } = useGetById<any>("schools");

  useEffect(() => {
    const id = (menuData as any)?.menu?.school_id;
    if (menuData) {
      fetchDataSchoolById(id);
    }
  }, [menuData]);

  const [menu, setMenu] = useState<string>("");
  const [searchMenu, setSearchMenu] = useState<any[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const [resetMenuInput, setResetMenuInput] = useState(false);

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

  // Initialize selections when menu data loads
  useEffect(() => {
    if ((menuData as any)?.menuItems && Array.isArray((menuData as any).menuItems)) {
      const initialSelections = {};

      (menuData as any).menuItems.forEach((item) => {
        // Convert weekday string to index
        // Assuming weekDay is defined elsewhere as weekDay = ["domingo", "segunda", "terca", etc.]
        const weekdayIndex = weekDay.findIndex((day) => day.toLowerCase() === item.weekday.toLowerCase());

        if (weekdayIndex !== -1) {
          initialSelections[`${weekdayIndex}-${item.meal_type}`] = {
            recipe_id: item.recipe_id,
            weekday: weekdayIndex,
            meal_type: item.meal_type,
          };
        }
      });

      setSelections(initialSelections);

      // Also set the menu_id in menuItems
      setMenuItems((prev) => ({
        ...prev,
        menu_id: (menuData as any).menu.id,
        school_id: (menuData as any).menu.school_id,
      }));

      // Also populate the searchMenu with the current menu
      if ((menuData as any).menu) {
        setSearchMenu([
          {
            id: (menuData as any).menu.id,
            formattedLabel: `Mês: ${(menuData as any).menu.month}, Tipo: ${
              (menuData as any).menu.week_type === "ODD" ? "Ímpar" : "Par"
            }`,
            week_type: (menuData as any).menu.week_type,
          },
        ]);
      }
    }
  }, [menuData]);

  // Handle recipe selection
  const handleRecipeSelect = (recipeId: number, weekdayIndex: number, mealType: string) => {
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

  // Prepare menu items for submission
  const prepareMenuItems = (): MenuItems[] => {
    // return Object.values(selections).map((selection) => ({
    //   school_id: String((menuData as any)?.menu?.school_id || menuItems.school_id),
    //   menu_id: String((menuData as any)?.menu?.id || menuItems.menu_id),
    //   recipe_id: String(selection.recipe_id),
    //   weekday: weekDay[selection.weekday].toLowerCase(),
    //   meal_type: selection.meal_type,
    //   additional_notes: menuItems.additional_notes || "",
    // }));
    return Object.values(selections).map((selection) => ({
      school_id: String((menuData as any)?.menu?.school_id || menuItems.school_id),
      menu_id: String((menuData as any)?.menu?.id || menuItems.menu_id),
      recipe_id: String(selection.recipe_id),
      weekday: selection.weekday, // Changed this line
      meal_type: selection.meal_type,
      additional_notes: menuItems.additional_notes || "",
    }));
  };

  // API hooks for creating and updating
  const { postData: createPost } = usePost<any>("menu_items");
  const { upDate: updateData } = useUpdate<any>("menu_items");
  // const { deleteData } = useRemove<any>("menu_items");

  // Handle form submission for update
  const updateMenuItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const menuItemsToSend = prepareMenuItems();

      if (menuItemsToSend.length === 0) {
        toast.warning("Por favor, selecione pelo menos uma receita");
        return;
      }

      // Track existing items from the backend
      const existingItemIds = new Map();
      if ((menuData as any)?.menuItems) {
        (menuData as any).menuItems.forEach((item) => {
          const key = `${item.weekday}-${item.meal_type}`;
          existingItemIds.set(key, item.id);
        });
      }

      const itemsToDelete = [];
      if ((menuData as any)?.menuItems) {
        (menuData as any).menuItems.forEach((item) => {
          const weekdayIndex = weekDay.findIndex((day) => day.toLowerCase() === item.weekday.toLowerCase());

          // if (weekdayIndex !== -1) {
          //   const key = `${weekdayIndex}-${item.meal_type}`;
          //   if (!selections[key]) {
          //     itemsToDelete.push(item?.id);
          //   }
          // }
        });
      }

      for (const item of menuItemsToSend) {
        const key = `${item.weekday}-${item.meal_type}`;

        if (existingItemIds.has(key)) {
          // Update existing item
          const itemId = existingItemIds.get(key);
          await updateData(itemId, [item]);
        } else {
          // Create new item
          await createPost(item);
        }
      }

      toast.success("Menu atualizado com sucesso!");

      // Refresh data after update
      if (params.id) {
        fetchDataMenuId(params.id);
      }
    } catch (error: any) {
      toast.error("Erro ao atualizar menu: " + error.message);
    }
  };

  // Render the form
  return (
    <div className="flex w-full flex-col justify-start gap-4">
      <div className="flex justify-start gap-4 md:justify-end mb-4">
        <Link href="/admin/menus">
          <Button variant="outline" className="text-orange-500 hover:text-orange-600 font-bold">
            <ArrowLeft /> Voltar
          </Button>
        </Link>
        <ToastContainer />
      </div>

      <h1 className="text-3xl font-bold">Atualizar Menu</h1>

      {menuLoading ? (
        <div>Carregando dados do menu...</div>
      ) : (
        <form onSubmit={updateMenuItem} className="space-y-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">{dataSchoolbyId?.[0]?.name}</h2>
            <p>
              Mês: {(menuData as any)?.menu?.month}{" "}
              <span className="ml-2">Semana: {(menuData as any)?.menu?.week_type === "EVEN" ? "Par" : "Ímpar"}</span>
            </p>
          </div>

          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border">
                    <InputSelect
                      options={searchMenu}
                      value=""
                      onChange={() => {}}
                      //value={menuItems.menu_id}
                      // onChange={() => {}}
                      onSearchChange={() => {}} //futuro permitir mudar tipo de semana
                      placeholder=""
                      forceReset={resetMenuInput}
                      field="formattedLabel"
                      disabled={true}
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
                    <td className="p-2 border bg-gray-50 font-medium">{meal.label}</td>
                    {weekDay.map((day, index) => {
                      // Look for existing recipe in this cell
                      const existingRecipe = (menuData as any)?.menuItems?.find(
                        (item) => item.weekday.toLowerCase() === day.toLowerCase() && item.meal_type === meal.value
                      );

                      return (
                        <td key={`${day}-${meal.value}`} className="p-2 border">
                          {/* <InputSelect
                            options={searchRecipe}
                            value={selections[`${index}-${meal.value}`]?.recipe_id || ""}
                            onChange={(recipeId) => handleRecipeSelect(recipeId, index, meal.value)}
                            onSearchChange={(query) => setQueryRecipe(query)}
                            placeholder="Selecione uma Receita"
                            forceReset={resetRecipeInput}
                            field="name"
                            defaultValue={existingRecipe?.recipe_name}
                          /> */}
                          <InputSelect
                            options={searchRecipe}
                            value={selections[`${index}-${meal.value}`]?.recipe_id || ""}
                            onChange={(recipeId) => handleRecipeSelect(recipeId, index, meal.value)}
                            onSearchChange={(query) => setQueryRecipe(query)}
                            placeholder="Selecione uma Receita"
                            forceReset={resetRecipeInput}
                            field="name"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 font-bold">
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateMenuPage;
