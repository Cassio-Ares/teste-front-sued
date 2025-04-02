"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React from "react";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Card } from "@/components/ui/card";
import { Eye, Search, Trash } from "lucide-react";
import Link from "next/link";

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

//hooks personalizados
import { useRemove } from "@/hook/useRemove";
import { useSearch } from "@/hook/useSearch";

interface Recipe {
  id?: number;
  name: string;
  nutricionist_name?: string;
  created_at: Date;
}

const Recipes = () => {
  const [searchRecipe, setSeachRecipe] = useState<string>("");

  const {
    data: recipesData,
    loading: recipesLoading,
    error: recipesError,
    setQuery: setQueryRecipe,
    refetch: refetchRecipe,
  } = useSearch<any>("recipes", searchRecipe);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSeachRecipe(value);
    setQueryRecipe(value);
  };

  const { data, loading, error, removeData } = useRemove("recipes", refetchRecipe);

  const removeItem = async (id: number) => {
    await removeData(id);

    toast.success(data?.message);
  };

  return (
    <div className="flex flex-col justify-start gap-4">
      <h1 className="font-bold text-xl">Receitas</h1>
      <div className="flex justify-end">
        <Link href="/admin/recipes/new">
          <Button className="bg-orange-500 hover:bg-orange-600 font-bold">+ Nova Receita</Button>
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
            <TableCaption className="mt-10 text-gray-400"></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-bold">Refeição</TableHead>
                <TableHead className="font-bold">Nutricionista</TableHead>
                <TableHead className="font-bold">Data de criação</TableHead>
                <TableHead className="text-end font-bold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipesData?.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell className="font-medium">{recipe.name}</TableCell>
                  <TableCell>{recipe?.nutricionist_name}</TableCell>
                  <TableCell>{new Date(recipe.created_at).toLocaleDateString("pt-BR")}</TableCell>
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
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                              <Eye />
                            </Button>
                          </Link>
                        )}

                        <DialogTrigger>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                            <Trash />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Deseja remover o cardápio?</DialogTitle>
                            <DialogDescription>Essa ação não poderá ser desfeita.</DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="destructive" onClick={() => removeItem(recipe.id || 0)}>
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
