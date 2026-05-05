import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-nuevo-evento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderAdminComponent, SidebarAdminComponent],
  templateUrl: './nuevo-evento.html',
  styleUrls: ['./nuevo-evento.css']
})
export class NuevoEventoComponent implements OnInit {
  evento = {
    titulo: '',
    tipo: '',
    fechaInicio: '',
    fechaFin: '',
    descripcion: ''
  };
  tituloFormulario = 'Nuevo Evento';
  usuarioActual: any = null;

  constructor(
    private router: Router,
    private eventoService: EventoService,
    private authService: AuthService,
    private toastService: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getUsuarioActual();
  }

  crearEvento() {
    const eventoData = {
      ...this.evento,
      usuarioId: this.usuarioActual?._id || this.authService.getUserId()
    };

    this.eventoService.crearEvento(eventoData).subscribe({
      next: (response: any) => {
        this.toastService.success('Evento creado exitosamente');
        this.router.navigate(['/cartelera-actividades-admin']);
      },
      error: (error: any) => {
        this.toastService.error('Error al crear el evento: ' + (error.error?.error || error.message));
      }
    });
  }

  limpiarFormulario() {
    this.evento = {
      titulo: '',
      tipo: '',
      fechaInicio: '',
      fechaFin: '',
      descripcion: ''
    };
  }

  logout() {
    this.authService.logout();
  }
}