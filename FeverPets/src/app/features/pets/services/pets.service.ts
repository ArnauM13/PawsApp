import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { API_CONFIG } from '@core/config';
import { Pet } from '@features/pets/models';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

interface CacheEntry {
  data: Pet[];
  total: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class PetsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.baseUrl;
  private readonly cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  /**
   * Get all pets from the API
   * @returns Observable with array of pets
   */
  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.baseUrl}${API_CONFIG.endpoints.pets}`);
  }

  /**
   * Get paginated pets from the API with caching
   * Uses json-server pagination: _page and _limit query params
   * @param page Page number (starts at 1)
   * @param limit Number of items per page
   * @returns Observable with paginated pets and total count
   */
  getPetsPaginated(page: number, limit: number): Observable<PaginatedResponse<Pet>> {
    const cacheKey = `${page}-${limit}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return of({ data: cached.data, total: cached.total });
    }

    const params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    return this.http.get<Pet[]>(`${this.baseUrl}${API_CONFIG.endpoints.pets}`, {
      params,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Pet[]>) => {
        const total = parseInt(response.headers.get('X-Total-Count') || '0', 10);
        const data = response.body || [];

        this.cache.set(cacheKey, {
          data,
          total,
          timestamp: Date.now()
        });

        return { data, total };
      }),
      shareReplay(1)
    );
  }

  /**
   * Get a specific pet by ID
   * @param id Pet ID
   * @returns Observable with pet data
   */
  getPetById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.baseUrl}${API_CONFIG.endpoints.petById(id)}`);
  }
}
