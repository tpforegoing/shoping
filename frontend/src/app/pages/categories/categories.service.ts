import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CategoryFull, CategoryResponse } from './categories.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
//   private readonly apiUrl = '/api/category/';
  private readonly API_URL = `${environment.apiUrl}/api/category/`;

  getCategories(page = 1, filter = ''): Observable<CategoryResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('search', filter);
    return this.http.get<CategoryResponse>(this.API_URL, { params, withCredentials: true });
  }

  createCategory(data: Partial<CategoryFull>): Observable<CategoryFull> {
    // console.log('Create Category:', `${this.API_URL}`, data);
    return this.http.post<CategoryFull>(this.API_URL, data);
  }

  updateCategory(id: number, changes: Partial<CategoryFull>): Observable<CategoryFull> {
  // console.log('Update Category:', `${this.API_URL}${id}/`, changes);
    return this.http.put<CategoryFull>(`${this.API_URL}${id}/`, changes);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}${id}/`);
  }
}