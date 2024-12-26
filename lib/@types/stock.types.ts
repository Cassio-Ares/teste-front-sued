export interface StockTypes {
  id?: number;
  state_id?: string | number;
  city_id?: string | number;
  school_id?: string | number;
  ingredient_id?: string | number;
  ingredient_name?: string;
  brand: string;
  quantity_min: number | null;
  unit_of_measure: string;
  unit_price: number | null;
  total_quantity: number | null;
  total_invested?: number;
  expiration_date: string | Date;
}
