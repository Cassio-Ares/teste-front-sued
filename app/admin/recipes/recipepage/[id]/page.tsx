"use client";

import { informationError } from "@/components/informationError";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/connect/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import { InputSelect } from "@/components/inputSelect";

import { useSearch } from "../../../../../hook/useSearch";

import { MissingIngredient } from "@/components/missingIngredient";
import RecipeDialogPNAE from "@/components/recipeDialogPNAE";
import RecipeDialogStockRequisition from "@/components/recipeDialogStockRequisition";

//types

const RecipeView = () => {
  const params = useParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [servings, setServings] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  const [schoolSearch, setSchoolSearch] = useState("");
  const {
    data: searchSchool,
    loading: schoolLoading,
    error: schoolError,
    setQuery: setQuerySchool,
  } = useSearch<any>("schools", schoolSearch);

  const fetchRecipeDetails = useCallback(async (recipeId: number, schoolId?: number, desiredServings?: number) => {
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

      if (response.data.success === false && response.data.missingIngredients) {
        setRecipe({
          ...response.data.recipe,
          ingredients: response.data.ingredients,
          missingIngredients: response.data.missingIngredients,
        });
      } else {
        setRecipe(response.data.data || response.data);
      }

      // setRecipe(response.data.data || response.data);
      if (desiredServings) setServings(desiredServings);
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const recipeId = params.id;
    if (recipeId) {
      fetchRecipeDetails(Number(recipeId));
    }
  }, [params.id]);

  const handleSchoolSelect = useCallback(
    (schoolId: number | null) => {
      if (schoolId === null) {
        setSelectedSchool(null);
        if (params.id) {
          setServings(1);
          fetchRecipeDetails(Number(params.id));
        }
        return;
      }
      const school = searchSchool?.find((s) => s.id === schoolId);
      if (school && params.id) {
        setSelectedSchool(school);
        fetchRecipeDetails(Number(params.id), school.id, servings);
      }
    },
    [searchSchool, params.id, servings]
  );

  // Handle servings change
  const handleServingsChange = useCallback(
    async (newServings: number) => {
      if (newServings < 1) {
        setError("O número de porções deve ser maior que 0.");
        return;
      }

      if (params?.id && selectedSchool?.id) {
        await fetchRecipeDetails(Number(params.id), selectedSchool.id, newServings);
      }
    },
    [params.id, selectedSchool]
  );

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  console.log("recipe", recipe);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-start gap-4 md:justify-end mb-4">
        <Link href="/admin/recipes">
          <Button variant="outline" className="text-orange-500 hover:text-orange-600 font-bold">
            <ArrowLeft /> Voltar
          </Button>
        </Link>
        <ToastContainer />
      </div>
      {recipe && (
        <Card className="p-6">
          {/* <h1 className="text-2xl font-bold mb-4">{recipe.school_name}</h1> */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <h4 className="text-2xl font-bold flex items-center gap-4">
              {recipe?.recipe?.name || recipe?.name} - {recipe?.recipe?.teaching_modality}
            </h4>
            {recipe?.missingIngredients && (
              <MissingIngredient recipe={recipe} missingIngredients={recipe.missingIngredients} />
            )}
          </div>
          <div className="flex w-full md:w-[60%] flex-col gap-4">
            <div className="flex justify-start items-center w-[300px] mb-6">
              <Label>Nome da Instituição</Label>
              <InputSelect
                options={searchSchool}
                value={selectedSchool?.id}
                onChange={handleSchoolSelect}
                onSearchChange={(query) => setQuerySchool(query)}
                placeholder="Selecione uma Instituição"
                // forceReset={resetSchoolInput}
                field="name"
              />
            </div>
          </div>
          <div className="flex items-center gap-5 mb-4">
            <Label className="font-semibold">Porções:</Label>
            <Input
              id="servings"
              type="number"
              min="1"
              value={servings || ""}
              onChange={selectedSchool ? (e) => setServings(Number(e.target.value)) : undefined}
              className={`w-20 p-2 border rounded ${!selectedSchool ? "cursor-not-allowed opacity-80" : ""}`}
              disabled={!selectedSchool}
            />
            <Button
              className="bg-orange-500 hover:bg-orange-600 font-bold"
              onClick={() => handleServingsChange(servings)}
            >
              Recalcular
            </Button>
            <RecipeDialogPNAE textButton="Ficha Tecnica PNAE" recipe={recipe} />
            {/* <RecipeDialog type="KITCHEN" textButton="Ficha Tecnica Cozinha" recipe={recipe} /> */}
            <RecipeDialogStockRequisition textButton="Requisição do Estoque" recipe={recipe} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="mb-4">
                <h2 className="font-semibold">Informações da Receita</h2>
                <p>Número de Ingredientes: {recipe?.ingredients?.length || 0}</p>
                <p>Tempo de Preparo: {recipe?.recipe?.prep_time || recipe?.prep_time} min</p>
                <p>Número de Porções: {recipe?.recipe?.servings || recipe?.servings}</p>
              </div>

              {/* <div>
                <h4 className="font-semibold">Informações de Custo</h4>
                <p>
                  Custo Total: R${" "}
                  {recipe?.recipe?.metrics?.total_cost.toFixed(2) || recipe?.metrics?.total_cost.toFixed(2)}
                </p>
                <p>
                  Custo por Porção: R${" "}
                  {recipe?.recipe?.metrics?.cost_per_serving?.toFixed(2) ||
                    recipe?.metrics?.cost_per_serving.toFixed(2)}
                </p>
              </div> */}
            </div>

            <div>
              <h2 className="font-semibold">Utensílios Necessários</h2>
              <p>{recipe?.recipe?.required_utensils || recipe?.required_utensils}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-2">Método de Preparo</h2>
          <p className="mb-4">{recipe?.recipe?.preparation_method || recipe?.preparation_method}</p>

          <h2 className="text-xl font-bold mb-2">Ingredientes</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingrediente</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Kcal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipe.ingredients?.map((ingredient, index) => (
                <TableRow key={`ingredient-${index}`}>
                  <TableCell>{ingredient.ingredient_description || ingredient.description}</TableCell>
                  <TableCell>{ingredient.gross_weight}</TableCell>
                  <TableCell>{ingredient.unit_of_measure || ingredient.unit_of_measure_gross_weight}</TableCell>
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

export default RecipeView;
