"use client";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Textarea } from "@/components/ui/textarea";
import React, { useCallback, useEffect, useState } from "react";
import { ingredientsRecipe } from '../../../mock/ingredienteRecipe.mock'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Bold,
  Code2,
  Copy,
  Eraser,
  Italic,
  List,
  Pencil,
  Plus,
  PlusCircle,
  Quote,
  Strikethrough,
  Trash,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/connect/api";
import { informationError } from "@/components/informationError";
import { InputSelect } from "@/components/inputSelect";



const weekDay = [
  { label: "Domingo", value: 1 },
  { label: "Segunda-feira", value: 2 },
  { label: "Terca-feira", value: 3 },
  { label: "Quarta-feira", value: 4 },
  { label: "Quinta-feira", value: 5 },
  { label: "Sexta-feira", value: 6 },
  { label: "Sábado", value: 7 },
];
const mealType = [
  { label: "Lanche da Manhã", value: "MorningSnack" },
  { label: "Almoço", value: "Lunch" },
  { label: "Lanche da Tarde", value: "AfternoonSnack" },
  { label: "Lanche da Noite", value: "NightSnack" },
  { label: "Lanche Periodo Integral Manha", value: "FullPeriodMealMorning" },
  { label: "Lanche Periodo Integral Tarde", value: "FullPeriodMealAfternoon" },
];

// interface MenuItem {
//   school_id: number | string;
//   menu_id: number | string;
//   recipe_id: number | string;
//   weekday: number | string;
//   meal_type: number | string;
//   additional_notes: number | string;
// }


const NewMenu = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<any>({
    school_id: '',
    menu_id: '',
    recipe_id: '',
    weekday: "",
    meal_type: "",
    additional_notes: "",
  });

  //school
  const [searchSchool, setSearchSchool] = useState<any[]>([]);
  const [schoolSearch, setSchoolSearch] = useState("");

  useEffect(() => {
    if (schoolSearch.length > 2) {
      fetchDataSchool();
    } else {
      fetchDataSchool()
    }
    fetchDataSchool();
  }, [schoolSearch]);

  const fetchDataSchool = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/schools/search/${schoolSearch}`)

      setSearchSchool(response.data.data);

      if (response.data.data.length > 0) {
        const schoolData = response?.data?.data[0];
        setMenuItems(prevMenuItems => ({
          ...prevMenuItems,
          school_id: schoolData.id
        }));
      }
    } catch (error) {
      informationError(error)
    } finally {
      setLoading(false);
    }
  }, [schoolSearch])


 


  const [menu, setMenu] = useState<any>('');
  const [searchMenu, setSearchMenu] = useState<any[]>([]);

  useEffect(() => {
    if (menu.length >= 1) {
      fetchDataMenu();
    }
  }, [menu]);

  const fetchDataMenu = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/menus", {
        params: {
          month: menu,
          school_id: menu.school_id,
          year: new Date().getFullYear(),
        },
      });

      const formattedData = response.data.data.map((item: any) => ({
        formattedLabel: `Mês: ${item.month},
                          Semanas: ${item.month_weeks === 'FIRST_AND_THIRD' ? '1 e 3' : '2 e 4'},
                           Tipo: ${item.week_type === 'ODD' ? 'Impar' : 'Par'},`,
      }));

      console.log("formattedData:", formattedData);

      setSearchMenu(formattedData);

      if (response.data.data.length > 0) {
        const menuData = response?.data?.data[0];
        setMenuItems(prevMenuItems => ({
          ...prevMenuItems,
          menu_id: menuData.id
        }));
      }

    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  }, [menu]);

  console.log('menu: ', searchMenu);



  //search recipe
  const [recipes, setRecipes] = useState([]);
  const [searchRecipe, setSeachRecipe] = useState<string>("");

  useEffect(() => {
    if (searchRecipe.length > 2) {
      fieldData();
    } else {
      fieldData();
    }
    fieldData();
  }, [searchRecipe]);

  const fieldData = useCallback(async () => {
    try {
      const response = searchRecipe.length > 2
        ? await api.get(`/recipes/search/${searchRecipe}`)
        : await api.get("/recipes");

      setRecipes(response.data.data);

      if (response.data.data.length > 0) {
        const recipeData = response?.data?.data[0];
        setMenuItems(prevMenuItems => ({
          ...prevMenuItems,
          recipe_id: recipeData.id
        }));
      }

    } catch (error) {
      informationError(error);
    } finally {
      setLoading(false);
    }
  }, [searchRecipe]);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await api.post("/menu_items", menuItems);

      toast.success(response.data.message);

      setMenuItems({
        school_id: "",
        menu_id:  "",
        recipe_id:  '',
        weekday: "",
        meal_type: "",
        additional_notes: "",
      })

      // Limpa os estados de pesquisa IMPORTANTE
      setSchoolSearch("");
      setMenu("");
      setSeachRecipe("");

    } catch (error) {
      informationError(error);
    }
  };

  console.log('menuItems: ', menuItems);

  return (
    <div className="flex w-full flex-col justify-start gap-4">
      <div className="flex justify-start gap-4 md:justify-end mb-4">
        <Link href="/admin/menus">
          <Button variant="outline" className="text-orange-500 hover:text-orange-600 font-bold">
            <ArrowLeft /> Voltar
          </Button>
        </Link>
        <ToastContainer />
      </div>
      <h1 className="text-3xl font-bold">Criar Novo Menu</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label>Nome da escola</Label>
          <InputSelect
            options={searchSchool}
            value={menuItems.school_id}
            onChange={(value) => setMenu({ ...menuItems, school_id: value })}
            onSearchChange={(searchTerm) => setSchoolSearch(searchTerm)}
            placeholder="Selecione uma escola"
            field="name"
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label>Escolha um periodo</Label>
          <InputSelect
            options={searchMenu || ""}
            value={menuItems.menu_id}
            onChange={(value) => setMenu({ ...menuItems, menu_id: value })}
            onSearchChange={(searchTerm) => setMenu(searchTerm)}
            placeholder="Selecione um Mês"
            field="formattedLabel"
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label>Escolha um Receita</Label>
          <InputSelect
            options={recipes}
            value={menuItems.recipe_id}
            onChange={(value) => setMenu({ ...menuItems, recipe_id: value })}
            onSearchChange={(searchTerm) => setMenu(searchTerm)}
            placeholder="Selecione uma Receita"
            field="name"
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label>Dia da semana</Label>
          <Select
            value={menuItems.weekday}
            onValueChange={(value) =>
              setMenuItems((prev: any) => ({ ...prev, weekday:parseFloat(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Escolha um dia da semana" />
            </SelectTrigger>
            <SelectContent>
              {weekDay.map((day) => (
                <SelectItem key={day.value} value={day.value.toString()}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Label>Tipo de refeição</Label>
          <Select
            value={menuItems.meal_type}
            onValueChange={(value) =>
              setMenuItems((prev) => ({ ...prev, meal_type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Escolha um tipo de refeição" />
            </SelectTrigger>
            <SelectContent>
              {mealType.map((meal) => (
                <SelectItem key={meal.value} value={meal.value}>
                  {meal.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Label>Observações</Label>
          <Card className="p-4">
            <Textarea
              value={menuItems.additional_notes}
              onChange={(e) => setMenuItems({ ...menuItems, additional_notes: e.target.value })}
              placeholder="Observações"
              rows={6}
            />
          </Card>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Criando..." : "Enviar"}
        </Button>
      </form>
    </div>
  );
};

export default NewMenu;