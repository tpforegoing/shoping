export const ACTION_LIST = 'list' as const;
export const ACTION_CREATE = 'create' as const;
export const ACTION_UPDATE = 'update' as const;
export const ACTION_DELETE = 'delete' as const;
export const ACTION_DETAILS = 'details' as const; //
export const CLIENT = 'client' as const;
export const MANAGER = 'manager' as const;

export const PARAMS_FILTER = 'search' as const; 

export type ErrorSource = 
    typeof ACTION_LIST |
    typeof ACTION_CREATE | 
    typeof ACTION_UPDATE | 
    typeof ACTION_DELETE |
    typeof ACTION_DETAILS;


export interface ErrorMessage{
    source:  ErrorSource ;
    message: string;
    fieldErrors: Record<string, string>;
}

// Базовий інтерфейс для параметрів запиту
export interface QueryParams {
  page?: number;
  filter?: string;
  ordering?: string;
  is_active?: string;  // Рядкове представлення для URL
  itemId?: number;
  sourceUrl?: string;
}

// Інтерфейс для внутрішнього використання в компонентах
export interface LoadParams {
  page?: number;
  filter?: string;
  ordering?: string;
  isActive?: boolean;  // Булеве значення для логіки
  itemId?: number;
}