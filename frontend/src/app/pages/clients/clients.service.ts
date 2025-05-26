import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Customer, CustomerResponse, CustomerSubmit } from './clients.model';
import { LoadParams, QueryParams } from '../../store/store.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/api/customer/`;

  getCustomers(params: LoadParams): Observable<CustomerResponse> {
    const queryParams: QueryParams = {
      ...(params.page !== 1 && { page: params.page }),
      ...(params.filter?.trim() && { search: params.filter }),
    }
    // console.log('[DEBUG] getCustomer: ', params, queryParams);
    return this.http.get<CustomerResponse>(this.API_URL, { params: queryParams as any, withCredentials: true });
  }

  createCustomer(data: Partial<CustomerSubmit>): Observable<Customer> {
    return this.http.post<Customer>(this.API_URL, data);
  }

  updateCustomer(id: number, changes: Partial<CustomerSubmit>): Observable<Customer> {
    return this.http.put<Customer>(`${this.API_URL}${id}/`, changes);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}${id}/`);
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.API_URL}${id}/`, { withCredentials: true });
  }
}
