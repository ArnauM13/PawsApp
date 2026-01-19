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

/**
 * Service for making HTTP requests to the Pets API.
 *
 * This service handles all communication with the backend API for pets,
 * including pagination, sorting, and filtering. It abstracts the HTTP layer
 * from the rest of the application.
 */
@Injectable({
  providedIn: 'root'
})
export class PetsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.baseUrl;

  /**
   * Fetches a paginated list of pets from the API.
   *
   * Supports server-side pagination, sorting, and filtering. The response
   * includes the total count of pets in the X-Total-Count header.
   *
   * @param query - Query parameters including page, limit, sortField, sortOrder, and filters
   * @returns Observable of paginated pets response with data and total count
   *
   * @example
   * ```typescript
   * const query: PetsQuery = {
   *   page: 1,
   *   limit: 10,
   *   sortField: 'name',
   *   sortOrder: 'asc'
   * };
   * this.api.getPaged(query).subscribe(response => {
   *   console.log(response.data); // Array of pets
   *   console.log(response.total); // Total count
   * });
   * ```
   */
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

  /**
   * Fetches a single pet by its ID.
   *
   * @param id - The unique identifier of the pet
   * @returns Observable of the pet object
   *
   * @example
   * ```typescript
   * this.api.getById(1).subscribe(pet => {
   *   console.log(pet.name); // Pet name
   * });
   * ```
   */
  getById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.baseUrl}${API_CONFIG.endpoints.petById(id)}`);
  }

  /**
   * Gets the total number of pets available in the system.
   *
   * This method makes a minimal request (1 item) to get only the
   * X-Total-Count header, which is more efficient than fetching all pets.
   *
   * @returns Observable of the total number of pets
   *
   * @example
   * ```typescript
   * this.api.getTotal().subscribe(total => {
   *   console.log(`There are ${total} pets in the system`);
   * });
   * ```
   */
  getTotal(): Observable<number> {
    const params = new HttpParams()
      .set('_page', '1')
      .set('_limit', '1');

    return this.http.get<Pet[]>(`${this.baseUrl}${API_CONFIG.endpoints.pets}`, {
      params,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Pet[]>) => {
        return parseInt(response.headers.get('X-Total-Count') || '0', 10);
      })
    );
  }
}
