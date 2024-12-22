"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Trash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { informationError } from "@/components/informationError";
import { api } from "@/connect/api";
import { InputSelect } from "@/components/inputSelect";

//hooks personalizados
import { useSearch } from "@/hook/useSearch";
import { usePost } from "@/hook/usePost";
import { useRemove } from "@/hook/useRemove";

interface Stock {
  id?: number;
  state_id?: string | number;
  city_id?: string | number;
  school_id?: string | number;
  ingredient_id?: string | number;
  ingredient_name?: string;
  brand: string;
  quantity_min: number | null;
  unit_of_measure: string;
  unit_price: number | null;
  total_quantity: number | null;
  total_invested?: number;
  expiration_date: string | Date;
}

const Stock = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stock, setStock] = useState<Stock>({
    state_id: "",
    city_id: "",
    school_id: "",
    ingredient_id: "",
    brand: "",
    quantity_min: null,
    unit_of_measure: "",
    unit_price: null,
    total_quantity: null,
    expiration_date: "",
  });

  const [search, setSearch] = useState<string>();

  const {
    data: inventoryData,
    loading: inventoryLoading,
    error: inventoryError,
    setQuery: setQueryInventory,
    refetch: refetchInventory,
  } = useSearch("inventory", search);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    setQueryInventory(value);
  };

  console.log(inventoryData);

  //busca para post
  const [schoolSearch, setSchoolSearch] = useState("");
  const {
    data: searchSchool,
    loading: schoolLoading,
    error: schoolError,
    setQuery: setQuerySchool,
  } = useSearch("schools", schoolSearch);

  const [selectedSchool, setSelectedSchool] = useState(null);

  const handleSchoolSelect = (schoolId: number) => {
    const school = searchSchool?.data?.find((s) => s.id === schoolId);

    if (school) {
      setSelectedSchool(school);
      setStock({
        ...stock,
        state_id: school.state_id,
        city_id: school.city_id,
        school_id: school.id,
      });
    }
  };

  const [ingredientSearch, setIngredientSearch] = useState("");

  const {
    data: ingredientData,
    loading: ingredientLoading,
    error: ingredientError,
    setQuery: setQueryIngredient,
  } = useSearch("ingredients", ingredientSearch);

  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const handleIngredientSelect = (ingredientId: number) => {
    const ingredient = ingredientData?.data?.find((i) => i.id === ingredientId);

    if (ingredient) {
      setSelectedIngredient(ingredient);
      setStock({
        ...stock,
        ingredient_id: ingredient.id,
      });
    }
  };

  //post
  const {
    data: dataPost,
    loading: postLoading,
    error: postError,
    postData: createPost,
  } = usePost<Stock>("inventory", refetchInventory);

  console.log("stock", stock);

  const [resetSchoolInput, setResetSchoolInput] = useState(false);
  const [resetIngredientInput, setResetIngredientInput] = useState(false);

  const createStock = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const stockPayload = {
        state_id: stock.state_id,
        city_id: stock.city_id,
        school_id: stock.school_id,
        ingredient_id: stock.ingredient_id,
        brand: stock.brand,
        quantity_min: stock.quantity_min,
        unit_of_measure: stock.unit_of_measure,
        unit_price: stock.unit_price,
        total_quantity: stock.total_quantity,
        expiration_date: stock.expiration_date,
      };

      const responseData = await createPost(stockPayload);

      toast.success(responseData?.message);

      setStock({
        state_id: "",
        city_id: "",
        school_id: "",
        ingredient_id: "",
        brand: "",
        quantity_min: null,
        unit_of_measure: "",
        unit_price: null,
        total_quantity: null,
        expiration_date: "",
      });

      // Resetar os estados de seleção
      setSelectedSchool(null);
      setSelectedIngredient(null);

      // Disparar os resets para os InputSelect
      setResetSchoolInput(true);
      setResetIngredientInput(true);

      // Voltar os resets para false após um ciclo de renderização
      setTimeout(() => {
        setResetSchoolInput(false);
        setResetIngredientInput(false);
      }, 0);

      // Resetar buscas
      setSchoolSearch("");
      setIngredientSearch("");

      // Resetar preço
      setUnitPrice("");

      setIsDialogOpen(false);
    } catch (error) {
      setIsDialogOpen(true);
    }
  };

  //list and search

  //função para valor monetario
  const [unitPrice, setUnitPrice] = useState<any>(stock.unit_price || "");

  const formatMoney = (value = "0") => {
    // Remove qualquer caractere não numérico
    let formattedValue = value.replace(/\D/g, "");

    // Adiciona a vírgula como separador de decimais
    formattedValue = formattedValue.replace(/(\d)(\d{2})$/, "$1,$2");

    // Adiciona o separador de milhar
    formattedValue = formattedValue.replace(/(?=(\d{3})+(?!\d))/g, ".");

    // Adiciona o prefixo de moeda
    return `R$ ${formattedValue}`;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/\D/g, "");
    const numericValue = parseFloat(rawValue) / 100; // Convert to decimal

    setUnitPrice(rawValue);
    setStock((prevStock) => ({
      ...prevStock,
      unit_price: numericValue,
    }));
  };

  //delete
  const { data, loading, error, removeData } = useRemove(
    `inventory`,
    refetchInventory
  );
  const removeItem = async (id: number) => {
    
    await removeData(id);

    toast.success(data?.message);
  };

  console.log("stock", stock);

  return (
    <div className="flex flex-col justify-start gap-4">
      <h1 className="font-bold text-xl">Estoque</h1>
      <div className="flex justify-end">
        <ToastContainer />
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="bg-orange-500 hover:bg-orange-600 text-white hover:text-white font-bold"
            >
              + Novo item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar item no estoque</DialogTitle>
              <DialogDescription>
                Adicione um novo item ao seu estoque
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createStock}>
              <div className="flex justify-start items-center w-[300px] gap-4">
                <Label>Nome da Instituição</Label>
                <InputSelect
                  options={searchSchool?.data}
                  value={selectedSchool?.id}
                  onChange={handleSchoolSelect}
                  onSearchChange={(query) => setQuerySchool(query)}
                  placeholder="Selecione uma Instituição"
                  forceReset={resetSchoolInput}
                  field="name"
                />
              </div>
              <div className="flex w-full gap-4 mt-4 text-start">
                <div className="flex w-full flex-col gap-2">
                  <Label>Nome do ingrediente</Label>
                  <InputSelect
                    options={ingredientData?.data}
                    value={selectedIngredient?.id}
                    onChange={handleIngredientSelect}
                    onSearchChange={(query) => setQueryIngredient(query)}
                    placeholder="Selecione um ingrediente"
                    forceReset={resetIngredientInput}
                    field="description"
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Label>Nome da marca</Label>
                  <Input
                    value={stock.brand || ""}
                    onChange={(event) =>
                      setStock({ ...stock, brand: event.target.value })
                    }
                    placeholder="Marca"
                  />
                </div>
              </div>
              <div className="flex w-full gap-4 mt-4 text-start">
                <div className="flex w-full flex-col gap-2">
                  <Label>Contém na embalagem</Label>
                  <Input
                    type="number"
                    value={stock.quantity_min || ""}
                    onChange={(event) =>
                      setStock({
                        ...stock,
                        quantity_min: parseFloat(event.target.value),
                      })
                    }
                    placeholder="Quantidade"
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Label>Unidade de medida da unidade minima</Label>
                  <Select
                    value={stock.unit_of_measure}
                    onValueChange={(value) =>
                      setStock({ ...stock, unit_of_measure: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar medida" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Quilogramas (Kg)</SelectItem>
                      <SelectItem value="g">Gramas (g)</SelectItem>
                      <SelectItem value="L">Litros (L)</SelectItem>
                      <SelectItem value="ml">Mililitros (ml)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex w-full gap-4 mt-4 text-start">
                <div className="flex w-full flex-col gap-2">
                  <Label>Preço por unidade</Label>
                  <Input
                    value={formatMoney(unitPrice)}
                    onChange={handleChange}
                    placeholder="Preço da unidade mínima"
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Label>Quantidade total comprada</Label>
                  <Input
                    type="number"
                    value={stock.total_quantity || ""}
                    onChange={(event) =>
                      setStock({
                        ...stock,
                        total_quantity: parseFloat(event.target.value),
                      })
                    }
                    placeholder="Quantidade total"
                  />
                </div>
              </div>
              <div className="flex w-full gap-4 mt-4 text-start">
                <div className="flex w-full flex-col gap-2">
                  <Label>Data de validade</Label>
                  <Input
                    type="date"
                    value={
                      stock.expiration_date instanceof Date
                        ? stock.expiration_date.toISOString().split("T")[0]
                        : stock.expiration_date
                    }
                    onChange={(event) =>
                      setStock({
                        ...stock,
                        expiration_date: event.target.value,
                      })
                    }
                    placeholder="Data de validade"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button className="bg-orange-500 hover:bg-orange-600 font-bold">
                  Adicionar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-start items-center w-[300px] gap-4">
        <Search size={16} />
        <Input placeholder="Pesquisar..." onChange={handleSearchChange} />
      </div>
      <div className="flex">
        <Card className="w-full p-4">
          <Table>
            <TableCaption className="mt-10 text-gray-400">
              Lista com todos os itens cadastrados.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-bold">
                  Ingredientes
                </TableHead>
                <TableHead className="font-bold">Marca</TableHead>
                <TableHead className="font-bold">
                  Pacote ou unidade minima
                </TableHead>
                <TableHead className="font-bold">Unid. med.</TableHead>
                <TableHead className="font-bold">Preço por unidade</TableHead>
                <TableHead className="font-bold">
                  Quantidade total comprada
                </TableHead>
                <TableHead className="font-bold">
                  Total de investimento
                </TableHead>
                <TableHead className="font-bold text-center">
                  Data de validade
                </TableHead>
                <TableHead className="font-bold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData?.data?.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell>{stock.ingredient_name}</TableCell>
                  <TableCell>{stock.brand}</TableCell>
                  <TableCell>{stock.quantity_min}</TableCell>
                  <TableCell>{stock.unit_of_measure}</TableCell>
                  <TableCell>
                    R$
                    {typeof stock.unit_price === "string"
                      ? parseFloat(stock.unit_price).toFixed(2)
                      : stock?.unit_price?.toFixed(2)}
                  </TableCell>
                  <TableCell>{stock.total_quantity}</TableCell>
                  <TableCell>
                    R$
                    {typeof stock.total_invested === "string"
                      ? parseFloat(stock.total_invested).toFixed(2)
                      : stock?.total_invested?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {new Date(stock.expiration_date).toLocaleDateString(
                      "pt-BR"
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                   <Dialog>
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
                            Deseja remover o item do estoque?
                          </DialogTitle>
                          <DialogDescription>
                            Essa ação não poderá ser desfeita.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="destructive"
                             onClick={() => removeItem(stock.id || 0)}
                          >
                            Remover
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog> 
                   
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Stock;
