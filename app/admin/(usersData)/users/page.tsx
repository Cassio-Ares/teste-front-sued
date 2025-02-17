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
import { Search, Trash } from "lucide-react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

const userData = [
  {
    id: 1,
    name: "Nutricionista 1",
    email: "email@email",
    phone: "51 99999-9999",
    user_type: "123456789", //['adm', 'state', 'city', 'school', 'nutri']
    state_id: "123456789",
    city_id: "123456789",
    school_id: "123456789",
  },
];
//"adm", "state", "city", "school", "nutri"
interface UserData {
  id: number;
  value: string;
  user_type: string;
}
const userTypeData: UserData[] = [
  {
    id: 1,
    value: "Administrador",
    user_type: "adm",
  },
  {
    id: 2,
    value: "Nutricionista",
    user_type: "nutri",
  },
  {
    id: 3,
    value: "Estado",
    user_type: "state",
  },
  {
    id: 4,
    value: "Municipio/ Cidade",
    user_type: "city",
  },
  {
    id: 5,
    value: "Instituição",
    user_type: "school",
  },
];

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

const StatePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    user_type: "",
    state_id: "",
    city_id: "",
    school_id: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  //user_type
  const [selectedUserType, setSelectedUserType] = useState<UserData | null>(null);

  const handleUserTypeSelect = (selectedId: number) => {
    const userType = userTypeData.find((item) => item.id === selectedId);
    setSelectedUserType(userType || null);
  };

  //state
  const [selectedState, setSelectedState] = useState<any | null>(null);
  const handleState = (stateId: number) => {
    const state = statesData.find((item) => item.id === stateId);
    setSelectedState(state || null);
  };

  //city

  //school
  //  const [schoolSearch, setSchoolSearch] = useState<string>("");

  //   const {
  //     data: searchSchool,
  //     loading: schoolLoading,
  //     error: schoolError,
  //     setQuery: setQuerySchool,
  //   } = useSearch<any>("schools", schoolSearch);

  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  console.log("selectedSchool", selectedSchool?.id);

  // const handleSchoolSelect = (schoolId: number | null) => {
  //   if (schoolId === null) {
  //     setSelectedSchool(null);
  //     setStock({
  //       ...stock,
  //       state_id: "",
  //       city_id: "",
  //       school_id: "",
  //     });
  //     return;
  //   }

  //   const school = searchSchool?.find((s) => s.id === schoolId);
  //   if (school) {
  //     setSelectedSchool(school);
  //     setStock({
  //       ...stock,
  //       state_id: school.state_id,
  //       city_id: school.city_id,
  //       school_id: school.id,
  //     });
  //   }
  // };

  const handleSchoolSelect = () => {};

  return (
    <div className="flex flex-col justify-start gap-4">
      <h1 className="font-bold text-xl">Estados</h1>
      <div className="flex justify-end">
        <ToastContainer />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="bg-orange-500 hover:bg-orange-600 text-white hover:text-white font-bold">
              + Novo Estado
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar novo Usuario</DialogTitle>
              <DialogDescription>Adicione um novo usuario</DialogDescription>
            </DialogHeader>
            <form onSubmit={"handleSubmitState"}>
              <div className="flex justify-start items-center w-[400px] gap-4">
                <Label>Nome Completo</Label>
                <Input
                  type="text"
                  // value={inputData.state_hall_email}
                  //onChange={(e) => setInputData({ ...inputData, state_hall_email: e.target.value })}
                />
              </div>
              <div className="flex w-full gap-4 mt-4 text-start">
                <div className="flex w-full flex-col gap-2">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    // value={inputData.state_hall_email}
                    //onChange={(e) => setInputData({ ...inputData, state_hall_email: e.target.value })}
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Label>Telefone</Label>
                  <Input
                    type="text"
                    placeholder="51 99999-9999"
                    //  value={inputData.state_hall_phone}
                    //  onChange={(e) => setInputData({ ...inputData, state_hall_phone: e.target.value })}
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
                    onSearchChange={setSearchQuery}
                    placeholder="Selecione um tipo de usuário"
                    field="value"
                  />
                </div>
                <div className="flex flex-col justify-start mb-2 w-1/2 gap-4">
                  <Label>Estado</Label>
                  <InputSelect
                    options={userTypeData}
                    value={selectedUserType}
                    onChange={handleUserTypeSelect}
                    onSearchChange={setSearchQuery}
                    placeholder="Selecione um tipo de usuário"
                    field="value"
                  />
                </div>
              </div>
              <div className="flex w-full gap-4 mt-4 text-start">
                <div className="flex flex-col justify-start mb-2 w-1/2 gap-4">
                  <Label>Municipio / Cidade</Label>
                  <InputSelect
                    options={userTypeData}
                    value={selectedUserType}
                    onChange={handleUserTypeSelect}
                    onSearchChange={setSearchQuery}
                    placeholder="Selecione um tipo de usuário"
                    field="value"
                  />
                </div>
                <div className="flex flex-col justify-start mb-2 w-1/2 gap-4">
                  <Label>Instituição</Label>
                  <InputSelect
                    options={userTypeData}
                    value={selectedUserType}
                    onChange={handleUserTypeSelect}
                    onSearchChange={setSearchQuery}
                    placeholder="Selecione um tipo de usuário"
                    field="value"
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
          {/* <Label>Nome da Instituição</Label>
        <InputSelect
          options={searchSchool}
          value={selectedSchool?.id}
          onChange={handleSchoolSelect}
          onSearchChange={(query) => setQuerySchool(query)}
          placeholder="Selecione uma Instituição"
          forceReset={resetSchoolInput}
          field="name"
        /> */}
        </div>
        <div className="flex justify-start items-center w-[300px] gap-4">
          <Search size={16} />
          <Input placeholder="Pesquisar..." />
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
                <TableHead className="font-bold text-center">Data de validade</TableHead>
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
                  <TableCell>{user.state_id}</TableCell>
                  <TableCell>{user.city_id}</TableCell>
                  <TableCell>{user.school_id}</TableCell>
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
