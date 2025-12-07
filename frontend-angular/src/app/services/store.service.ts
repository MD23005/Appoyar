import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

export interface PurchaseRequest {
  productId: number;
  quantity: number;
}

export interface PurchaseResponse {
  purchaseId: number;
  productId: number;
  quantity: number;
  totalPoints: number;
  remainingPoints: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private http = inject(HttpClient);

  // Productos (públicos)
  private productsBaseUrl = 'https://appoyar.onrender.com/api/public/store';

  // Compras (requiere estar autenticado)
  private purchasesBaseUrl = 'https://appoyar.onrender.com/api/store';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productsBaseUrl}/products`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productsBaseUrl}/products/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.productsBaseUrl}/products`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.productsBaseUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.productsBaseUrl}/products/${id}`);
  }

  // Realizar compra usando puntos
  purchaseProduct(request: PurchaseRequest): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(`${this.purchasesBaseUrl}/purchases`, request);
  }
}
