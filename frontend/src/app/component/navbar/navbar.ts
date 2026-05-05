import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router'; // Añadido RouterModule
import { filter } from 'rxjs/operators';

declare var M: any;

@Component({
  selector: 'app-navbar',
  standalone: true, // Asegúrate de que esto esté si usas standalone
  imports: [RouterModule], // IMPORTANTE: Para que routerLink funcione
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements AfterViewInit, OnDestroy {
  private dropdownInstances: any[] = [];
  private sidenavInstance: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Primera inicialización
      this.initializeMaterialize();
      
      // ✅ REINICIALIZAR CUANDO CAMBIA LA RUTA
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          // Aumentamos a 200ms para asegurar que el DOM post-navegación esté listo
          setTimeout(() => this.initializeMaterialize(), 200);
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyMaterialize();
  }

  private initializeMaterialize(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Limpiar rastro de instancias viejas
      this.destroyMaterialize();

      setTimeout(() => {
        // 1. Inicializar Dropdowns
        const dropdowns = document.querySelectorAll('.dropdown-trigger');
        dropdowns.forEach((dropdown: any) => {
          const instance = M.Dropdown.init(dropdown, {
            hover: true,
            coverTrigger: false,
            constrainWidth: false
          });
          if (instance) this.dropdownInstances.push(instance);
        });

        // 2. Inicializar Sidenav (Corregido para IDs dinámicos)
        const sidenavElems = document.querySelectorAll('.sidenav');
        if (sidenavElems.length > 0) {
          const instances = M.Sidenav.init(sidenavElems, {
            edge: 'left',
            draggable: true,
            preventScrolling: true // Evita conflictos con el scroll de Angular
          });
          // Guardamos la instancia (Materialize devuelve array si hay varios)
          this.sidenavInstance = Array.isArray(instances) ? instances[0] : instances;
        }
      }, 150); // Tiempo prudente para el renderizado
    }
  }

  private destroyMaterialize(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Destruir dropdowns de forma segura
      this.dropdownInstances.forEach(instance => {
        if (instance && typeof instance.destroy === 'function') {
          try { instance.destroy(); } catch (e) {}
        }
      });
      this.dropdownInstances = [];

      // Destruir sidenav de forma segura
      if (this.sidenavInstance && typeof this.sidenavInstance.destroy === 'function') {
        try { 
          // Si el menú está abierto al destruir, quitamos el overlay a la fuerza
          if (this.sidenavInstance.isOpen) {
            this.sidenavInstance.close();
          }
          this.sidenavInstance.destroy(); 
        } catch (e) {}
      }
    }
  }
}