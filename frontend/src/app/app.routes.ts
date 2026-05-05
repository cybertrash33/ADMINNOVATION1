import { Routes } from '@angular/router';
import { Home } from './public/home/home';
import { LoginComponent } from './public/login/login';
import { Registro } from './public/registro/registro';
import { Nuestrahistoria } from './public/nuestrahistoria/nuestrahistoria';
import { Misionvision } from './public/misionvision/misionvision';
import { Equipodirectivo } from './public/equipodirectivo/equipodirectivo';
import { Valorescorporativos } from './public/valorescorporativos/valorescorporativos';
import { Dashboard } from './usuario/dashboard/dashboard';
import { NewPqrsComponent } from './usuario/new-pqrs/new-pqrs';
import { MiPerfilUsuario } from './usuario/mi-perfil-usuario/mi-perfil-usuario';
import { MisPqrsComponent } from './usuario/mis-pqrs/mis-pqrs';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin';
import { CarteleraActividadesComponent } from './usuario/cartelera-actividades/cartelera-actividades';
import { GestionUsuariosComponent } from './admin/gestion-usuarios/gestion-usuarios';
import { MiPerfilAdmin } from './admin/mi-perfil-admin/mi-perfil-admin';
import { CarteleraActividadesAdminComponent } from './admin/cartelera-actividades-admin/cartelera-actividades-admin';
import { PqrsAdminComponent } from './admin/pqrs-admin/pqrs-admin';
import { NuevoEventoComponent } from './admin/nuevo-evento/nuevo-evento';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { residentGuard } from './guards/resident.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: Registro },
  { path: 'nuestrahistoria', component: Nuestrahistoria },
  { path: 'misionvision', component: Misionvision },
  { path: 'equipodirectivo', component: Equipodirectivo },
  { path: 'valorescorporativos', component: Valorescorporativos },

  { path: 'dashboard', component: Dashboard, canActivate: [residentGuard] },
  { path: 'new-pqrs', component: NewPqrsComponent, canActivate: [residentGuard] },
  { path: 'mis-pqrs', component: MisPqrsComponent, canActivate: [residentGuard] },
  { path: 'mi-perfil', component: MiPerfilUsuario, canActivate: [residentGuard] },
  { path: 'cartelera-actividades', component: CarteleraActividadesComponent, canActivate: [authGuard] },

  { path: 'dashboard-admin', component: DashboardAdminComponent, canActivate: [adminGuard] },
  { path: 'gestion-usuarios', component: GestionUsuariosComponent, canActivate: [adminGuard] },
  { path: 'pqrs-admin', component: PqrsAdminComponent, canActivate: [adminGuard] },
  { path: 'mi-perfil-admin', component: MiPerfilAdmin, canActivate: [adminGuard] },
  { path: 'cartelera-actividades-admin', component: CarteleraActividadesAdminComponent, canActivate: [adminGuard] },
  { path: 'nuevo-evento', component: NuevoEventoComponent, canActivate: [adminGuard] },
  { path: 'editar-evento/:id', component: NuevoEventoComponent, canActivate: [adminGuard] },

  { path: 'servicios', component: Home },
  { path: 'servicios/consultoria', component: Home },
  { path: 'servicios/desarrollo-web', component: Home },
  { path: 'servicios/marketing-digital', component: Home },
  { path: 'servicios/soporte-tecnico', component: Home },
  { path: 'noticias', component: Home },
  { path: 'noticias/ultimas', component: Home },
  { path: 'noticias/eventos', component: Home },
  { path: 'noticias/comunicados', component: Home },
  { path: 'noticias/blog', component: Home },
  { path: 'contacto', component: Home },
  { path: 'contacto/formulario', component: Home },
  { path: 'contacto/oficinas', component: Home },
  { path: 'contacto/telefonos', component: Home },
  { path: 'contacto/trabaja-con-nosotros', component: Home }
];