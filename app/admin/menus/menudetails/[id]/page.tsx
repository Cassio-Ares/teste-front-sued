"use client";

import { informationError } from "@/components/informationError";
import RecipeDialog from "@/components/recipeDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/connect/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { MissingIngredient } from "@/components/missingIngredient";

//types

const MealTypeLabels = {
  MorningSnack: "Lanche da Manhã",
  Lunch: "Almoço",
  AfternoonSnack: "Lanche da Tarde",
  NightSnack: "Lanche da Noite",
  FullPeriodMealMorning: "Lanche Integral - Manhã",
  FullPeriodMealAfternoon: "Lanche Integral - Tarde",
};

const RecipeMenuDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams(); // Para capturar query strings no Next.js
  const [menuData, setMenuData] = useState<any>(null); //dados vindos da url
  const [recipe, setRecipe] = useState<any>(null);
  const [servings, setServings] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  //pega dados da url e decodifica
  useEffect(() => {
    const data = searchParams.get("data"); //{"recipeId":2,"estimatedPortions":80,"schoolId":2}
    if (data) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(data));
        setMenuData(decodedData);
      } catch (error) {
        toast.error("Erro ao decodificar dados");
        console.error("Erro ao decodificar dados:", error);
      }
    }
  }, [searchParams]);

  const fetchRecipeDetails = useCallback(
    async (recipeId: number, schoolId?: number, desiredServings?: number) => {
      setError(null);
      setLoading(true);

      try {
        let response;

        // Caso com todos os dados
        if (desiredServings && desiredServings > 1) {
          response = await api.post("/recipes/serving", {
            recipeId,
            school_id: schoolId,
            desiredServings,
          });
        }
        // caso 2 com id e school_id
        else if (schoolId) {
          response = await api.get(`/recipes/${recipeId}`, {
            params: { school_id: schoolId },
          });
        }
        //caso 3
        else {
          response = await api.get(`/recipes/${recipeId}`);
        }

        if (
          response.data.success === false &&
          response.data.missingIngredients
        ) {
          setRecipe({
            ...response.data.recipe,
            ingredients: response.data.ingredients,
            missingIngredients: response.data.missingIngredients,
          });
        } else {
          setRecipe(response.data.data || response.data);
        }

        console.log("Full API Response:", response);
        // setRecipe(response.data.data || response.data);
        if (desiredServings) setServings(desiredServings);
      } catch (error) {
        informationError(error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Verifica se `menuData` e `items` estão definidos
  useEffect(() => {
    const recipeId = params.id;

    console.log("menuData", menuData);

    if (
      (recipeId &&
        menuData &&
        menuData?.schoolId &&
        menuData.estimatedPortions) ||
      1
    ) {
      fetchRecipeDetails(
        Number(recipeId),
        menuData?.schoolId,
        menuData?.estimatedPortions
      );
    }
  }, [params.id, menuData]);

  // Handle servings change
  const handleServingsChange = useCallback(
    async (newServings: number) => {
      if (newServings < 1) {
        setError("O número de porções deve ser maior que 0.");
        return;
      }

      const recipeId = params.id;

      if (recipeId && menuData && menuData.schoolId) {
        fetchRecipeDetails(Number(recipeId), menuData.schoolId, newServings);
      }
    },
    [params.id, menuData, fetchRecipeDetails]
  );

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  console.log("recipe", recipe);

  return (
    <div className="container mx-auto p-4">
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
      {recipe && (
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-4">{menuData?.schoolName}</h1>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h4 className="text-2xl font-bold">
              {recipe?.recipe?.name || recipe?.name}
            </h4>
            {recipe?.missingIngredients && (
              <MissingIngredient
                recipe={recipe}
                missingIngredients={recipe.missingIngredients}
              />
            )}
          </div>
          <div className="flex items-center gap-5 mb-4">
            <Label className="font-semibold">Porções:</Label>
            <Input
              id="servings"
              type="number"
              min="1"
              value={servings || ""}
              onChange={(e) => setServings(Number(e.target.value))}
              className="w-20 p-2 border rounded"
            />
            <Button
              className="bg-orange-500 hover:bg-orange-600 font-bold"
              onClick={() => handleServingsChange(servings)}
            >
              Recalcular
            </Button>
            <RecipeDialog
              textButton="Ficha tecnica PNAE"
              recipe={recipe}
              teaching_modality={
                menuData.teaching_modality || "Não foi informado"
              }
            />
            <RecipeDialog
              textButton="Ficha tecnica Cozinha"
              recipe={recipe}
              teaching_modality={
                menuData.teaching_modality || "Não foi informado"
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="mb-4">
                <h2 className="font-semibold">Informações da Receita</h2>
                <p>
                  Número de Ingredientes: {recipe?.ingredients?.length || 0}
                </p>
                <p>
                  Tempo de Preparo:{" "}
                  {recipe?.recipe?.prep_time || recipe?.prep_time} min
                </p>
                <p>
                  Número de Porções:{" "}
                  {recipe?.recipe?.servings || recipe?.servings}
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Informações de Custo</h4>
                <p>
                  Custo Total: R${" "}
                  {recipe?.recipe?.metrics?.total_cost.toFixed(2) ||
                    recipe?.metrics?.total_cost.toFixed(2)}
                </p>
                <p>
                  Custo por Porção: R${" "}
                  {recipe?.recipe?.metrics?.cost_per_serving?.toFixed(2) ||
                    recipe?.metrics?.cost_per_serving.toFixed(2)}
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-semibold">Utensílios Necessários</h2>
              <p>
                {recipe?.recipe?.required_utensils || recipe?.required_utensils}
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-2">Método de Preparo</h2>
          <p className="mb-4">
            {recipe?.recipe?.preparation_method || recipe?.preparation_method}
          </p>

          <h2 className="text-xl font-bold mb-2">Ingredientes</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingrediente</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Custo</TableHead>
                <TableHead>Kcal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipe.ingredients?.map((ingredient, index) => (
                <TableRow key={`ingredient-${index}`}>
                  <TableCell>
                    {ingredient.ingredient_description ||
                      ingredient.description}
                  </TableCell>
                  <TableCell>{ingredient.gross_weight}</TableCell>
                  <TableCell>
                    {ingredient.unit_of_measure ||
                      ingredient.unit_of_measure_gross_weight}
                  </TableCell>
                  <TableCell>R$ {ingredient?.cost?.toFixed(2)}</TableCell>
                  <TableCell>{ingredient.kcal}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default RecipeMenuDetails;
