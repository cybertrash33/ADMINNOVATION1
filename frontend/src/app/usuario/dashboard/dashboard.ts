import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SidebarUsuarioComponent } from '../sidebar-usuario/sidebar-usuario.component';
import { HeaderUsuarioComponent } from '../header-usuario/header-usuario.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, SidebarUsuarioComponent, HeaderUsuarioComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  usuarioActual: any = null;
  pqrsUsuario: any[] = [];
  eventosRecientes: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getUsuarioActual();
    if (!this.usuarioActual) {
      this.authService.logout();
    }
  }

  irANewPqrs() {
    this.router.navigate(['/new-pqrs']);
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getEstadoClase(estado: string): string {
    const clases: { [key: string]: string } = {
      'pendiente': 'estado-pendiente',
      'en_proceso': 'estado-proceso',
      'resuelto': 'estado-resuelto',
      'cerrado': 'estado-cerrado',
      'rechazado': 'estado-rechazado'
    };
    return clases[estado] || 'estado-pendiente';
  }

  getTipoEventoClase(tipo: string): string {
    const clases: { [key: string]: string } = {
      'maintenance': 'tipo-mantenimiento',
      'meeting': 'tipo-reunion',
      'announcement': 'tipo-aviso'
    };
    return clases[tipo] || 'tipo-aviso';
  }

  getTipoEventoIcon(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'maintenance': 'build',
      'meeting': 'groups',
      'announcement': 'campaign'
    };
    return iconos[tipo] || 'event';
  }
}