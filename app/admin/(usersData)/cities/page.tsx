"use client";
import InputSelect from "@/components/inputSelect";
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

const cityData = [
  {
    id: 1,
    uf: "RS",
    name: "Mostardas",
    city_hall_phone: "55555555555",
    city_hall_email: "aihbcj@skn",
    address: "Bairro da Mostarda, 520 - Centro",
  },
];

const CitiesPage = () => {
  const [inputData, setInputData] = useState({
    state_id: 0,
    name: "",
    city_hall_phone: "",
    city_hall_email: "",
    address: "",
  });

  //buscar state
  const [stateQuery, setStateQuery] = useState("");
  const [selectedState, setSelectedState] = useState<any>(null);

  const {
    data: searchState,
    loading: stateLoading,
    error: stateError,
    setQuery: setQueryState,
  } = useSearch<any>("states", stateQuery);

  const handleStateSelect = (stateId: number) => {
    if (stateId === null) {
      setSelectedState(null);
      setInputData((inputData) => ({
        ...inputData,
        state_id: 0,
      }));

      return;
    }

    const state = searchState.find((i) => i.id === stateId);

    if (state) {
      setSelectedState(state);
      setInputData((inputData) => ({
        ...inputData,
        state_id: state.id,
      }));
    }
  };

  //receber os estado do backend
  const [query, setQuery] = useState<string>("");
  const [resetState, setResetState] = useState(false);

  const {
    data: searchCity,
    loading: cityLoading,
    error: cityError,
    setQuery: setQueryCity,
    refetch: refetchCity,
  } = useSearch<any>("cities", query);

  const { data, loading, error, postData } = usePost<any>("cities");

  const handleSubmitCity = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await postData(inputData);

      toast.success(response?.message);

      setInputData({
        state_id: 0,
        name: "",
        city_hall_phone: "",
        city_hall_email: "",
        address: "",
      });

      setSelectedState(null);
      setResetState(true);
      setTimeout(() => setResetState(false));
      setStateQuery("");
      refetchCity();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setQueryCity(value);
  };

  const removeItem = async (id: number) => {};

  return (
    <div className="flex flex-col justify-start gap-4">
      <h1 className="font-bold text-xl">Cidades</h1>
      <div className="flex justify-end">
        <ToastContainer />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="bg-orange-500 hover:bg-orange-600 text-white hover:text-white font-bold">
              + Nova Cidade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar novo Cidade</DialogTitle>
              <DialogDescription>Adicione um nova cidade</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitCity}>
              <div className="flex justify-start items-center w-[300px] gap-4">
                <Label>Nome do Estado</Label>
                <InputSelect
                  options={searchState}
                  value={selectedState?.id}
                  onChange={handleStateSelect}
                  onSearchChange={(query) => setStateQuery(query)}
                  placeholder="Selecione uma Instituição"
                  forceReset={resetState}
                  field="name"
                />
              </div>
              <Label>Nome da Cidade</Label>
              <Input
                value={inputData.name}
                placeholder="Cidade"
                onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
              />
              <Label>Telefone</Label>
              <Input
                value={inputData.city_hall_phone}
                placeholder="51 99999-9999"
                onChange={(e) => setInputData({ ...inputData, city_hall_phone: e.target.value })}
              />
              <Label>Nome da E-mail</Label>
              <Input
                value={inputData.city_hall_email}
                placeholder="e-mail"
                onChange={(e) => setInputData({ ...inputData, city_hall_email: e.target.value })}
              />
              <Label>Endereço da Prefeitura</Label>
              <Input
                value={inputData.address}
                placeholder="rua/avenida, 999 - bairro"
                onChange={(e) => setInputData({ ...inputData, address: e.target.value })}
              />
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
                <TableHead className="font-bold">Cidade</TableHead>
                {/* <TableHead className="font-bold">Estado</TableHead> */}
                <TableHead className="font-bold">Telefone</TableHead>
                <TableHead className="font-bold">E-mail</TableHead>
                <TableHead className="font-bold">Endereço da Prefeitura</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchCity?.map((city) => {
                return (
                  <TableRow key={city.id}>
                    <TableCell>{city.name}</TableCell>
                    {/* <TableCell>{city.uf}</TableCell> */}
                    <TableCell>{city.city_hall_phone}</TableCell>
                    <TableCell>{city.city_hall_email}</TableCell>
                    <TableCell>{city.address}</TableCell>
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
                            <Button variant="destructive" onClick={() => removeItem(city.id || 0)}>
                              Remover
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default CitiesPage;
