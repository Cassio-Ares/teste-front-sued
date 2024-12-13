"use client";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";


import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Trash2 } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { informationError } from "@/components/informationError";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/connect/api";
import { Trash } from "lucide-react";


interface Ingredient {
  id?: number ;
  description: string;
  legend_type?: string;
  gross_weight: number;
  correction_factor: number | null;
  cooked_weight: number | null;
  cooking_index: number | null;
  kcal: number | null;
  kj: number | null;
  protein: number | null;
  lipids: number | null;
  carbohydrate: number | null;
  calcium: number | null;
  iron: number | null;
  retinol: number | null;
  vitaminC: number | null;
  sodium: number | null;
}
const Ingredients = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    description: "",
    gross_weight: 100,
    correction_factor: null,
    cooked_weight: null,
    cooking_index: null,
    kcal: null,
    kj: null,
    protein: null,
    lipids: null,
    carbohydrate: null,
    calcium: null,
    iron: null,
    retinol: null,
    vitaminC: null,
    sodium: null,
  });
  const [ingredientsData, setIngredientsData] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState<string>("")


  useEffect(() => {
    if (search.length > 2) {
      fetchData();
    } else {
      fetchData();
    }
  }, [search]);

  // Modificação no fetchData para não precisar passar o evento
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = search.length > 2
        ? await api.get(`/ingredients/search/${search}`)
        : await api.get("/ingredients");

      setIngredientsData(response.data.data);
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  };

  const removeitem = async (id: number) => {
    try {
      await api.delete(`/ingredients/${id}`);
      fetchData();
    } catch (error) {
      informationError(error);
    }
  };

  const handleCreateIngredient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/ingredients', newIngredient);
      setNewIngredient({
        description: "",
        gross_weight: 100,
        correction_factor: null,
        cooked_weight: null,
        cooking_index: null,
        kcal: null,
        kj: null,
        protein: null,
        lipids: null,
        carbohydrate: null,
        calcium: null,
        iron: null,
        retinol: null,
        vitaminC: null,
        sodium: null,
      });

      fetchData();
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(ingredientsData)



  return (
    <div className="flex flex-col justify-start gap-4 ">
      <h1 className="font-bold text-xl">Ingredientes </h1>
      <div className="flex justify-end">
        {/* <Link href="/admin/menus/new"> */}
        <Button
          className="bg-orange-500 hover:bg-orange-600 font-bold"
          onClick={() => setIsOpen(true)}
        >
          + Novo ingrediente
        </Button>
        {/* </Link> */}
        <ToastContainer />
        {/*teste*/}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleCreateIngredient}>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Ingrediente</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Nome do Ingrediente</Label>
                    <Input
                      name="name"
                      value={newIngredient.description}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          description: event.target.value,
                        });
                      }}
                      placeholder="Digite o nome do ingrediente"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Legenda (CD/FNDE nº 06/2020)</Label>
                    <Select
                      value={newIngredient.legend_type || ""}
                      onValueChange={(value) => {
                        setNewIngredient({
                          ...newIngredient,
                          legend_type: value
                        });
                      }}
                    >
                      <SelectTrigger className="p-2 border rounded">
                        <SelectValue placeholder="Legenda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oferta limitada para todas as idades">
                          Oferta limitada para todas as idades
                        </SelectItem>
                        <SelectItem value="Limitada para > 3 anos e proibida para ≤ 3 anos">
                          Limitada para  `&gt;` 3 anos e proibida para ≤ 3 anos
                        </SelectItem>
                        <SelectItem value="Aquisição proibida">
                          Aquisição proibida
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Peso bruto(g)</Label>
                    <Input
                      name="gross_weight"
                      type="number"
                      value={newIngredient.gross_weight}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Fator de Correção </Label>
                    <Input
                      name="correction_factor"
                      type="number"
                      value={newIngredient.correction_factor || ""}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          correction_factor: parseFloat(event.target.value),
                        });
                      }}

                      placeholder="Digite o fator de correção"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Peso Cozido </Label>
                    <Input
                      name="cooked_weight"
                      type="number"
                      value={newIngredient.cooked_weight || ""}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          cooked_weight: parseFloat(event.target.value),
                        });
                      }}

                      placeholder="Digite o peso cozido"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Índice de Cocção</Label>
                    <Input
                      name="cooking_index"
                      type="number"
                      value={newIngredient.cooking_index || ""}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          cooking_index: parseFloat(event.target.value),
                        });
                      }}
                      placeholder="Digite o indice Índice de cocção"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Kcal</Label>
                    <Input
                      name="kcal"
                      type="number"
                      value={newIngredient.kcal || ""}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          kcal: parseFloat(event.target.value),
                        });
                      }}
                      placeholder="Digite o kcal"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Kj</Label>
                    <Input
                      name="kj"
                      type="number"
                      value={newIngredient.kj || ""}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          kj: parseFloat(event.target.value),
                        });
                      }}
                      placeholder="Digite o kj"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Proteínas</Label>
                    <Input
                      name="protein"
                      type="number"
                      value={newIngredient.protein || ""}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          protein: parseFloat(event.target.value),
                        });
                      }}
                      placeholder="Digite as proteínas"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Lipídios</Label>
                    <Input
                      name="lipids"
                      type="number"
                      value={newIngredient.lipids || ""}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          lipids: parseFloat(event.target.value),
                        });
                      }}
                      placeholder="Digite os lipídios"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Carboidratos</Label>
                    <Input
                      name="carbohydrate"
                      type="number"
                      value={newIngredient.carbohydrate || ""}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          carbohydrate: parseFloat(event.target.value),
                        });
                      }}
                      placeholder="Digite os carboidratos"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Cálcio</Label>
                    <Input
                      name="calcium"
                      type="number"
                      value={newIngredient.calcium || ""}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          calcium: parseFloat(event.target.value),
                        });
                      }}
                      placeholder="Digite o cálcio"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Ferro</Label>
                    <Input
                      name="iron"
                      type="number"
                      value={newIngredient.iron || ""}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          iron: parseFloat(event.target.value),
                        });
                      }}
                      placeholder="Digite o ferro"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Retinol (vit. A)</Label>
                    <Input
                      name="retinol"
                      type="number"
                      value={newIngredient.retinol || ""}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          retinol: parseFloat(event.target.value),
                        });
                      }}
                      placeholder="Digite o retinol"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Vit. C</Label>
                    <Input
                      name="vitaminC"
                      type="number"
                      value={newIngredient.vitaminC || ""}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          vitaminC: parseFloat(event.target.value),
                        });
                      }}
                      placeholder="Digite o vitamina C"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Sódio</Label>
                    <Input
                      name="sodium"
                      type="number"
                      value={newIngredient.sodium || ""}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          sodium: parseFloat(event.target.value),
                        });
                      }}
                      placeholder="Digite o sódio"
                    />
                  </div>
                </div>
              </DialogDescription>

              <DialogFooter>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 font-bold"
                >
                  Salvar Ingrediente
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-start items-center w-[300px] gap-4">
        <Search size={16} />
        <Input onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar..."></Input>
      </div>
      <div className="flex">
        <Card className="w-full p-4">
          <Table>
            <TableCaption className="mt-10 text-gray-400">
              Lista com todas os ingredientes cadastrados.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Descrição</TableHead>
                <TableHead className="font-bold">Legenda</TableHead>

                <TableHead className="font-bold">PB(g)</TableHead>
                <TableHead className="font-bold">FC</TableHead>
                <TableHead className="font-bold">PC(g)</TableHead>
                <TableHead className="font-bold">IC</TableHead>

                <TableHead className="font-bold">Kcal</TableHead>
                <TableHead className="font-bold">Kj</TableHead>

                <TableHead className="font-bold">Proteína(g)</TableHead>
                <TableHead className="font-bold">Lipídios(g)</TableHead>
                <TableHead className="font-bold">Carboidratos(g)</TableHead>

                <TableHead className="font-bold">Cálcio(mg)</TableHead>
                <TableHead className="font-bold">Ferro(g)</TableHead>
                <TableHead className="font-bold">Vit.A(mcg)</TableHead>
                <TableHead className="font-bold">Vit.C(mg)</TableHead>
                <TableHead className="font-bold">Sódio(g)</TableHead>
                <TableHead className="font-bold">Acões</TableHead>

              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredientsData?.map((ingredients) => (
                <TableRow key={ingredients.id}>
                
                  <TableCell className="font-medium">{ingredients.description}</TableCell>

              
                  <TableCell className="font-medium">{ingredients.legend_type}</TableCell>

              
                  <TableCell className="font-medium">{ingredients.gross_weight}</TableCell>

             
                  <TableCell className="font-medium">{ingredients.correction_factor}</TableCell>

              
                  <TableCell className="font-medium">{ingredients.cooked_weight}</TableCell>

        
                  <TableCell className="font-medium">{ingredients.cooking_index}</TableCell>

           
                  <TableCell className="font-medium">{ingredients.kcal}</TableCell>

       
                  <TableCell className="font-medium">{ingredients.kj}</TableCell>

   
                  <TableCell className="font-medium">{ingredients.protein}</TableCell>

 
                  <TableCell className="font-medium">{ingredients.lipids}</TableCell>

               
                  <TableCell className="font-medium">{ingredients.carbohydrate}</TableCell>

              
                  <TableCell className="font-medium">{ingredients.calcium}</TableCell>

           
                  <TableCell className="font-medium">{ingredients.iron}</TableCell>

                
                  <TableCell className="font-medium">{ingredients.retinol}</TableCell>

           
                  <TableCell className="font-medium">{ingredients.vitaminC}</TableCell>

        
                  <TableCell className="font-medium">{ingredients.sodium}</TableCell>

   
                  <TableCell className="font-medium text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeitem(ingredients.id || 0)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </Card>
      </div>
    </div>
  );
}

export default Ingredients;


