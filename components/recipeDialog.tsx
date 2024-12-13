import jsPDF from "jspdf";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";


interface Recipe {
    id: number;
    name: string;
    preparation_method: string;
    required_utensils: string;
    prep_time: number;
    servings: number;
    total_cost: string;
    created_by_name: string;
    school_name: string;
    metrics: {
        cost_per_serving: number;
        total_ingredients: number;
        average_ingredient_cost: number;
    };
    ingredients: RecipeIngredient[];
}

interface RecipeIngredient {
    ingredient_description: string;
    description: string;
    quantity: string;
    adjusted_quantity: string;
    ajustedCookedWeight: string;
    gross_weight: string;
    cooked_weight: string;
    correction_factor: number;
    unit_price: number;
    adjusted_cost: number;
    cost_per_serving: number;
    kcal: string;
    kj: string;
    protein: string;
    lipids: string;
    carbohydrate: string;
    calcium: string;
    iron: string;
    retinol: string;
    vitaminC: string;
    sodium: string;
}


const RecipeDialog = ({ recipe }: { recipe: Recipe }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleExportToPDF = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
        });

        const margin = 10;
        let yPosition = margin;


        const contentHeight = calculateContentHeight();
        const pageHeight = 297;


        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text(recipe?.school_name || "Escola não informada", margin, yPosition, { align: "left" });
        yPosition += 10;
        doc.text("FICHA TÉCNICA DE PREPARO", margin, yPosition, { align: "left" });
        yPosition += 15;

        doc.setFontSize(16);
        doc.text("Informações da Receita", margin, yPosition);
        yPosition += 10;

        doc.setFontSize(12);
        doc.text(`Custo Total: R$ ${recipe?.total_cost}`, margin, yPosition);
        yPosition += 8;
        doc.text(`Custo por Porção: R$ ${recipe?.metrics?.cost_per_serving.toFixed(2)}`, margin, yPosition);
        yPosition += 8;
        doc.text(`Número de Porções: ${recipe?.servings}`, margin, yPosition);
        yPosition += 15;


        doc.setFontSize(16);
        doc.text("Utensílios Necessários", margin, yPosition);
        yPosition += 10;

        doc.setFontSize(12);
        const utensilsText = doc.splitTextToSize(recipe?.required_utensils || "Nenhum utensílio informado", 170);
        utensilsText.forEach((line: string) => {
            doc.text(line, margin, yPosition);
            yPosition += 6;
        });
        yPosition += 10;


        doc.setFontSize(16);
        doc.text("Ingredientes", margin, yPosition);
        yPosition += 10;

        const headers = [
            "Ingrediente", "Bruto (g)", "Líquido (g)", "Fator Correção",
            "Custo Unitário (R$)", "kcal", "kJ", "Proteína (g)",
            "Lipídios (g)", "Carboidrato (g)", "Cálcio (mg)", "Ferro (mg)",
            "Retinol (mcg)", "Vitamina C (mg)", "Sódio (mg)"
        ];
        const columnWidths = [40, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];

        doc.setFontSize(10);
        let xPosition = margin;

        // Cabeçalho da tabela
        headers.forEach((header, index) => {
            doc.text(header, xPosition, yPosition);
            xPosition += columnWidths[index];
        });
        yPosition += 8;

        // Conteúdo da tabela
        recipe?.ingredients?.forEach((ingredient) => {
            xPosition = margin;
            const rowData = [
                ingredient.ingredient_description || ingredient.description ,
                ingredient?.gross_weight || ingredient?.adjusted_quantity || "N/A",
                ingredient?.cooked_weight || ingredient?.ajustedCookedWeight || "N/A",
                ingredient?.correction_factor || "N/A",
                `R$ ${ingredient?.cost_per_serving || ingredient?.adjusted_cost || "0" }`,
                ingredient?.kcal || "0",
                ingredient?.kj || "0",
                ingredient?.protein || "0",
                ingredient?.lipids || "0",
                ingredient?.carbohydrate || "0",
                ingredient?.calcium || "0",
                ingredient?.iron || "0",
                ingredient?.retinol || "0",
                ingredient?.vitaminC || "0",
                ingredient?.sodium || "0",
                
            ];

            rowData.forEach((data, index) => {
                doc.text(String(data), xPosition, yPosition);
                xPosition += columnWidths[index];
            });

            yPosition += 6;

            // Quebra de página
            if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
        });


        doc.setFontSize(16);
        doc.text("Nome da Receita", margin, yPosition);
        yPosition += 10;

        doc.setFontSize(12);
        doc.text(recipe?.name || "Receita sem nome", margin, yPosition);
        yPosition += 15;


        doc.setFontSize(16);
        doc.text("Método de Preparo", margin, yPosition);
        yPosition += 10;

        doc.setFontSize(12);
        const preparationText = doc.splitTextToSize(recipe?.preparation_method || "Método de preparo não informado", 170);
        preparationText.forEach((line: string) => {
            doc.text(line, margin, yPosition);
            yPosition += 6;
        });


        doc.setFontSize(16);
        doc.text("Tempo de Preparo", margin, yPosition);
        yPosition += 10;

        doc.setFontSize(12);
        doc.text(`${recipe?.prep_time || "Tempo de preparo não informado"} minutos`, margin, yPosition);
        yPosition += 15;

        // Salvar o PDF
        doc.save(`${recipe?.name}_ficha_tecnica.pdf`);
    };

    const calculateContentHeight = () => {

        const lineHeight = 10;
        const numberOfLines = 20;
        return lineHeight * numberOfLines;
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button >
                    Ficha Técnica de Preparo
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="m-auto">
                    <DialogTitle className="text-3xl">{recipe?.school_name}</DialogTitle>
                    <DialogDescription >FICHA TÉCNICA DE PREPARO</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <h3 className="font-semibold">Informações da Receita</h3>
                        <p>Custo Total: R$ {recipe?.total_cost}</p>
                        <p>Custo por Porção: R$ {recipe?.metrics?.cost_per_serving.toFixed(2)}</p>
                        <p>Número de Porções: {recipe?.servings}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Utensílios Necessários</h3>
                        <p>{recipe?.required_utensils}</p>
                    </div>
                </div>

                <h3 className="text-lg font-bold mb-2">Ingredientes</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ingrediente</TableHead>
                            <TableHead>Per capita (bruto)</TableHead>
                            <TableHead>Per capita (liquído)</TableHead>
                            <TableHead>Fator de correção</TableHead>
                            <TableHead>Custo unitário</TableHead>
                            <TableHead>(kcal)</TableHead>
                            <TableHead>(kJ)</TableHead>
                            <TableHead>Proteína(g)</TableHead>
                            <TableHead>Lipídeos(g)</TableHead>
                            <TableHead>Carboidrato(g)</TableHead>
                            <TableHead>Cálcio(mg)</TableHead>
                            <TableHead>Ferro(mg)</TableHead>
                            <TableHead>Retinol(mcg)</TableHead>
                            <TableHead>Vit.C (mg)</TableHead>
                            <TableHead>Sódio(mg)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recipe?.ingredients?.map((ingredient, index) => (
                            <TableRow key={index}>
                                <TableCell>{ingredient.ingredient_description || ingredient.description}</TableCell>
                                <TableCell>{ingredient.quantity || ingredient.adjusted_quantity}</TableCell>
                                <TableCell>{ingredient?.cooked_weight || ingredient?.ajustedCookedWeight}</TableCell>
                                <TableCell>{ingredient?.correction_factor}</TableCell>
                                <TableCell>R$ {ingredient?.cost_per_serving || ingredient?.adjusted_cost}</TableCell>
                                <TableCell>{ingredient?.kcal}</TableCell>
                                <TableCell>{ingredient?.kj}</TableCell>
                                <TableCell>{ingredient?.protein}</TableCell>
                                <TableCell>{ingredient?.lipids}</TableCell>
                                <TableCell>{ingredient?.carbohydrate}</TableCell>
                                <TableCell>{ingredient?.calcium}</TableCell>
                                <TableCell>{ingredient?.iron}</TableCell>
                                <TableCell>{ingredient?.retinol}</TableCell>
                                <TableCell>{ingredient?.vitaminC}</TableCell>
                                <TableCell>{ingredient?.sodium}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <h3 className="text-lg font-bold mt-4">Nome da Receita</h3>
                <p>{recipe?.name}</p>

                <h3 className="text-lg font-bold mt-4">Método de Preparo</h3>
                <p>{recipe?.preparation_method}</p>

                <h3 className="text-lg font-bold mt-4">Tempo de Preparo</h3>
                <p>{recipe?.prep_time}</p>

                <Button onClick={handleExportToPDF}>Exportar para PDF</Button>
            </DialogContent>
        </Dialog>
    );
};

export default RecipeDialog;

