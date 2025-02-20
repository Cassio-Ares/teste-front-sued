"use client";

import { InputSelect } from "@/components/inputSelect";
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
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/connect/api";
import { useSearch } from "@/hook/useSearch";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const Menus = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMenu, setSearchMenu] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDateMenus, setSelectedDateMenus] = useState<any>(null);

  //school
  const [schoolSearch, setSchoolSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  const {
    data: searchSchool,
    loading: searchSchoolLoading,
    error: searchSchoolError,
    setQuery: setQuerySchool,
  } = useSearch<any>("schools", schoolSearch);

  const handleSchoolSelect = (schoolId: number) => {
    const school = searchSchool?.find((s) => s.id === schoolId);
    if (school) {
      setSelectedSchool(school);
    }
  };

  console.log(selectedSchool?.name);

  useEffect(() => {
    fetchDataMenu();
  }, [selectedSchool]);

  const fetchDataMenu = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/menus", {
        params: {
          school_id: String(selectedSchool?.id),
          year: new Date().getFullYear(),
        },
      });

      // console.log("response", response.data);

      setSearchMenu(response.data.data);
    } catch (error: any) {
      setError(error.message);
      toast.error("Erro ao buscar menus");
    } finally {
      setLoading(false);
    }
  }, [selectedSchool]);

  const removeItem = (menu_id: string) => {
    //logica com back
  };

  return (
    <div className="flex flex-col justify-start gap-4 h-full">
      <ToastContainer />
      <h1 className="font-bold text-xl">Menus</h1>

      <div className="w-full flex row justify-between">
        <div className="flex">
          <Link href="/admin/menus/newmenu">
            <Button className="bg-orange-500 hover:bg-orange-600 font-bold">+ Novo Menu</Button>
          </Link>
        </div>
        <div className="flex">
          <Link href="/admin/menus/new">
            <Button className="bg-orange-500 hover:bg-orange-600 font-bold">+ Cardápio Menu</Button>
          </Link>
        </div>
      </div>
      <div className="flex justify-center items-center w-full h-full">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Nome da Instituição</Label>
            <InputSelect
              options={searchSchool}
              value={selectedSchool?.id}
              onChange={handleSchoolSelect}
              onSearchChange={(query) => setSchoolSearch(query)}
              placeholder="Selecione uma Instituição"
              field="name"
            />
          </div>
        </div>
      </div>
      <div className="flex">
        <Card className="w-full p-4">
          <Table>
            <TableCaption className="mt-10 text-gray-400">Lista com todos os menus cadastrados.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-bold">Mês</TableHead>
                <TableHead className="font-bold">Semana Impar</TableHead>
                <TableHead className="font-bold">Semana Par</TableHead>
                <TableHead className="font-bold">Menu Completo</TableHead>
                <TableHead className="font-bold text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from(new Set(searchMenu.map((menu) => menu.month))).map((month) => {
                console.log("Processing month:", month);
                const monthMenus = searchMenu.filter((menu) => menu.month === month);
                const oddWeek = monthMenus.find((menu) => menu.week_type === "ODD");
                const evenWeek = monthMenus.find((menu) => menu.week_type === "EVEN");

                return (
                  <TableRow key={month}>
                    <TableCell>
                      {new Date(new Date().getFullYear(), month - 1)
                        .toLocaleString("default", {
                          month: "long",
                        })
                        .charAt(0)
                        .toUpperCase() +
                        new Date(new Date().getFullYear(), month - 1)
                          .toLocaleString("default", {
                            month: "long",
                          })
                          .slice(1)
                          .toLowerCase()}
                    </TableCell>
                    <TableCell>
                      {oddWeek && (
                        <>
                          <Link
                            href={{
                              pathname: "/admin/menus/menudata",
                              query: {
                                type: "odd",
                                id: oddWeek?.id,
                              },
                            }}
                            className="w-full"
                          >
                            <Button variant="ghost" className="hover:bg-orange-100">
                              Cardápio Ímpar
                            </Button>
                          </Link>
                          <Link href={`/admin/menus/updatemenu/${oddWeek?.id}`}>
                            <Button variant="ghost" size="sm" className="text-black">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>

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
                                <Button variant="destructive" onClick={() => removeItem(oddWeek.id || 0)}>
                                  Remover
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {evenWeek && (
                        <>
                          <Link
                            href={{
                              pathname: "/admin/menus/menudata",
                              query: {
                                type: "even",
                                id: evenWeek?.id,
                              },
                            }}
                            className="w-full"
                          >
                            <Button variant="ghost" className="hover:bg-orange-100">
                              Cardápio Par
                            </Button>
                          </Link>

                          <Link href={`/admin/menus/updatemenu/${evenWeek?.id}`}>
                            <Button variant="ghost" size="sm" className="text-black">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>

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
                                <Button variant="destructive" onClick={() => removeItem(evenWeek.id || 0)}>
                                  Remover
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={{
                          pathname: "/admin/menus/menudata",
                          query: {
                            type: "complete",
                            id: monthMenus
                              .filter((menu) => ["ODD", "EVEN"].includes(menu.week_type))
                              .map((menu) => menu.id)
                              .join(","),
                          },
                        }}
                        className="w-full"
                      >
                        <Button variant="ghost" className="hover:bg-orange-100">
                          Menu Completo
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium text-center"></TableCell>
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

export default Menus;
