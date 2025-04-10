"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React from "react";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Search } from "lucide-react";

//hooks personalizados
import { useGetById } from "@/hook/useGetById";
import { usePost } from "@/hook/usePost";
import { useSearch } from "@/hook/useSearch";
import { useUpdate } from "@/hook/useUpdate";

//formatValue
import { formatValue } from "../../../lib/utils/formatValue";

//types
import { IngredientTypes } from "../../../lib/@types/ingredient.types";

// type SearchDataType = {
//   data: IngredientTypes[];
// };

const Ingredients = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newIngredient, setNewIngredient] = useState<Partial<IngredientTypes>>({
    description: "",
    gross_weight: 100,
    correction_factor: null,
    cooking_index: null,
    kcal: null,
    protein: null,
    lipids: null,
    carbohydrate: null,
    calcium: null,
    iron: null,
    retinol: null,
    vitaminC: null,
    sodium: null,
  });
  const [ingredientsData, setIngredientsData] = useState<IngredientTypes[]>([]);
  const [search, setSearch] = useState<string>();

  //get
  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
    setQuery,
    refetch,
  } = useSearch<any>("ingredients", search);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    setQuery(value);
  };

  //post
  const {
    data: dataPost,
    loading: postLoading,
    error: postError,
    postData: createPost,
  } = usePost<any>("ingredients", refetch);
  const handleCreateIngredient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const responseData = await createPost(newIngredient);

      toast.success(responseData?.message);

      setNewIngredient({
        description: "",
        gross_weight: 100,
        correction_factor: null,
        cooking_index: null,
        kcal: null,
        protein: null,
        lipids: null,
        carbohydrate: null,
        calcium: null,
        iron: null,
        retinol: null,
        vitaminC: null,
        sodium: null,
      });

      setIsOpen(false);
    } catch (error) {
      setIsOpen(true);
    }
  };

  //get by id
  const {
    data: ingredientIdData,
    loading: ingredientIdLoading,
    error: ingredientIdError,
    fetchData: ingredientIdFetch,
  } = useGetById<any>("ingredients");

  const [editingIngredient, setEditingIngredient] = useState<any>({
    id: 0,
    description: "",
    legend_type: "",
    gross_weight: 100,
    correction_factor: null,
    cooking_index: null,
    kcal: null,
    protein: null,
    lipids: null,
    carbohydrate: null,
    calcium: null,
    iron: null,
    retinol: null,
    vitaminC: null,
    sodium: null,
  });

  const selectedIngredientIdHandler = (id: number) => {
    ingredientIdFetch(id);
    setIsEditOpen(true);
  };

  useEffect(() => {
    if (ingredientIdData && ingredientIdData[0]) {
      setEditingIngredient({
        id: ingredientIdData[0].id,
        description: ingredientIdData[0].description,
        legend_type: ingredientIdData[0].legend_type,
        gross_weight: ingredientIdData[0].gross_weight,
        correction_factor: ingredientIdData[0].correction_factor,
        cooking_index: ingredientIdData[0].cooking_index,
        kcal: ingredientIdData[0].kcal,
        protein: ingredientIdData[0].protein,
        lipids: ingredientIdData[0].lipids,
        carbohydrate: ingredientIdData[0].carbohydrate,
        calcium: ingredientIdData[0].calcium,
        iron: ingredientIdData[0].iron,
        retinol: ingredientIdData[0].retinol,
        vitaminC: ingredientIdData[0].vitaminC,
        sodium: ingredientIdData[0].sodium,
      });
    }
  }, [ingredientIdData]);

  //update ingredient

  const {
    data: dataUpdate,
    loading: updateLoading,
    error: updateError,
    upDate: updateIngredientPost,
  } = useUpdate<any>("ingredients", refetch);

  const handleUpdateIngredient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // console.log("editingIngredient", editingIngredient);
      // console.log("editingIngredient.id", editingIngredient.id);
      // console.log("url", `/ingredients/${editingIngredient.id}`);

      const responseData = await updateIngredientPost(editingIngredient?.id ?? 0, editingIngredient);

      toast.success(responseData?.message);

      setEditingIngredient({
        id: 0,
        description: "",
        legend_type: "",
        gross_weight: 100,
        correction_factor: null,
        cooking_index: null,
        kcal: null,
        protein: null,
        lipids: null,
        carbohydrate: null,
        calcium: null,
        iron: null,
        retinol: null,
        vitaminC: null,
        sodium: null,
      });

      setIsEditOpen(false);
    } catch (error) {
      console.log("error", error);
      setIsEditOpen(true);
    }
  };

  //delete não esta visivel no front mudei regra de negocio
  // const { data, loading, error, removeData } = useRemove(
  //   "ingredients",
  //   refetch
  // );

  // const removeitem = async (id: number) => {
  //   await removeData(id);

  //   toast.success(data?.message);
  // };

  return (
    <div className="flex flex-col justify-start gap-4 ">
      <h1 className="font-bold text-xl">Ingredientes </h1>
      <div className="flex justify-end">
        {/* <Link href="/admin/menus/new"> */}
        <Button className="bg-orange-500 hover:bg-orange-600 font-bold" onClick={() => setIsOpen(true)}>
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
                          legend_type: value,
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
                          Limitada para `&gt;` 3 anos e proibida para ≤ 3 anos
                        </SelectItem>
                        <SelectItem value="Aquisição proibida">Aquisição proibida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Peso bruto(g)</Label>
                    <Input name="gross_weight" type="number" value={newIngredient.gross_weight} disabled />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Fator de Correção </Label>
                    <Input
                      name="correction_factor"
                      type="number"
                      value={newIngredient.correction_factor ?? undefined}
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
                    <Label>Índice de Cocção</Label>
                    <Input
                      name="cooking_index"
                      type="number"
                      value={newIngredient.cooking_index ?? undefined}
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
                    {/* <Input
                      name="kcal"
                      type="number"
                      value={newIngredient.kcal ?? undefined}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          kcal: parseFloat(event.target.value),
                        });
                      }}
                      placeholder="Digite o kcal"
                    /> */}
                    <Input
                      name="kcal"
                      type="number"
                      value={newIngredient.kcal ?? undefined} // Asegura que o valor seja 0 se for null ou undefined
                      onChange={(event) => {
                        const value = event.target.value;
                        setNewIngredient({
                          ...newIngredient,
                          kcal: value === "" ? 0 : parseFloat(value), // Quando o campo estiver vazio, o valor será 0
                        });
                      }}
                      placeholder="Digite o kcal"
                    />
                  </div>
                  {/* <div className="flex flex-col gap-2">
                    <Label>Kj</Label>
                    <Input
                      name="kj"
                      type="number"
                      value={newIngredient.kj || null}
                      onChange={(event) => {
                        setNewIngredient({
                          ...newIngredient,
                          kj: parseFloat(event.target.value),
                        });
                      }}
                      placeholder="Digite o kj"
                    />
                  </div> */}
                  <div className="flex flex-col gap-2">
                    <Label>Proteínas</Label>
                    <Input
                      name="protein"
                      type="number"
                      value={newIngredient.protein ?? undefined}
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
                      value={newIngredient.lipids ?? undefined}
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
                      value={newIngredient.carbohydrate ?? undefined}
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
                      value={newIngredient.calcium ?? undefined}
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
                      value={newIngredient.iron ?? undefined}
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
                      value={newIngredient.retinol ?? undefined}
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
                      value={newIngredient.vitaminC ?? undefined}
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
                      value={newIngredient.sodium ?? undefined}
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
                <Button className="bg-orange-500 hover:bg-orange-600 font-bold">Salvar Ingrediente</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-start items-center w-[300px] gap-4">
        <Search size={16} />
        <Input onChange={handleSearchChange} placeholder="Pesquisar..."></Input>
      </div>
      <div className="flex">
        <Card className="w-full p-4">
          <Table>
            <TableCaption className="mt-10 text-gray-400">Lista com todas os ingredientes cadastrados.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Descrição</TableHead>
                <TableHead className="font-bold">Legenda</TableHead>

                <TableHead className="font-bold">PB(g)</TableHead>
                <TableHead className="font-bold">FC</TableHead>
                <TableHead className="font-bold">IC</TableHead>

                <TableHead className="font-bold">Kcal</TableHead>
                <TableHead className="font-bold">Kj</TableHead>

                <TableHead className="font-bold">Proteína(g)</TableHead>
                <TableHead className="font-bold">Lipídios(g)</TableHead>
                <TableHead className="font-bold">Carboidratos(g)</TableHead>

                <TableHead className="font-bold">Cálcio(mg)</TableHead>
                <TableHead className="font-bold">Ferro(g)</TableHead>
                <TableHead className="font-bold">Retinol (Vit.A) (mcg)</TableHead>
                <TableHead className="font-bold">Vit.C(mg)</TableHead>
                <TableHead className="font-bold">Sódio(g)</TableHead>
                <TableHead className="font-bold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchData &&
                searchData.map((ingredients) => (
                  <TableRow key={ingredients.id}>
                    <TableCell className="font-medium">{ingredients.description}</TableCell>

                    <TableCell className="font-medium">{formatValue(ingredients.legend_type)}</TableCell>

                    <TableCell className="font-medium">{formatValue(ingredients.gross_weight)}</TableCell>

                    <TableCell className="font-medium">{formatValue(ingredients.correction_factor)}</TableCell>

                    <TableCell className="font-medium">{formatValue(ingredients.cooking_index)}</TableCell>

                    <TableCell className="font-medium text-center">{formatValue(ingredients.kcal)}</TableCell>

                    <TableCell className="font-medium text-center">{formatValue(ingredients.kj)}</TableCell>

                    <TableCell className="font-medium text-center">{formatValue(ingredients.protein)}</TableCell>

                    <TableCell className="font-medium text-center">{formatValue(ingredients.lipids)}</TableCell>

                    <TableCell className="font-medium text-center">{formatValue(ingredients.carbohydrate)}</TableCell>

                    <TableCell className="font-medium text-center">{formatValue(ingredients.calcium)}</TableCell>

                    <TableCell className="font-medium text-center">{formatValue(ingredients.iron)}</TableCell>

                    <TableCell className="font-medium text-center">{formatValue(ingredients.retinol)}</TableCell>

                    <TableCell className="font-medium text-center">{formatValue(ingredients.vitaminC)}</TableCell>

                    <TableCell className="font-medium text-center">{formatValue(ingredients.sodium)}</TableCell>

                    <TableCell className="font-medium text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-black"
                        onClick={() => selectedIngredientIdHandler(ingredients.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {/* <Dialog>
                      <DialogTrigger>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Deseja remover o ingrediente?
                          </DialogTitle>
                          <DialogDescription>
                            Essa ação não poderá ser desfeita.
                            E irá apagar o ingrediente de todos os Estoques onde esta cadastrado.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="destructive"
                            onClick={() => removeitem(ingredients.id || 0)}
                          >
                            Remover
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog> */}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
        <>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleUpdateIngredient}>
                <DialogHeader>
                  <DialogTitle>Atualizar dados do Ingrediente</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Nome do Ingrediente</Label>
                      <Input
                        name="name"
                        value={editingIngredient.description}
                        onChange={(event) => {
                          setEditingIngredient({
                            ...editingIngredient,
                            description: event.target.value,
                          });
                        }}
                        placeholder="Digite o nome do ingrediente"
                        disabled
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Legenda (CD/FNDE nº 06/2020)</Label>
                      <Select
                        value={editingIngredient.legend_type || ""}
                        onValueChange={(value) => {
                          setEditingIngredient({
                            ...editingIngredient,
                            legend_type: value,
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
                            Limitada para `&gt;` 3 anos e proibida para ≤ 3 anos
                          </SelectItem>
                          <SelectItem value="Aquisição proibida">Aquisição proibida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Peso bruto(g)</Label>
                      <Input name="gross_weight" type="number" value={editingIngredient.gross_weight} disabled />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Fator de Correção </Label>
                      <Input
                        name="correction_factor"
                        type="number"
                        value={editingIngredient.correction_factor ?? undefined}
                        onChange={(event) => {
                          setEditingIngredient({
                            ...editingIngredient,
                            correction_factor: parseFloat(event.target.value),
                          });
                        }}
                        placeholder="Digite o fator de correção"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Índice de Cocção</Label>
                      <Input
                        name="cooking_index"
                        type="number"
                        value={editingIngredient.cooking_index ?? undefined}
                        onChange={(event) => {
                          setEditingIngredient({
                            ...editingIngredient,
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
                        value={editingIngredient.kcal ?? undefined}
                        onChange={(event) => {
                          const value = event.target.value;
                          setEditingIngredient({
                            ...editingIngredient,
                            kcal: value === "" ? 0 : parseFloat(value),
                          });
                        }}
                        placeholder="Digite o kcal"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Proteínas</Label>
                      <Input
                        name="protein"
                        type="number"
                        value={editingIngredient.protein ?? undefined}
                        onChange={(event) => {
                          setEditingIngredient({
                            ...editingIngredient,
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
                        value={editingIngredient.lipids ?? undefined}
                        onChange={(event) => {
                          setEditingIngredient({
                            ...editingIngredient,
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
                        value={editingIngredient.carbohydrate ?? undefined}
                        onChange={(event) => {
                          setEditingIngredient({
                            ...editingIngredient,
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
                        value={editingIngredient.calcium ?? undefined}
                        onChange={(event) => {
                          setEditingIngredient({
                            ...editingIngredient,
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
                        value={editingIngredient.iron ?? undefined}
                        onChange={(event) => {
                          setEditingIngredient({
                            ...editingIngredient,
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
                        value={editingIngredient.retinol ?? undefined}
                        onChange={(event) => {
                          setEditingIngredient({
                            ...editingIngredient,
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
                        value={editingIngredient.vitaminC ?? undefined}
                        onChange={(event) => {
                          setEditingIngredient({
                            ...editingIngredient,
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
                        value={editingIngredient.sodium ?? undefined}
                        onChange={(event) => {
                          setEditingIngredient({
                            ...editingIngredient,
                            sodium: parseFloat(event.target.value),
                          });
                        }}
                        placeholder="Digite o sódio"
                      />
                    </div>
                  </div>
                </DialogDescription>

                <DialogFooter>
                  <Button className="bg-orange-500 hover:bg-orange-600 font-bold">Atualizar Ingrediente</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </>
      </div>
    </div>
  );
};

export default Ingredients;
