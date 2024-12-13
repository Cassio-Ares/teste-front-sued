"use client";

import { informationError } from "@/components/informationError";
import { InputSelect } from "@/components/inputSelect";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { api } from "@/connect/api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";



const Menus = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // School
  const [searchSchool, setSearchSchool] = useState<any[]>([]);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);
  const [menus, setMenus] = useState<any[]>([]);

  useEffect(() => {
    if (schoolSearch.length > 2) {
      fetchDataSchool();
    } 
  }, [schoolSearch]);

  const fetchDataSchool = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/schools/search/${schoolSearch}`)

      setSearchSchool(response.data.data);

      // Opcional: Seleciona automaticamente a primeira escola
      if (response.data.data.length > 0) {
        const schoolData = response.data.data[0];
        setSelectedSchool(schoolData.id);
      }
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  }, [schoolSearch]);

  const fetchMenus = async (selectedDate: Date) => {
    // Verifica se escola e data estão selecionadas
    if (!selectedSchool) {
      informationError('Selecione uma escola');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Extrai dia, mês e ano da data selecionada
      const day = selectedDate.getDate(); // Usando getDate() para obter o dia do mês
      const month = selectedDate.getMonth() + 1; // getMonth() retorna 0-11, então soma 1 para ficar 1-12
      const year = selectedDate.getFullYear();

      const response = await api.get('/menus/menu_data', {
        params: {
          day,
          month,
          year,
          schoolId: selectedSchool
        }
      });

      setMenus(response.data.data);
    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      console.log('Calling fetchMenus with:', selectedDate);
      fetchMenus(selectedDate);
    }
  };

  // console.log('date', date);
  // console.log('selectedSchool', selectedSchool);


  console.log('menus', menus);



  return (
    <div className="flex flex-col justify-start gap-4 h-full">
      <h1 className="font-bold text-xl">Cardápios</h1>

      {/* Botões existentes */}
      <div className="w-full flex row justify-between">
        <div className="flex">
          <Link href="/admin/menus/newmenu">
            <Button className="bg-orange-500 hover:bg-orange-600 font-bold">
              + Novo Menu
            </Button>
          </Link>
          <ToastContainer />
        </div>
        <div className="flex">
          <Link href="/admin/menus/new">
            <Button className="bg-orange-500 hover:bg-orange-600 font-bold">
              + Cardápio Menu
            </Button>
          </Link>
          <ToastContainer />
        </div>
      </div>

      <div className="flex justify-center items-center w-full h-full">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Nome da escola</Label>
            <InputSelect
              options={searchSchool}
              value={selectedSchool}
              onChange={(value) => setSelectedSchool(value)}
              onSearchChange={(searchTerm) => setSchoolSearch(searchTerm)}
              placeholder="Selecione uma escola"
              field="name"
            />
          </div>

          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
        </div>
      </div>

      {/* Opcional: Exibição dos menus encontrados */}
      {menus && menus.length > 0 && (
        <div className="mt-4">
          <h2 className="font-bold text-lg mb-2">Cardápios Encontrados</h2>
          {menus.map((menu) => (
            <div key={menu.id} className="border p-2 mb-2">
              {/* Adicione aqui a exibição dos detalhes do menu */}
              <pre>{JSON.stringify(menu, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menus;