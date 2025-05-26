import { User } from "../../auth/auth.model";

export interface Customer {
    id: number;
    code: string;
    name: string;
    user: User | any;
    phone_no: string;
    created?: string;
    updated?: string;
    created_by?: string | null;
    updated_by?: string | null;
}

export interface CustomerResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Customer[];
}

export interface CustomerSubmit {
    code: string;
    name: string;
    phone_no?: string;
}
