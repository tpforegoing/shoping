// export interface Category {
//     id: number;
//     code: string;
//     icon: string | null;
//     title: string;
//     full_title: string;
//     parent: number | null;
// }

export interface CategoryFull {
    id: number;
    code: string;
    icon: string | null;
    title: string;
    full_title: string;
    description: string | null;
    parent: number | null;
    created: string;
    updated: string; 
    created_by: string | null;
    updated_by: string | null;
}

export interface CategoryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: CategoryFull[];
}

