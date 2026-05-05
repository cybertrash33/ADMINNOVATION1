import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { UsuarioService } from './usuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioActual: any = null;
  private token: string | null = null;
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();
  private usuarioSubject = new BehaviorSubject<any>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.cargarSesion();
  }

  private cargarSesion() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        this.token = token;
        this.usuarioActual = JSON.parse(userStr);
        this.loggedIn.next(true);
        this.usuarioSubject.next(this.usuarioActual);
      }
    }
  }

  login(email: string, password: string) {
    return this.usuarioService.loginUsuario({ email, password });
  }

  guardarSesion(response: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.id);
      localStorage.setItem('user', JSON.stringify(response.usuario));
      this.token = response.token;
      this.usuarioActual = response.usuario;
      this.loggedIn.next(true);
      this.usuarioSubject.next(this.usuarioActual);
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      this.token = null;
      this.usuarioActual = null;
      this.loggedIn.next(false);
      this.usuarioSubject.next(null);
      this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getUsuarioActual(): any {
    return this.usuarioActual;
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  isAdmin(): boolean {
    return this.usuarioActual?.tipoUsuario === 'Administrador/Empleado';
  }

  getRole(): string {
    return this.usuarioActual?.tipoUsuario || '';
  }

  getUserId(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userId');
    }
    return null;
  }

  actualizarUsuarioEnSesion(datos: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.usuarioActual = { ...this.usuarioActual, ...datos };
      localStorage.setItem('user', JSON.stringify(this.usuarioActual));
      this.usuarioSubject.next(this.usuarioActual);
    }
  }
}