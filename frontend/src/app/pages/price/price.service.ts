import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Price, PriceResponse, PriceSubmit } from './price.model';
import { LoadParams, QueryParams } from '../../store/store.model';


@Injectable({ providedIn: 'root' })
export class PriceService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/api/price/`;

  // Отримання списку цін з можливістю фільтрації за активністю
  getPrices(params: LoadParams): Observable<PriceResponse> {
    const queryParams: QueryParams = {
      ...(params.page !== 1 && { page: params.page }),
      ...(params.filter?.trim() && { search: params.filter }),
      ...((params.isActive ?? null) !== null && { is_active: params.isActive!.toString() }),
    }
    
    return this.http.get<PriceResponse>(this.API_URL, {  params: queryParams as any, withCredentials: true });
  }

  // Отримання деталей ціни
  getById(id: number): Observable<Price> {
    return this.http.get<Price>(`${this.API_URL}${id}/`, { withCredentials: true });
  }

  // Створення нової ціни
  createPrice(data: Partial<PriceSubmit>): Observable<Price> {
    return this.http.post<Price>(this.API_URL, data, { withCredentials: true });
  }

  // Оновлення ціни
  updatePrice(id: number, changes: Partial<PriceSubmit>): Observable<Price> {
    return this.http.put<Price>(`${this.API_URL}${id}/`, changes, { withCredentials: true });
  }

  // Видалення ціни
  deletePrice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}${id}/`, { withCredentials: true });
  }

}
