"use client";
import { InputSelect } from "@/components/inputSelect";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Pencil, Plus, PlusCircle, Trash } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { usePost } from "@/hook/usePost";
import { useSearch } from "@/hook/useSearch";

//types
import { RecipeTypes } from "../../../../lib/@types/recipe.types";

// import { IngredientTypes } from "../../../../lib/@types/ingredient.types";

//temporario

type Unit = "g" | "ml";

interface Ingredient {
  ingredient_id: number;
  cooked_weight?: number;
  gross_weight?: number;
  unit_of_measure: Unit;
  homemade_measure?: string;
  description?: string;
}

const units: string[] = ["g", "ml"];

const NewRecipe = () => {
  const [editingIngredient, setEditingIngredient] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [newRecipe, setNewRecipe] = useState<Partial<RecipeTypes>>({
    teaching_modality: "",
    name: "",
    preparation_method: "",
    required_utensils: "",
    description_of_recipe: "",
    observations: "",
    home_measurements: "",
    prep_time: 0,
    timeOfCoccao: 0,
    servings: 1,
    ingredients: [],
  });

  const [ingredientSearch, setIngredientSearch] = useState("");
  const [ingredients, setIngredients] = useState<any>([]);

  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    ingredient_id: 0,
    cooked_weight: undefined,
    gross_weight: undefined,
    unit_of_measure: "g",
  });

  const {
    data: ingredientData,
    loading: ingredientLoading,
    error: ingredientError,
    setQuery: setQueryIngredient,
  } = useSearch<any>("ingredients", ingredientSearch);

  const [selectedIngredient, setSelectedIngredient] = useState<any>(null);

  const handleIngredientSelect = (ingredientId: number) => {
    if (ingredientId === null) {
      setSelectedIngredient(null);
      setNewIngredient({
        ...newIngredient,
        ingredient_id: 0,
      });
      return;
    }
    const ingredient = ingredientData?.find((i) => i.id === ingredientId);

    if (ingredient) {
      setSelectedIngredient(ingredient);
      setNewIngredient({
        ...newIngredient,
        ingredient_id: ingredient.id,
      });
    }
  };

  const [resetIngredientInput, setResetIngredientInput] = useState(false);

  // Sincronizar ingredientes com newRecipe
  useEffect(() => {
    setNewRecipe((prev) => ({
      ...prev,
      ingredients: ingredients,
    }));
  }, [ingredients]);

  const addIngredient = () => {
    const ingredientToAdd: Ingredient = {
      ingredient_id: newIngredient.ingredient_id ?? 0,
      gross_weight: newIngredient.gross_weight,
      unit_of_measure: newIngredient.unit_of_measure || "g",
      homemade_measure: newIngredient.homemade_measure,
    };

    if (editingIngredient !== null) {
      const updatedIngredients = [...ingredients];
      updatedIngredients[editingIngredient] = ingredientToAdd;
      setIngredients(updatedIngredients);
      toast.success("Ingrediente atualizado com sucesso!");
    } else {
      setIngredients((prev) => [...prev, ingredientToAdd]);
      toast.success("Ingrediente adicionado com sucesso!");
    }

    // Resetar estados após adicionar o ingrediente
    setSelectedIngredient(null);
    setResetIngredientInput(true);

    setTimeout(() => {
      setResetIngredientInput(false);
    }, 0);

    setIngredientSearch("");
    setNewIngredient({
      ingredient_id: 0,
      cooked_weight: undefined,
      gross_weight: undefined,
      unit_of_measure: "g",
      homemade_measure: undefined,
    });
    setEditingIngredient(null);
    setIsOpen(false);
  };

  const handleAddIngredient = () => {
    setEditingIngredient(null);
    setNewIngredient({
      ingredient_id: 0,
      cooked_weight: undefined,
      gross_weight: undefined,
      unit_of_measure: "g",
      homemade_measure: undefined,
    });
    setIsOpen(true);
  };

  const handleEditIngredient = (index: number, ingredient: Ingredient) => {
    setEditingIngredient(index);
    setNewIngredient(ingredient);
    setIsOpen(true);
  };

  //post

  const { data: dataPost, loading: postLoading, error: postError, postData: createPost } = usePost<any>("recipes");

  //colocar form
  //const createNewRecipe = async (event: React.FormEvent<HTMLFormElement>) => {
  const createNewRecipe = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      const responseData = await createPost(newRecipe);
      toast.success(responseData?.message);
      setNewRecipe({
        teaching_modality: "",
        name: "",
        preparation_method: "",
        required_utensils: "",
        description_of_recipe: "",
        observations: "",
        home_measurements: "",
        prep_time: 0,
        timeOfCoccao: 0,
        servings: 1,
        ingredients: [],
      });

      setIngredients([]);
    } catch (error) {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex w-full flex-col justify-start gap-4">
      {/* Header */}
      <div className="flex flex-col-reverse md:flex-row w-full">
        <div className="flex flex-col w-full antialiased">
          <h3 className="font-bold text-xl md:text-2xl">Adicionar Receita</h3>
          <p className="text-base md:text-lg text-gray-400">
            Adicione ingredientes, modo de preparo, utensilios e informações
          </p>
        </div>
        <div className="flex justify-start gap-4 md:justify-end mb-4">
          <Link href="/admin/recipes">
            <Button variant="outline" className="text-orange-500 hover:text-orange-600 font-bold">
              <ArrowLeft /> Voltar
            </Button>
          </Link>
          <ToastContainer />
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full gap-5 mt-6 md:mt-20">
        <div className="flex w-full md:w-[60%] flex-col gap-4">
          <div className="flex flex-col justify-start w-full gap-2">
            <Label className="text-base mb-1 font-semibold">Modalidade de Ensino (Faixa Etária)</Label>
            <Select
              value={newRecipe.teaching_modality}
              onValueChange={(e) => setNewRecipe({ ...newRecipe, teaching_modality: e })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Modalidade de Ensino da Receita" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="E.I">E.I (Educação Infantil)</SelectItem>
                  <SelectItem value="E.M">E.M (Ensino Médio)</SelectItem>
                  <SelectItem value="E.F">E.F (Ensino Fundamental)</SelectItem>
                  <SelectItem value="EJA (E.F)">EJA (E.F) - Educação de Jovens e Adultos</SelectItem>
                  <SelectItem value="EJA (E.M)">EJA (E.M) - Educação de Jovens e Adultos</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Label className="text-base mb-2 font-semibold">Nome da refeição</Label>
            <Input
              value={newRecipe.name}
              onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
              placeholder="Nome do prato"
            />
          </div>

          {/* Servings and Prep Time */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex w-full flex-col gap-2">
              <Label className="text-base mb-2 font-semibold">Atende quantas pessoas?</Label>
              <Input
                type="number"
                value={(newRecipe.servings = 1)}
                onChange={(e) =>
                  setNewRecipe({
                    ...newRecipe,
                    servings: parseInt(e.target.value),
                  })
                }
                placeholder="Ex.: 1"
                disabled
              />
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label className="text-base mb-2 font-semibold">Tempo de Cocção (min)</Label>
              <Input
                type="text"
                value={newRecipe.timeOfCoccao || ""}
                onChange={(e) =>
                  setNewRecipe({
                    ...newRecipe,
                    timeOfCoccao: parseInt(e.target.value),
                  })
                }
                placeholder="Ex.: 30"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label className="text-base mb-2 font-semibold">Tempo de Preparo(min)</Label>
              <Input
                type="text"
                value={newRecipe.prep_time || ""}
                onChange={(e) =>
                  setNewRecipe({
                    ...newRecipe,
                    prep_time: parseInt(e.target.value),
                  })
                }
                placeholder="Ex.: 30"
              />
            </div>
          </div>

          {/* Ingredients List */}
          <div className="flex flex-col mt-4">
            {ingredients?.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold">Ingredientes adicionados</h4>
                <ul className="list-disc pl-5 marker:text-gray-500">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>
                        -{" "}
                        <span className="font-bold">
                          {ingredient.cooked_weight || ingredient.gross_weight} {ingredient.unit_of_measure}
                        </span>{" "}
                        de{" "}
                        {ingredientData?.find((i) => i.id === ingredient.ingredient_id)?.description || "Ingrediente"}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-black"
                          onClick={() => handleEditIngredient(index, ingredient)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            setIngredients((prev) => prev.filter((_, i) => i !== index));
                            toast.success("Ingrediente removido com sucesso!");
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Add Ingredient Button */}
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-500"
              onClick={handleAddIngredient}
            >
              <PlusCircle className="mr-2" /> Adicionar ingrediente
            </Button>

            {/* Ingredient Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingIngredient !== null ? "Editar ingrediente" : "Adicionar ingrediente"}
                  </DialogTitle>
                  <DialogDescription>
                    <div className="flex w-full gap-4 mt-4 text-start">
                      <div className="flex w-full flex-col gap-2">
                        <Label>Ingrediente</Label>
                        <InputSelect
                          options={ingredientData}
                          value={selectedIngredient?.id}
                          onChange={handleIngredientSelect}
                          onSearchChange={(query) => setQueryIngredient(query)}
                          placeholder="Selecione um ingrediente"
                          forceReset={resetIngredientInput}
                          field="description"
                        />
                      </div>
                      <div className="flex w-full flex-col gap-2">
                        <Label>Unidade de medida</Label>
                        <Select
                          value={newIngredient.unit_of_measure || "g"}
                          onValueChange={(value) =>
                            setNewIngredient((prev) => ({
                              ...prev,
                              unit_of_measure: value as Ingredient["unit_of_measure"],
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma unidade de medida" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Unidades de medida</SelectLabel>
                              {units.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex w-full gap-4 mt-4 text-start">
                      <div className="flex w-full flex-col gap-2">
                        <Label>Peso bruto</Label>
                        <Input
                          placeholder="Peso bruto"
                          type="number"
                          value={newIngredient.gross_weight ?? undefined}
                          onChange={(e) =>
                            setNewIngredient((prev) => ({
                              ...prev,
                              gross_weight: Number(e.target.value),
                            }))
                          }
                        />
                      </div>
                      <div className="flex w-full flex-col gap-2">
                        <Label>Medida Caseira</Label>
                        <Input
                          placeholder="1 colher de farinha"
                          type="text"
                          value={newIngredient.homemade_measure ?? undefined}
                          onChange={(e) =>
                            setNewIngredient((prev) => ({
                              ...prev,
                              homemade_measure: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button className="bg-orange-500 hover:bg-orange-600 font-bold" onClick={addIngredient}>
                    {editingIngredient !== null ? "Atualizar" : "Adicionar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Preparation Method and Utensils */}
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col">
            <Label className="text-base mb-2 font-semibold">Modo de preparo</Label>
            <Card className="p-4">
              <Textarea
                value={newRecipe.preparation_method || ""}
                onChange={(e) =>
                  setNewRecipe({
                    ...newRecipe,
                    preparation_method: e.target.value,
                  })
                }
                className="w-full"
                rows={6}
                placeholder="Descreva como você prepara a sua receita..."
              />
            </Card>
          </div>
          <div className="flex flex-col mt-2">
            <Label className="text-base mb-2 font-semibold">Utensílios e equipamentos</Label>
            <Card className="p-4">
              <Textarea
                value={newRecipe.required_utensils || ""}
                onChange={(e) =>
                  setNewRecipe({
                    ...newRecipe,
                    required_utensils: e.target.value,
                  })
                }
                className="w-full"
                rows={6}
                placeholder="Liste os utensílios necessários..."
              />
            </Card>
          </div>
          {/* <div className="flex flex-col mt-2">
            <Label className="text-base mb-2 font-semibold">
              Medidas caseiras
            </Label>
            {/* <Card className="p-4">
              <Textarea
                value={newRecipe.home_measurements || ""}
                onChange={(e) =>
                  setNewRecipe({
                    ...newRecipe,
                    home_measurements: e.target.value,
                  })
                }
                className="w-full"
                rows={6}
                placeholder="Descreva medidas caseiras para os ingredientes..."
              />
            </Card> 
          </div> */}
          <div className="flex flex-col mt-2">
            <Label className="text-base mb-2 font-semibold">
              Cardápio (descreva como você quer a descrição do cardápio)
            </Label>
            <Card className="p-4">
              <Textarea
                value={newRecipe.description_of_recipe || ""}
                onChange={(e) =>
                  setNewRecipe({
                    ...newRecipe,
                    description_of_recipe: e.target.value,
                  })
                }
                className="w-full"
                rows={6}
                placeholder="Descreva como você quer a descrição do cardápio..."
              />
            </Card>
          </div>
          <div className="flex flex-col mt-2">
            <Label className="text-base mb-2 font-semibold">Observação</Label>
            <Card className="p-4">
              <Textarea
                value={newRecipe.observations || ""}
                onChange={(e) =>
                  setNewRecipe({
                    ...newRecipe,
                    observations: e.target.value,
                  })
                }
                className="w-full"
                rows={6}
                placeholder="Descreva alguma observações..."
              />
            </Card>
          </div>

          <div className="flex justify-center md:justify-end mt-4">
            <Button
              variant="outline"
              className="flex w-[300px] md:w-[200px] bg-orange-500 hover:bg-orange-600 text-white hover:text-white font-bold"
              onClick={createNewRecipe}
              disabled={postLoading}
            >
              <Plus className="mr-2" /> {postLoading ? "Salvando..." : "Salvar cardápio"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRecipe;
