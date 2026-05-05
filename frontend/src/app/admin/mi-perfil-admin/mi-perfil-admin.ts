import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UsuarioService } from '../../services/usuario';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Router, RouterModule } from '@angular/router';
import { HeaderAdminComponent } from '../header-admin/header-admin.component';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin';

@Component({
  selector: 'app-mi-perfil-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderAdminComponent, SidebarAdminComponent],
  templateUrl: './mi-perfil-admin.html',
  styleUrls: ['./mi-perfil-admin.css']
})
export class MiPerfilAdmin {
  datosUsuario: any = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  usuarioActual: any = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getUsuarioActual();
    this.datosUsuario = this.usuarioActual;
    if (this.datosUsuario?.foto) {
      this.previewUrl = this.datosUsuario.foto;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  subirFoto() {
    const userId = this.authService.getUserId();
    if (this.selectedFile && userId) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        this.usuarioService.actualizarFoto(userId, base64).subscribe({
          next: (response: any) => {
            const nuevaFoto = response.usuario?.foto || response.foto;
            this.datosUsuario = { ...this.datosUsuario, foto: nuevaFoto };
            this.usuarioActual = { ...this.datosUsuario };
            this.previewUrl = nuevaFoto;
            this.authService.actualizarUsuarioEnSesion({ foto: nuevaFoto });
            this.selectedFile = null;
            this.toastService.success('Foto actualizada exitosamente');
          },
          error: (error: any) => {
            console.error('Error al actualizar foto:', error);
            this.toastService.error('Error al actualizar la foto');
          }
        });
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.toastService.warning('Por favor selecciona una foto');
    }
  }

  logout() {
    this.authService.logout();
  }
}
