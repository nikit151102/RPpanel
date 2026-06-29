import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/common.model';
import { ProductNiche, ProductNicheDto } from '../models/niche.model';
import { QueryDto } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class NicheService {
  private readonly BASE_URL = 'https://xn--80akonecy.xn--p1ai/api/api/Entities/ProductNiche';

  constructor(private http: HttpClient, private auth: AuthService) {}

  createNiche(dto: ProductNicheDto): Observable<any> {
    return this.http.post(this.BASE_URL, dto, { headers: this.auth.getAuthHeaders() });
  }

  updateNiche(id: string, dto: ProductNicheDto): Observable<any> {
    return this.http.put(`${this.BASE_URL}/${id}`, dto, { headers: this.auth.getAuthHeaders() });
  }

  deleteNiche(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`, { headers: this.auth.getAuthHeaders() });
  }

  filterNiches(query: any): Observable<ApiResponse<ProductNiche>> {
    return this.http.post<ApiResponse<ProductNiche>>(
      `${this.BASE_URL}/Filter`, query, { headers: this.auth.getAuthHeaders() }
    );
  }

  addCategoriesToNiche(nicheId: string, categoryIds: string[]): Observable<any> {
    return this.http.put(
      `${this.BASE_URL}/AddCategoryToNiche/${nicheId}`,
      categoryIds,
      { headers: this.auth.getAuthHeaders() }
    );
  }

  removeCategoriesFromNiche(nicheId: string, categoryIds: string[]): Observable<any> {
    return this.http.put(
      `${this.BASE_URL}/RemoveCategoryFromNiche/${nicheId}`,
      categoryIds,
      { headers: this.auth.getAuthHeaders() }
    );
  }

  addProductsToNiche(nicheId: string, productIds: string[]): Observable<any> {
    return this.http.put(
      `${this.BASE_URL}/AddProductsToNiche/${nicheId}`,
      productIds,
      { headers: this.auth.getAuthHeaders() }
    );
  }

  removeProductsFromNiche(nicheId: string, productIds: string[]): Observable<any> {
    return this.http.put(
      `${this.BASE_URL}/RemoveProductsFromNiche/${nicheId}`,
      productIds,
      { headers: this.auth.getAuthHeaders() }
    );
  }
}