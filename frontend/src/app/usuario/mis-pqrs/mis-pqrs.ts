import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Pqrs } from '../../services/pqrs';
import { AuthService } from '../../services/auth.service';
import { HeaderUsuarioComponent } from '../header-usuario/header-usuario.component';
import { SidebarUsuarioComponent } from '../sidebar-usuario/sidebar-usuario.component';

@Component({
  selector: 'app-mis-pqrs',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderUsuarioComponent, SidebarUsuarioComponent],
  templateUrl: './mis-pqrs.html',
  styleUrls: ['./mis-pqrs.css']
})
export class MisPqrsComponent implements OnInit {
  pqrsUsuario: any[] = [];
  usuarioActual: any = null;
  selectedPqrs: any = null;

  constructor(
    private pqrsService: Pqrs,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getUsuarioActual();
    this.cargarPqrsUsuario();
  }

  cargarPqrsUsuario() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.pqrsService.getPqrsByUsuario(userId).subscribe({
        next: (data: any) => {
          this.pqrsUsuario = data;
        },
        error: (err: any) => {
          console.error('Error al cargar PQRS del usuario:', err);
        }
      });
    }
  }

  irANewPqrs() {
    this.router.navigate(['/new-pqrs']);
  }

  verSeguimiento(pqrs: any) {
    this.selectedPqrs = pqrs;
  }

  cerrarModal() {
    this.selectedPqrs = null;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getEstadoClase(estado: string): string {
    const clases: { [key: string]: string } = {
      'pendiente': 'estado-pendiente',
      'en_proceso': 'estado-proceso',
      'resuelto': 'estado-resuelto',
      'cerrado': 'estado-cerrado',
      'rechazado': 'estado-rechazado'
    };
    return clases[estado] || '';
  }

  getEstadoLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'en_proceso': 'En Proceso',
      'resuelto': 'Resuelto',
      'cerrado': 'Cerrado',
      'rechazado': 'Rechazado'
    };
    return labels[estado] || estado;
  }

  getTipoLabel(tipo: string): string {
    const labels: { [key: string]: string } = {
      'peticion': 'Petición',
      'queja': 'Queja',
      'reclamo': 'Reclamo',
      'sugerencia': 'Sugerencia'
    };
    return labels[tipo] || tipo;
  }

  getTipoBadge(tipo: string): string {
    const badges: { [key: string]: string } = {
      'peticion': 'tipo-peticion',
      'queja': 'tipo-queja',
      'reclamo': 'tipo-reclamo',
      'sugerencia': 'tipo-sugerencia'
    };
    return badges[tipo] || '';
  }
}