import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_CONFIG } from '@core/config';
import { Pet } from '@features/pets/models';

export interface PetsQuery {
  page: number;
  limit: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, string | number>;
}

export interface PaginatedPetsResponse {
  data: Pet[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class PetsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.baseUrl;

  getPaged(query: PetsQuery): Observable<PaginatedPetsResponse> {
    let params = new HttpParams()
      .set('_page', query.page.toString())
      .set('_limit', query.limit.toString());

    if (query.sortField) {
      params = params.set('_sort', query.sortField);
      params = params.set('_order', query.sortOrder || 'asc');
    }

    if (query.filters) {
      Object.entries(query.filters).forEach(([key, value]) => {
        params = params.set(key, value.toString());
      });
    }

    return this.http.get<Pet[]>(`${this.baseUrl}${API_CONFIG.endpoints.pets}`, {
      params,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Pet[]>) => {
        const total = parseInt(response.headers.get('X-Total-Count') || '0', 10);
        const data = response.body || [];
        return { data, total };
      })
    );
  }

  getById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.baseUrl}${API_CONFIG.endpoints.petById(id)}`);
  }
}
