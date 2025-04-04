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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//hooks personalizados
import { Textarea } from "@/components/ui/textarea";
import { usePost } from "@/hook/usePost";
import { useSearch } from "@/hook/useSearch";
import { useSearchPlusSchool } from "@/hook/useSearchPlusSchool";

//types
// import { SchoolTypes, SchoolBasictypes } from "../../../lib/@types/school.types";
// import { StockTypes } from "../../../lib/@types/stock.types";
// import { IngredientTypes } from "../../../lib/@types/ingredient.types";

const Stock = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [stock, setStock] = useState<any>({
    state_id: "",
    city_id: "",
    school_id: "",
    ingredient_id: "",
    brand: "",
    quantity_min: null,
    packaging: "",
    unit_of_measure: "",
    unit_price: null,
    total_quantity: null,
    expiration_date: "",
    movement_type: "",
    observation: "", //optional
  });

  const [search, setSearch] = useState<string>();

  //busca para post
  const [schoolSearch, setSchoolSearch] = useState<string>("");

  const {
    data: searchSchool,
    loading: schoolLoading,
    error: schoolError,
    setQuery: setQuerySchool,
  } = useSearch<any>("schools", schoolSearch);

  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  const handleSchoolSelect = (schoolId: number | null) => {
    if (schoolId === null) {
      setSelectedSchool(null);
      setStock({
        ...stock,
        state_id: "",
        city_id: "",
        school_id: "",
      });
      return;
    }

    const school = searchSchool?.find((s) => s.id === schoolId);
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

  const [ingredientSearch, setIngredientSearch] = useState<string>("");

  const {
    data: ingredientData,
    loading: ingredientLoading,
    error: ingredientError,
    setQuery: setQueryIngredient,
  } = useSearch<any>("ingredients", ingredientSearch);

  const [selectedIngredient, setSelectedIngredient] = useState<any>(null);

  const handleIngredientSelect = (ingredientId: number | null) => {
    if (ingredientId === null) {
      setSelectedIngredient(null);
      setStock({
        ...stock,
        ingredient_id: "",
      });
      return;
    }

    const ingredient = ingredientData?.find((i) => i.id === ingredientId);

    if (ingredient) {
      setSelectedIngredient(ingredient);
      setStock({
        ...stock,
        ingredient_id: ingredient.id,
      });
    }
  };

  const {
    data: inventoryData,
    loading: inventoryLoading,
    error: inventoryError,
    setQuery: setQueryInventory,
    refetch: refetchInventory,
  } = useSearchPlusSchool<any>("inventory", search, {
    school_id: selectedSchool?.id,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    setQueryInventory(value);
  };

  //post
  const {
    data: dataPost,
    loading: postLoading,
    error: postError,
    postData: createPost,
  } = usePost<any>("inventory", refetchInventory);

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
        packaging: stock.packaging,
        unit_of_measure: stock.unit_of_measure,
        unit_price: stock.unit_price,
        total_quantity: stock.total_quantity,
        expiration_date: stock.expiration_date,
        movement_type: "INPUT",
        observation: stock.observation,
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
        packaging: "",
        unit_of_measure: "",
        unit_price: null,
        total_quantity: null,
        expiration_date: "",
        movement_type: "",
        observation: "",
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
  // const { data, loading, error, removeData } = useRemove(`inventory`, refetchInventory);
  // const removeItem = async (id: number) => {
  //   await removeData(id);

  //   toast.success(data?.message);
  // };

  return (
    <div className="flex flex-col justify-start gap-4">
      <h1 className="font-bold text-xl">Estoque</h1>
      <div className="flex justify-end">
        <ToastContainer />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="bg-orange-500 hover:bg-orange-600 text-white hover:text-white font-bold">
              + Novo item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar item no estoque</DialogTitle>
              <DialogDescription>Adicione um novo item ao seu estoque</DialogDescription>
            </DialogHeader>
            <form onSubmit={createStock}>
              <div className="flex justify-start items-center w-[300px] gap-4">
                <Label>Nome da Instituição</Label>
                <InputSelect
                  options={searchSchool}
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
                  <Label>Nome da marca</Label>
                  <Input
                    value={stock.brand || ""}
                    onChange={(event) => setStock({ ...stock, brand: event.target.value })}
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
                  <Label>Tipo de embalagem</Label>
                  <Select value={stock.packaging} onValueChange={(value) => setStock({ ...stock, packaging: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar medida" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="caixa">Caixa</SelectItem>
                      <SelectItem value="saco">Saco</SelectItem>
                      <SelectItem value="bandeija">Bandeija</SelectItem>
                      <SelectItem value="pacote">Pacote</SelectItem>
                      <SelectItem value="pote">Pote</SelectItem>
                      <SelectItem value="galão">Galão</SelectItem>
                      <SelectItem value="unit">Unidade (sem embalagem)</SelectItem>
                      <SelectItem value="embalagem da marca com produto citado">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex w-full gap-4 mt-4 text-start">
                <div className="flex w-full flex-col gap-2">
                  <Label>Unidade de medida da unidade minima</Label>
                  <Select
                    value={stock.unit_of_measure}
                    onValueChange={(value) => setStock({ ...stock, unit_of_measure: value })}
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
                <div className="flex w-full flex-col gap-2">
                  <Label>Preço por unidade</Label>
                  <Input value={formatMoney(unitPrice)} onChange={handleChange} placeholder="Preço da unidade mínima" />
                </div>
              </div>
              <div className="flex w-full gap-4 mt-4 text-start">
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
              <div className="flex w-full gap-4 mt-4 text-start">
                <div className="flex w-full flex-col gap-2">
                  <Label className="text-base mb-2 font-semibold">Observações</Label>
                  <Card className="p-4">
                    <Textarea
                      value={stock.observation || ""}
                      onChange={(e) =>
                        setStock({
                          ...stock,
                          observation: e.target.value,
                        })
                      }
                      className="w-full"
                      rows={6}
                      placeholder="obs ...."
                    />
                  </Card>
                </div>
              </div>
              <DialogFooter>
                <Button className="bg-orange-500 hover:bg-orange-600 font-bold">Adicionar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-evenly items-center">
        <div className="flex justify-start items-center w-[300px] gap-4">
          <Label>Nome da Instituição</Label>
          <InputSelect
            options={searchSchool}
            value={selectedSchool?.id}
            onChange={handleSchoolSelect}
            onSearchChange={(query) => setQuerySchool(query)}
            placeholder="Selecione uma Instituição"
            forceReset={resetSchoolInput}
            field="name"
          />
        </div>
        <div className="flex justify-start items-center w-[300px] gap-4">
          <Search size={16} />
          <Input placeholder="Pesquisar..." onChange={handleSearchChange} />
        </div>
      </div>
      <div className="flex">
        <Card className="w-full p-4">
          <Table>
            <TableCaption className="mt-10 text-gray-400">Lista com todos os itens cadastrados.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-bold">Ingredientes</TableHead>
                <TableHead className="font-bold">Marca</TableHead>
                <TableHead className="font-bold">Pacote ou unidade minima</TableHead>
                <TableHead className="font-bold">Unid. med.</TableHead>
                <TableHead className="font-bold">Preço por unidade</TableHead>
                <TableHead className="font-bold">Quantidade total comprada</TableHead>
                <TableHead className="font-bold">Total de investimento</TableHead>
                <TableHead className="font-bold text-center">Data de validade</TableHead>
                {/* <TableHead className="font-bold text-center">Ações</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData?.map((stock) => (
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
                  <TableCell> {new Date(stock.expiration_date).toLocaleDateString("pt-BR")}</TableCell>
                  {/* <TableCell className="font-medium text-center">
                    <Dialog>
                      <DialogTrigger>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Deseja remover o item do estoque?</DialogTitle>
                          <DialogDescription>Essa ação não poderá ser desfeita.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="destructive" onClick={() => removeItem(stock.id || 0)}>
                            Remover
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell> */}
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
