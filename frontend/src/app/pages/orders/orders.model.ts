import { Customer } from "../clients/clients.model";
import { Product } from "../products/products.model";

export interface OrderItem {
    id: number;
    order: number;
    product: Product;
    quantity: number;
    price_at_time: string;
    total_price: string;
    created?: string;
    updated?: string;
    created_by?: string | null;
    updated_by?: string | null;
}

export interface Order {
    id: number;
    customer: Customer;
    status: 'draft' | 'submitted' | 'paid' | 'cancelled';
    total_price: string;
    items?: OrderItem[];
    created?: string;
    updated?: string;
    created_by?: string | null;
    updated_by?: string | null;
}

export interface OrderResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Order[];
}

export interface OrderSubmit {
    customer: number;
    status: 'draft' | 'submitted' | 'paid' | 'cancelled';
}

export interface OrderItemSubmit {
    order: number;
    product: number;
    quantity: number;
}
