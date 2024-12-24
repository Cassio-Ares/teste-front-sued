"use client";

import React, { useState, useEffect, use, useCallback } from "react";
import { useParams } from "next/navigation";
import { api } from "@/connect/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { informationError } from "@/components/informationError";
import RecipeDialog from "@/components/recipeDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { InputSelect } from "@/components/inputSelect";

import { useSearch } from "../../../../../hook/useSearch.ts";

import { MissingIngredient } from "@/components/missingIngredient";

//types
import { SchoolBasicTypes } from "../../../../../lib/@types/school.types.ts";
import { RecipeInformationTypes } from "../../../../../lib/@types/recipeInformation.types.ts";


const RecipeView = () => {
  const params = useParams();
  const [recipe, setRecipe] = useState<RecipeInformationTypes>(null);
  const [servings, setServings] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

 
  const [schoolSearch, setSchoolSearch] = useState("");
  const {
    data: searchSchool,
    loading: schoolLoading,
    error: schoolError,
    setQuery: setQuerySchool,
  } = useSearch<SchoolBasicTypes>("schools", schoolSearch);

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

        // setRecipe(response.data.data || response.data);
        if (desiredServings) setServings(desiredServings);
      } catch (error) {
        informationError(error);
        setError("Erro ao carregar receita");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const recipeId = params.id;
    if (recipeId) {
      fetchRecipeDetails(Number(recipeId));
    }
  }, [params.id]);

  const handleSchoolSelect = useCallback(
    (schoolId: number) => {
      const school = searchSchool?.data?.find((s) => s.id === schoolId);
      if (school && params.id) {
        setSelectedSchool(school);
        fetchRecipeDetails(Number(params.id), school.id, servings);
      }
    },
    [searchSchool?.data, params.id, servings]
  );

  // Handle servings change
  const handleServingsChange = useCallback(
    async (newServings: number) => {
      if (newServings < 1) {
        setError("O número de porções deve ser maior que 0.");
        return;
      }

      if (params.id) {
        await fetchRecipeDetails(
          Number(params.id),
          selectedSchool?.id,
          newServings
        );
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
          {/* <h1 className="text-2xl font-bold mb-4">{recipe.school_name}</h1> */}
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
          <div className="flex w-full md:w-[60%] flex-col gap-4">
            <div className="flex justify-start items-center w-[300px] mb-6">
              <Label>Nome da Instituição</Label>
              <InputSelect
                options={searchSchool?.data}
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
              onChange={(e) => setServings(Number(e.target.value))}
              className="w-20 p-2 border rounded"
            />
            <Button
              className="mr-10"
              onClick={() => handleServingsChange(servings)}
            >
              Recalcular
            </Button>
            <RecipeDialog recipe={recipe} />
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
                    recipe?.metrics?.total_cost}
                </p>
                <p>
                  Custo por Porção: R${" "}
                  {recipe?.recipe?.metrics?.cost_per_serving?.toFixed(2) ||
                    recipe?.metrics?.cost_per_serving}
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
                  <TableCell>{ingredient.unit_of_measure}</TableCell>
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

export default RecipeView;
