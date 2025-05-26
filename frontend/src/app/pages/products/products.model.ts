import { CategoryFull } from "../categories/categories.model";
import { Price } from "../price/price.model";

export interface Product {
    id: number;
    title: string;
    category: CategoryFull | null; // може бути ID або повний об'єкт категорії
    current_price?: Price | null;
    current_price_value?: string | null; // повний об'єкт ціни
    current_price_id?: number | null;
    description?: string;
    created?: string;
    updated?: string;
    created_by?: string | null;
    updated_by?: string | null;
}

  export interface ProductResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Product[];
}

export interface ProductSubmit {
  title: string;
  description?: string;
  category: number | null;
}


