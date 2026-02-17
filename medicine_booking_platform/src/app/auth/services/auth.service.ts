import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    // Simulate API call with delay
    return of({
      success: true,
      message: 'Login successful',
      user: {
        id: '1',
        email: loginRequest.email,
        fullName: 'Test User',
        phoneNumber: '1234567890',
        role: loginRequest.role as 'user' | 'store' | 'admin'
      },
      token: 'mock-jwt-token'
    }).pipe(
      delay(1000),
      map(response => {
        if (response.success && response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token!);
          this.currentUserSubject.next(response.user);
        }
        return response;
      })
    );
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    // Simulate API call with delay
    return of({
      success: true,
      message: 'Registration successful',
      user: {
        id: '1',
        email: registerRequest.email,
        fullName: registerRequest.fullName,
        phoneNumber: registerRequest.phoneNumber,
        role: 'user' as 'user' | 'store' | 'admin'
      },
      token: 'mock-jwt-token'
    }).pipe(
      delay(1000),
      map(response => {
        if (response.success && response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token!);
          this.currentUserSubject.next(response.user);
        }
        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }
}