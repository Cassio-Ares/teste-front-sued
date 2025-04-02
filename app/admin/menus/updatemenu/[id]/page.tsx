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

const weekDay = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"];

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
  //const [open, setOpen] = useState(false);
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

  // Busca e seleção de menus e receitas

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
  const [selections, setSelections] = useState<Record<string, any>>({}); //mapear as seleções de receitas

  /**
   * ex:
   * {
    "0-Lunch": {
        "recipe_id": 1,
        "weekday": 0,
        "meal_type": "Lunch"
    },
    "0-MorningSnack": {
        "recipe_id": 1,
        "weekday": 0,
        "meal_type": "MorningSnack"
    },
    "2-MorningSnack": {
        "recipe_id": 1,
        "weekday": 2,
        "meal_type": "MorningSnack"
    }
}
   */

  useEffect(() => {
    if ((menuData as any)?.menuItems && Array.isArray((menuData as any).menuItems)) {
      const initialSelections = {};

      (menuData as any).menuItems.forEach((item) => {
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

      //coloca menu_id e school_id no menuItems
      setMenuItems((prev) => ({
        ...prev,
        menu_id: (menuData as any).menu.id,
        school_id: (menuData as any).menu.school_id,
      }));

      if ((menuData as any).menu) {
        setSearchMenu([
          {
            id: (menuData as any).menu.id,
            formattedLabel: `Mês: ${(menuData as any).menu.month}, Tipo: ${
              (menuData as any).menu.week_type === "ODD" ? "Ímpar" : "Par"
            }`,
            week_type: (menuData as any).menu.week_type,
          },
          // ...searchMenu coloca mes e o tipo de menu
          //{id: 1, formattedLabel: 'Mês: 2, Tipo: Par', week_type: 'EVEN'}
        ]);
      }
    }
  }, [menuData]);

  ////??? handleRecipeSelect ???
  //manipula a seleção de receitas
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

  // Preparação de menuItems para envio
  // const prepareMenuItems = (): MenuItems[] => {
  //   return Object.values(selections).map((selection) => ({
  //     school_id: String((menuData as any)?.menu?.school_id || menuItems.school_id),
  //     menu_id: String((menuData as any)?.menu?.id || menuItems.menu_id),
  //     recipe_id: String(selection.recipe_id),
  //     weekday: weekDay[selection.weekday].toLowerCase(), // Converter índice para nome do dia
  //     meal_type: selection.meal_type,
  //     additional_notes: menuItems.additional_notes || "",
  //   }));
  // };

  // API hooks for creating and updating
  const { postData: createPost } = usePost<any>("menu_items");
  const { upDate: updateData } = useUpdate<any>("menu_items");
  // const { deleteData } = useRemove<any>("menu_items");

  // submit
  // const updateMenuItem = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   try {
  //     const menuItemsToSend = prepareMenuItems();

  //     console.log("menuItemsToSend", menuItemsToSend); //falta menuItemId???

  //     if (menuItemsToSend.length === 0) {
  //       toast.warning("Por favor, selecione pelo menos uma receita");
  //       return;
  //     }

  //     //rastreia os itens existentes no backend
  //     // const existingItemIds = new Map();
  //     // if ((menuData as any)?.menuItems) {
  //     //   (menuData as any).menuItems.forEach((item) => {
  //     //     const key = `${item.weekday}-${item.meal_type}`;
  //     //     existingItemIds.set(key, item.id);
  //     //   });
  //     // }
  //     const existingItemIds = new Map();
  //     if ((menuData as any)?.menuItems) {
  //       (menuData as any).menuItems.forEach((item) => {
  //         const weekdayIndex = weekDay.findIndex((day) => day.toLowerCase() === item.weekday.toLowerCase());
  //         const key = `${weekdayIndex}-${item.meal_type}`;
  //         existingItemIds.set(key, item.id);
  //       });
  //     }

  //     const itemsToDelete = [];
  //     if ((menuData as any)?.menuItems) {
  //       (menuData as any).menuItems.forEach((item) => {
  //         const weekdayIndex = weekDay.findIndex((day) => day.toLowerCase() === item.weekday.toLowerCase());

  //         if (weekdayIndex !== -1) {
  //           const key = `${weekdayIndex}-${item.meal_type}`;
  //           if (!selections[key]) {
  //             itemsToDelete.push(item?.id);
  //           }
  //         }
  //       });
  //     }

  //     for (const item of menuItemsToSend) {
  //       const key = `${item.weekday}-${item.meal_type}`;
  //       // Update existing item
  //       if (existingItemIds.has(key)) {
  //         const itemId = existingItemIds.get(key);

  //         console.log("Updating item with ID:", itemId);
  //         await updateData(itemId, [item]);
  //       } else {
  //         // Create new item
  //         console.log("Creating new item:", item);
  //         await createPost(item);
  //       }
  //     }

  //     toast.success("Menu atualizado com sucesso!");

  //     // Refresh data after update
  //     if (params.id) {
  //       fetchDataMenuId(params.id);
  //     }
  //   } catch (error: any) {
  //     toast.error("Erro ao atualizar menu: " + error.message);
  //   }
  // };

  // const updateMenuItem = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   try {
  //     // 1. Primeiro, precisamos garantir que prepareMenuItems() retorna o formato correto
  //     // Modifique temporariamente para este teste:
  //     const menuItemsToSend = Object.values(selections).map((selection) => {
  //       // Converte índice numérico para o nome do dia
  //       const weekdayName = weekDay[selection.weekday].toLowerCase();

  //       return {
  //         school_id: String((menuData as any)?.menu?.school_id || menuItems.school_id),
  //         menu_id: String((menuData as any)?.menu?.id || menuItems.menu_id),
  //         recipe_id: String(selection.recipe_id),
  //         weekday: weekdayName, // Usando o NOME do dia
  //         meal_type: selection.meal_type,
  //         additional_notes: menuItems.additional_notes || "",
  //       };
  //     });

  //     if (menuItemsToSend.length === 0) {
  //       toast.warning("Por favor, selecione pelo menos uma receita");
  //       return;
  //     }

  //     // 2. Constrói o mapa de itens existentes
  //     const existingItemIds = new Map();
  //     if ((menuData as any)?.menuItems) {
  //       (menuData as any).menuItems.forEach((item) => {
  //         // Cria a chave com o NOME do dia
  //         const key = `${item.weekday}-${item.meal_type}`;
  //         console.log("Mapped existing item:", key, item.id);
  //         existingItemIds.set(key, item.id);
  //       });
  //     }

  //     // DEPURAÇÃO: Imprime todas as chaves do mapa para verificar
  //     console.log("Existing item keys:", Array.from(existingItemIds.keys()));

  //     // 3. Processa cada item
  //     for (const item of menuItemsToSend) {
  //       // Usa o mesmo formato de chave (com NOME do dia)
  //       const key = `${item.weekday}-${item.meal_type}`;
  //       console.log("Checking key:", key);

  //       if (existingItemIds.has(key)) {
  //         const itemId = existingItemIds.get(key);
  //         console.log("MATCH! Updating item with ID:", itemId);
  //         await updateData(itemId, [item]);
  //       } else {
  //         console.log("No match. Creating new item:", item);
  //         await createPost(item);
  //       }
  //     }

  //     toast.success("Menu atualizado com sucesso!");

  //     // Refresh data after update
  //     if (params.id) {
  //       fetchDataMenuId(params.id);
  //     }
  //   } catch (error: any) {
  //     toast.error("Erro ao atualizar menu: " + error.message);
  //   }
  // };

  const updateMenuItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Depuração dos dados fundamentais

      // Verifica se temos os dados necessários
      if (!menuData || !(menuData as any)?.menu) {
        toast.error("Dados do menu não encontrados");
        return;
      }

      // Verifica se selections tem conteúdo
      if (Object.keys(selections).length === 0) {
        toast.warning("Nenhuma receita selecionada");
        return;
      }

      // Preparação com verificações extremamente robustas
      const menuItemsToSend = Object.entries(selections)
        .map(([key, selection]) => {
          // Extrai os valores necessários com verificações
          const menuId = (menuData as any)?.menu?.id;
          const schoolId = (menuData as any)?.menu?.school_id;
          const recipeId = selection?.recipe_id;
          const weekdayIndex = selection?.weekday;
          const mealType = selection?.meal_type;

          // Verifica se todos os valores necessários existem
          if (!menuId || !schoolId || !recipeId || weekdayIndex === undefined || !mealType) {
            console.error("Dados incompletos para esta seleção:", {
              menuId,
              schoolId,
              recipeId,
              weekdayIndex,
              mealType,
            });
            return null;
          }

          // Converte índice para nome do dia com verificação
          let weekdayName;
          if (Array.isArray(weekDay) && weekdayIndex >= 0 && weekdayIndex < weekDay.length) {
            weekdayName = weekDay[weekdayIndex].toLowerCase();
          } else {
            console.error("Índice de dia inválido:", weekdayIndex);
            return null;
          }

          // Retorna o objeto completo
          return {
            school_id: String(schoolId),
            menu_id: String(menuId),
            recipe_id: String(recipeId),
            weekday: weekdayName,
            meal_type: mealType,
            additional_notes: menuItems.additional_notes || "",
          };
        })
        .filter((item) => item !== null); // Remove itens nulos

      if (menuItemsToSend.length === 0) {
        toast.warning("Nenhum item válido para enviar");
        return;
      }

      // Mapa de itens existentes
      const existingItemIds = new Map();
      if ((menuData as any)?.menuItems && Array.isArray((menuData as any).menuItems)) {
        (menuData as any).menuItems.forEach((item) => {
          if (item && item.weekday && item.meal_type && item.id) {
            const key = `${item.weekday}-${item.meal_type}`;

            existingItemIds.set(key, item.id);
          }
        });
      }

      // Processa cada item
      for (const item of menuItemsToSend) {
        const key = `${item.weekday}-${item.meal_type}`;

        try {
          if (existingItemIds.has(key)) {
            const itemId = existingItemIds.get(key);
            // console.log("MATCH! Updating item with ID:", itemId, "Data:", item);
            // Passa o item como objeto (não como array) se a API espera isso
            await updateData(itemId, item as any); //mudei   await updateData(itemId, item);
          } else {
            //  console.log("No match. Creating new item:", item);
            await createPost(item);
          }
        } catch (err) {
          console.error("Error processing item with key:", key, err);
          // Continue com o próximo item em vez de interromper todo o processo
        }
      }

      toast.success("Menu atualizado com sucesso!");

      // Refresh data after update
      if (params.id) {
        fetchDataMenuId(params.id);
      }
    } catch (error: any) {
      console.error("Main error:", error);
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
