"use client";

import { userTypeData } from "@/app/mock/userType.mock";
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
import { formatValue } from "@/lib/utils/formatValue";
import { Search, Trash } from "lucide-react";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

// const userData = [
//   {
//     id: 1,
//     name: "Nutricionista 1",
//     email: "email@email",
//     phone: "51 99999-9999",
//     user_type: "123456789", //['adm', 'state', 'city', 'school', 'nutri']
//     state_id: null,
//     city_id: "123456789",
//     school_id: "123456789",
//   },
// ];
//"adm", "state", "city", "school", "nutri"

const statesData = [
  {
    id: 1,
    name: "Estados",
    uf: "Es",
    state_hall_phone: "55555555555",
    state_hall_email: "state@email",
  },
];
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
const schoolData = [
  {
    id: 1,
    uf: "RS",
    city: "Mostardas",
    name: "nome da escola da mostarda",
    total_students_morning: 0,
    teaching_modality_morning: "Presencial",
    total_students_afternoon: 0,
    teaching_modality_afternoon: "Presencial",
    total_students_nigth: 0,
    teaching_modality_nigth: "Presencial",
    total_students_integral: 0,
    teaching_modality_integral: "Presencial",
    phone: "51 99999-9999",
    email: "email@email",
    address: "Rua da Mostarda, 520 - Centro",
  },
];

const RegisterUserPage = () => {
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    phone: "",
    user_type: "",
    state_id: null as number | null,
    city_id: null as number | null,
    school_id: null as number | null,
  });

  //user_type
  const [seachQueryType, setSearchQueryType] = useState("");
  const [selectedUserType, setSelectedUserType] = useState<any>(null);

  const handleUserTypeSelect = (selectedId: number) => {
    if (selectedId === null) {
      setSelectedUserType(null);
      setInputData({
        ...inputData,
        user_type: selectedUserType.user_type,
      });
      return;
    }
    const userType = userTypeData.find((item) => item.id === selectedId);

    if (userType) {
      setSelectedUserType(userType);
      setInputData({
        ...inputData,
        user_type: userType.user_type,
      });
    }
  };

  //state
  //buscar useState
  const [stateQuery, setStateQuery] = useState("");
  const [selectState, setSelectState] = useState<any>(null);
  const {
    data: stateData,
    error: stateError,
    loading: stateLoading,
    setQuery: setQueryState,
  } = useSearch<any>("states", stateQuery);

  const handleState = (stateId: number) => {
    if (stateId === null) {
      setSelectState(null);
      setInputData((inputData) => ({
        ...inputData,
        state_id: 0,
      }));

      return null;
    }

    const state = stateData.find((i) => i.id === stateId);
    if (state) {
      setSelectState(state);
      setInputData((inputData) => ({
        ...inputData,
        state_id: state.id,
      }));
    }
  };

  //buscar city
  const [cityQuery, setCityQuery] = useState("");
  const [selectCity, setSelectCity] = useState<any>(null);
  const { data: cityData, error: cityError, loading: cityLoading, setQuery: setQueryCity } = useSearch<any>("cities");

  const handleCity = (cityId: number) => {
    if (cityId === null) {
      setSelectCity(null);
      setInputData((inputData) => ({
        ...inputData,
        city_id: 0,
      }));

      return null;
    }

    const city = cityData.find((i) => i.id === cityId);

    console.log(city);

    if (city) {
      setSelectCity(city);
      setInputData((inputData) => ({
        ...inputData,
        state_id: city.state_id,
        city_id: city.id,
      }));
    }
  };

  //school
  const [schoolSearch, setSchoolSearch] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  const {
    data: searchSchool,
    loading: schoolLoading,
    error: schoolError,
    setQuery: setQuerySchool,
  } = useSearch<any>("schools", schoolSearch);

  const handleSchoolSelect = (schoolId: number | null) => {
    if (schoolId === null) {
      setSelectedSchool(null);
      setInputData({
        ...inputData,
        school_id: 0,
      });
      return;
    }

    const school = searchSchool?.find((s) => s.id === schoolId);
    if (school) {
      setSelectedSchool(school);
      setInputData({
        ...inputData,
        state_id: school.state_id,
        city_id: school.city_id,
        school_id: school.id,
      });
    }
  };

  const { postData } = usePost<any>("users");
  const handleSubmit = async (event: React.FocusEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await postData(inputData);
      toast.success(response?.message);

      setInputData({
        name: "",
        email: "",
        phone: "",
        user_type: "",
        state_id: null as number | null,
        city_id: null as number | null,
        school_id: null as number | null,
      });
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  //users

  const [searchUser, setSearchUser] = useState("");
  const { data: userData, data, error, loading, setQuery, refetch } = useSearch<any>("users");

  const handleUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchUser(value);
    setQuery(value);
  };

  return (
    <div className="flex flex-col justify-start gap-4">
      <h1 className="font-bold text-xl">Usuarios</h1>
      <div className="flex justify-end">
        <ToastContainer />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="bg-orange-500 hover:bg-orange-600 text-white hover:text-white font-bold">
              + Novo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar novo Usuario</DialogTitle>
              <DialogDescription>Adicione um novo usuario</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="flex justify-start items-center w-[400px] gap-4">
                <Label>Nome Completo</Label>
                <Input
                  type="text"
                  value={inputData.name}
                  onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
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
                <div className="flex flex-col justify-start mb-2 w-1/2 gap-4">
                  <Label>Tipo de usuario</Label>
                  <InputSelect
                    options={userTypeData}
                    value={selectedUserType}
                    onChange={handleUserTypeSelect}
                    onSearchChange={setSearchQueryType}
                    placeholder="Selecione um tipo de usuário"
                    field="value"
                  />
                </div>
                <div className="flex flex-col justify-start mb-2 w-1/2 gap-4">
                  <Label>Estado</Label>
                  <InputSelect
                    options={stateData}
                    value={selectState?.id}
                    onChange={handleState}
                    onSearchChange={(query) => setStateQuery(query)}
                    placeholder="Selecione o estado"
                    field="name"
                    disabled={inputData.user_type !== "state" ? true : false}
                  />
                </div>
              </div>
              <div className="flex w-full gap-4 mt-4 text-start">
                <div className="flex flex-col justify-start mb-2 w-1/2 gap-4">
                  <Label>Municipio / Cidade</Label>
                  <InputSelect
                    options={cityData}
                    value={selectCity?.id}
                    onChange={handleCity}
                    onSearchChange={setCityQuery}
                    placeholder="Selecione o municipio / cidade"
                    field="name"
                    disabled={inputData.user_type !== "city" ? true : false}
                  />
                </div>
                <div className="flex flex-col justify-start mb-2 w-1/2 gap-4">
                  <Label>Instituição</Label>
                  <InputSelect
                    options={searchSchool}
                    value={selectedSchool?.id}
                    onChange={handleSchoolSelect}
                    onSearchChange={setSchoolSearch}
                    placeholder="Selecione um tipo de usuário"
                    field="name"
                    disabled={inputData.user_type !== "school" ? true : false}
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
          <Input onChange={handleUser} placeholder="Pesquisar..." />
        </div>
      </div>
      <div className="flex">
        <Card className="w-full p-4">
          <Table>
            <TableCaption className="mt-10 text-gray-400">Lista com todos os itens cadastrados.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-bold">Nome</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Telefone</TableHead>
                <TableHead className="font-bold">Tipo</TableHead>
                <TableHead className="font-bold">Estado</TableHead>
                <TableHead className="font-bold">Cidade</TableHead>
                <TableHead className="font-bold">Instituição</TableHead>
                <TableHead className="font-bold text-center"></TableHead>
                <TableHead className="font-bold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.user_type}</TableCell>
                  <TableCell>{formatValue(user.state_id)}</TableCell>
                  <TableCell>{formatValue(user.city_id)}</TableCell>
                  <TableCell>{formatValue(user.school_id)}</TableCell>
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
                          {/* <Button variant="destructive" onClick={() => removeItem(stock.id || 0)}>
                          Remover
                        </Button> */}
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

export default RegisterUserPage;

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
