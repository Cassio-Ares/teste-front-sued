"use client";
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
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePost } from "@/hook/usePost";
import { useSearch } from "@/hook/useSearch";
import { Search, Trash } from "lucide-react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

// const nutritionistData = [
//   {
//     id: 1,
//     full_name: "Nutricionista 1",
//     email: "email@email",
//     phone: "51 99999-9999",
//     crn: "123456789",
//     registration_date: "01/01/2023",
//   },
// ];

const NutritionistPage = () => {
  const [inputData, setInputData] = useState({
    full_name: "",
    email: "",
    phone: "",
    crn: "",
    registration_date: "",
  });

  const [queryNutritionist, setQueryNutritionist] = useState("");

  const {
    data: nutritionistData,
    loading,
    error,
    setQuery,
    refetch: fetchData,
  } = useSearch<any>("nutritionists", queryNutritionist);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQueryNutritionist(value);
    setQuery(value);
  };

  const { postData: createPost } = usePost<any>("nutritionists");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await createPost(inputData);
      toast.success(response?.message);

      setInputData({
        full_name: "",
        email: "",
        phone: "",
        crn: "",
        registration_date: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (id: number) => {};
  return (
    <div className="flex flex-col justify-start gap-4">
      <h1 className="font-bold text-xl">Nutricionistas</h1>
      <div className="flex justify-end">
        <ToastContainer />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="bg-orange-500 hover:bg-orange-600 text-white hover:text-white font-bold">
              + Novo Nutricionista
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar nova Nutricionista</DialogTitle>
              <DialogDescription>Adicione um novo Nutricionista</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="flex justify-start items-center w-[400px] gap-4">
                <Label>Nome Completo</Label>
                <Input
                  type="text"
                  value={inputData.full_name}
                  onChange={(e) => setInputData({ ...inputData, full_name: e.target.value })}
                />
              </div>
              <div className="flex w-full gap-4 mt-4 text-start">
                <div className="flex w-full flex-col gap-2">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={inputData.email}
                    onChange={(e) => setInputData({ ...inputData, email: e.target.value })}
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Label>Telefone</Label>
                  <Input
                    type="text"
                    placeholder="51 99999-9999"
                    value={inputData.phone}
                    onChange={(e) => setInputData({ ...inputData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex w-full gap-4 mt-4 text-start">
                <div className="flex w-full flex-col gap-2">
                  <Label>CRN</Label>
                  <Input
                    type="text"
                    placeholder="Digite o CRN"
                    value={inputData.crn}
                    onChange={(e) => setInputData({ ...inputData, crn: e.target.value })}
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Label>Data de Registro</Label>
                  <Input
                    type="date"
                    placeholder="01/01/2023"
                    value={inputData.registration_date}
                    onChange={(e) => setInputData({ ...inputData, registration_date: e.target.value })}
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
      <div className="flex justify-evenly items-center">
        <div className="flex justify-start items-center w-[300px] gap-4">
          <Search size={16} />
          <Input onChange={handleSearch} placeholder="Pesquisar..." />
        </div>
      </div>
      <div className="flex">
        <Card className="w-full p-4">
          <Table>
            <TableCaption className="mt-10 text-gray-400">Lista com todos os itens cadastrados.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-bold">Nome</TableHead>
                <TableHead className="font-bold">Telefone</TableHead>
                <TableHead className="font-bold">E-mail</TableHead>
                <TableHead className="font-bold">CRN</TableHead>
                <TableHead className="font-bold">Data de Registro</TableHead>
                <TableHead className="font-bold">edit</TableHead>
                <TableHead className="font-bold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nutritionistData?.map((nutritionist) => (
                <TableRow key={nutritionist.id}>
                  <TableCell>{nutritionist.full_name}</TableCell>
                  <TableCell>{nutritionist.phone}</TableCell>
                  <TableCell>{nutritionist.email}</TableCell>
                  <TableCell>{nutritionist.crn}</TableCell>
                  <TableCell>{nutritionist.registration_date}</TableCell>
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
                          <Button variant="destructive" onClick={() => removeItem(nutritionist.id || 0)}>
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

export default NutritionistPage;

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
