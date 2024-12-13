"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '@/components/ui/select';
import { ArrowLeft, PlusCircle, Plus, Pencil, Trash } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { api } from '@/connect/api';
import { InputSelect } from '@/components/inputSelect';
import { informationError } from '@/components/informationError';


// Define types for better type safety
interface Ingredient {
  id?: number;
  ingredient_id: number;
  quantity: number;
  unit_of_measure: 'kg' | 'g' | 'L' | 'ml';
  description?: string;
}

interface Recipe {
  school_id: string | number;
  name: string;
  preparation_method: string;
  required_utensils: string;
  prep_time: number;
  servings: number;
  ingredients: Ingredient[];
}

const units: string[] = ['kg', 'g', 'L', 'ml'];

const NewRecipe = () => {
  const [editingIngredient, setEditingIngredient] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const [newRecipe, setNewRecipe] = useState<Recipe>({
    school_id: '',
    name: "",
    preparation_method: "",
    required_utensils: "",
    prep_time: 0,
    servings: 1,
    ingredients: []
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState<string>('');
  const [searchIngredient, setSearchIngredient] = useState<Ingredient[]>([]);

  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    ingredient_id: 0,
    quantity: 0,
    unit_of_measure: 'g'
  });

  useEffect(() => {
    if (ingredientSearch.length > 2) {
      fetchDataIngredient();
    } else {
      fetchDataIngredient();
    }
  }, [ingredientSearch]);

  const fetchDataIngredient = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = ingredientSearch.length > 2
        ? await api.get(`/ingredients/search/${ingredientSearch}`)
        : await api.get(`/ingredients`);

      setSearchIngredient(response.data.data);

      // if (response.data.data.length > 0) {
      //   const ingredientData = response?.data?.data;
      //   setIngredients(prevIngredient => ({
      //     ...prevIngredient,
      //     ingredient_id: ingredientData.id
      //   }));
      // }
    } catch (error) {
      informationError(error)
    } finally {
      setLoading(false);
    }
  }, [ingredientSearch])


  const [schoolSearch, setSchoolSearch] = useState("");
  const [searchSchool, setSearchSchool] = useState([]);

  useEffect(() => {
    if (schoolSearch.length > 2) {
      fetchDataSchool();
    }
  }, [schoolSearch]);

 
  const fetchDataSchool = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/schools/search/${schoolSearch}`)
      

      setSearchSchool(response.data.data);

      if (response.data.data.length > 0) {
        const schoolData = response?.data?.data[0];
        setNewRecipe(prevRecipe => ({
          ...prevRecipe,
          // state_id: schoolData.state_id,
          // city_id: schoolData.city_id,
          school_id: schoolData.id
        }));
      }
    } catch (error) {
      informationError(error)
    } finally {
      setLoading(false);
    }
  }, [schoolSearch])


  const addIngredient = () => {
    const ingredientToAdd: Ingredient = {
      ingredient_id: newIngredient.ingredient_id,
      quantity: newIngredient.quantity,
      unit_of_measure: newIngredient.unit_of_measure
    };

    if (editingIngredient !== null) {
      const updatedIngredients = [...ingredients];
      updatedIngredients[editingIngredient] = ingredientToAdd;
      setIngredients(updatedIngredients);
      toast.success("Ingrediente atualizado com sucesso!");
    } else {
      setIngredients(prev => [...prev, ingredientToAdd]);
      toast.success("Ingrediente adicionado com sucesso!");
    }

    // Reset states
    setNewIngredient({
      ingredient_id: 0,
      quantity: 0,
      unit_of_measure: 'g'
    });
    setEditingIngredient(null);
    setIsOpen(false);
  };

  const updateIngredient = (index: number, key: keyof Ingredient, value: any) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [key]: value
    };
    setIngredients(updatedIngredients);
  };

  const handleAddIngredient = () => {
    setEditingIngredient(null);
    setNewIngredient({
      ingredient_id: 0,
      quantity: 0,
      unit_of_measure: 'g'
    });
    setIsOpen(true);
  };

  const handleEditIngredient = (index: number, ingredient: Ingredient) => {
    setEditingIngredient(index);
    setNewIngredient(ingredient);
    setIsOpen(true);
  };

  const createNewRecipe = async () => {
    setLoading(true);
    setError(null);
    try {
      if (ingredients.length === 0) {
        toast.error('Por favor, adicione pelo menos um ingrediente');
        return;
      }

      const recipeData = {
        ...newRecipe,
        ingredients: ingredients.map(ing => ({
          ingredient_id: ing.ingredient_id,
          quantity: Number(ing.quantity), // Ensure number
          unit_of_measure: ing.unit_of_measure
        }))
      };

     console.log('recipeData: ', recipeData);

      const response = await api.post('/recipes', recipeData);
      toast.success(response.data.message);

      // Reset form or navigate
      setNewRecipe({
        school_id: '',
        name: "",
        preparation_method: "",
        required_utensils: "",
        prep_time: 0,
        servings: 1,
        ingredients: []
      });
      setIngredients([]);
    } catch (error) {
      toast.error('Erro ao criar receita');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  console.log('data', searchIngredient[0]?.description);

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

      <div className="flex flex-col md:flex-row w-full gap-4 mt-6 md:mt-20">
        <div className="flex w-full md:w-[60%] flex-col gap-4">
          {/* Recipe Name */}
          <div className="flex justify-start items-center w-[300px] gap-4">
            <Label>Nome da escola</Label>
            <InputSelect
              options={searchSchool}
              value={newRecipe.school_id}
              onChange={(value) => setNewRecipe({ ...newRecipe, school_id: value })}
              onSearchChange={(searchTerm) => setSchoolSearch(searchTerm)}
              placeholder="Selecione uma escola"
              field="name"
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <Label className="text-base">Nome da refeição</Label>
            <Input
              value={newRecipe.name}
              onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
              placeholder="Nome do prato"
            />
          </div>

          {/* Servings and Prep Time */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex w-full flex-col gap-2">
              <Label className="text-base">Atende quantas pessoas?</Label>
              <Input
                type="number"
                value={newRecipe.servings = 1}
                onChange={(e) => setNewRecipe({ ...newRecipe, servings: parseInt(e.target.value) })}
                placeholder="Ex.: 1"
                disabled
              />
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label className="text-base">Tempo de Preparo</Label>
              <Input
                type="text"
                value={newRecipe.prep_time || ""}
                onChange={(e) => setNewRecipe({ ...newRecipe, prep_time: parseInt(e.target.value) })}
                placeholder="Ex.: 30 min"
              />
            </div>
          </div>

          {/* Ingredients List */}
          <div className="flex flex-col mt-4">
            {ingredients.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold">Ingredientes adicionados</h4>
                <ul className="list-disc pl-5 marker:text-gray-500">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>
                        - <span className="font-bold">
                          {ingredient.quantity} {ingredient.unit_of_measure}
                        </span> de {searchIngredient.find(i => i.id === ingredient.ingredient_id)?.description || 'Ingrediente'}
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
                            setIngredients(prev => prev.filter((_, i) => i !== index));
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
                          options={searchIngredient}
                          value={newIngredient.ingredient_id || ''}  
                          onChange={(value) => setNewIngredient(prev => ({
                            ...prev,
                            ingredient_id: value as Ingredient['ingredient_id']
                          }))}
                          onSearchChange={(searchTerm) => setIngredientSearch(searchTerm)}
                          placeholder="Selecione um ingrediente"
                          field="description"
                        />
                        {/* <InputSelect
                          options={searchIngredient}
                          value={ingredients.ingredient_id}
                          onChange={(value) => setIngredients({ ...ingredients, ingredient_id: value })}
                          onSearchChange={(searchTerm) => setIngredientSearch(searchTerm)}
                          placeholder="Selecione um ingrediente"
                          field="description"
                        /> */}
                      </div>
                      <div className="flex w-full flex-col gap-2">
                        <Label>Unidade de medida</Label>
                        <Select
                          value={newIngredient.unit_of_measure || 'g'}
                          onValueChange={(value) => setNewIngredient(prev => ({
                            ...prev,
                            unit_of_measure: value as Ingredient['unit_of_measure']
                          }))}
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
                          value={newIngredient.quantity || ''}
                          onChange={(e) => setNewIngredient(prev => ({
                            ...prev,
                            quantity: Number(e.target.value)
                          }))}
                        />
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 font-bold"
                    onClick={addIngredient}
                  >
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
                onChange={(e) => setNewRecipe({ ...newRecipe, preparation_method: e.target.value })}
                className="w-full"
                rows={6}
                placeholder="Descreva como você prepara a sua receita..."
              />
            </Card>
          </div>

          <div className="flex flex-col mt-2">
            <Label className="text-base mb-2 font-semibold">
              Utensílios e equipamentos <small className="font-normal">(Opcional)</small>
            </Label>
            <Card className="p-4">
              <Textarea
                value={newRecipe.required_utensils || ""}
                onChange={(e) => setNewRecipe({ ...newRecipe, required_utensils: e.target.value })}
                className="w-full"
                rows={6}
                placeholder="Liste os utensílios necessários..."
              />
            </Card>
          </div>

          <div className="flex justify-center md:justify-end mt-4">
            <Button
              variant="outline"
              className="flex w-[300px] md:w-[200px] bg-orange-500 hover:bg-orange-600 text-white hover:text-white font-bold"
              onClick={createNewRecipe}
              disabled={loading}
            >
              <Plus className="mr-2" /> {loading ? 'Salvando...' : 'Salvar cardápio'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRecipe;