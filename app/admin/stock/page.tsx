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
  gross_weight: number | null;
  total_invested?: number;
  expiration_date: string | Date;
}

const Stock = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchSchool, setSearchSchool] = useState<any[]>([]);
  const [searchIngredient, setSearchIngredient] = useState<any[]>([]);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)
  const [stockData, setStockData] = useState<Stock[]>([]);
  const [stock, setStock] = useState<Stock>({
    state_id: "",
    city_id: "",
    school_id: "",
    ingredient_id: "",
    brand: "",
    quantity_min: null,
    unit_of_measure: "",
    unit_price: null,
    gross_weight: null,
    expiration_date: "",
  });

  useEffect(() => {
   if(schoolSearch.length > 2){
     fetchDataSchool();
   } else {
     fetchDataSchool()
   }
    fetchDataSchool();
  }, [schoolSearch]);

  const fetchDataSchool = async () => {
    setLoading(true);
    setError(null);
    try {
      const response =  await api.get(`/schools/search/${schoolSearch}`)
          
      setSearchSchool(response.data.data);

      if (response.data.data.length > 0) {
        const schoolData = response?.data?.data[0];
        setStock(prevStock => ({
          ...prevStock,
          state_id: schoolData.state_id,
          city_id: schoolData.city_id,
          school_id: schoolData.id
        }));
      }
    } catch (error) {
      informationError(error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(ingredientSearch.length > 2){
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

      if (response.data.data.length > 0) {
        const ingredientData = response?.data?.data;
        setStock(prevStock => ({
          ...prevStock,
          ingredient_id: ingredientData.id
        }));
      }
    } catch (error) {
      informationError(error)
    } finally {
      setLoading(false);
    }
  }, [ingredientSearch])


  const createStock = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setLoading(true);
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
        gross_weight: stock.gross_weight,
        expiration_date: stock.expiration_date
      };
      
      const response = await api.post("/inventory", stockPayload);

     toast.success(response.data.message);
      
      setIsDialogOpen(false);
     
      setStock({
        state_id: "",
        city_id: "",
        school_id: "",
        ingredient_id: "",
        brand: "",
        quantity_min: null,
        unit_of_measure: "",
        unit_price: null,
        gross_weight: null,
        expiration_date: "",
      });
      
      fetchData();
    } catch (error) {
      console.error('error', error);
      console.log('error', error);
        informationError(error);
      } finally {
        setLoading(false);
      }
  };

  //list and search
  useEffect(() => {
    if (search.length > 2) {
      fetchData();
    } else {
      fetchData();
    }
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = search.length > 2
        ? await api.get(`/inventory/search/${search}`)
        : await api.get("/inventory");

      setStockData(response.data.data);
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  }, [search]);


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
    setStock(prevStock => ({
      ...prevStock,
      unit_price: numericValue
    }));
  };

 
  const removeItem = async (id: number) => {
    try {
      await api.delete(`/inventory/${id}`);
      fetchData();
    } catch (error) {
      informationError(error);
    }
  };

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
              <DialogDescription>
                Adicione um novo item ao seu estoque
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createStock}>
              <div className="flex justify-start items-center w-[300px] gap-4">
                <Label>Nome da escola</Label>
                <InputSelect
                  options={searchSchool}
                  value={stock.school_id}
                  onChange={(value) => setStock({ ...stock, school_id: value})}
                  onSearchChange={(searchTerm) => setSchoolSearch(searchTerm)}
                  placeholder="Selecione uma escola"
                  field="name"
                />
              </div>
              <div className="flex w-full gap-4 mt-4 text-start">
                <div className="flex w-full flex-col gap-2">
                  <Label>Nome do ingrediente</Label>
                  <InputSelect
                    options={searchIngredient}
                    value={stock.ingredient_id}
                    onChange={(value) => setStock({ ...stock, ingredient_id: value })}
                    onSearchChange={(searchTerm) => setIngredientSearch(searchTerm)}
                    placeholder="Selecione um ingrediente"
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
                    onChange={(event) => setStock({ ...stock, quantity_min: parseFloat(event.target.value) })}
                    placeholder="Quantidade"
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Label>Unidade de medida da unidade minima</Label>
                  <Select value={stock.unit_of_measure} onValueChange={(value) => setStock({ ...stock, unit_of_measure: value })}  >
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
                  <Label>Peso total comprado</Label>
                  <Input
                    type="number"
                    value={stock.gross_weight || ''}
                    onChange={(event) => setStock({ ...stock, gross_weight: parseFloat(event.target.value) })}
                    placeholder="Peso total"
                  />
                </div>
              </div>
              <div className="flex w-full gap-4 mt-4 text-start">
                <div className="flex w-full flex-col gap-2">
                  <Label>Data de validade</Label>
                  <Input
                    type="date"
                    value={stock.expiration_date instanceof Date ? stock.expiration_date.toISOString().split('T')[0] : stock.expiration_date} 
                    onChange={(event) => setStock({ ...stock, expiration_date: event.target.value })}
                    placeholder="Data de validade" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 font-bold"
                >
                  Adicionar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-start items-center w-[300px] gap-4">
        <Search size={16} />
        <Input
          placeholder="Pesquisar..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
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
                <TableHead className="font-bold">Pacote ou unidade minima</TableHead>
                <TableHead className="font-bold">Unid. med.</TableHead>
                <TableHead className="font-bold">Preço por unidade</TableHead>
                <TableHead className="font-bold">Peso total comprado</TableHead>
                <TableHead className="font-bold">Total de investimento</TableHead>
                <TableHead className="font-bold text-center">Data de validade</TableHead>
                <TableHead className="font-bold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockData.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell>{stock.ingredient_name}</TableCell>
                  <TableCell>{stock.brand}</TableCell>
                  <TableCell>{stock.quantity_min}</TableCell>
                  <TableCell>{stock.unit_of_measure}</TableCell>
                  <TableCell>
                    R${(typeof stock.unit_price === 'string' ? parseFloat(stock.unit_price).toFixed(2) : stock?.unit_price?.toFixed(2))}
                  </TableCell>
                  <TableCell>{stock.gross_weight}</TableCell>
                  <TableCell>
                    R${(typeof stock.total_invested === 'string' ? parseFloat(stock.total_invested).toFixed(2) : stock?.total_invested?.toFixed(2))}
                  </TableCell>
                  <TableCell> {new Date(stock.expiration_date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="font-medium text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeItem(stock.id || 0)}
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
};

export default Stock;
