import { ErrorMessage, LoadParams } from "../../../store/store.model";
import { Customer } from "../clients.model";



export interface CustomerState {
    // Основні дані
    items: Customer[];                 // Список цін
    // Метадані
    count: number;                  // Загальна кількість записів
    next: string | null;            // URL для наступної сторінки (пагінація)
    previous: string | null;        // URL для попередньої сторінки (пагінація)
    
    // UI стани
    loading: boolean;               // Індикатор завантаження
    error: ErrorMessage | null;     // Інформація про помилку
    params : LoadParams | null;     // фільтрація 

}

export const initialCustomerState: CustomerState = {
    items: [],
    count: 0,
    next: null,
    previous: null,
    loading: false,
    error: null,
    params: null,
};
