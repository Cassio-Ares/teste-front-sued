'use client';

import { informationError } from '@/components/informationError';
import { InputSelect } from '@/components/inputSelect';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/connect/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { ToastContainer } from 'react-toastify';


const months: string[] = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

interface Menu {
    state_id: number;
    city_id: number;    
    school_id: number;
    week_type: string;
    month: number;
    year: number;        
    month_weeks: string;
    observations: string;
}

const CreateMenuPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [menu, setMenu] = useState<Menu>({
        state_id: 0,
        city_id: 0,
        school_id: 0,
        week_type: '',
        month: 0,
        year: new Date().getFullYear(),
        month_weeks: '',
        observations: ''
    });



    //school
    const [searchSchool, setSearchSchool] = useState<any[]>([]);
    const [schoolSearch, setSchoolSearch] = useState("");

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

            if (response.data.data.length > 0) {
                const schoolData = response?.data?.data[0];
                setMenu(prevStock => ({
                    ...prevStock,
                    state_id: schoolData.state_id,
                    city_id: schoolData.city_id,
                    school_id: schoolData.id
                }));
            }
        } catch (error) {
            informationError(error)
        } finally {
            setLoading(false);
        }
    }, [schoolSearch])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // setMenu((prevMenu) => ({
        //     ...prevMenu,
        //     week_type: prevMenu.month_weeks == 'SECOND_AND_FOURTH' ? 'EVEN' : 'ODD',
        // }));

     // menu.month_weeks === 'FIRST_AND_THIRD' ? menu.week_type = 'ODD' : menu.week_type = 'EVEN';

        try {
            setLoading(true);
           


            const response = await api.post('/menus', menu);
            setMenu({
                state_id: 0,
                city_id: 0,
                school_id: 0,
                week_type: '',
                month: 0,
                year: new Date().getFullYear(),
                month_weeks: '',
                observations: ''
            });
        } catch (error) {
            informationError(error);
        } finally {
            setLoading(false);
        }
    };


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
                        value={menu.school_id}
                        onChange={(value) => setMenu({ ...menu, school_id: value })}
                        onSearchChange={(searchTerm) => setSchoolSearch(searchTerm)}
                        placeholder="Selecione uma escola"
                        field="name"
                    />
                </div>

                <div className="flex w-full flex-col gap-2">
                    <Label>Mês</Label>
                    <Select
                        value={menu.month.toString()}
                        onValueChange={(value) => setMenu({ ...menu, month: parseInt(value) })}
                    >
                        <SelectTrigger>
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
                        onValueChange={(value) => setMenu({ ...menu, month_weeks: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecionar semanas" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* <SelectItem value="ALL_WEEKS">Todas as Semanas</SelectItem> */}
                            <SelectItem value="FIRST_AND_THIRD">Primeira e Terceira</SelectItem>
                            <SelectItem value="SECOND_AND_FOURTH">Segunda e Quarta</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex w-full flex-col gap-2">
                    <Label>Observações</Label>
                    <Card className="p-4">
                        <Textarea
                            value={menu.observations}
                            onChange={(e) => setMenu({ ...menu, observations: e.target.value })}
                            placeholder="Descreva detalhes sobre o menu criado"
                            rows={6}
                        />
                    </Card>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? "Criando..." : "Criar Menu"}
                </Button>
            </form>
        </div>
    );
};

export default CreateMenuPage;