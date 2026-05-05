import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UsuarioService } from '../../services/usuario';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Router, RouterModule } from '@angular/router';
import { HeaderUsuarioComponent } from '../header-usuario/header-usuario.component';
import { SidebarUsuarioComponent } from '../sidebar-usuario/sidebar-usuario.component';

@Component({
  selector: 'app-mi-perfil-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderUsuarioComponent, SidebarUsuarioComponent],
  templateUrl: './mi-perfil-usuario.html',
  styleUrls: ['./mi-perfil-usuario.css']
})
export class MiPerfilUsuario {
  datosUsuario: any = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.datosUsuario = this.authService.getUsuarioActual();
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
            this.datosUsuario.foto = response.usuario?.foto || response.foto;
            this.previewUrl = this.datosUsuario.foto;
            this.authService.actualizarUsuarioEnSesion({ foto: this.datosUsuario.foto });
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