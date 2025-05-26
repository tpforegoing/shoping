import { Product } from "../products/products.model";

// Модель цін
export interface Price {
    id: number;                //
    product_id: number;
    product: Product | string;
    value: string;
    valid_from: string;         // ISO-формат дати (типово для DRF)
    valid_to: string | null;
    is_active: boolean;
    description: string;
    created?: string;
    updated?: string;
    created_by?: string | null;
    updated_by?: string | null;
}

// Модель відповіді сервера при отриманні списку цін
export interface PriceResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Price[];
}

// Модель для відправки на сервер при створенні або оновленні ціни
export interface PriceSubmit {
    product: number;
    value: number;
    valid_from: string;
    valid_to: string | null;
    is_active: boolean;
    description: string;
    deactivate_previous?: boolean;
}

