import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product, ProductResponse, ProductSubmit } from './products.model';
import { Price, PriceResponse } from '../price/price.model';
import { LoadParams, QueryParams } from '../../store/store.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
//   private readonly apiUrl = '/api/category/';
  private readonly API_URL = `${environment.apiUrl}/api/products/`;

  getProducts(params: LoadParams): Observable<ProductResponse> {
    const queryParams: QueryParams = {
      ...(params.page !== 1 && { page: params.page }),
      ...(params.filter?.trim() && { search: params.filter }),
      ...((params.isActive ?? null) !== null && { is_active: params.isActive!.toString() }),
    }
    return this.http.get<ProductResponse>(this.API_URL, { params: queryParams as any, withCredentials: true });
  }

  createProduct(data: Partial<ProductSubmit>): Observable<Product> {

    return this.http.post<Product>(this.API_URL, data);
  }

  updateProduct(id: number, changes: Partial<ProductSubmit>): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}${id}/`, changes);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}${id}/`);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}${id}/`, { withCredentials: true });
  }

  // get Product details with prices
  getProductPrices(id: number, params : LoadParams): Observable<PriceResponse> {
    const queryParams: QueryParams = {
          ...(params.page !== 1 && { page: params.page }),
          ...(params.filter?.trim() && { search: params.filter }),
          ...((params.isActive ?? null) !== null && { is_active: params.isActive!.toString() }),
        }
    return this.http.get<PriceResponse>(`${this.API_URL}${id}/prices/`, 
        { params: queryParams as any, withCredentials: true });
  }
}
