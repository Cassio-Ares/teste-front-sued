export interface RecipeTypes {
  name: string;
  preparation_method: string;
  required_utensils: string;
  description_of_recipe: string;
  observations: string;
  home_measurements: string;
  prep_time: number;
  timeOfCoccao: number;
  servings: number;
  ingredients: IngredientRecipeTypes[];
}

interface IngredientRecipeTypes {
  id?: number;
  ingredient_id: number;
  cooked_weight?: number | undefined;
  gross_weight?: number | undefined;
  unit_of_measure: "kg" | "g" | "L" | "ml";
  description?: string;
}
