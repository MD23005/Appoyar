import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  correo: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  correo: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);
    
    if (token && userData) {
      try {
        this.currentUser.set(JSON.parse(userData));
        this.isAuthenticated.set(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearStoredAuth();
      }
    }
  }

  private clearStoredAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const mockResponse: AuthResponse = {
      user: {
        id: 1,
        nombre: credentials.correo.split('@')[0],
        correo: credentials.correo
      },
      token: 'mock-jwt-token-' + Date.now()
    };

    return new Observable(observer => {
      setTimeout(() => {
        this.setAuth(mockResponse);
        observer.next(mockResponse);
        observer.complete();
      }, 1000);
    });
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    const mockResponse: AuthResponse = {
      user: {
        id: Date.now(),
        nombre: userData.nombre,
        correo: userData.correo
      },
      token: 'mock-jwt-token-' + Date.now()
    };

    return new Observable(observer => {
      setTimeout(() => {
        this.setAuth(mockResponse);
        observer.next(mockResponse);
        observer.complete();
      }, 1000);
    });
  }

  private setAuth(authData: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authData.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
    this.currentUser.set(authData.user);
    this.isAuthenticated.set(true);
  }

  logout(): void {
    this.clearStoredAuth();
  }

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  getIsAuthenticated() {
    return this.isAuthenticated.asReadonly();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}