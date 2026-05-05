import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../services/evento.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-cartelera-actividades-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderAdminComponent, SidebarAdminComponent],
  templateUrl: './cartelera-actividades-admin.html',
  styleUrls: ['./cartelera-actividades-admin.css']
})
export class CarteleraActividadesAdminComponent implements OnInit {
  usuarioActual: any = null;
  eventos: any[] = [];
  eventosFiltrados: any[] = [];
  eventosPaginados: any[] = [];
  filtroTipo: string = '';
  ordenarPor: string = 'fecha';
  paginaActual: number = 1;
  itemsPorPagina: number = 6;
  loadingEventos: boolean = true;

  constructor(
    private router: Router,
    private eventoService: EventoService,
    private authService: AuthService,
    private toastService: ToastService,
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
    this.loadingEventos = true;
    this.eventoService.getEventos().subscribe({
      next: (data: any) => {
        this.eventos = data;
        this.aplicarFiltros();
        this.loadingEventos = false;
      },
      error: (error: any) => {
        console.error('Error al cargar eventos:', error);
        this.toastService.error('Error al cargar los eventos');
        this.loadingEventos = false;
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

  editarEvento(eventoId: string) {
    this.router.navigate(['/editar-evento', eventoId]);
  }

  eliminarEvento(eventoId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      this.eventoService.eliminarEvento(eventoId).subscribe({
        next: () => {
          console.log('Evento eliminado exitosamente');
          this.cargarEventos();
        },
        error: (error: any) => {
          console.error('Error al eliminar evento:', error);
          this.toastService.error('Error al eliminar el evento');
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}
