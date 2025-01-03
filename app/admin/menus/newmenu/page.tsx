"use client";

import { informationError } from "@/components/informationError";
import { InputSelect } from "@/components/inputSelect";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/connect/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";

import { useSearch } from "./../../../../hook/useSearch";
import { usePost } from "./../../../../hook/usePost";

const months: string[] = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface Menu {
  state_id: number;
  city_id: number;
  school_id: number;
  month: number;
  year: number;
  month_weeks: string;
  observations: string;
}

const CreateMenuPage = () => {
  const [menu, setMenu] = useState<Menu>({
    state_id: 0,
    city_id: 0,
    school_id: 0,
    month: 0,
    year: new Date().getFullYear(),
    month_weeks: "",
    observations: "",
  });

  //school
  const [schoolSearch, setSchoolSearch] = useState("");

  const {
    data: searchSchool,
    loading: searchSchoolLoading,
    error: searchSchoolError,
    setQuery: setQuerySchool,
  } = useSearch<any>("schools", schoolSearch);

  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [resetSchoolInput, setResetSchoolInput] = useState(false);

  const handleSchoolSelect = (schoolId: number) => {
    const school = searchSchool?.find((s) => s.id === schoolId);
    if (school) {
      setSelectedSchool(school);
      setMenu((prevMenu) => ({
        ...prevMenu,
        state_id: school.state_id,
        city_id: school.city_id,
        school_id: school.id,
      }));
    }
  };

  const {
    data: dataPost,
    loading: postLoading,
    error: postError,
    postData: createPost,
  } = usePost<any>("menus");

  const createMenu = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await createPost(menu);

      console.log("Response createMenu", response);

      toast.success(response?.message || "Menu criado com sucesso!");

      setMenu({
        state_id: 0,
        city_id: 0,
        school_id: 0,
        month: 0,
        year: new Date().getFullYear(),
        month_weeks: "",
        observations: "",
      });

      setSelectedSchool(null);
      setResetSchoolInput(true);
      setTimeout(() => {
        setResetSchoolInput(false);
      }, 0);

      setSchoolSearch("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full flex-col justify-start gap-4">
      <div className="flex justify-start gap-4 md:justify-end mb-4">
        <Link href="/admin/menus">
          <Button
            variant="outline"
            className="text-orange-500 hover:text-orange-600 font-bold"
          >
            <ArrowLeft /> Voltar
          </Button>
        </Link>
        <ToastContainer />
      </div>
      <h1 className="text-3xl font-bold">Criar Novo Menu</h1>
      <form onSubmit={createMenu} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label>Nome da Instituição</Label>
          <InputSelect
            options={searchSchool}
            value={selectedSchool?.id}
            onChange={handleSchoolSelect}
            onSearchChange={(query) => setSchoolSearch(query)}
            forceReset={resetSchoolInput}
            placeholder="Selecione uma instituição"
            field="name"
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label>Mês</Label>
          <Select
            value={menu.month.toString()}
            onValueChange={
              selectedSchool
                ? (value) => setMenu({ ...menu, month: parseInt(value) })
                : undefined
            }
          >
            <SelectTrigger
              className={!selectedSchool ? "cursor-not-allowed opacity-80" : ""}
              disabled={!selectedSchool}
            >
              <SelectValue placeholder="Selecione Mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((item, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label>Semanas</Label>
          <Select
            value={menu.month_weeks}
            onValueChange={
              selectedSchool
                ? (value) => setMenu({ ...menu, month_weeks: value })
                : undefined
            }
          >
            <SelectTrigger
              className={!selectedSchool ? "cursor-not-allowed opacity-80" : ""}
              disabled={!selectedSchool}
            >
              <SelectValue placeholder="Selecionar semanas" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="ALL_WEEKS">Todas as Semanas</SelectItem> */}
              <SelectItem value="FIRST_AND_THIRD">
                Primeira e Terceira
              </SelectItem>
              <SelectItem value="SECOND_AND_FOURTH">
                Segunda e Quarta
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label>Observações</Label>
          <Card className="p-4">
            <Textarea
              value={menu.observations}
              onChange={(e) =>
                setMenu({ ...menu, observations: e.target.value })
              }
              placeholder="Descreva detalhes sobre o menu criado"
              rows={6}
            />
          </Card>
        </div>

        <Button type="submit" disabled={postLoading} className="w-full">
          {postLoading ? "Criando..." : "Criar Menu"}
        </Button>
      </form>
    </div>
  );
};

export default CreateMenuPage;
