"use client";
import { teachingModalities } from "@/app/mock/teaching_modality.mock";
import InputSelect from "@/components/inputSelect";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePost } from "@/hook/usePost";
import { useSearch } from "@/hook/useSearch";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const SchoolsData = [
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

const InstituitionsPage = () => {
  const [inputData, setInputData] = useState({
    name: "",
    state_id: null as number | null,
    city_id: null as number | null, //pego só a cidade aqui e o estado no backend
    total_students_morning: null as number | null,
    teaching_modality_morning: "",
    total_students_afternoon: null as number | null,
    teaching_modality_afternoon: "",
    total_students_nigth: null as number | null,
    teaching_modality_nigth: "",
    total_students_integral: null as number | null,
    teaching_modality_integral: "",
    phone: "",
    email: "",
    address: "",
  });

  //buscar useState
  const [stateQuery, setStateQuery] = useState("");
  const [selectState, setSelectState] = useState<any>(null);
  const {
    data: stateData,
    error: stateError,
    loading: stateLoading,
    setQuery: setQueryState,
  } = useSearch<any>("state", stateQuery);

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

    if (city) {
      setSelectCity(city);
      setInputData((inputData) => ({
        ...inputData,
        city_id: city.id,
      }));
    }
  };

  console.log(inputData);

  //receber os estado do backend
  const { postData } = usePost<any>("school");

  const handleSubmitSchool = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await postData(inputData);
      toast.success(response.message);

      setInputData({
        name: "",
        state_id: null as number | null,
        city_id: null as number | null, //pego só a cidade aqui e o estado no backend
        total_students_morning: null as number | null,
        teaching_modality_morning: "",
        total_students_afternoon: null as number | null,
        teaching_modality_afternoon: "",
        total_students_nigth: null as number | null,
        teaching_modality_nigth: "",
        total_students_integral: null as number | null,
        teaching_modality_integral: "",
        phone: "",
        email: "",
        address: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (id: number) => {};

  return (
    <div className="flex flex-col justify-start gap-4">
      <h1 className="font-bold text-xl">Instituições</h1>
      <div className="flex justify-end">
        <ToastContainer />
        {/* <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="bg-orange-500 hover:bg-orange-600 text-white hover:text-white font-bold">
              + Nova Cidade
            </Button>
          </DialogTrigger>
        </Dialog> */}
      </div>
      <div className="flex flex-col ">
        <Card className="w-full p-4">
          <form onSubmit={handleSubmitSchool} className="space-y-4">
            <Label className="font-bold text-lg">Nome do Instituição</Label>
            <Input
              value={inputData.name}
              placeholder="Digite o nome da Instituição"
              onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
            />
            <div>
              <div className="flex flex-row w-full gap-2">
                <div className="flex flex-col  w-1/2 ">
                  <Label className="font-bold text-lg">Nome da Cidade</Label>
                  <InputSelect
                    options={stateData}
                    value={selectState?.id}
                    onChange={handleState}
                    onSearchChange={(query) => setStateQuery(query)}
                    placeholder="Selecione uma Instituição"
                    // forceReset={resetSchoolInput}
                    field="name"
                  />
                </div>
                <div className="flex flex-col  w-1/2 ">
                  <Label className="font-bold text-lg">Nome da Cidade</Label>
                  <InputSelect
                    options={cityData}
                    value={selectCity?.id}
                    onChange={handleCity}
                    onSearchChange={(query) => setCityQuery(query)}
                    placeholder="Selecione uma Instituição"
                    // forceReset={resetSchoolInput}
                    field="name"
                  />
                </div>
              </div>
              <Label className="font-bold text-lg">Turno da Manhã</Label>
              <div className="flex justify-start items-center gap-4">
                <Select
                  value={inputData.teaching_modality_morning}
                  onValueChange={(e) => setInputData({ ...inputData, teaching_modality_morning: e })}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Selecione uma modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachingModalities.map((modality) => {
                      return (
                        <SelectItem key={modality} value={modality}>
                          {modality}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <label>Numero de alunos</label>
                <Input
                  type="number"
                  value={inputData.total_students_morning || ""}
                  className="w-1/4"
                  onChange={(e) => setInputData({ ...inputData, total_students_morning: Number(e.target.value) })}
                  disabled={
                    inputData?.teaching_modality_morning === "" ||
                    inputData?.teaching_modality_morning ===
                      "Escola não tem aula neste turno ou não possui esta modalidade"
                  }
                />
              </div>
            </div>

            <div>
              <Label className="font-bold text-lg">Turno da Tarde</Label>
              <div className="flex justify-start items-center gap-4">
                <Select
                  value={inputData.teaching_modality_afternoon}
                  onValueChange={(e) => setInputData({ ...inputData, teaching_modality_afternoon: e })}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Selecione uma modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachingModalities.map((modality) => {
                      return (
                        <SelectItem key={modality} value={modality}>
                          {modality}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <label>Numero de alunos</label>
                <Input
                  type="number"
                  value={inputData.total_students_afternoon || ""}
                  className="w-1/4"
                  onChange={(e) => setInputData({ ...inputData, total_students_afternoon: Number(e.target.value) })}
                  disabled={
                    inputData?.teaching_modality_afternoon === "" ||
                    inputData?.teaching_modality_afternoon ===
                      "Escola não tem aula neste turno ou não possui esta modalidade"
                  }
                />
              </div>
            </div>

            <div>
              <Label className="font-bold text-lg">Turno da Noite</Label>
              <div className="flex justify-start items-center gap-4">
                <Select
                  value={inputData.teaching_modality_nigth}
                  onValueChange={(e) => setInputData({ ...inputData, teaching_modality_nigth: e })}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Selecione uma modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachingModalities.map((modality) => {
                      return (
                        <SelectItem key={modality} value={modality}>
                          {modality}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <label>Numero de alunos</label>
                <Input
                  className="w-1/4"
                  type="number"
                  value={inputData.total_students_nigth || ""}
                  onChange={(e) => setInputData({ ...inputData, total_students_nigth: Number(e.target.value) })}
                  disabled={
                    inputData?.teaching_modality_nigth === "" ||
                    inputData?.teaching_modality_nigth ===
                      "Escola não tem aula neste turno ou não possui esta modalidade"
                  }
                />
              </div>
            </div>

            <div>
              <Label className="font-bold text-lg">Turno da Integral</Label>
              <div className="flex justify-start items-center gap-4">
                <Select
                  value={inputData.teaching_modality_integral}
                  onValueChange={(e) => setInputData({ ...inputData, teaching_modality_integral: e })}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Selecione uma modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachingModalities.map((modality) => {
                      return (
                        <SelectItem key={modality} value={modality}>
                          {modality}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <label>Numero de alunos</label>
                <Input
                  className="w-1/4"
                  type="number"
                  value={inputData.total_students_integral || ""}
                  onChange={(e) => setInputData({ ...inputData, total_students_integral: Number(e.target.value) })}
                  disabled={
                    inputData?.teaching_modality_integral === "" ||
                    inputData?.teaching_modality_integral ===
                      "Escola não tem aula neste turno ou não possui esta modalidade"
                  }
                />
              </div>
            </div>

            <Label className="font-bold text-lg">Telefone</Label>
            <Input
              value={inputData.phone}
              placeholder="51 99999-9999"
              onChange={(e) => setInputData({ ...inputData, phone: e.target.value })}
            />
            <Label className="font-bold text-lg">E-mail</Label>
            <Input
              value={inputData.email}
              placeholder="e-mail"
              onChange={(e) => setInputData({ ...inputData, email: e.target.value })}
            />
            <Label className="font-bold text-lg">Endereço</Label>
            <Input
              value={inputData.address}
              placeholder="rua ou avenida e numero"
              onChange={(e) => setInputData({ ...inputData, address: e.target.value })}
            />
          </form>
        </Card>
      </div>
    </div>
  );
};

export default InstituitionsPage;
