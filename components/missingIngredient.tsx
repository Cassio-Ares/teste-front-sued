import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export const MissingIngredient = ({ recipe, missingIngredients }) => {
  if (!missingIngredients || missingIngredients.length === 0) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <AlertCircle className="w-4 h-4" />
          Ingredientes em Falta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Não é possível calcular o custo da receita</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="mb-2 font-medium">
            Os seguintes ingredientes estão em falta no estoque:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            {missingIngredients.map((ingredient) => (
              <li key={ingredient.id} className="text-sm">
                {ingredient.description}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex justify-end">
          <DialogClose asChild>
            <Button variant="secondary">Fechar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};