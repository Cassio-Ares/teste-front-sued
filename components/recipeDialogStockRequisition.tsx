import { useUpdate } from "@/hook/useUpdate";
import { formModality } from "@/lib/utils/formModality";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

// Helper function to format values
const formatValue = (value) => {
  if (value === undefined || value === null) return "—";
  if (typeof value === "number") {
    // Check if the value is an integer (has no decimal part)
    if (Number.isInteger(value)) {
      return String(value).replace(".", ",");
    } else {
      return value.toFixed(2).replace(".", ",");
    }
  }
  return String(value);
};

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

const RecipeDialogStockRequisition = ({
  recipe: rawRecipeData,
  teaching_modality = null,
  textButton = "Ver Receita",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Normalize the recipe data structure
  const recipe = normalizeRecipeData(rawRecipeData);

  // Helper for secretary title based on school name
  const getSecretaryTitle = () => {
    const schoolName = recipe.school_name || "Escola não informada";
    const isMunicipal = schoolName.toLowerCase().includes("municipal");
    const isEstadual = schoolName.toLowerCase().includes("estadual");

    if (isMunicipal) {
      return `SECRETARIA MUNICIPAL DE EDUCAÇÃO DO ${recipe.city_name || "MUNICÍPIO"}`;
    } else if (isEstadual) {
      return `SECRETARIA ESTADUAL DE EDUCAÇÃO DO ${recipe.state_name || "ESTADO"}`;
    }

    return `SECRETARIA (MUNICIPAL/ESTADUAL) DE EDUCAÇÃO DO (MUNICÍPIO/ESTADO)`;
  };

  // Calculate nutritional totals
  const calculateTotals = () => {
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      return {
        grossWeight: 0,
        unit_measure_gross_weight: "g",
      };
    }

    return recipe.ingredients.reduce(
      (totals, ingredient) => {
        return {
          grossWeight: totals.grossWeight + (parseFloat(ingredient.gross_weight) || 0),
          unit_measure_gross_weight: ingredient?.unit_of_measure || ingredient?.unit_of_measure_gross_weight || "g",
        };
      },
      {
        grossWeight: 0,
        unit_measure_gross_weight: "g",
      }
    );
  };

  const totals = calculateTotals();

  const handleExportToPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const margin = 15;
    let yPosition = margin;
    const pageWidth = 210; // A4 portrait width
    const pageHeight = 297; // A4 portrait height

    // Set fonts and sizes for consistent rendering
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    // Center the title - ensure it doesn't get cut off
    doc.text(getSecretaryTitle(), pageWidth / 2, yPosition, { align: "center" });
    yPosition += 6;

    // Current date format
    doc.setFontSize(10);
    doc.text(`Relatório de retirada de estoque ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 6;

    // Make sure this text doesn't get cut off
    doc.setFontSize(10);
    const modalityText =
      recipe.teaching_modality !== null
        ? `FICHA TÉCNICA DE PREPARO - CARDÁPIO ETAPA/ ${formModality(recipe.teaching_modality).toUpperCase()}`
        : "FICHA TÉCNICA DE PREPARO - CARDÁPIO ETAPA/ MODALIDADE DE ENSINO (FAIXA ETÁRIA)";
    doc.text(modalityText, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // Recipe name
    doc.setFontSize(10);
    doc.text(`Nome: ${recipe.name || "Não informado"}`, margin, yPosition);
    yPosition += 10;

    // Table dimensions
    const tableWidth = pageWidth - 2 * margin;
    const colWidths = [tableWidth * 0.7, tableWidth * 0.3];

    // Function to draw the ingredients table
    const drawIngredientsTable = () => {
      // Table header cells with yellow background
      doc.setFillColor(255, 250, 210); // Light yellow like in the image
      doc.rect(margin, yPosition, tableWidth, 6, "F");

      // Table header text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);

      // Center "Ingredientes" in its column
      doc.text("Ingredientes", margin + colWidths[0] / 2, yPosition + 4, { align: "center" });

      // Center "Per capita (bruto)" in its column
      doc.text("Per capita\n(bruto)", margin + colWidths[0] + colWidths[1] / 2, yPosition + 3, { align: "center" });

      yPosition += 6;

      // Table rows - use actual recipe data
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        recipe.ingredients.forEach((ingredient, idx) => {
          // Alternate row background for better readability
          if (idx % 2 === 1) {
            doc.setFillColor(245, 245, 245);
            doc.rect(margin, yPosition, tableWidth, 6, "F");
          }

          // Set text styles for ingredients cells
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);

          // Get ingredient description
          const ingredientName = ingredient.ingredient_description || ingredient.description || "—";

          // Format the per capita value
          let perCapitaText = "—";
          if (ingredient.unit_of_measure) {
            perCapitaText = `${formatValue(ingredient.gross_weight)} ${ingredient.unit_of_measure}`;
          } else if (ingredient.unit_of_measure_gross_weight) {
            perCapitaText = `${formatValue(ingredient.gross_weight)} ${ingredient.unit_of_measure_gross_weight}`;
          }

          // Text alignment matches the image
          doc.text(ingredientName, margin + colWidths[0] / 2, yPosition + 4, { align: "center" });
          doc.text(perCapitaText, margin + colWidths[0] + colWidths[1] / 2, yPosition + 4, { align: "center" });

          yPosition += 6;
        });

        // Total row with gray background
        doc.setFillColor(230, 230, 230);
        doc.rect(margin, yPosition, tableWidth, 6, "F");

        // Set text styles for total row
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);

        // Add "Total" text and total weight
        doc.text("Total", margin + colWidths[0] / 2, yPosition + 4, { align: "center" });
        doc.text(
          `${formatValue(totals.grossWeight)} ${totals.unit_measure_gross_weight}`,
          margin + colWidths[0] + colWidths[1] / 2,
          yPosition + 4,
          { align: "center" }
        );
      } else {
        // If no ingredients, show empty table with message
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.text("Nenhum ingrediente encontrado", margin + tableWidth / 2, yPosition + 4, { align: "center" });
      }

      yPosition += 10;
    };

    drawIngredientsTable();

    // Allocations Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Alocações de Ingredientes", margin, yPosition);
    yPosition += 5;

    // Yellow background for allocations section
    doc.setFillColor(255, 250, 210); // Light yellow

    // Determine height based on number of ingredients with allocations
    const ingredientsWithAllocations = recipe.ingredients
      ? recipe.ingredients.filter((ing) => ing.brand_allocations)
      : [];

    // Calculate height needed (minimum 30mm, or more depending on ingredients)
    const allocationsHeight = Math.max(30, ingredientsWithAllocations.length * 15);

    doc.rect(margin, yPosition, tableWidth, allocationsHeight, "F");

    // Draw allocations if they exist
    if (ingredientsWithAllocations.length > 0) {
      let allocYPos = yPosition + 6;

      ingredientsWithAllocations.forEach((ingredient, index) => {
        // Ingredient name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(ingredient.ingredient_description || ingredient.description || "—", margin + 5, allocYPos);
        allocYPos += 6;

        // Allocation summary
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        // Get allocation text from ingredient
        const allocationText =
          ingredient.allocations_summary ||
          ingredient.allocations_description ||
          (ingredient.brand_allocations
            ? `Quantidade total de ${formatValue(ingredient.gross_weight)} ${
                ingredient.unit_of_measure || ingredient.unit_of_measure_gross_weight || "g"
              }`
            : "Sem alocações");

        doc.text(allocationText, margin + 5, allocYPos);
        allocYPos += index < ingredientsWithAllocations.length - 1 ? 9 : 0;
      });
    } else {
      // No allocations message
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text("Nenhuma alocação de ingredientes encontrada", margin + 5, yPosition + 15);
    }

    // Save the PDF with appropriate name
    const safeName = (recipe.name || "receita").replace(/[^a-z0-9]/gi, "_").toLowerCase();
    doc.save(`${safeName}_ficha_tecnica.pdf`);
  };

  const { data, loading, error, upDate } = useUpdate<any>("inventory/output");

  const outputInventory = async () => {
    try {
      if (!recipe?.ingredients) {
        console.error("Nenhum ingrediente encontrado.");
        return;
      }

      for (const ingredient of recipe.ingredients) {
        if (!ingredient.brand_allocations) continue;

        for (const allocation of ingredient.brand_allocations) {
          const inventoryData = {
            ingredient_id: ingredient.id,
            movement_type: "OUTPUT",
            total_quantity: allocation.quantity_used,
            unit_of_measure: allocation.unit_of_measure,
            unit_price: allocation.cost,
            brand: allocation.brand,
            expiration_date: new Date(allocation.expiration_date).toISOString().split("T")[0],
            observation: `Saída de estoque para a receita ${recipe.name}, na data ${new Date().toLocaleDateString()}`,
          };

          try {
            const response = await upDate(allocation.inventory_id, inventoryData);
            console.log(`Estoque atualizado para ${allocation.brand}:`, response);
          } catch (error) {
            console.error(`Erro ao atualizar estoque de ${allocation.brand}:`, error);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao processar saída de estoque:", error);
    }
  };

  const handleButtonClick = async () => {
    try {
      // Tente exportar o PDF primeiro
      handleExportToPDF();
      console.log("PDF gerado com sucesso");

      // Se for bem-sucedido, tente processar o estoque
      try {
        await outputInventory();
        console.log("Estoque atualizado com sucesso");
      } catch (inventoryError) {
        console.error("Erro ao atualizar o estoque:", inventoryError);
        // Continue, mesmo se a atualização do estoque falhar, pois o PDF já foi gerado
      }
    } catch (pdfError) {
      console.error("Erro ao gerar o PDF:", pdfError);
      // Aqui você poderia mostrar uma mensagem ao usuário
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{textButton}</Button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="m-auto">
          <DialogTitle className="text-2xl flex flex-col justify-center items-center">
            {getSecretaryTitle()}
            <div className="text-xl items-center">
              Relatório de retirada de estoque {new Date().toLocaleDateString()}
            </div>
          </DialogTitle>
          <DialogDescription className="text-center text-lg font-bold">
            {recipe.teaching_modality !== null
              ? `FICHA TÉCNICA DE PREPARO - CARDÁPIO ETAPA/ ${formModality(recipe.teaching_modality).toUpperCase()}`
              : "FICHA TÉCNICA DE PREPARO - CARDÁPIO ETAPA/ MODALIDADE DE ENSINO (FAIXA ETÁRIA)"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-2 mb-2">
          <div className="border-b pb-2">
            <h3 className="font-semibold">Nome: {recipe.name || "Não informado"}</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="border w-full">
            <TableHeader className="bg-yellow-50">
              <TableRow>
                <TableHead className="border w-auto font-bold text-center">Ingredientes</TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Per capita
                  <br />
                  (bruto)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipe.ingredients &&
                recipe.ingredients.map((ingredient, index) => (
                  <TableRow key={index} className={index % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                    <TableCell className="border font-medium text-center">
                      {ingredient.ingredient_description || ingredient.description || "—"}
                    </TableCell>
                    <TableCell className="border text-center">
                      {ingredient.unit_of_measure
                        ? formatValue(ingredient.gross_weight) + " " + ingredient.unit_of_measure
                        : ingredient.unit_of_measure_gross_weight
                        ? formatValue(ingredient.gross_weight) + " " + ingredient.unit_of_measure_gross_weight
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              {/* Totals row */}
              <TableRow className="bg-yellow-50 font-bold">
                <TableCell className="border text-center">Total</TableCell>
                <TableCell className="border text-center">
                  {formatValue(totals.grossWeight) + " " + totals.unit_measure_gross_weight}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="border p-2 bg-yellow-50">
            <h3 className="text-md font-bold">Alocações de Ingredientes</h3>
            {recipe.ingredients && recipe.ingredients.some((ing) => ing.brand_allocations) ? (
              <>
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
            ) : (
              <p className="text-sm italic mt-2">Nenhuma alocação de ingredientes encontrada</p>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button onClick={handleButtonClick} className="mt-4">
            <Download className="h-4 w-4 mr-2" />
            Exportar para PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDialogStockRequisition;
