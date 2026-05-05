import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Pqrs } from '../../services/pqrs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';

@Component({
  selector: 'app-pqrs-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarAdminComponent, HeaderAdminComponent],
  templateUrl: './pqrs-admin.html',
  styleUrls: ['./pqrs-admin.css']
})
export class PqrsAdminComponent implements OnInit {
  pqrsList: any[] = [];
  pqrsFiltradas: any[] = [];
  loadingPqrs: boolean = true;
  selectedPqrs: any = null;
  selectedEstado: string = '';
  filtroEstado: string = '';
  filtroUsuario: string = '';
  filtroTipo: string = '';
  filtroPrioridad: string = '';
  usuarioActual: any = null;

  // Ordenamiento
  columnaOrden: string = '';
  direccionOrden: 'asc' | 'desc' = 'asc';

  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;

  // Vista
  vistaActual: 'tabla' | 'tarjetas' = 'tabla';

  // Estadísticas
  estadisticas: any = {
    total: 0,
    pendientes: 0,
    enProceso: 0,
    resueltos: 0,
    cerrados: 0,
    rechazados: 0
  };

  // Modal
  activeTab: string = 'detalles';
  nuevaNota: string = '';
  respuestaTexto: string = '';

  constructor(
    private pqrsService: Pqrs,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getUsuarioActual();
    this.cargarPqrs();
  }

  cargarUsuarioActual() {
    this.usuarioActual = this.authService.getUsuarioActual();
  }

  cargarPqrs() {
    this.pqrsService.getPqrs().subscribe({
      next: (data: any) => {
        this.pqrsList = data;
        this.pqrsFiltradas = data;
        this.calcularEstadisticas();
        this.loadingPqrs = false;
      },
      error: (err: any) => {
        console.error('Error al cargar PQRS:', err);
        this.loadingPqrs = false;
      }
    });
  }

  filtrarPqrs() {
    this.pqrsFiltradas = this.pqrsList.filter(pqrs => {
      const filtroEstadoValido = !this.filtroEstado || pqrs.estado === this.filtroEstado;
      const filtroUsuarioValido = !this.filtroUsuario ||
        (pqrs.usuarioId?.nombre && pqrs.usuarioId.nombre.toLowerCase().includes(this.filtroUsuario.toLowerCase())) ||
        (pqrs.usuarioId?.apellido && pqrs.usuarioId.apellido.toLowerCase().includes(this.filtroUsuario.toLowerCase()));
      const filtroTipoValido = !this.filtroTipo || pqrs.tipo === this.filtroTipo;
      const filtroPrioridadValido = !this.filtroPrioridad || pqrs.prioridad === this.filtroPrioridad;
      return filtroEstadoValido && filtroUsuarioValido && filtroTipoValido && filtroPrioridadValido;
    });
    this.paginaActual = 1;
  }

  calcularEstadisticas() {
    this.estadisticas = {
      total: this.pqrsList.length,
      pendientes: this.pqrsList.filter(p => p.estado === 'pendiente').length,
      enProceso: this.pqrsList.filter(p => p.estado === 'en_proceso').length,
      resueltos: this.pqrsList.filter(p => p.estado === 'resuelto').length,
      cerrados: this.pqrsList.filter(p => p.estado === 'cerrado').length,
      rechazados: this.pqrsList.filter(p => p.estado === 'rechazado').length
    };
  }

  ordenar(columna: string) {
    if (this.columnaOrden === columna) {
      this.direccionOrden = this.direccionOrden === 'asc' ? 'desc' : 'asc';
    } else {
      this.columnaOrden = columna;
      this.direccionOrden = 'asc';
    }

    this.pqrsFiltradas.sort((a, b) => {
      let valorA = a[columna];
      let valorB = b[columna];

      if (columna === 'usuarioId') {
        valorA = a.usuarioId?.nombre || '';
        valorB = b.usuarioId?.nombre || '';
      }

      if (valorA < valorB) return this.direccionOrden === 'asc' ? -1 : 1;
      if (valorA > valorB) return this.direccionOrden === 'asc' ? 1 : -1;
      return 0;
    });
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
  }

  cambiarVista(vista: 'tabla' | 'tarjetas') {
    this.vistaActual = vista;
  }

  get pqrsPaginadas() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.pqrsFiltradas.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.pqrsFiltradas.length / this.itemsPorPagina);
  }

  seleccionarPqrs(pqrs: any) {
    this.selectedPqrs = pqrs;
    this.selectedEstado = pqrs.estado;
  }

  verPqrs(pqrs: any) {
    this.seleccionarPqrs(pqrs);
  }

  cancelarSeleccion() {
    this.selectedPqrs = null;
    this.selectedEstado = '';
  }

  confirmarActualizacionEstado() {
    if (this.selectedPqrs && this.selectedEstado) {
      const autor = this.usuarioActual?.nombre || 'Administrador';
      this.pqrsService.actualizarEstadoPqrs(this.selectedPqrs._id, this.selectedEstado, autor).subscribe({
        next: (response: any) => {
          console.log('Estado actualizado:', response);
          this.cargarPqrs();
          this.cancelarSeleccion();
        },
        error: (err: any) => {
          console.error('Error al actualizar estado:', err);
          this.toastService.error('Error al actualizar estado de PQRS');
        }
      });
    }
  }

  eliminarPqrs(pqrsId: string) {
    if (confirm('¿Estás seguro de eliminar esta PQRS? Esta acción no se puede deshacer.')) {
      this.pqrsService.eliminarPqrs(pqrsId).subscribe({
        next: (response: any) => {
          console.log('PQRS eliminada:', response);
          this.cargarPqrs();
          this.cancelarSeleccion();
        },
        error: (err: any) => {
          console.error('Error al eliminar PQRS:', err);
          this.toastService.error('Error al eliminar PQRS');
        }
      });
    }
  }

  agregarNota() {
    if (this.selectedPqrs && this.nuevaNota.trim()) {
      const autor = this.usuarioActual?.nombre || 'Administrador';
      this.pqrsService.agregarNotaInterna(this.selectedPqrs._id, this.nuevaNota, autor).subscribe({
        next: (response: any) => {
          console.log('Nota agregada:', response);
          this.nuevaNota = '';
          this.cargarPqrs();
          this.selectedPqrs = this.pqrsList.find(p => p._id === this.selectedPqrs._id);
        },
        error: (err: any) => {
          console.error('Error al agregar nota:', err);
          this.toastService.error('Error al agregar nota');
        }
      });
    }
  }

  responderPqrs() {
    if (this.selectedPqrs && this.respuestaTexto.trim()) {
      this.pqrsService.responderPqrs(this.selectedPqrs._id, this.respuestaTexto).subscribe({
        next: (response: any) => {
          console.log('Respuesta enviada:', response);
          this.respuestaTexto = '';
          this.cargarPqrs();
          this.selectedPqrs = this.pqrsList.find(p => p._id === this.selectedPqrs._id);
        },
        error: (err: any) => {
          console.error('Error al responder PQRS:', err);
          this.toastService.error('Error al responder PQRS');
        }
      });
    }
  }

  cambiarTab(tab: string) {
    this.activeTab = tab;
  }

  tieneArchivo(archivo: any): boolean {
    return archivo && archivo !== '' && archivo !== null;
  }

  verArchivo(archivoBase64: string) {
    if (!archivoBase64 || archivoBase64.length < 20) {
      this.toastService.warning('No hay archivo adjunto');
      return;
    }

    if (archivoBase64.startsWith('data:')) {
      window.open(archivoBase64, '_blank');
      return;
    }

    let mimeType = 'application/octet-stream';
    
    if (archivoBase64.includes('.pdf') || archivoBase64.includes('%2Fpdf')) {
      mimeType = 'application/pdf';
    } else if (archivoBase64.includes('.jpg') || archivoBase64.includes('.jpeg') || archivoBase64.includes('%2Fjpg') || archivoBase64.includes('%2Fjpeg')) {
      mimeType = 'image/jpeg';
    } else if (archivoBase64.includes('.png') || archivoBase64.includes('%2Fpng')) {
      mimeType = 'image/png';
    } else if (archivoBase64.includes('.gif') || archivoBase64.includes('%2Fgif')) {
      mimeType = 'image/gif';
    } else if (archivoBase64.includes('.doc') || archivoBase64.includes('%2Fdoc')) {
      mimeType = 'application/msword';
    } else if (archivoBase64.includes('.docx') || archivoBase64.includes('%2Fdocx')) {
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else {
      const header = archivoBase64.substring(0, 20).toLowerCase();
      if (header.startsWith('/9j/')) {
        mimeType = 'image/jpeg';
      } else if (header.startsWith('ivborw0kggo')) {
        mimeType = 'image/png';
      } else if (header.startsWith('r0lgodlh')) {
        mimeType = 'image/gif';
      } else if (header.startsWith('jvberi0xltc4')) {
        mimeType = 'application/pdf';
      }
    }

    const dataUrl = `data:${mimeType};base64,${archivoBase64}`;
    window.open(dataUrl, '_blank');
  }

  descargarArchivo(archivoBase64: string) {
    if (!archivoBase64 || archivoBase64.length < 20) {
      this.toastService.warning('No hay archivo adjunto');
      return;
    }

    // Si ya tiene el prefijo data URL, usar directamente
    let dataUrl = archivoBase64;
    let extension = 'bin';

    if (!archivoBase64.startsWith('data:')) {
      // Detectar el tipo de archivo y agregar el prefijo correspondiente
      let mimeType = 'application/octet-stream';
      
      // Detectar por extensión si está incluida en el nombre
      if (archivoBase64.includes('.pdf') || archivoBase64.includes('%2Fpdf')) {
        mimeType = 'application/pdf';
        extension = 'pdf';
      } else if (archivoBase64.includes('.jpg') || archivoBase64.includes('.jpeg') || archivoBase64.includes('%2Fjpg') || archivoBase64.includes('%2Fjpeg')) {
        mimeType = 'image/jpeg';
        extension = 'jpg';
      } else if (archivoBase64.includes('.png') || archivoBase64.includes('%2Fpng')) {
        mimeType = 'image/png';
        extension = 'png';
      } else if (archivoBase64.includes('.gif') || archivoBase64.includes('%2Fgif')) {
        mimeType = 'image/gif';
        extension = 'gif';
      } else if (archivoBase64.includes('.doc') || archivoBase64.includes('%2Fdoc')) {
        mimeType = 'application/msword';
        extension = 'doc';
      } else if (archivoBase64.includes('.docx') || archivoBase64.includes('%2Fdocx')) {
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        extension = 'docx';
      } else {
        // Intentar detectar por el contenido base64
        const header = archivoBase64.substring(0, 20).toLowerCase();
        if (header.startsWith('/9j/')) {
          mimeType = 'image/jpeg';
          extension = 'jpg';
        } else if (header.startsWith('ivborw0kggo')) {
          mimeType = 'image/png';
          extension = 'png';
        } else if (header.startsWith('r0lgodlh')) {
          mimeType = 'image/gif';
          extension = 'gif';
        } else if (header.startsWith('jvberi0xltc4')) {
          mimeType = 'application/pdf';
          extension = 'pdf';
        }
      }

      dataUrl = `data:${mimeType};base64,${archivoBase64}`;
    } else {
      // Extraer extensión del data URL si está disponible
      const mimeMatch = archivoBase64.match(/data:([^;]+)/);
      if (mimeMatch) {
        const mime = mimeMatch[1];
        switch (mime) {
          case 'application/pdf': extension = 'pdf'; break;
          case 'image/jpeg': extension = 'jpg'; break;
          case 'image/png': extension = 'png'; break;
          case 'image/gif': extension = 'gif'; break;
          case 'application/msword': extension = 'doc'; break;
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': extension = 'docx'; break;
        }
      }
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `archivo_adjunto.${extension}`;
    link.click();
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getEstadoClase(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'estado-pendiente';
      case 'en_proceso': return 'estado-proceso';
      case 'resuelto': return 'estado-resuelto';
      case 'cerrado': return 'estado-cerrado';
      case 'rechazado': return 'estado-rechazado';
      default: return '';
    }
  }

  getPrioridadClase(prioridad: string): string {
    switch (prioridad) {
      case 'baja': return 'prioridad-baja';
      case 'media': return 'prioridad-media';
      case 'alta': return 'prioridad-alta';
      case 'urgente': return 'prioridad-urgente';
      default: return '';
    }
  }

  getTipoBadge(tipo: string): string {
    switch (tipo) {
      case 'peticion': return 'tipo-peticion';
      case 'queja': return 'tipo-queja';
      case 'reclamo': return 'tipo-reclamo';
      case 'sugerencia': return 'tipo-sugerencia';
      default: return '';
    }
  }

  getTipoLabel(tipo: string): string {
    switch (tipo) {
      case 'peticion': return 'Petición';
      case 'queja': return 'Queja';
      case 'reclamo': return 'Reclamo';
      case 'sugerencia': return 'Sugerencia';
      default: return tipo;
    }
  }

  getPrioridadLabel(prioridad: string): string {
    switch (prioridad) {
      case 'baja': return 'Baja';
      case 'media': return 'Media';
      case 'alta': return 'Alta';
      case 'urgente': return 'Urgente';
      default: return prioridad;
    }
  }

  logout() {
    this.authService.logout();
  }
}
