import { formatValue } from "@/lib/utils/formatValue";
import jsPDF from "jspdf";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

// import { RecipeInformationTypes } from "../lib/@types/recipeInformation.types.ts";

const RecipeDialogStockRequisition = ({ recipe, textButton }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const margin = 10;
    let yPosition = margin;
    const pageHeight = 297;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(recipe?.school_name || "Escola não informada", margin, yPosition);
    yPosition += 10;
    doc.text("FICHA TÉCNICA DE PREPARO", margin, yPosition);
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
    doc.text("Ingredientes", margin, yPosition);
    yPosition += 10;

    const headers = ["Ingrediente", "Bruto", "Uni.med", "Líquido", "Uni.med", "Custo Total (R$)"];
    const columnWidths = [60, 30, 30, 30, 30, 30];
    doc.setFontSize(10);
    let xPosition = margin;

    headers.forEach((header, index) => {
      doc.text(header, xPosition, yPosition);
      xPosition += columnWidths[index];
    });
    yPosition += 8;

    recipe?.ingredients?.forEach((ingredient) => {
      xPosition = margin;
      const rowData = [
        ingredient.ingredient_description || ingredient.description,
        ingredient?.gross_weight || "N/A",
        ingredient?.unit_of_measure || "N/A",
        ingredient?.cooked_weight || "N/A",
        ingredient?.unit_of_measure_cooked_weight || "N/A",
        ingredient?.cost || "0",
      ];
      rowData.forEach((data, index) => {
        doc.text(String(data), xPosition, yPosition);
        xPosition += columnWidths[index];
      });
      yPosition += 6;
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    });

    doc.save(`${recipe?.name}_ficha_tecnica.pdf`);
  };

  const schoolName = recipe?.recipe?.school_name || recipe?.school_name || "Escola não informada";
  const isMunicipal = schoolName.toLowerCase().includes("municipal");
  const isEstadual = schoolName.toLowerCase().includes("estadual");

  const getSecretaryTitle = () => {
    if (isMunicipal) {
      return `Secretaria Municipal de Educação do Município de ${recipe?.city_name}`;
    } else if (isEstadual) {
      return `Secretaria Estadual de Educação do Estado de ${recipe?.state_name}`;
    }
    return schoolName;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{textButton}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="m-auto">
          <DialogTitle className="text-4xl text-center">{getSecretaryTitle()}</DialogTitle>
          <DialogDescription className="text-center text-lg">{recipe?.name}</DialogDescription>
        </DialogHeader>
        <h3 className="text-lg font-bold mb-2">Ingredientes</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingrediente</TableHead>
              <TableHead>Per capita (bruto)</TableHead>
              <TableHead>Unid.Med</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipe?.ingredients?.map((ingredient, index) => (
              <TableRow key={index}>
                <TableCell>{ingredient.ingredient_description || ingredient?.description}</TableCell>
                <TableCell>
                  {formatValue(ingredient?.gross_weight) || formatValue(ingredient.adjusted_quantity)}
                </TableCell>
                <TableCell>{ingredient.unit_of_measure || ingredient.unit_of_measure_gross_weight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {recipe.ingredients && recipe.ingredients.some((ing) => ing.brand_allocations) && (
          <>
            <h3 className="text-lg font-bold mt-4">Orientação para melhor aproveitamento do estoque</h3>
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

        <Button onClick={handleExportToPDF}>Exportar para PDF</Button>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDialogStockRequisition;

// const RecipeDialogStockRequisition = ({
//   recipe,
//   teaching_modality = null,
//   textButton,
// }: {
//   recipe: any;
//   teaching_modality?: any;
//   textButton?: string;
// }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   console.log("recipe", recipe); //inventory_id, inventory_data = [{ingredient_id, quantity= [gross_weight || adjusted_quantity, unit_of_measure || unit_of_measure_gross_weight] , movement_type="OUTPUT"}]

//   const handleExportToPDF = () => {
//     const doc = new jsPDF({
//       orientation: "landscape",
//       unit: "mm",
//       format: "a4",
//     });

//     const margin = 10;
//     let yPosition = margin;

//     const contentHeight = calculateContentHeight();
//     const pageHeight = 297;

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(20);
//     doc.text(recipe?.school_name || "Escola não informada", margin, yPosition, {
//       align: "left",
//     });
//     yPosition += 10;
//     doc.text("FICHA TÉCNICA DE PREPARO", margin, yPosition, { align: "left" });
//     yPosition += 15;

//     doc.setFontSize(16);
//     doc.text("Informações da Receita", margin, yPosition);
//     yPosition += 10;

//     doc.setFontSize(12);
//     doc.text(`Custo Total: R$ ${recipe?.total_cost}`, margin, yPosition);
//     yPosition += 8;
//     doc.text(`Custo por Porção: R$ ${recipe?.metrics?.cost_per_serving.toFixed(2)}`, margin, yPosition);
//     yPosition += 8;
//     doc.text(`Número de Porções: ${recipe?.servings}`, margin, yPosition);
//     yPosition += 15;

//     doc.setFontSize(16);
//     doc.text("Utensílios Necessários", margin, yPosition);
//     yPosition += 10;

//     doc.setFontSize(12);
//     const utensilsText = doc.splitTextToSize(recipe?.required_utensils || "Nenhum utensílio informado", 170);
//     utensilsText.forEach((line: string) => {
//       doc.text(line, margin, yPosition);
//       yPosition += 6;
//     });
//     yPosition += 10;

//     doc.setFontSize(16);
//     doc.text("Ingredientes", margin, yPosition);
//     yPosition += 10;

//     const headers = [
//       "Ingrediente",
//       "Bruto",
//       "Uni.med",
//       "Líquido",
//       "Uni.med",
//       "Med. caseira",
//       "Fator Correção",
//       "Custo Unitário (R$)",
//       "kcal",
//       "kJ",
//       "Proteína (g)",
//       "Lipídios (g)",
//       "Carboidrato (g)",
//       "Cálcio (mg)",
//       "Ferro (mg)",
//       "Retinol (mcg)",
//       "Vitamina C (mg)",
//       "Sódio (mg)",
//       "Custo Total (R$)",
//     ];
//     const columnWidths = [40, 30, 15, 30, 15, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];

//     doc.setFontSize(10);
//     let xPosition = margin;

//     // Cabeçalho da tabela
//     headers.forEach((header, index) => {
//       doc.text(header, xPosition, yPosition);
//       xPosition += columnWidths[index];
//     });
//     yPosition += 8;

//     // Conteúdo da tabela
//     recipe?.ingredients?.forEach((ingredient) => {
//       xPosition = margin;
//       const rowData = [
//         ingredient.ingredient_description || ingredient.description,
//         ingredient?.gross_weight || ingredient?.adjusted_quantity || "N/A",
//         ingredient?.unit_of_measure || ingredient?.unit_of_measure_gross_weight || "N/A",
//         ingredient?.cooked_weight || ingredient?.ajustedCookedWeight || "N/A",
//         ingredient?.unit_of_measure || ingredient?.unit_of_measure_cooked_weight || "N/A",
//         ingredient?.homemade_measure || "N/A",
//         ingredient?.correction_factor || "N/A",
//         `R$ ${ingredient?.cost_per_serving || ingredient?.adjusted_cost || "0"}`,
//         ingredient?.kcal || "0",
//         ingredient?.kj || "0",
//         ingredient?.protein || "0",
//         ingredient?.lipids || "0",
//         ingredient?.carbohydrate || "0",
//         ingredient?.calcium || "0",
//         ingredient?.iron || "0",
//         ingredient?.retinol || "0",
//         ingredient?.vitaminC || "0",
//         ingredient?.sodium || "0",
//         ingredient?.cost || "0",
//       ];

//       rowData.forEach((data, index) => {
//         doc.text(String(data), xPosition, yPosition);
//         xPosition += columnWidths[index];
//       });

//       yPosition += 6;

//       // Quebra de página
//       if (yPosition > pageHeight - margin) {
//         doc.addPage();
//         yPosition = margin;
//       }
//     });

//     doc.setFontSize(16);
//     doc.text("Nome da Receita", margin, yPosition);
//     yPosition += 10;

//     doc.setFontSize(12);
//     doc.text(recipe?.name || "Receita sem nome", margin, yPosition);
//     yPosition += 15;

//     doc.setFontSize(16);
//     doc.text("Método de Preparo", margin, yPosition);
//     yPosition += 10;

//     doc.setFontSize(12);
//     const preparationText = doc.splitTextToSize(recipe?.preparation_method || "Método de preparo não informado", 170);
//     preparationText.forEach((line: string) => {
//       doc.text(line, margin, yPosition);
//       yPosition += 6;
//     });

//     doc.setFontSize(16);
//     doc.text("Medidas Caseiras", margin, yPosition);
//     yPosition += 10;

//     doc.setFontSize(12);
//     const preparationText2 = doc.splitTextToSize(recipe?.home_measurements || "Medidas caseiras não informadas", 170);
//     preparationText2.forEach((line: string) => {
//       doc.text(line, margin, yPosition);
//       yPosition += 6;
//     });

//     doc.setFontSize(16);
//     doc.text("Tempo de Preparo", margin, yPosition);
//     yPosition += 10;

//     doc.setFontSize(12);
//     doc.text(`${recipe?.prep_time || "Tempo de preparo não informado"} minutos`, margin, yPosition);
//     yPosition += 15;

//     // Salvar o PDF
//     doc.save(`${recipe?.name}_ficha_tecnica.pdf`);
//   };

//   const calculateContentHeight = () => {
//     const lineHeight = 10;
//     const numberOfLines = 20;
//     return lineHeight * numberOfLines;
//   };

//   //ajuste do nome da tabela (lembrar de reorganizar)
//   const schoolName = recipe?.recipe?.school_name || recipe?.school_name || "Escola não informada";
//   const isMunicipal = schoolName.toLowerCase().includes("municipal");
//   const isEstadual = schoolName.toLowerCase().includes("estadual");

//   const getSecretaryTitle = () => {
//     if (isMunicipal) {
//       return `Secretaria Municipal de Educação do Município de ${recipe?.city_name}`;
//     } else if (isEstadual) {
//       return `Secretaria Estadual de Educação do Estado de ${recipe?.state_name}`;
//     }

//     return schoolName;
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button>{textButton}</Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader className="m-auto">
//           <DialogTitle className="text-4xl flex flex-col justify-center items-center">
//             {teaching_modality !== null ? getSecretaryTitle() : getSecretaryTitle() || "Escola não informada"}
//             <div className="text-2xl items-center">FICHA DE INGREDIENTES PARA PREPARO</div>
//           </DialogTitle>
//           <DialogDescription className="text-center text-lg">
//             {teaching_modality !== null
//               ? `${recipe.recipe?.name || recipe?.name} - ${teaching_modality}`
//               : `${recipe.recipe?.name || recipe?.name}`}
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid grid-cols-3 gap-4 mb-4"></div>
//         <h3 className="text-lg font-bold mb-2">Ingredientes</h3>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Ingrediente</TableHead>
//               <TableHead>Per capita (bruto)</TableHead>
//               <TableHead>Unid.Med</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {recipe?.ingredients?.map((ingredient, index) => (
//               <TableRow key={index}>
//                 <TableCell>{ingredient.ingredient_description || ingredient?.description}</TableCell>
//                 <TableCell>
//                   {formatValue(ingredient?.gross_weight) || formatValue(ingredient.adjusted_quantity)}
//                 </TableCell>
//                 <TableCell>{ingredient.unit_of_measure || ingredient.unit_of_measure_gross_weight}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>

//         <Button onClick={handleExportToPDF}>Exportar para PDF req</Button>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default RecipeDialogStockRequisition;
