import { IngredientTypes } from "./ingredient.types";

export interface IngredientBasicInformation {
  cooked_weight: number;
  gross_weight: number;
  unit_of_measure: string;
  ingredient_description?: string;
  description?: string;
  legend_type: string | null;
  correction_factor: number | string;
  cooking_index: number | string;
  kcal: string | number;
  kj: string | number;
  protein: number | null;
  lipids: number | null;
  carbohydrate: number | null;
  calcium: number | null;
  iron: number | null;
  retinol: number | null;
  vitaminC: number | null;
  sodium: number | null;
  display_quantity: string | number;
  display_unit?: string;
  cost: number;
  cost_per_serving: number;
}

export interface ExtendedIngredient extends IngredientTypes {
  ingredient_id?: number;
  ingredient_gross_weight?: string | number;
  brand?: string;
  unit_price?: string;
  expiration_date?: string;
  inventory_id?: number;
  quantity_min?: string;
  inventory_unit?: string;
  total_invested?: string;
  quantity?: number;
  deleted_at?: string | null;
  total_cost?: number;
  deleted_at?: Date | null | undefined;
}


export interface BaseRecipeInformation {
  id: number;
  name: string;
  url_image: string | null;
  preparation_method: string;
  required_utensils: string;
  description_of_recipe: string;
  observations: string;
  timeOfCoccao: number; 
  prep_time: number;
  created_by: number;
  updated_by: number | null;
  servings: number;
  created_by_name: string;
  school_name: string | null;
  metrics: {
    total_cost: number;
    cost_per_serving: number;
    total_ingredients: number;
    average_ingredient_cost: number;
  };
}


type RecipeResponseType1 = {
  success: true;
  recipe: BaseRecipe & {
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
  ingredients: ExtendedIngredient[];
  message: string;
};


type RecipeResponseType2 = BaseRecipe & {
  ingredients: (ExtendedIngredient & {
    id: number;
    description: string;
  })[];
};


export type RecipeInformationTypes = RecipeResponseType1 | RecipeResponseType2;

// export interface IngredientBasicInformation {
//   cooked_weight: number;
//   gross_weight: number;
//   unit_of_measure: string;
//   ingredient_description?: string;
//   description?: string;
//   legend_type: string | null;
//   correction_factor: string;
//   cooking_index: string;
//   kcal: string | number;
//   kj: string | number;
//   protein: number | null;
//   lipids: number | null;
//   carbohydrate: number | null;
//   calcium: number | null;
//   iron: number | null;
//   retinol: number | null;
//   vitaminC: number | null;
//   sodium: number | null;
//   display_quantity: string | number;
//   display_unit?: string;
//   unit_of_measure?: string;
//   cost: number;
//   cost_per_serving: number;
// };

// export interface ExtendedIngredient extends BaseIngredient {
//   ingredient_id?: number;
//   id?: number;
//   ingredient_gross_weight?: string;
//   brand?: string;
//   unit_price?: string;
//   expiration_date?: string;
//   inventory_id?: number;
//   quantity_min?: string;
//   inventory_unit?: string;
//   total_invested?: string;
//   quantity?: number;
//   deleted_at?: string | null;
//   total_cost?: number;
// };

// export interface BaseRecipeInformation{
//   id: number;
//   name: string;
//   url_image: string | null;
//   preparation_method: string;
//   required_utensils: string;
//   description_of_recipe: string;
//   observations: string;
//   timeOfCoccao: number;
//   prep_time: number;
//   created_by: number;
//   updated_by: number | null;
//   servings: number;
//   created_by_name: string;
//   school_name: string | null;
//   metrics: {
//     total_cost: number;
//     cost_per_serving: number;
//     total_ingredients: number;
//     average_ingredient_cost: number;
//   };
// };

// type RecipeResponseType1 = {
//   success: true;
//   recipe: BaseRecipe & {
//     deleted_at: string | null;
//     created_at: string;
//     updated_at: string;
//   };
//   ingredients: ExtendedIngredient[];
//   message: string;
// };

// // Tipo para o terceiro formato
// type RecipeResponseType2 = BaseRecipe & {
//   ingredients: (ExtendedIngredient & {
//     id: number;
//     description: string;
//   })[];
// };

// export type RecipeInformationTypes = RecipeResponseType1 | RecipeResponseType2;
