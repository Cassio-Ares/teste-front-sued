export interface IngredientTypes {
  id: number;
  description: string;
  legend_type: string | null;
  gross_weight: number;
  correction_factor: number | null;
  cooking_index: number | null;
  kcal: number | null;
  kj: number | null;
  protein: number | null;
  lipids: number | null;
  carbohydrate: number | null;
  calcium: number | null;
  iron: number | null;
  retinol: number | null;
  vitaminC: number | null;
  sodium: number | null;
  created_by: number;
  updated_by: number | null;
  deleted_at: Date | null;
}

export interface IngredientBasicTypes {
  id: number;
  description: string;
}

