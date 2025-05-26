import { ErrorMessage } from "../../../store/store.model";
import { Price } from "../price.model";


export interface PriceState {
    // Основні дані
    items: Price[];                 // Список цін
    // Метадані
    count: number;                  // Загальна кількість записів
    next: string | null;            // URL для наступної сторінки (пагінація)
    previous: string | null;        // URL для попередньої сторінки (пагінація)
    
    // UI стани
    loading: boolean;               // Індикатор завантаження
    error: ErrorMessage | null;     // Інформація про помилку
    filter: string;                 // Поточний фільтр пошуку
    isActiveFilter: boolean | null; // Фільтр за активністю
    currentProductId: number | null;// ID поточного продукту, для якого завантажені ціни
}

export const initialState: PriceState = {
    items: [],
    count: 0,
    next: null,
    previous: null,
    loading: false,
    error: null,
    filter: '',
    isActiveFilter: null,
    currentProductId: null
};
