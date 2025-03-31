import jsPDF from "jspdf";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

// Helper function to format values
const formatValue = (value) => {
  if (value === undefined || value === null) return "—";
  if (typeof value === "number") {
    return value.toFixed(2).replace(".", ",");
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

const RecipeTechnicalSheet = ({ recipe: rawRecipeData, teaching_modality = null, textButton = "Ver Receita" }) => {
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
        cost_per_serving: 0,
        correction_factor: 0,
        kcal: 0,
        kj: 0,
        protein: 0,
        lipids: 0,
        carbs: 0,
        calcium: 0,
        iron: 0,
        retinol: 0,
        vitC: 0,
        sodium: 0,
        grossWeight: 0,
        cookedWeight: 0,
        unit_measure_gross_weight: "",
        unit_measure_cooked_weight: "",
      };
    }

    return recipe.ingredients.reduce(
      (totals, ingredient) => {
        console.log("ingredient para total", ingredient);
        return {
          cost_per_serving:
            totals.cost_per_serving +
            (parseFloat(ingredient.cost_per_serving) || ingredient.adjusted_cost_per_serving || 0),
          correction_factor: totals.correction_factor + parseFloat(ingredient.correction_factor),
          kcal: totals.kcal + (parseFloat(ingredient.kcal) || 0),
          kj: totals.kj + (parseFloat(ingredient.kj) || 0),
          protein: totals.protein + (parseFloat(ingredient.protein) || 0),
          lipids: totals.lipids + (parseFloat(ingredient.lipids) || 0),
          carbs: totals.carbs + (parseFloat(ingredient.carbohydrate) || 0),
          calcium: totals.calcium + (parseFloat(ingredient.calcium) || 0),
          iron: totals.iron + (parseFloat(ingredient.iron) || 0),
          retinol: totals.retinol + (parseFloat(ingredient.retinol) || 0),
          vitC: totals.vitC + (parseFloat(ingredient.vitaminC) || 0),
          sodium: totals.sodium + (parseFloat(ingredient.sodium) || 0),
          grossWeight: totals.grossWeight + (parseFloat(ingredient.gross_weight) || 0),
          cookedWeight:
            totals.cookedWeight +
            (parseFloat(ingredient.cooked_weight) || parseFloat(ingredient.ajustedCookedWeight) || 0),
          unit_measure_gross_weight: ingredient?.unit_of_measure || ingredient?.unit_of_measure_gross_weight,
          unit_measure_cooked_weight: ingredient?.unit_of_measure || ingredient?.unit_of_measure_cooked_weight,
        };
      },
      {
        cost_per_serving: 0,
        correction_factor: 0,
        kcal: 0,
        kj: 0,
        protein: 0,
        lipids: 0,
        carbs: 0,
        calcium: 0,
        iron: 0,
        retinol: 0,
        vitC: 0,
        sodium: 0,
        grossWeight: 0,
        cookedWeight: 0,
        unit_measure_gross_weight: "",
        unit_measure_cooked_weight: "",
      }
    );
  };

  // Calculate per 100g values
  const calculatePer100g = (totals) => {
    if (totals.cookedWeight <= 0) return {};

    const factor = 100 / totals.cookedWeight;
    return {
      kcal: totals.kcal * factor,
      kj: totals.kj * factor,
      protein: totals.protein * factor,
      lipids: totals.lipids * factor,
      carbs: totals.carbs * factor,
      calcium: totals.calcium * factor,
      iron: totals.iron * factor,
      retinol: totals.retinol * factor,
      vitC: totals.vitC * factor,
      sodium: totals.sodium * factor,
    };
  };

  const totals = calculateTotals();
  const per100g = calculatePer100g(totals);

  let correctionFactor = 0;

  if (totals.correction_factor > 0) {
    correctionFactor = totals.correction_factor / recipe?.ingredients?.length;
  }

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

    // Header section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(getSecretaryTitle(), pageWidth / 2, yPosition, { align: "center" });
    yPosition += 7;

    doc.text("PROGRAMA NACIONAL DE ALIMENTAÇÃO ESCOLAR - PNAE", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 7;

    const modalityText = teaching_modality
      ? `FICHA TÉCNICA DE PREPARO - CARDÁPIO ETAPA/ ${teaching_modality}`
      : "FICHA TÉCNICA DE PREPARO - CARDÁPIO ETAPA/ MODALIDADE DE ENSINO (FAIXA ETÁRIA)";

    doc.text(modalityText, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // Recipe name
    doc.setFontSize(12);
    doc.text(`Nome: ${recipe.name || "Não informado"}`, margin, yPosition);
    yPosition += 8;

    // Ingredients table
    const drawTable = () => {
      // Table header
      const headers = [
        "Ingredientes",
        "Per capita (bruto)",
        "Per capita (líquido)",
        "Fator de correção",
        "Medida caseira",
        "Custo unitário",
        "Energia (kcal)",
        "Energia (kJ)",
        "Proteína (g)",
        "Lipídeos (g)",
        "Carboidratos (g)",
        "Cálcio (mg)",
        "Ferro (mg)",
        "Retinol (mcg)",
        "Vit. C (mg)",
        "Sódio (mg)",
      ];

      const colWidths = [30, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];
      const tableWidth = colWidths.reduce((a, b) => a + b, 0);
      const startX = (pageWidth - tableWidth) / 2;

      let currentX = startX;
      let currentY = yPosition;

      // Draw header
      doc.setFillColor(230, 230, 230);
      doc.rect(startX, currentY - 5, tableWidth, 7, "F");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");

      headers.forEach((header, index) => {
        doc.text(header, currentX + colWidths[index] / 2, currentY, { align: "center" });
        currentX += colWidths[index];
      });

      currentY += 5;

      // Draw rows
      doc.setFont("helvetica", "normal");

      if (recipe.ingredients && recipe.ingredients.length > 0) {
        recipe.ingredients.forEach((ingredient, rowIndex) => {
          // Check if we need a new page
          if (currentY > pageHeight - 15) {
            doc.addPage();
            currentY = margin;

            // Redraw header on new page
            currentX = startX;
            doc.setFont("helvetica", "bold");
            doc.setFillColor(230, 230, 230);
            doc.rect(startX, currentY - 5, tableWidth, 7, "F");

            headers.forEach((header, index) => {
              doc.text(header, currentX + colWidths[index] / 2, currentY, { align: "center" });
              currentX += colWidths[index];
            });

            currentY += 5;
            doc.setFont("helvetica", "normal");
          }

          currentX = startX;

          const rowData = [
            ingredient.ingredient_description || ingredient.description || "—",
            formatValue(ingredient.gross_weight) +
              " " +
              (ingredient?.unit_of_measure || ingredient?.unit_of_measure_gross_weight) || "—",
            formatValue(ingredient.cooked_weight) +
              " " +
              (ingredient?.unit_of_measure || ingredient?.unit_of_measure_cooked_weight) || "—",
            formatValue(ingredient.correction_factor) || "—",
            formatValue(ingredient.homemade_measure) || "—",
            formatValue(ingredient.cost_per_serving) || formatValue(ingredient.adjusted_cost) || "—",
            formatValue(ingredient.kcal) || "—",
            formatValue(ingredient.kj) || "—",
            formatValue(ingredient.protein) || "—",
            formatValue(ingredient.lipids) || "—",
            formatValue(ingredient.carbohydrate) || "—",
            formatValue(ingredient.calcium) || "—",
            formatValue(ingredient.iron) || "—",
            formatValue(ingredient.retinol) || "—",
            formatValue(ingredient.vitaminC) || "—",
            formatValue(ingredient.sodium) || "—",
          ];

          rowData.forEach((data, index) => {
            doc.text(String(data), currentX + colWidths[index] / 2, currentY, { align: "center" });
            currentX += colWidths[index];
          });

          currentY += 5;

          // Draw row lines
          doc.setDrawColor(200, 200, 200);
          doc.line(startX, currentY - 2.5, startX + tableWidth, currentY - 2.5);
        });
      }

      // Draw totals row
      currentX = startX;
      doc.setFont("helvetica", "bold");

      const totalsRow = [
        "Total",
        formatValue(totals.grossWeight) + " " + totals.unit_measure_gross_weight,
        formatValue(totals.cookedWeight) + " " + totals.unit_measure_cooked_weight,
        "—",
        "—",
        formatValue(totals.cost_per_serving),
        formatValue(totals.kcal),
        formatValue(totals.kj),
        formatValue(totals.protein),
        formatValue(totals.lipids),
        formatValue(totals.carbs),
        formatValue(totals.calcium),
        formatValue(totals.iron),
        formatValue(totals.retinol),
        formatValue(totals.vitC),
        formatValue(totals.sodium),
      ];

      doc.setFillColor(240, 240, 240);
      doc.rect(startX, currentY - 2.5, tableWidth, 5, "F");

      totalsRow.forEach((data, index) => {
        doc.text(String(data), currentX + colWidths[index] / 2, currentY, { align: "center" });
        currentX += colWidths[index];
      });

      currentY += 7;

      // Per 100g information
      doc.text("Informação nutricional em 100g", startX, currentY);
      currentY += 5;

      currentX = startX;

      const per100gRow = [
        "",
        "",
        formatValue(100),
        "",
        "",
        "",
        formatValue(per100g.kcal),
        formatValue(per100g.kj),
        formatValue(per100g.protein),
        formatValue(per100g.lipids),
        formatValue(per100g.carbs),
        formatValue(per100g.calcium),
        formatValue(per100g.iron),
        formatValue(per100g.retinol),
        formatValue(per100g.vitC),
        formatValue(per100g.sodium),
      ];

      doc.setFillColor(240, 240, 240);
      doc.rect(startX, currentY - 2.5, tableWidth, 5, "F");

      per100gRow.forEach((data, index) => {
        doc.text(String(data), currentX + colWidths[index] / 2, currentY, { align: "center" });
        currentX += colWidths[index];
      });

      return currentY + 7;
    };

    yPosition = drawTable();

    // Additional information
    const addSection = (title, content) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 15) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(title, margin, yPosition);

      doc.setFillColor(255, 255, 200);
      doc.rect(margin, yPosition + 1, pageWidth - 2 * margin, 10, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      const textLines = doc.splitTextToSize(content || "Não informado", pageWidth - 2 * margin - 5);
      doc.text(textLines, margin + 2, yPosition + 5);

      return yPosition + 14 + (textLines.length - 1) * 3;
    };

    yPosition = addSection("Rendimento total (g)", formatValue(totals.cookedWeight));
    yPosition = addSection("Fator de cocção", correctionFactor);
    yPosition = addSection("Modo de prepararo", recipe.preparation_method || "Não informado");

    // Additional fields
    yPosition = addSection("Medida Caseira", recipe.home_measurements || "Não informado");
    {
      /**arrumar aqui  */
    }
    yPosition = addSection("Tempo de Cocção", `${recipe.timeOfCoccao || "0"} min`);
    yPosition = addSection("Tempo de Preparo", `${recipe.prep_time || "0"} min`);
    yPosition = addSection("Descrições de Preparo", recipe.description_of_recipe || "Não informado");
    yPosition = addSection("Observações", recipe.observations || "Não informado");

    // Footer
    if (yPosition > pageHeight - 25) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(9);
    doc.text("Nome, número do CRN e assinatura do nutricionista.", pageWidth - margin, pageHeight - margin, {
      align: "right",
    });

    // Save the PDF
    const safeName = (recipe.name || "receita").replace(/[^a-z0-9]/gi, "_").toLowerCase();
    doc.save(`${safeName}_ficha_tecnica.pdf`);
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
            <div className="text-xl items-center">PROGRAMA NACIONAL DE ALIMENTAÇÃO ESCOLAR - PNAE</div>
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {teaching_modality !== null
              ? `FICHA TÉCNICA DE PREPARO - CARDÁPIO ETAPA/ ${teaching_modality}`
              : "FICHA TÉCNICA DE PREPARO - CARDÁPIO ETAPA/ MODALIDADE DE ENSINO (FAIXA ETÁRIA)"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-2 mb-2">
          <div className="border-b pb-2">
            <h3 className="font-semibold">Nome: {recipe.name || "Não informado"}</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="border">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="border w-auto font-bold">Ingredientes</TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Per capita
                  <br />
                  (bruto)
                </TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Per capita
                  <br />
                  (líquido)
                </TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Fator de
                  <br />
                  correção
                </TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Medida
                  <br />
                  caseira
                </TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Custo
                  <br />
                  unitário
                </TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Energia
                  <br />
                  (kcal)
                </TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Energia
                  <br />
                  (kJ)
                </TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Proteína
                  <br />
                  (g)
                </TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Lipídeos
                  <br />
                  (g)
                </TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Carboi-
                  <br />
                  dratos (g)
                </TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Cálcio
                  <br />
                  (mg)
                </TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Ferro
                  <br />
                  (mg)
                </TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Retinol
                  <br />
                  (mcg)
                </TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Vit. C<br />
                  (mg)
                </TableHead>
                <TableHead className="border text-center whitespace-nowrap">
                  Sódio
                  <br />
                  (mg)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipe.ingredients &&
                recipe.ingredients.map(
                  (ingredient, index) => (
                    console.log(
                      "ingredienttttttttttttttttt",
                      ingredient,
                      ingredient.unit_of_measure_gross_weight,
                      ingredient.unit_of_measure_cooked_weight
                    ),
                    (
                      <TableRow key={index}>
                        <TableCell className="border font-medium">
                          {ingredient.ingredient_description || ingredient.description || "—"}
                        </TableCell>
                        <TableCell className="border text-center">
                          {ingredient.unit_of_measure
                            ? formatValue(ingredient.gross_weight) + " " + ingredient.unit_of_measure
                            : ingredient.unit_of_measure_gross_weight
                            ? formatValue(ingredient.gross_weight) + " " + ingredient.unit_of_measure_gross_weight
                            : "—"}
                        </TableCell>
                        <TableCell className="border text-center">
                          {ingredient.unit_of_measure
                            ? formatValue(ingredient.cooked_weight) + " " + ingredient.unit_of_measure
                            : ingredient.unit_of_measure_cooked_weight
                            ? formatValue(ingredient.cooked_weight) + " " + ingredient.unit_of_measure_cooked_weight
                            : "—"}
                        </TableCell>
                        <TableCell className="border text-center">
                          {formatValue(ingredient.correction_factor) || "—"}
                        </TableCell>
                        <TableCell className="border text-center">
                          {formatValue(ingredient.homemade_measure) || "—"}
                        </TableCell>
                        <TableCell className="border text-center">
                          {formatValue(ingredient.cost_per_serving) || formatValue(ingredient.adjusted_cost) || "—"}
                        </TableCell>
                        <TableCell className="border text-center">{formatValue(ingredient.kcal) || "—"}</TableCell>
                        <TableCell className="border text-center">{formatValue(ingredient.kj) || "—"}</TableCell>
                        <TableCell className="border text-center">{formatValue(ingredient.protein) || "—"}</TableCell>
                        <TableCell className="border text-center">{formatValue(ingredient.lipids) || "—"}</TableCell>
                        <TableCell className="border text-center">
                          {formatValue(ingredient.carbohydrate) || "—"}
                        </TableCell>
                        <TableCell className="border text-center">{formatValue(ingredient.calcium) || "—"}</TableCell>
                        <TableCell className="border text-center">{formatValue(ingredient.iron) || "—"}</TableCell>
                        <TableCell className="border text-center">{formatValue(ingredient.retinol) || "—"}</TableCell>
                        <TableCell className="border text-center">{formatValue(ingredient.vitaminC) || "—"}</TableCell>
                        <TableCell className="border text-center">{formatValue(ingredient.sodium) || "—"}</TableCell>
                      </TableRow>
                    )
                  )
                )}
              {/* Totals row */}
              <TableRow className="bg-gray-100 font-bold">
                <TableCell className="border">Total</TableCell>
                <TableCell className="border text-center">
                  {formatValue(totals.grossWeight) + " " + totals.unit_measure_gross_weight}
                </TableCell>
                <TableCell className="border text-center">
                  {formatValue(totals.cookedWeight) + " " + totals.unit_measure_cooked_weight}
                </TableCell>
                <TableCell className="border text-center">—</TableCell>
                <TableCell className="border text-center">—</TableCell>
                <TableCell className="border text-center">{formatValue(totals.cost_per_serving)}</TableCell>
                <TableCell className="border text-center">{formatValue(totals.kcal)}</TableCell>
                <TableCell className="border text-center">{formatValue(totals.kj)}</TableCell>
                <TableCell className="border text-center">{formatValue(totals.protein)}</TableCell>
                <TableCell className="border text-center">{formatValue(totals.lipids)}</TableCell>
                <TableCell className="border text-center">{formatValue(totals.carbs)}</TableCell>
                <TableCell className="border text-center">{formatValue(totals.calcium)}</TableCell>
                <TableCell className="border text-center">{formatValue(totals.iron)}</TableCell>
                <TableCell className="border text-center">{formatValue(totals.retinol)}</TableCell>
                <TableCell className="border text-center">{formatValue(totals.vitC)}</TableCell>
                <TableCell className="border text-center">{formatValue(totals.sodium)}</TableCell>
              </TableRow>
              {/* <TableRow className="bg-gray-50">
                <TableCell colSpan={2} className="border text-center font-bold">
                  Informação nutricional em 100g
                </TableCell>
                <TableCell className="border text-center">100,00</TableCell>
                <TableCell className="border text-center">—</TableCell>
                <TableCell className="border text-center">—</TableCell>
                <TableCell className="border text-center">—</TableCell>
                <TableCell className="border text-center">{formatValue(per100g.kcal)}</TableCell>
                <TableCell className="border text-center">{formatValue(per100g.kj)}</TableCell>
                <TableCell className="border text-center">{formatValue(per100g.protein)}</TableCell>
                <TableCell className="border text-center">{formatValue(per100g.lipids)}</TableCell>
                <TableCell className="border text-center">{formatValue(per100g.carbs)}</TableCell>
                <TableCell className="border text-center">{formatValue(per100g.calcium)}</TableCell>
                <TableCell className="border text-center">{formatValue(per100g.iron)}</TableCell>
                <TableCell className="border text-center">{formatValue(per100g.retinol)}</TableCell>
                <TableCell className="border text-center">{formatValue(per100g.vitC)}</TableCell>
                <TableCell className="border text-center">{formatValue(per100g.sodium)}</TableCell>
              </TableRow> */}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-4">
            <div className="border p-2 bg-yellow-50">
              <h3 className="text-md font-bold">Rendimento total (g)</h3>
              <p>{formatValue(totals.cookedWeight)}</p>
            </div>
            <div className="border p-2 bg-yellow-50">
              <h3 className="text-md font-bold">Fator de cocção</h3>
              <p>{correctionFactor || "0"}</p>
            </div>
            <div className="border p-2 bg-yellow-50">
              <h3 className="text-md font-bold">Modo de prepararo</h3>
              <p className="whitespace-pre-line">{recipe.preparation_method || "Não informado"}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border p-2 bg-yellow-50">
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
            </div>
            <div className="border p-2 bg-yellow-50">
              <h3 className="text-md font-bold">Tempo de Cocção</h3>
              <p>{recipe.timeOfCoccao || "0"} min</p>
            </div>
            <div className="border p-2 bg-yellow-50">
              <h3 className="text-md font-bold">Tempo de Preparo</h3>
              <p>{recipe.prep_time || "0"} min</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="border p-2 bg-yellow-50">
            <h3 className="text-md font-bold">Descrições de Preparo</h3>
            <p className="whitespace-pre-line">{recipe.description_of_recipe || "Não informado"}</p>
          </div>
          <div className="border p-2 bg-yellow-50">
            <h3 className="text-md font-bold">Observações</h3>
            <p className="whitespace-pre-line">{recipe.observations || "Não informado"}</p>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button onClick={handleExportToPDF} className="mt-4">
            Exportar para PDF
          </Button>
          {/* <div className="text-right text-sm italic mt-6">Nome, número do CRN e assinatura do nutricionista.</div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeTechnicalSheet;
