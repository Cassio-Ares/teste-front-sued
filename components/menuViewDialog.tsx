'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { jsPDF } from "jspdf";
import { recipes } from "@/app/mock/recipes.mock";

type MenuViewDialogProps = {
  day: string;
  meal: string;
  month: string;
  weekType: string;
};

const MenuViewDialog = ({
  day,
  meal,
  month,
  weekType,
}: MenuViewDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const recipe = recipes.find((rData) => rData.name === meal);

  const handleExportToPDF = () => {
    
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: "mm",
      format: [297, 210], 
    });

    const marginLeft = 20;
    let currentY = 20;

    doc.setFontSize(16);
    doc.text("Detalhes do Cardápio", marginLeft, currentY);

    currentY += 10;
    doc.setFontSize(12);
    doc.text(`Mês: ${month}`, marginLeft, currentY);
    currentY += 10;
    doc.text(`Tipo de Semana: ${weekType === "oddWeeks" ? "Semanas Ímpares" : "Semanas Pares"}`, marginLeft, currentY);
    currentY += 10;
    doc.text(`Dia: ${day}`, marginLeft, currentY);
    currentY += 10;
    doc.text(`Refeição: ${meal}`, marginLeft, currentY);

   
    if (recipe) {
      const headers = ["Ingrediente", "PB", "FC", "PL", "KCAL", "PTN", "CHO", "LPD", "VIT A", "VIT C", "CALCIO", "FERRO"];
      const columnWidths = [40, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];

      currentY += 10;
      let currentX = marginLeft;

      // Cabeçalho
      doc.setFont('bold');
      headers.forEach((header, index) => {
        doc.text(header, currentX, currentY);
        currentX += columnWidths[index];
      });

      doc.setFont('normal');
      currentY += 10;

      recipe.ingredients.forEach((ingredient) => {
        currentX = marginLeft;

        const ingredientData = [
          ingredient.name,
          ingredient.pb || '-',
          ingredient.fc || '-',
          ingredient.pl || '-',
          ingredient.kcal || '-',
          ingredient.ptn || '-',
          ingredient.cho || '-',
          ingredient.lpd || '-',
          ingredient.vitA || '-',
          ingredient.vitC || '-',
          ingredient.calcio || '-',
          ingredient.ferro || '-'
        ];

        ingredientData.forEach((data, index) => {
          doc.text(String(data), currentX, currentY);
          currentX += columnWidths[index];
        });

        currentY += 10;

        if (currentY > 180) {
          doc.addPage([297, 210]);
          currentY = 20;
        }
      });

      currentY += 20;
      doc.text(`Método de Preparo: ${recipe.preparationMethod}`, marginLeft, currentY);
      currentY += 10;
      doc.text(`Responsável Técnico: ${recipe.technicalResponsible.name} - CRN: ${recipe.technicalResponsible.crn11}`, marginLeft, currentY);
    }

    // Save the PDF
     doc.save(`cardapio_${month}_${day}.pdf`);
  };

  const renderIngredientDetails = (ingredient: any) => {
    // Filter out the id and remove null values
    const details = Object.entries(ingredient)
      .filter(([key, value]) => key !== 'id' && value !== null)
      .map(([key, value]) => `${key.toUpperCase()}: ${value}`);

    return details;
  };

  return (
    <>
      <Button
        variant="ghost"
        className="px-2 py-1"
        onClick={() => setIsOpen(true)}
      >
        <Eye />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
       <div className="max-h-[600px] space-y-4 py-4 overflow-y-auto">
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Cardápio</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre o item do cardápio
            </DialogDescription>
          </DialogHeader>

        
            <div>
              <strong>Mês:</strong> {month}
            </div>
            <div>
              <strong>Tipo de Semana:</strong>
              {weekType === "oddWeeks" ? "Semanas Ímpares" : "Semanas Pares"}
            </div>
            <div>
              <strong>Dia:</strong> {day}
            </div>
            <div>
              <strong>Refeição:</strong> {meal}
            </div>
            {recipe && (
              <div>
                <strong>Ingredientes:</strong>
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Ingrediente</th>
                      <th className="border p-2">PB</th>
                      <th className="border p-2">FC</th>
                      <th className="border p-2">PL</th>
                      <th className="border p-2">KCAL</th>
                      <th className="border p-2">PTN</th>
                      <th className="border p-2">CHO</th>
                      <th className="border p-2">LPD</th>
                      <th className="border p-2">VIT A</th>
                      <th className="border p-2">VIT C</th>
                      <th className="border p-2">CALCIO</th>
                      <th className="border p-2">FERRO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipe.ingredients.map((ingredient) => (
                      <tr key={ingredient.id}>
                        <td className="border p-2">{ingredient.name}</td>
                        <td className="border p-2">{ingredient.pb || 'N/A'}</td>
                        <td className="border p-2">{ingredient.fc || 'N/A'}</td>
                        <td className="border p-2">{ingredient.pl || 'N/A'}</td>
                        <td className="border p-2">{ingredient.kcal || 'N/A'}</td>
                        <td className="border p-2">{ingredient.ptn || 'N/A'}</td>
                        <td className="border p-2">{ingredient.cho || 'N/A'}</td>
                        <td className="border p-2">{ingredient.lpd || 'N/A'}</td>
                        <td className="border p-2">{ingredient.vitA || 'N/A'}</td>
                        <td className="border p-2">{ingredient.vitC || 'N/A'}</td>
                        <td className="border p-2">{ingredient.calcio || 'N/A'}</td>
                        <td className="border p-2">{ingredient.ferro || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4">
                  <strong>Método de Preparo:</strong>
                  <p>{recipe.preparationMethod}</p>
                  <strong>Responsável Técnico:</strong>
                  <p>
                    {recipe.technicalResponsible.name} - CRN: {recipe.technicalResponsible.crn11}
                  </p>
                </div>
              </div>
            )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Fechar
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold "
              onClick={handleExportToPDF}
            >
              Exportar Ficha técnica
            </Button>
          </DialogFooter>
      </DialogContent>
      </div>
      </Dialog>
    </>
  );
};

export default MenuViewDialog;

