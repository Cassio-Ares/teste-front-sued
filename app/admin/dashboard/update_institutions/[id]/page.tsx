"use client";
import { teachingModalities, teachingModalitiesEJA } from "@/app/mock/teaching_modality.mock";
import { informationError } from "@/components/informationError";
import InputSelect from "@/components/inputSelect";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/connect/api";
import { useSearch } from "@/hook/useSearch";
import { useUpdate } from "@/hook/useUpdate";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const UpdateInstituitionsPage = () => {
  const params = useParams();
  const [schoolDetails, setSchoolDetails] = useState<any>(null);
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

  /////////////////////////////
  const [stateDataName, setStateDataName] = useState<any>(null);
  const getStateName = async (stateId) => {
    try {
      const response = await api.get(`/states/${stateId}`);

      return setStateDataName(response.data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (schoolDetails) {
      getStateName(schoolDetails.state_id);
    }
  }, [schoolDetails]);

  const [cityDataName, setCityDataName] = useState<any>(null);
  const getCityName = async (cityId) => {
    try {
      const response = await api.get(`/cities/${cityId}`);

      return setCityDataName(response.data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (schoolDetails) {
      getCityName(schoolDetails.city_id);
    }
  }, [schoolDetails]);

  /////////////////////////////
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSchhoolDetails = useCallback(async (school_id: number) => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.get(`/schools/${school_id}`);

      setSchoolDetails(response.data.data[0]);
    } catch (error: any) {
      setError(error);
      informationError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const schoolId = params.id;
    if (schoolId) {
      fetchSchhoolDetails(Number(schoolId));
    }
  }, [params.id]);

  console.log("state", stateDataName?.name);
  useEffect(() => {
    if (schoolDetails) {
      setInputData({
        name: schoolDetails.name,
        state_id: schoolDetails.state_id,
        city_id: schoolDetails.city_id,
        total_students_morning: schoolDetails.total_students_morning || null,
        teaching_modality_morning: schoolDetails.teaching_modality_morning || "",
        total_students_afternoon: schoolDetails.total_students_afternoon || null,
        teaching_modality_afternoon: schoolDetails.teaching_modality_afternoon || "",
        total_students_nigth: schoolDetails.total_students_nigth || null,
        teaching_modality_nigth: schoolDetails.teaching_modality_nigth || "",
        total_students_integral: schoolDetails.total_students_integral || null,
        teaching_modality_integral: schoolDetails.teaching_modality_integral || "",
        phone: schoolDetails.phone || "",
        email: schoolDetails.email || "",
        address: schoolDetails.address || "",
      });
    }
  }, [schoolDetails]);

  /////////////////////////

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

    if (city) {
      setSelectCity(city);
      setInputData((inputData) => ({
        ...inputData,
        city_id: city.id,
      }));
    }
  };

  //receber os estado do backend
  const { data: dataPost, loading: postLoading, error: postError, upDate: updateSchool } = useUpdate<any>("schools");

  const handleSubmitSchool = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      //convertendo dados de null para valores para conter erro zod verificar melhor depois
      const adjustedInputData = {
        ...inputData,
        total_students_morning: inputData.total_students_morning === null ? 0 : inputData.total_students_morning,
        teaching_modality_morning:
          inputData.teaching_modality_morning === ""
            ? "Escola não tem aula neste turno ou não possui esta modalidade"
            : inputData.teaching_modality_morning,

        total_students_afternoon: inputData.total_students_afternoon === null ? 0 : inputData.total_students_afternoon,
        teaching_modality_afternoon:
          inputData.teaching_modality_afternoon === ""
            ? "Escola não tem aula neste turno ou não possui esta modalidade"
            : inputData.teaching_modality_afternoon,

        total_students_nigth: inputData.total_students_nigth === null ? 0 : inputData.total_students_nigth,
        teaching_modality_nigth:
          inputData.teaching_modality_nigth === ""
            ? "Escola não tem aula neste turno ou não possui esta modalidade"
            : inputData.teaching_modality_nigth,

        total_students_integral: inputData.total_students_integral === null ? 0 : inputData.total_students_integral,
        teaching_modality_integral:
          inputData.teaching_modality_integral === ""
            ? "Escola não tem aula neste turno ou não possui esta modalidade"
            : inputData.teaching_modality_integral,
      };

      const response = await updateSchool(schoolDetails.id, adjustedInputData);
      toast.success(response.message);
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (id: number) => {};

  return (
    <div className="flex flex-col justify-start gap-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl">Instituições</h1>
        <div className="flex justify-start gap-4 md:justify-end mb-4">
          <Link href="/admin/dashboard">
            <Button variant="outline" className="text-orange-500 hover:text-orange-600 font-bold">
              <ArrowLeft /> Voltar
            </Button>
          </Link>
        </div>
      </div>
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
              disabled
            />
            <div>
              <div className="flex flex-row w-full gap-2">
                <div className="flex flex-col  w-1/2 ">
                  <Label className="font-bold text-lg">Estado</Label>
                  <InputSelect
                    options={stateData}
                    value={selectState?.id}
                    onChange={handleState}
                    onSearchChange={(query) => setStateQuery(query)}
                    placeholder={stateDataName?.name}
                    // forceReset={resetSchoolInput}
                    disabled
                    field="name"
                  />
                </div>
                <div className="flex flex-col  w-1/2 ">
                  <Label className="font-bold text-lg">Cidade</Label>
                  <InputSelect
                    options={cityData}
                    value={selectCity?.id}
                    onChange={handleCity}
                    onSearchChange={(query) => setCityQuery(query)}
                    placeholder={cityDataName?.name}
                    // forceReset={resetSchoolInput}
                    disabled
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
                    {teachingModalitiesEJA.map((modality) => {
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
              placeholder="Rua ou avenida e numero"
              onChange={(e) => setInputData({ ...inputData, address: e.target.value })}
            />
            <Button className="bg-orange-500 hover:bg-orange-600 font-bold ">Adicionar</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UpdateInstituitionsPage;
