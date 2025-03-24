import { formatValue } from "@/lib/utils/formatValue";
import jsPDF from "jspdf";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

// import { RecipeInformationTypes } from "../lib/@types/recipeInformation.types.ts";

// Helper function to normalize recipe data regardless of structure
const normalizeRecipeData = (recipeData) => {
  // Handle case where recipe is nested inside a response object
  const recipe = recipeData.recipe || recipeData;

  // Handle case where ingredients are in a separate array
  const ingredients = recipeData.ingredients || recipe.ingredients || [];

  // Handle different metric structures
  const metrics = recipe.metrics || {
    total_cost: 0,
    cost_per_serving: 0,
    total_ingredients: ingredients.length,
    average_ingredient_cost: 0,
  };

  return {
    ...recipe,
    ingredients,
    metrics,
  };
};

const RecipeDialogPNAE = ({ recipe: rawRecipeData, teaching_modality = null, textButton = "Ver Receita" }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Normalize the recipe data structure
  const recipe = normalizeRecipeData(rawRecipeData);

  const handleExportToPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const margin = 10;
    let yPosition = margin;
    const pageHeight = 210; // A4 landscape height
    const pageWidth = 297; // A4 landscape width

    // PDF title section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(recipe.school_name || "Escola não informada", margin, yPosition, {
      align: "left",
    });
    yPosition += 10;
    doc.text("FICHA TÉCNICA DE PREPARO", margin, yPosition, { align: "left" });
    yPosition += 15;

    // Recipe info section
    doc.setFontSize(16);
    doc.text("Informações da Receita", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.text(
      `Custo Total: R$ ${
        typeof recipe.metrics.total_cost === "number" ? recipe.metrics.total_cost.toFixed(2) : "0.00"
      }`,
      margin,
      yPosition
    );
    yPosition += 8;
    doc.text(
      `Custo por Porção: R$ ${
        typeof recipe.metrics.cost_per_serving === "number" ? recipe.metrics.cost_per_serving.toFixed(2) : "0.00"
      }`,
      margin,
      yPosition
    );
    yPosition += 8;
    doc.text(`Número de Porções: ${recipe.servings || 0}`, margin, yPosition);
    yPosition += 15;

    // Utensils section
    doc.setFontSize(16);
    doc.text("Utensílios Necessários", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    const utensilsText = doc.splitTextToSize(recipe.required_utensils || "Nenhum utensílio informado", 170);
    utensilsText.forEach((line) => {
      doc.text(line, margin, yPosition);
      yPosition += 6;

      // Check if we need a new page
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    });
    yPosition += 10;

    // Ingredients section
    doc.setFontSize(16);
    doc.text("Ingredientes", margin, yPosition);
    yPosition += 10;

    // Add a new page if we don't have enough room for the ingredients table header
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
    }

    const headers = [
      "Ingrediente",
      "Bruto",
      "Uni.med",
      "Líquido",
      "Uni.med",
      "Med. caseira",
      "Fator Correção",
      "Custo Unitário (R$)",
      "kcal",
      "kJ",
      "Proteína (g)",
      "Lipídios (g)",
      "Carboidrato (g)",
      "Cálcio (mg)",
      "Ferro (mg)",
      "Retinol (mcg)",
      "Vitamina C (mg)",
      "Sódio (mg)",
      "Custo Total (R$)",
    ];

    // Calculate column widths to fit within page width
    const availableWidth = pageWidth - 2 * margin;
    const columnWidths = headers.map(() => availableWidth / headers.length);

    doc.setFontSize(8); // Smaller font for the table
    let xPosition = margin;

    // Table header
    headers.forEach((header, index) => {
      doc.text(header, xPosition, yPosition);
      xPosition += columnWidths[index];
    });
    yPosition += 8;

    // Table rows
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      recipe.ingredients.forEach((ingredient) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 15) {
          doc.addPage();
          yPosition = margin;

          // Reprint header on new page
          xPosition = margin;
          headers.forEach((header, index) => {
            doc.text(header, xPosition, yPosition);
            xPosition += columnWidths[index];
          });
          yPosition += 8;
        }

        xPosition = margin;
        const rowData = [
          ingredient.ingredient_description || ingredient.description || "",
          formatValue(ingredient.gross_weight) || "",
          ingredient.unit_of_measure || ingredient.unit_of_measure_gross_weight || "",
          formatValue(ingredient.cooked_weight) || formatValue(ingredient.ajustedCookedWeight) || "",
          ingredient.unit_of_measure_cooked_weight || ingredient.unit_of_measure || "",
          formatValue(ingredient.homemade_measure) || "",
          formatValue(ingredient.correction_factor) || "",
          `R$ ${formatValue(ingredient.cost_per_serving) || formatValue(ingredient.adjusted_cost) || "0"}`,
          formatValue(ingredient.kcal) || "0",
          formatValue(ingredient.kj) || "0",
          formatValue(ingredient.protein) || "0",
          formatValue(ingredient.lipids) || "0",
          formatValue(ingredient.carbohydrate) || "0",
          formatValue(ingredient.calcium) || "0",
          formatValue(ingredient.iron) || "0",
          formatValue(ingredient.retinol) || "0",
          formatValue(ingredient.vitaminC) || "0",
          formatValue(ingredient.sodium) || "0",
          formatValue(ingredient.total_cost) || formatValue(ingredient.cost) || "0",
        ];

        rowData.forEach((data, index) => {
          doc.text(String(data), xPosition, yPosition);
          xPosition += columnWidths[index];
        });

        yPosition += 6;
      });
    }

    // Recipe details sections
    const addSectionToPDF = (title, content, addSpacing = true) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(16);
      doc.text(title, margin, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      if (content) {
        const contentText = doc.splitTextToSize(content, pageWidth - 2 * margin);
        contentText.forEach((line) => {
          doc.text(line, margin, yPosition);
          yPosition += 6;

          // Check if we need a new page
          if (yPosition > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }
        });
      } else {
        doc.text("Não informado", margin, yPosition);
        yPosition += 6;
      }

      if (addSpacing) yPosition += 10;
    };

    addSectionToPDF("Nome da Receita", recipe.name);
    addSectionToPDF("Método de Preparo", recipe.preparation_method);
    addSectionToPDF("Medidas Caseiras", recipe.home_measurements);
    addSectionToPDF("Tempo de Cocção", `${recipe.timeOfCoccao || 0} minutos`);
    addSectionToPDF("Tempo de Preparo", `${recipe.prep_time || 0} minutos`);
    addSectionToPDF("Descrições de Preparo", recipe.description_of_recipe);
    addSectionToPDF("Observações", recipe.observations, false);

    // Save the PDF with proper file name
    const safeName = (recipe.name || "receita").replace(/[^a-z0-9]/gi, "_").toLowerCase();
    doc.save(`${safeName}_ficha_tecnica.pdf`);
  };

  // Helper for secretary title based on school name
  const getSecretaryTitle = () => {
    const schoolName = recipe.school_name || "Escola não informada";
    const isMunicipal = schoolName.toLowerCase().includes("municipal");
    const isEstadual = schoolName.toLowerCase().includes("estadual");

    if (isMunicipal) {
      return `Secretaria Municipal de Educação do Município de ${recipe.city_name || ""}`;
    } else if (isEstadual) {
      return `Secretaria Estadual de Educação do Estado de ${recipe.state_name || ""}`;
    }

    return schoolName;
  };

  // Helper to get the correct value considering all possible data structures
  const getIngredientValue = (ingredient, fieldName) => {
    return ingredient[fieldName] || "—";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{textButton}</Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="m-auto">
          <DialogTitle className="text-4xl flex flex-col justify-center items-center">
            {getSecretaryTitle()}
            <div className="text-2xl items-center">PROGRAMA NACIONAL DE ALIMENTAÇÃO ESCOLAR - PNAE</div>
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {teaching_modality !== null
              ? `FICHA TÉCNICA DE PREPARO - ${teaching_modality}`
              : "FICHA TÉCNICA DE PREPARO"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <h3 className="font-semibold">Informações da Receita</h3>
            <p>
              Custo Total: R${" "}
              {typeof recipe.metrics.total_cost === "number" ? recipe.metrics.total_cost.toFixed(2) : "0,00"}
            </p>
            <p>
              Custo por Porção: R${" "}
              {typeof recipe.metrics.cost_per_serving === "number"
                ? recipe.metrics.cost_per_serving.toFixed(2)
                : "0,00"}
            </p>
            <p>Número de Porções: {recipe.servings || "0"}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mt-4">Nome da Receita</h3>
            <p>{recipe.name || "Sem nome"}</p>
          </div>
          <div>
            <h3 className="font-semibold">Utensílios Necessários</h3>
            <p>{recipe.required_utensils || "Não informado"}</p>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-2">Ingredientes</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingrediente</TableHead>
              <TableHead>Per capita (bruto)</TableHead>
              <TableHead>Unid.Med</TableHead>
              <TableHead>Per capita (liquído)</TableHead>
              <TableHead>Unid.Med</TableHead>
              <TableHead>Med. Caseira</TableHead>
              <TableHead>Fator de correção</TableHead>
              <TableHead>Custo unitário R$</TableHead>
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
              <TableHead>Total R$</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipe.ingredients &&
              recipe.ingredients.map((ingredient, index) => (
                <TableRow key={index}>
                  <TableCell>{ingredient.ingredient_description || ingredient.description || "—"}</TableCell>
                  <TableCell>
                    {formatValue(ingredient.gross_weight) || formatValue(ingredient.adjusted_quantity) || "—"}
                  </TableCell>
                  <TableCell>{ingredient.unit_of_measure || ingredient.unit_of_measure_gross_weight || "—"}</TableCell>
                  <TableCell>
                    {formatValue(ingredient.cooked_weight) || formatValue(ingredient.ajustedCookedWeight) || "—"}
                  </TableCell>
                  <TableCell>{ingredient.unit_of_measure_cooked_weight || ingredient.unit_of_measure || "—"}</TableCell>
                  <TableCell>{formatValue(ingredient.homemade_measure) || "—"}</TableCell>
                  <TableCell>{formatValue(ingredient.correction_factor) || "—"}</TableCell>
                  <TableCell>
                    R$ {formatValue(ingredient.cost_per_serving) || formatValue(ingredient.adjusted_cost) || "0"}
                  </TableCell>
                  <TableCell>{formatValue(ingredient.kcal) || "0"}</TableCell>
                  <TableCell>{formatValue(ingredient.kj) || "0"}</TableCell>
                  <TableCell>{formatValue(ingredient.protein) || "0"}</TableCell>
                  <TableCell>{formatValue(ingredient.lipids) || "0"}</TableCell>
                  <TableCell>{formatValue(ingredient.carbohydrate) || "0"}</TableCell>
                  <TableCell>{formatValue(ingredient.calcium) || "0"}</TableCell>
                  <TableCell>{formatValue(ingredient.iron) || "0"}</TableCell>
                  <TableCell>{formatValue(ingredient.retinol) || "0"}</TableCell>
                  <TableCell>{formatValue(ingredient.vitaminC) || "0"}</TableCell>
                  <TableCell>{formatValue(ingredient.sodium) || "0"}</TableCell>
                  <TableCell>{formatValue(ingredient.total_cost) || formatValue(ingredient.cost) || "0"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <h3 className="text-lg font-bold mt-4">Método de Preparo</h3>
        <p>{recipe.preparation_method || "Não informado"}</p>

        <h3 className="text-lg font-bold mt-4">Medida Caseira</h3>
        <p>{recipe.home_measurements || "Não informado"}</p>

        <h3 className="text-lg font-bold mt-4">Tempo de Cocção</h3>
        <p>{recipe.timeOfCoccao || "0"} min</p>

        <h3 className="text-lg font-bold mt-4">Tempo de Preparo</h3>
        <p>{recipe.prep_time || "0"} min</p>

        <h3 className="text-lg font-bold mt-4">Descrições de Preparo</h3>
        <p>{recipe.description_of_recipe || "Não informado"}</p>

        <h3 className="text-lg font-bold mt-4">Observações</h3>
        <p>{recipe.observations || "Não informado"}</p>

        {/* Optional: Show ingredient allocations if available */}
        {recipe.ingredients && recipe.ingredients.some((ing) => ing.brand_allocations) && (
          <>
            <h3 className="text-lg font-bold mt-4">Alocações de Ingredientes</h3>
            {recipe.ingredients
              .filter((ing) => ing.brand_allocations)
              .map((ing, idx) => (
                <div key={idx} className="mt-2">
                  <h4 className="font-semibold">{ing.description || ing.ingredient_description}</h4>
                  <p className="whitespace-pre-line">
                    {ing.allocations_summary || ing.allocations_description || "Sem alocações"}
                  </p>
                </div>
              ))}
          </>
        )}

        <Button onClick={handleExportToPDF} className="mt-4">
          Exportar para PDF
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDialogPNAE;
