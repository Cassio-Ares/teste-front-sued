"use client";
import { Button } from "@/components/ui/button";
import { useGetById } from "@/hook/useGetById";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

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

const MenuDataContent = () => {
  const searchParams = useSearchParams();
  // const id = searchParams.get("id");
  // const type = searchParams.get("type");
  // const [formattedData, setFormattedData] = useState<any[]>([]);

  let id: any;
  let type: string | null;
  const [formattedData, setFormattedData] = useState<any[]>([]);

  useEffect(() => {
    id = searchParams.get("id");
    type = searchParams.get("type");
  }, [searchParams]);

  const idList = id ? id.split(",").map(Number).filter(Boolean) : [];

  const { data, loading, error, fetchData } = useGetById("menus");

  useEffect(() => {
    if (idList.length > 0) {
      for (let i = 0; i < idList.length; i++) {
        fetchData(idList[i]);
      }
    }
  }, []);

  useEffect(() => {
    if (data && "menu" in data) {
      setFormattedData((prev) => {
        const duplicate = prev.find(
          (item) => item.menu.id === (data.menu as any).id
        );
        if (!duplicate) {
          return [...prev, data];
        }
        return prev;
      });
    }
  }, [data]);

  const normalizeWeekday = (day) => {
    return day
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const getMenuItems = (day, mealTypeValue) => {
    if (formattedData.length === 0) return [];
    const items = formattedData.flatMap((menuData) =>
      menuData.menuItems.filter(
        (item) =>
          normalizeWeekday(item.weekday) === normalizeWeekday(day) &&
          item.meal_type === mealTypeValue
      )
    );
    return items;
  };

  console.log("formattedData", formattedData);

  return (
    <>
      <div className="flex justify-start gap-4 md:justify-end mb-4">
        <Link href="/admin/menus">
          <Button
            variant="outline"
            className="text-orange-500 hover:text-orange-600 font-bold"
          >
            <ArrowLeft /> Voltar
          </Button>
        </Link>
      </div>
      {idList.length > 0 ? (
        idList.map((itemId) => (
          <div
            key={itemId}
            className="flex w-full flex-col justify-start gap-4"
          >
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 border bg-gray-100 font-medium">
                      Refeição
                    </th>
                    {weekDay.map((day) => (
                      <th
                        key={day}
                        className="p-2 border bg-gray-100 font-medium"
                      >
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
                      {weekDay.map((day) => {
                        const items = getMenuItems(day, meal.value);
                        return (
                          <td
                            key={`${day}-${meal.value}`}
                            className="p-2 border"
                          >
                            {items.length > 0 && (
                              <div className="text-sm">
                                <div className="font-medium">
                                  {items[0].recipe_name}
                                </div>
                                {items[0].estimated_portions && (
                                  <div className="text-gray-600">
                                    Porções: {items[0].estimated_portions}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p>Colocar diálogo de erro aqui</p>
      )}
    </>
  );
};

const MenuData = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <MenuDataContent />
    </Suspense>
  );
};

export default MenuData;

/**
 *  <InputSelect
                       // options={searchRecipe}
                        // value={
                        //   selections[`${index}-${meal.value}`]?.recipe_id || ""
                        // }
                        // onChange={(recipeId) =>
                        //   handleRecipeSelect(recipeId, index, meal.value)
                        // }
                        // onSearchChange={(query) => setQueryRecipe(query)}
                        placeholder="Selecione uma Receita"
                        field="name"
                      />
 */
