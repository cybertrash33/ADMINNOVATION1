import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiUrl + '/usuarios';

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  loginUsuario(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales);
  }

  getUsuarios(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  actualizarFoto(userId: string, foto: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/foto`, { foto });
  }

  eliminarUsuario(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  actualizarUsuario(userId: string, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, usuario);
  }
}