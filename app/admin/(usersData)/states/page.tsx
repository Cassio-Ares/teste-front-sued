"use client";
import { states } from "@/app/mock/StateMock";
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
import { Search, Trash } from "lucide-react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

const dataState = [
  {
    id: 1,
    name: "Estados",
    uf: "Es",
    state_hall_phone: "55555555555",
    state_hall_email: "state@email",
  },
];

const StatePage = () => {
  const [stateData, setStateData] = useState({ name: "", uf: "" });
  const [inputData, setInputData] = useState({
    name: stateData.name,
    uf: stateData.uf,
    state_hall_phone: "",
    state_hall_email: "",
  });

  const handleStateOnChange = () => {
    const selectedState = states.find((state) => state.name === state.name && state.uf === state.uf);
    if (selectedState) {
      setStateData(selectedState);
    }
  };

  const handleSubmitState = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //logica com backend
  };

  const removeItem = async (id: number) => {};

  return (
    <div className="flex flex-col justify-start gap-4">
      <h1 className="font-bold text-xl">Estados</h1>
      <div className="flex justify-end">
        <ToastContainer />
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="bg-orange-500 hover:bg-orange-600 text-white hover:text-white font-bold"
              >
                + Novo Estado
              </Button>
            </DialogTrigger>
            <DialogContent className="mt-[-100px]">
              <DialogHeader>
                <DialogTitle>Cadastrar novo Estado</DialogTitle>
                <DialogDescription>Adicione um novo Estado</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitState}>
                <div className="flex justify-start items-center w-[300px] gap-4">
                  <Label>Nome do Estado</Label>
                  <Select value={stateData.uf} onValueChange={handleStateOnChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => {
                        return <SelectItem value={state.uf}>{state.name}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-full gap-4 mt-4 text-start">
                  <div className="flex w-full flex-col gap-2">
                    <Label>E-mail</Label>
                    <Input
                      type="email"
                      value={inputData.state_hall_email}
                      onChange={(e) => setInputData({ ...inputData, state_hall_email: e.target.value })}
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <Label>Telefone</Label>
                    <Input
                      type="text"
                      placeholder="51 99999-9999"
                      value={inputData.state_hall_phone}
                      onChange={(e) => setInputData({ ...inputData, state_hall_phone: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button className="bg-orange-500 hover:bg-orange-600 font-bold">Adicionar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex justify-evenly items-center">
        <div className="flex justify-start items-center w-[300px] gap-4">
          <Search size={16} />
          <Input placeholder="Pesquisar..." />
        </div>
      </div>
      <div className="flex">
        <Card className="w-full p-4">
          <Table>
            <TableCaption className="mt-10 text-gray-400">Lista com todos os Estados cadastrados.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-bold">Nome</TableHead>
                <TableHead className="font-bold">Sigla</TableHead>
                <TableHead className="font-bold">Telefone</TableHead>
                <TableHead className="font-bold">E-mail.</TableHead>
                <TableHead className="font-bold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataState?.map((state) => (
                <TableRow key={state.id}>
                  <TableCell>{state.name}</TableCell>
                  <TableCell>{state.uf}</TableCell>
                  <TableCell>{state.state_hall_phone}</TableCell>
                  <TableCell>{state.state_hall_email}</TableCell>
                  <TableCell className="font-medium text-center">
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
                          <Button variant="destructive" onClick={() => removeItem(state?.id || 0)}>
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

export default StatePage;

/**
 * const StatePage = () => {
  return (
    <div className="flex flex-col justify-start gap-4">
      <h1 className="font-bold text-xl">Estados</h1>
      <div className="flex justify-end"></div>
    </div>
  );
};

export default StatePage;

 */
