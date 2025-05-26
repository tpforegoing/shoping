import { Product } from "../../products/products.model";

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  price: string;
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

export const initialCartState: CartState = {
  items: [],
  loading: false,
  error: null
};
