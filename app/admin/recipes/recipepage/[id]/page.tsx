'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/connect/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import { informationError } from '@/components/informationError';
import RecipeDialog from '@/components/recipeDialog';

interface Ingredient {
    ingredient_description: string;
    description: string;
    quantity: number;
    adjusted_quantity: number;
    unit_of_measure: string;
    cost_per_serving: number;
    adjusted_cost: number;
    total_cost: number;
    kcal: number;
}

interface Recipe {
    school_name: string;
    name: string;
    metrics: {
        total_ingredients: number;
        cost_per_serving: number;
    };
    prep_time: string;
    servings: number;
    total_cost: number;
    required_utensils: string[] | string;
    preparation_method: string;
    ingredients: Ingredient[];
}

const RecipeView = () => {
    const params = useParams();
    const [recipe, setRecipe] = useState<Recipe | null| any>(null);
    const [servings, setServings] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const recipeId = params.id as string;
        if (recipeId) {
            fetchRecipeDetails(Number(recipeId));
        }
    }, [params.id]);

    const fetchRecipeDetails = useCallback(
        async (recipeId: number, desiredServings: number = 1) => {
            setError(null);
            setLoading(true);
            try {
                let response;
                if (desiredServings > 1) {
                    response = await api.post('/recipes/serving', {
                        recipeId,
                        desiredServings
                    });
                } else {
                    response = await api.get(`/recipes/${recipeId}`);
                }

                console.log('response: ', response.data);

                setRecipe(response.data.data || response.data);
                setServings(desiredServings);
            } catch (error) {
                
                informationError(error);
                setError("Erro ao carregar receita");
            } finally {
                setLoading(false);
            }
        },
        []  
    );

    const handleServingsChange = async (newServings: number) => {
        if (newServings < 1) {
            setError("O número de porções deve ser maior que 0.");
            return;
        }
        const recipeId = params.id as string;
        if (recipeId) {
            await fetchRecipeDetails(Number(recipeId), newServings);
        }
    };

   
    const renderUtensils = () => {
        const utensils = Array.isArray(recipe?.required_utensils)
            ? recipe?.required_utensils
            : [recipe?.required_utensils].filter(Boolean);

        return utensils?.map((utensil, index) => (
            <li key={`utensil-${index}`}>{utensil}</li>
        ));
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-start gap-4 md:justify-end mb-4">
                <Link href="/admin/recipes">
                    <Button variant="outline" className="text-orange-500 hover:text-orange-600 font-bold">
                        <ArrowLeft /> Voltar
                    </Button>
                </Link>
                <ToastContainer />
            </div>
            {recipe && (
                <Card className="p-6">
                    <h1 className="text-2xl font-bold mb-4">{recipe.school_name}</h1>
                    <h4 className="text-2xl font-bold mb-4">{recipe.name}</h4>

                    <div className="flex items-center gap-5 mb-4">
                        <label htmlFor="servings" className="font-semibold">Porções:</label>
                        <input
                            id="servings"
                            type="number"
                            min="1"
                            value={servings || ''}
                            onChange={(e) => setServings(Number(e.target.value))}
                            className="w-20 p-2 border rounded"
                        />
                        <Button className='mr-10' onClick={() => handleServingsChange(servings)}>Recalcular</Button>
                        <RecipeDialog recipe={recipe} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <div className='mb-4'>
                                <h2 className="font-semibold">Informações da Receita</h2>
                                <p>Número de Ingredientes: {recipe.metrics.total_ingredients}</p>
                                <p>Tempo de Preparo: {recipe.prep_time}</p>
                                <p>Número de Porções: {recipe.servings}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold">Informações de Custo</h4>
                                <p>Custo Total: R$ {recipe.total_cost}</p>
                                <p>Custo por Porção: R$ {recipe.metrics.cost_per_serving.toFixed(2)}</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="font-semibold">Utensílios Necessários</h2>
                            <ul>
                                {renderUtensils()}
                            </ul>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-2">Método de Preparo</h2>
                    <p className="mb-4">{recipe.preparation_method}</p>

                    <h2 className="text-xl font-bold mb-2">Ingredientes</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ingrediente</TableHead>
                                <TableHead>Quantidade</TableHead>
                                <TableHead>Unidade</TableHead>
                                <TableHead>Custo</TableHead>
                                <TableHead>Kcal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recipe.ingredients?.map((ingredient, index) => (
                                <TableRow key={`ingredient-${index}`}>
                                    <TableCell>{ingredient.ingredient_description || ingredient.description}</TableCell>
                                    <TableCell>{ingredient.quantity || ingredient.adjusted_quantity}</TableCell>
                                    <TableCell>{ingredient.unit_of_measure}</TableCell>
                                    <TableCell>R$ {ingredient?.cost_per_serving || ingredient?.adjusted_cost}</TableCell>
                                    <TableCell>{ingredient.kcal}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
};

export default RecipeView;


