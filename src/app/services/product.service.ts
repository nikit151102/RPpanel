import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiResponse, QueryDto } from '../models/common.model';
import { Product, ProductCategory } from '../models/niche.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly BASE_URL = 'https://xn--80akonecy.xn--p1ai/api/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  searchProducts(query: QueryDto): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(
      `${this.BASE_URL}/Entities/ProductInstanceSearch/Filter`,
      query,
      { headers: this.auth.getAuthHeaders() }
    );
  }

  filterCategories(query: QueryDto): Observable<ApiResponse<ProductCategory>> {
    return this.http.post<ApiResponse<ProductCategory>>(
      `${this.BASE_URL}/Entities/ProductCategory/Filter`,
      query,
      { headers: this.auth.getAuthHeaders() }
    );
  }
}