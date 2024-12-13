"use client";

import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { use, useEffect, useState } from "react";
import { menu } from "../../mock/menu.mock";

import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Trash } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MenuViewDialog from "@/components/menuViewDialog";
import { api } from "@/connect/api";
import { informationError } from "@/components/informationError";
import { InputSelect } from "@/components/inputSelect";
import { Input } from "@/components/ui/input";

interface Recipe {
  id?: number;
  name: string;
  nutricionist_name?: string;
  created_at: Date
}

const Recipes = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchRecipe, setSeachRecipe] = useState<string>("");

   useEffect(() => {
    if(searchRecipe.length > 2){
      fieldData();
    }
    fieldData();
  }, [searchRecipe]);

  const fieldData = async () => {
    try {
      const response = searchRecipe.length > 2
        ? await api.get(`/recipes/search/${searchRecipe}`)
        : await api.get("/recipes");
      
      console.log('response: ', response);
      setRecipes(response.data.data);
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  };

  const removeRecipe = async (id: number) => {
    try {
      const response = await api.delete(`/recipes/${id}`);
      toast.success(response.data.data.message);
      fieldData();
    } catch (error) {
      informationError(error);
    }
  };


  return (
    <div className="flex flex-col justify-start gap-4">
      <h1 className="font-bold text-xl">Receitas</h1>
      <div className="flex justify-end">
        <Link href="/admin/recipes/new">
          <Button className="bg-orange-500 hover:bg-orange-600 font-bold">
            + Nova Receita
          </Button>
        </Link>
        <ToastContainer />
      </div>
      <div className="flex justify-start items-center w-[300px] gap-4">
        <Search size={16} />
        <Input onChange={(event) => setSeachRecipe(event.target.value)} placeholder="Pesquisar..."></Input>
      </div>
      <div className="flex mt-6">
        <Card className="w-full p-4">
          <Table>
            <TableCaption className="mt-10 text-gray-400">
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-bold">Refeição</TableHead>
                <TableHead className="font-bold">Nutricionista</TableHead>
                <TableHead className="font-bold">Data de criação</TableHead>
                <TableHead className="text-end font-bold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell className="font-medium">{recipe.name}</TableCell>
                  <TableCell>{recipe?.nutricionist_name}</TableCell>
                  <TableCell>{new Date(recipe.created_at).toLocaleDateString('pt-BR')}</TableCell>  
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                      {/* enviar recipe para visualização */}
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => recipe.id && viewRecipe(recipe.id)}
                        >
                          <Eye />
                        </Button> */}
                      
                        {recipe?.id && (
                          <Link href={`/admin/recipes/recipepage/${recipe.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <Eye />
                            </Button>
                          </Link>
                        )}
                     
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
                              Deseja remover o cardápio?
                            </DialogTitle>
                            <DialogDescription>
                              Essa ação não poderá ser desfeita.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="secondary">Fechar</Button>
                            <Button
                              variant="destructive"
                              onClick={() => recipe.id !== undefined && removeRecipe(recipe.id)}
                            >
                              Remover
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
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


export default Recipes;