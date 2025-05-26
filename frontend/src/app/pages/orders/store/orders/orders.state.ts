import { ErrorMessage, LoadParams } from "../../../../store/store.model";
import { Order } from "../../orders.model";


export interface OrdersState {
    orders: Order[];
    selectedOrder: Order | null;
    count: number;
    next: string | null;
    previous: string | null;
    loading: boolean;
    error: ErrorMessage | null;     // Інформація про помилку
    params : LoadParams | null;     // фільтрація 
}

export const initialOrdersState: OrdersState = {
    orders: [],
    selectedOrder: null,
    count: 0,
    next: null,
    previous: null,
    loading: false,
    error: null,
    params: null,
};
