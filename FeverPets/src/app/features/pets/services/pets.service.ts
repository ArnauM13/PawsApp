import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api.config';
import { Pet } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.baseUrl;

  /**
   * Get all pets from the API
   * @returns Observable with array of pets
   */
  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.baseUrl}${API_CONFIG.endpoints.pets}`);
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
