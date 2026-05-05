import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Pqrs {
  private apiUrl = environment.apiUrl + '/pqrs';

  constructor(private http: HttpClient) { }

  crearPqrs(pqrs: any): Observable<any> {
    return this.http.post(this.apiUrl, pqrs);
  }

  getPqrs(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getPqrsByUsuario(usuarioId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  actualizarEstadoPqrs(pqrsId: string, estado: string, autor?: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${pqrsId}`, { estado, autor });
  }

  eliminarPqrs(pqrsId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${pqrsId}`);
  }

  agregarNotaInterna(pqrsId: string, nota: string, autor?: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${pqrsId}/nota`, { nota, autor });
  }

  responderPqrs(pqrsId: string, respuesta: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${pqrsId}/responder`, { respuesta });
  }
}