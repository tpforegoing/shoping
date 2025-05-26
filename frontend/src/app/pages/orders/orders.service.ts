import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderResponse, OrderSubmit, OrderItem, OrderItemSubmit } from './orders.model';
import { LoadParams, QueryParams } from '../../store/store.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/api/orders/`;

  getOrders(params: LoadParams): Observable<OrderResponse> {
    const queryParams: QueryParams = {
      ...(params.page !== 1 && { page: params.page }),
      ...(params.filter?.trim() && { search: params.filter }),
    }
    return this.http.get<OrderResponse>(this.API_URL, { params: queryParams as any, withCredentials: true });
  }

  createOrder(data: Partial<OrderSubmit>): Observable<Order> {
    return this.http.post<Order>(this.API_URL, data);
  }

  updateOrder(id: number, changes: Partial<OrderSubmit>): Observable<Order> {
    return this.http.put<Order>(`${this.API_URL}${id}/`, changes);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}${id}/`);
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}${id}/`, { withCredentials: true });
  }

  // Order Items
  getOrderItems(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/api/orders/${orderId}/items/`, { withCredentials: true });
  }

  createOrderItem(data: OrderItemSubmit): Observable<OrderItem> {
    return this.http.post<OrderItem>(`${environment.apiUrl}/api/orders/${data.order}/items/`, data);
  }

  updateOrderItem(orderId: number, itemId: number, changes: Partial<OrderItemSubmit>): Observable<OrderItem> {
    return this.http.put<OrderItem>(`${environment.apiUrl}/api/orders/${orderId}/items/${itemId}/`, changes);
  }

  deleteOrderItem(orderId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/orders/${orderId}/items/${itemId}/`);
  }
}
