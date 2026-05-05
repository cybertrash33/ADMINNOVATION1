import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Pqrs } from '../../services/pqrs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-new-pqrs',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-pqrs.html',
  styleUrls: ['./new-pqrs.css']
})
export class NewPqrsComponent implements OnInit {
  nuevaPqrs = {
    usuarioId: '',
    tipo: '',
    asunto: '',
    descripcion: '',
    bloque: '',
    numeroApartamento: ''
  };
  usuarioActual: any = null;

  constructor(
    private router: Router,
    private pqrsService: Pqrs,
    private authService: AuthService,
    private toastService: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getUsuarioActual();

    const userId = this.authService.getUserId();
    if (userId) {
      this.nuevaPqrs.usuarioId = userId;
    }

    if (this.usuarioActual) {
      this.nuevaPqrs.bloque = this.usuarioActual.numeroBloque || '';
      this.nuevaPqrs.numeroApartamento = this.usuarioActual.numeroApartamento || '';
    }
  }

  enviarFormulario() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.toastService.error('Tu sesión ha expirado o hay un error de usuario. Por favor, reingresa.');
      return;
    }

    this.nuevaPqrs.usuarioId = userId;

    this.pqrsService.crearPqrs(this.nuevaPqrs).subscribe({
      next: (res: any) => {
        this.toastService.success('PQRS Radicada con éxito!');
        this.router.navigate(['/mis-pqrs']);
      },
      error: (err: any) => {
        this.toastService.error('Error al radicar la PQRS: ' + (err.error?.message || 'Error desconocido'));
      }
    });
  }
}