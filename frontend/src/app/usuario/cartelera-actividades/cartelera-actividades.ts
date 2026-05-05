import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../services/evento.service';
import { AuthService } from '../../services/auth.service';
import { HeaderUsuarioComponent } from '../header-usuario/header-usuario.component';
import { SidebarUsuarioComponent } from '../sidebar-usuario/sidebar-usuario.component';

@Component({
  selector: 'app-cartelera-actividades',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderUsuarioComponent, SidebarUsuarioComponent],
  templateUrl: './cartelera-actividades.html',
  styleUrls: ['./cartelera-actividades.css']
})
export class CarteleraActividadesComponent implements OnInit {
  usuarioActual: any = null;
  eventos: any[] = [];
  eventosFiltrados: any[] = [];
  eventosPaginados: any[] = [];
  filtroTipo: string = '';
  ordenarPor: string = 'fecha';
  paginaActual: number = 1;
  itemsPorPagina: number = 6;

  constructor(
    private router: Router,
    private eventoService: EventoService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getUsuarioActual();
    this.cargarEventos();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.authService.getUsuarioActual();
  }

  cargarEventos() {
    this.eventoService.getEventos().subscribe({
      next: (data) => {
        console.log('Eventos recibidos del backend:', data);
        this.eventos = data;
        this.aplicarFiltros();
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
      }
    });
  }

  aplicarFiltros() {
    this.eventosFiltrados = this.eventos.filter(evento => {
      if (this.filtroTipo && evento.tipo !== this.filtroTipo) {
        return false;
      }
      return true;
    });

    this.eventosFiltrados.sort((a, b) => {
      if (this.ordenarPor === 'fecha') {
        return new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime();
      } else if (this.ordenarPor === 'titulo') {
        return a.titulo.localeCompare(b.titulo);
      }
      return 0;
    });

    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.eventosPaginados = this.eventosFiltrados.slice(inicio, fin);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas()) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }

  totalPaginas(): number {
    return Math.ceil(this.eventosFiltrados.length / this.itemsPorPagina);
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getTipoEventoClase(tipo: string): string {
    switch (tipo) {
      case 'maintenance':
        return 'event-maintenance';
      case 'meeting':
        return 'event-meeting';
      case 'announcement':
        return 'event-announcement';
      default:
        return '';
    }
  }

  getTipoEventoIcon(tipo: string): string {
    switch (tipo) {
      case 'maintenance':
        return 'build';
      case 'meeting':
        return 'groups';
      case 'announcement':
        return 'campaign';
      default:
        return 'event';
    }
  }

  logout() {
    this.authService.logout();
  }
}
