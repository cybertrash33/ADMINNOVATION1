import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarAdminComponent, HeaderAdminComponent],
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.css']
})
export class GestionUsuariosComponent implements OnInit {
  usuariosList: any[] = [];
  loadingUsuarios: boolean = true;
  usuarioActual: any = null;

  // Vista
  vistaActual: 'tabla' | 'tarjetas' = 'tabla';

  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getUsuarioActual();
    this.cargarUsuarios();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.authService.getUsuarioActual();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data: any) => {
        this.usuariosList = data;
        this.loadingUsuarios = false;
      },
      error: (err: any) => {
        console.error('Error al cargar usuarios:', err);
        this.loadingUsuarios = false;
      }
    });
  }

  cambiarVista(vista: 'tabla' | 'tarjetas') {
    this.vistaActual = vista;
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
  }

  get usuariosPaginados() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.usuariosList.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.usuariosList.length / this.itemsPorPagina);
  }

  obtenerTipoUsuario(tipo: string): string {
    const mapa: { [key: string]: string } = {
      '1': 'Administrador/Empleado',
      '2': 'Residente/Propietario',
      'Administrador/Empleado': 'Administrador/Empleado',
      'Residente/Propietario': 'Residente/Propietario'
    };
    return mapa[tipo] || tipo;
  }

  editarUsuario(usuario: any) {
    this.toastService.info(`Función de edición en desarrollo para: ${usuario.nombre}`);
  }

  eliminarUsuario(usuario: any) {
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario "${usuario.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      this.usuarioService.eliminarUsuario(usuario._id).subscribe({
        next: () => {
          this.toastService.success('Usuario eliminado exitosamente');
          this.cargarUsuarios();
        },
        error: (err: any) => {
          console.error('Error al eliminar usuario:', err);
          this.toastService.error('Error al eliminar el usuario');
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}
