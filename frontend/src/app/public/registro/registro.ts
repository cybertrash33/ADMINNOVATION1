import { Component, OnInit, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario';
import { ToastService } from '../../services/toast.service';
import { isPlatformBrowser } from '@angular/common';

declare var M: any;

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro implements OnInit, AfterViewInit {
  usuario = {
    nombre: '',
    tipoUsuario: '',
    email: '',
    tipoDocumento: '',
    numeroDocumento: '',
    telefono: '',
    tipoResidente: '',
    conjuntoResidencial: '',
    numeroBloque: '',
    numeroApartamento: '',
    password: ''
  };

  constructor(
    private usuarioService: UsuarioService,
    private toastService: ToastService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit() {
    // Solo inicializar Materialize si estamos en el navegador
    this.inicializarMaterialize();
  }

  ngAfterViewInit() {
    // Alternativa: inicializar después de que la vista esté renderizada
    this.inicializarMaterialize();
  }

  inicializarMaterialize() {
    // ✅ SOLUCIÓN: Verificar si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
      }, 100);
    }
  }

  registrar() {
    // Validar que todos los campos estén llenos
    if (!this.usuario.nombre || !this.usuario.tipoUsuario || !this.usuario.email ||
        !this.usuario.tipoDocumento || !this.usuario.numeroDocumento ||
        !this.usuario.telefono || !this.usuario.tipoResidente || !this.usuario.conjuntoResidencial ||
        !this.usuario.numeroBloque || !this.usuario.numeroApartamento) {
      this.toastService.warning('Por favor complete todos los campos');
      return;
    }

    this.usuarioService.registrarUsuario(this.usuario).subscribe({
      next: (respuesta) => {
        this.toastService.success('Usuario registrado exitosamente!');
        this.limpiarFormulario();
      },
      error: (error) => {
        this.toastService.error('Error al registrar usuario: ' + 
          (error.error?.message || 'Error desconocido'));
      }
    });
  }

  limpiarFormulario() {
    this.usuario = {
      nombre: '',
      tipoUsuario: '',
      email: '',
      tipoDocumento: '',
      numeroDocumento: '',
      telefono: '',
      tipoResidente: '',
      conjuntoResidencial: '',
      numeroBloque: '',
      numeroApartamento: '',
      password: ''
    };
    
    // ✅ SOLUCIÓN: También verificar aquí
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
      }, 100);
    }
  }
}

