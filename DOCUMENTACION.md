# ADMINNOVATION - Documentación del Proyecto

## 1. Descripción General

**ADMINNOVATION** es un sistema de gestión integral para conjuntos residenciales que permite la administración de usuarios, PQRS (Peticiones, Quejas, Reclamos y Sugerencias), eventos/actividades y estadísticas. La aplicación cuenta con dos roles principales: **Administrador/Empleado** y **Residente**, cada uno con funcionalidades diferenciadas.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | Angular (Standalone Components) | 19+ |
| Backend | Node.js + Express | 5.1.0 |
| Base de Datos | MongoDB (Mongoose) | 8.19.1 |
| Gráficos | Chart.js + chartjs-plugin-datalabels | - |
| Otros | CORS, Morgan, Multer | - |

---

## 3. Estructura de Directorios

```
ADMINNOVATION/
├── backend/
│   ├── index.js                    # Servidor Express principal
│   ├── database.js                  # Conexión a MongoDB
│   ├── models/
│   │   ├── usuario.js               # Modelo de Usuario
│   │   ├── pqrs.js                  # Modelo de PQRS
│   │   └── evento.js                 # Modelo de Evento
│   ├── controllers/
│   │   ├── usuario.controller.js    # Lógica de usuarios
│   │   ├── pqrs.controller.js       # Lógica de PQRS
│   │   ├── evento.controller.js     # Lógica de eventos
│   │   └── estadisticas.controller.js # Lógica de estadísticas
│   ├── routes/
│   │   ├── usuario.route.js         # Rutas de usuarios
│   │   ├── pqrs.route.js            # Rutas de PQRS
│   │   ├── evento.route.js          # Rutas de eventos
│   │   └── estadisticas.route.js    # Ruta de estadísticas
│   └── package.json
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── app.ts               # Componente raíz
│       │   ├── app.routes.ts         # Rutas de navegación
│       │   ├── app.config.ts         # Configuración de la app
│       │   ├── component/
│       │   │   ├── navbar/           # Barra de navegación
│       │   │   └── footer/           # Pie de página
│       │   ├── services/
│       │   │   ├── usuario.ts        # Servicio de usuarios
│       │   │   ├── pqrs.ts           # Servicio de PQRS
│       │   │   └── evento.service.ts  # Servicio de eventos
│       │   ├── public/
│       │   │   ├── home/             # Página principal
│       │   │   ├── login/            # Inicio de sesión
│       │   │   ├── registro/         # Registro de usuarios
│       │   │   ├── nuestrahistoria/  # Nuestra Historia
│       │   │   ├── misionvision/     # Misión y Visión
│       │   │   ├── equipodirectivo/  # Equipo Directivo
│       │   │   └── valorescorporativos/ # Valores Corporativos
│       │   ├── usuario/
│       │   │   ├── dashboard/            # Dashboard residente
│       │   │   ├── mi-perfil-usuario/    # Perfil del residente
│       │   │   ├── mis-pqrs/            # PQRS del residente
│       │   │   ├── new-pqrs/            # Crear nueva PQRS
│       │   │   ├── cartelera-actividades/ # Cartelera de actividades
│       │   │   ├── header-usuario/      # Header del residente
│       │   │   └── sidebar-usuario/      # Sidebar del residente
│       │   ├── admin/
│       │   │   ├── dashboard-admin/              # Dashboard administrador
│       │   │   ├── gestion-usuarios/              # Gestión de usuarios
│       │   │   ├── pqrs-admin/                    # Gestión de PQRS
│       │   │   ├── cartelera-actividades-admin/   # Cartelera admin
│       │   │   ├── nuevo-evento/                  # Crear/editar evento
│       │   │   ├── mi-perfil-admin/               # Perfil del administrador
│       │   │   ├── header-admin/                  # Header del admin
│       │   │   └── sidebar-admin/                 # Sidebar del admin
│       │   └── paginausuario/          # (Componente adicional de página)
│       ├── styles.css               # Estilos globales
│       └── index.html               # Archivo HTML principal
├── Captura.JPG                      # Capturas de pantalla
├── Captura1.JPG
├── Captura3.JPG
└── DOCUMENTACION.md                 # Este archivo
```

---

## 4. Backend (API REST)

### 4.1 Configuración del Servidor

- **Puerto**: 3001 (configurable vía `process.env.PORT`)
- **Base de Datos**: MongoDB local en `mongodb://localhost/adminnovation`
- **CORS**: Habilitado para `http://localhost:4200` (Angular dev server)
- **Límite de payload**: 10MB para JSON
- **Logging**: Morgan en modo `dev`

### 4.2 Modelos de Datos (Mongoose Schemas)

#### Usuario (`models/usuario.js`)

| Campo | Tipo | Requerido | Máx | Descripción |
|-------|------|-----------|-----|-------------|
| nombre | String | Sí | 100 | Nombre completo |
| tipoDocumento | String | Sí | 100 | Tipo de documento |
| numeroDocumento | String | Sí | 100 | Número de documento |
| email | String | Sí | 100 | Correo electrónico |
| telefono | String | Sí | 100 | Teléfono de contacto |
| tipoUsuario | String | Sí | 100 | Rol: "Administrador/Empleado" u otro |
| tipoResidente | String | Sí | 100 | Tipo de residente |
| conjuntoResidencial | String | Sí | 100 | Nombre del conjunto |
| numeroBloque | String | Sí | 100 | Número de bloque/torre |
| numeroApartamento | String | Sí | 100 | Número de apartamento |
| password | String | Sí | 100 | Contraseña |
| foto | String | No | - | Foto de perfil en base64 |
| timestamps | - | - | - |.createdAt, updatedAt automáticos |

#### PQRS (`models/pqrs.js`)

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| tipo | String | Sí | Enum: `peticion`, `queja`, `reclamo`, `sugerencia` |
| asunto | String | Sí | Asunto (máx 200 caracteres) |
| descripcion | String | Sí | Descripción detallada |
| usuarioId | ObjectId | Sí | Referencia al modelo `Usuario` |
| estado | String | No | Enum: `pendiente`, `en_proceso`, `resuelto`, `cerrado`, `rechazado` (default: `pendiente`) |
| prioridad | String | No | Enum: `baja`, `media`, `alta`, `urgente` (default: `media`) |
| notasInternas | Array | No | Notas del administrador [{nota, fecha, autor}] |
| historialEstados | Array | No | Historial de cambios de estado [{estado, fecha, autor}] |
| respuesta | String | No | Respuesta del administrador |
| fechaRespuesta | Date | No | Fecha de respuesta |
| archivo | String | No | Archivo adjunto en base64 |
| timestamps | - | - | createdAt, updatedAt automáticos |

#### Evento (`models/evento.js`)

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| titulo | String | Sí | Título del evento (máx 200 caracteres) |
| tipo | String | Sí | Enum: `maintenance`, `meeting`, `announcement` |
| fechaInicio | Date | Sí | Fecha y hora de inicio |
| fechaFin | Date | Sí | Fecha y hora de fin |
| descripcion | String | Sí | Descripción del evento |
| usuarioId | ObjectId | Sí | Referencia al modelo `Usuario` (creador) |
| timestamps | - | - | createdAt, updatedAt automáticos |

### 4.3 Endpoints API

#### Usuarios (`/api/usuarios`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/usuarios` | Obtener todos los usuarios |
| POST | `/api/usuarios` | Crear un nuevo usuario (registro) |
| POST | `/api/usuarios/login` | Autenticación de usuario |
| GET | `/api/usuarios/:id` | Obtener un usuario por ID |
| PUT | `/api/usuarios/:id` | Actualizar un usuario completo |
| PATCH | `/api/usuarios/:id/foto` | Actualizar solo la foto de perfil |
| DELETE | `/api/usuarios/:id` | Eliminar un usuario |

#### PQRS (`/api/pqrs`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/pqrs` | Obtener todas las PQRS (con populate de usuario) |
| POST | `/api/pqrs` | Crear una nueva PQRS |
| GET | `/api/pqrs/usuario/:usuarioId` | Obtener PQRS de un usuario específico |
| PATCH | `/api/pqrs/:id` | Actualizar estado de una PQRS |
| DELETE | `/api/pqrs/:id` | Eliminar una PQRS |
| PATCH | `/api/pqrs/:id/nota` | Agregar nota interna a una PQRS |
| PATCH | `/api/pqrs/:id/responder` | Responder una PQRS |

#### Eventos (`/api/eventos`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/eventos` | Obtener todos los eventos (con populate de usuario) |
| POST | `/api/eventos` | Crear un nuevo evento |
| GET | `/api/eventos/:id` | Obtener un evento por ID |
| PUT | `/api/eventos/:id` | Actualizar un evento |
| DELETE | `/api/eventos/:id` | Eliminar un evento |

#### Estadísticas (`/api/estadisticas`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/estadisticas` | Obtener estadísticas generales del dashboard |

**Respuesta de estadísticas:**
```json
{
  "usuarios": {
    "total": 150,
    "activos": 120,
    "nuevosMes": 15,
    "distribucion": [120, 30, 15]
  },
  "pqrs": {
    "total": 85,
    "pendientes": 12,
    "resueltasMes": 30,
    "porEstado": [12, 25, 40, 8]
  },
  "actividades": {
    "total": 25,
    "activos": 18,
    "proximos": 5,
    "porMes": [4, 6, 5, 8, 7, 5]
  }
}
```

---

## 5. Frontend (Angular)

### 5.1 Configuración General

- Arquitectura basada en **Standalone Components** (Angular 19+)
- Rutas definidas en `app.routes.ts`
- Servicios inyectables con `providedIn: 'root'`
- Autenticación basada en **JWT** (JSON Web Token) con `AuthService` centralizado
- Guards de rutas: `authGuard` (requiere login), `adminGuard` (requiere rol administrador), `residentGuard` (requiere rol residente)
- HTTP Interceptor que inyecta el token JWT en todas las peticiones al backend
- Comunicación con backend vía `HttpClient` hacia `http://localhost:3001/api/`

### 5.2 Rutas de Navegación

#### Rutas Públicas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/home` | Home | Página principal del sitio |
| `/login` | LoginComponent | Inicio de sesión |
| `/registro` | Registro | Formulario de registro de usuarios |
| `/nuestrahistoria` | Nuestrahistoria | Información corporativa |
| `/misionvision` | Misionvision | Misión y visión |
| `/equipodirectivo` | Equipodirectivo | Equipo directivo |
| `/valorescorporativos` | Valorescorporativos | Valores corporativos |

#### Rutas de Residente

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/dashboard` | Dashboard | Panel principal del residente |
| `/mi-perfil` | MiPerfilUsuario | Perfil y foto del residente |
| `/mis-pqrs` | MisPqrsComponent | Listado de PQRS del residente |
| `/new-pqrs` | NewPqrsComponent | Crear nueva PQRS |
| `/cartelera-actividades` | CarteleraActividadesComponent | Ver actividades/eventos |

#### Rutas de Administrador

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/dashboard-admin` | DashboardAdminComponent | Panel de control con estadísticas |
| `/gestion-usuarios` | GestionUsuariosComponent | CRUD de usuarios |
| `/pqrs-admin` | PqrsAdminComponent | Gestión completa de PQRS |
| `/cartelera-actividades-admin` | CarteleraActividadesAdminComponent | Gestión de eventos |
| `/nuevo-evento` | NuevoEventoComponent | Crear nuevo evento |
| `/editar-evento/:id` | NuevoEventoComponent | Editar evento existente |
| `/mi-perfil-admin` | MiPerfilAdmin | Perfil y foto del administrador |

#### Rutas Placeholder (pendientes de implementación)

| Ruta | Componente Actual | Descripción |
|------|-------------------|-------------|
| `/servicios` | Home | Servicios (pendiente) |
| `/servicios/consultoria` | Home | Consultoría (pendiente) |
| `/servicios/desarrollo-web` | Home | Desarrollo web (pendiente) |
| `/servicios/marketing-digital` | Home | Marketing digital (pendiente) |
| `/servicios/soporte-tecnico` | Home | Soporte técnico (pendiente) |
| `/noticias/*` | Home | Sección de noticias (pendiente) |
| `/contacto/*` | Home | Sección de contacto (pendiente) |

### 5.3 Servicios

#### UsuarioService (`services/usuario.ts`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `registrarUsuario(usuario)` | POST `/api/usuarios` | Registra un nuevo usuario |
| `loginUsuario(credenciales)` | POST `/api/usuarios/login` | Autenticación de usuario |
| `getUsuarios()` | GET `/api/usuarios` | Lista todos los usuarios |
| `actualizarFoto(userId, foto)` | PATCH `/api/usuarios/:id/foto` | Actualiza foto de perfil |
| `eliminarUsuario(userId)` | DELETE `/api/usuarios/:id` | Elimina un usuario |
| `actualizarUsuario(userId, usuario)` | PUT `/api/usuarios/:id` | Actualiza datos de usuario |

#### PqrsService (`services/pqrs.ts`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `crearPqrs(pqrs)` | POST `/api/pqrs` | Crea una nueva PQRS |
| `getPqrs()` | GET `/api/pqrs` | Lista todas las PQRS |
| `getPqrsByUsuario(usuarioId)` | GET `/api/pqrs/usuario/:usuarioId` | PQRS de un usuario |
| `actualizarEstadoPqrs(pqrsId, estado, autor)` | PATCH `/api/pqrs/:id` | Cambia estado de PQRS |
| `eliminarPqrs(pqrsId)` | DELETE `/api/pqrs/:id` | Elimina una PQRS |
| `agregarNotaInterna(pqrsId, nota, autor)` | PATCH `/api/pqrs/:id/nota` | Agrega nota interna |
| `responderPqrs(pqrsId, respuesta)` | PATCH `/api/pqrs/:id/responder` | Responde una PQRS |

#### EventoService (`services/evento.service.ts`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `getEventos()` | GET `/api/eventos` | Lista todos los eventos |
| `crearEvento(evento)` | POST `/api/eventos` | Crea un nuevo evento |
| `actualizarEvento(id, evento)` | PUT `/api/eventos/:id` | Actualiza un evento |
| `eliminarEvento(id)` | DELETE `/api/eventos/:id` | Elimina un evento |

### 5.4 Flujo de Autenticación

1. **Registro**: El usuario llena el formulario en `/registro` con todos sus datos personales y tipo de usuario. La contraseña se hashea con **bcryptjs** antes de almacenarse.
2. **Login**: El usuario ingresa email y contraseña en `/login`.
3. **Verificación**: El backend busca el email en la base de datos, compara la contraseña hasheada con **bcryptjs**, y genera un **JWT** que contiene `{id, nombre, email, tipoUsuario}`.
4. **Redirección por rol**:
   - Si `tipoUsuario === 'Administrador/Empleado'` → `/dashboard-admin`
   - Cualquier otro tipo → `/dashboard`
5. **Sesión**: Se almacenan `token` (JWT), `userId` e `user` (objeto JSON) en `localStorage`. El token se envía automáticamente en cada petición HTTP vía `AuthInterceptor`.
6. **Protección de rutas**:
   - `authGuard`: Verifica que el usuario esté autenticado (token presente). Si no, redirige a `/login`.
   - `adminGuard`: Verifica autenticación + rol `Administrador/Empleado`. Si no es admin, redirige a `/dashboard`.
   - `residentGuard`: Verifica autenticación + que NO sea administrador. Si es admin, redirige a `/dashboard-admin`.
7. **Cierre de sesión**: `AuthService.logout()` elimina `token`, `userId` y `user` de `localStorage` y redirige a `/login`.
8. **Validación backend**: Todas las rutas protegidas requieren el header `Authorization: Bearer <token>`. Las rutas de admin requieren rol `Administrador/Empleado` vía `roleMiddleware`.

---

## 6. Funcionalidades Implementadas

### 6.1 Módulo Público

- **Página de inicio (Home)**: Landing page del sistema.
- **Registro de usuarios**: Formulario completo con nombre, tipo de documento, número de documento, email, teléfono, tipo de usuario, tipo de residente, conjunto residencial, bloque, apartamento y contraseña. Usa Materialize CSS para los selectores.
- **Login**: Autenticación con redirección según rol.
- **Páginas informativas**: Nuestra Historia, Misión/Visión, Equipo Directivo, Valores Corporativos.

### 6.2 Módulo de Residente

- **Dashboard**: Panel principal con accesos directos y bienvenida personalizada.
- **Mi Perfil**: Visualización y edición de datos personales, subida de foto de perfil (base64).
- **Crear PQRS**: Formulario para radicar nuevas PQRS con tipo (petición, queja, reclamo, sugerencia), asunto, descripción, bloque y apartamento.
- **Mis PQRS**: Listado de las PQRS del usuario autenticado con estado y fechas formateadas.
- **Cartelera de Actividades**: Visualización de eventos con filtros por tipo (mantenimiento, reunión, anuncio) y paginación.

### 6.3 Módulo de Administrador

- **Dashboard Admin**: Panel de control con estadísticas en tiempo real:
  - Tarjetas resumen: Total usuarios, usuarios activos, nuevos del mes, total PQRS, PQRS pendientes, PQRS resueltas, total actividades.
  - Gráfico de barras: Distribución de usuarios (activos, inactivos, nuevos).
  - Gráfico de barras: PQRS por estado (pendientes, en proceso, resueltas, cerradas).
  - Gráfico de líneas: Actividades por mes (últimos 6 meses).
  - Usa **Chart.js** con **chartjs-plugin-datalabels**.
- **Gestión de Usuarios**:
  - Listado completo de usuarios en vista de tabla o tarjetas.
  - Paginación (10 elementos por página).
  - Edición y eliminación de usuarios.
- **Gestión de PQRS**:
  - Listado de todas las PQRS con filtros avanzados (estado, usuario, tipo, prioridad).
  - Vista de tabla y tarjetas con paginación.
  - Ordenamiento por columnas.
  - Estadísticas en tiempo real (pendientes, en proceso, resueltas, cerradas, rechazadas).
  - Cambio de estado de PQRS.
  - Agregar notas internas.
  - Responder PQRS.
  - Vista previa y descarga de archivos adjuntos (soporta PDF, imágenes y documentos).
  - Formateo de fechas en español.
- **Cartelera de Actividades (Admin)**:
  - Listado de todos los eventos con filtros por tipo.
  - Ordenamiento por fecha o título.
  - Paginación (6 elementos por página).
  - Edición y eliminación de eventos.
- **Crear/Editar Evento**: Formulario para crear o modificar eventos con título, tipo (mantenimiento, reunión, anuncio), fechas de inicio/fin y descripción.
- **Mi Perfil Admin**: Visualización de datos del administrador con subida de foto de perfil.

---

## 7. Componentes Compartidos

| Componente | Ubicación | Descripción |
|-----------|-----------|-------------|
| Navbar | `component/navbar/` | Barra de navegación pública |
| Footer | `component/footer/` | Pie de página público |
| Header Admin | `admin/header-admin/` | Cabecera del panel administrativo |
| Sidebar Admin | `admin/sidebar-admin/` | Menú lateral del administrador |
| Header Usuario | `usuario/header-usuario/` | Cabecera del panel del residente |
| Sidebar Usuario | `usuario/sidebar-usuario/` | Menú lateral del residente |

---

## 8. Estilos y Diseño

- Estilos globales en `src/styles.css`
- Cada componente tiene su archivo CSS independiente (`styleUrls`)
- Dashboard administrativo usa **Chart.js** para gráficos interactivos
- Los estados de PQRS y prioridades tienen clases CSS diferenciadas:
  - Estados: `estado-pendiente`, `estado-proceso`, `estado-resuelto`, `estado-cerrado`, `estado-rechazado`
  - Prioridades: `prioridad-baja`, `prioridad-media`, `prioridad-alta`, `prioridad-urgente`
  - Tipos de PQRS: `tipo-peticion`, `tipo-queja`, `tipo-reclamo`, `tipo-sugerencia`
- Tipos de evento con clases: `event-maintenance`, `event-meeting`, `event-announcement`

---

## 9. Consideraciones Técnicas

### Seguridad
- Autenticación con **JWT** (JSON Web Token) con expiración de 8 horas.
- Contraseñas hasheadas con **bcryptjs** (salt rounds: 10).
- Protección de rutas en frontend con **Guards**: `authGuard`, `adminGuard`, `residentGuard`.
- Protección de rutas en backend con **middleware JWT** (`authMiddleware`) y control de roles (`roleMiddleware`).
- Validación de datos en el backend con **express-validator** (campos requeridos, formato de email, longitud de contraseña, IDs de MongoDB).
- `AuthInterceptor` inyecta automáticamente el token JWT en todas las peticiones HTTP.
- Prevención de duplicados: se valida que el email y número de documento no existan antes de registrar.
- Las contraseñas nunca se incluyen en las respuestas del API (`.select('-password')`).

### Base de Datos
- MongoDB local sin autenticación en `mongodb://localhost/adminnovation`.
- Los documentos incluyen `timestamps` automáticos (createdAt, updatedAt).
- Las referencias entre colecciones usan `ObjectId` con `populate` de Mongoose.

- **Frontend**
- **Environment**: URLs de API centralizadas en `environment.ts` (dev) y `environment.prod.ts` (prod).
- Se usa `isPlatformBrowser` para compatibilidad con SSR (Server-Side Rendering).
- Los archivos adjuntos en PQRS se manejan en formato base64 directamente en la base de datos.
- Las fotos de perfil también se almacenan como base64.
- **Formularios**: Migrados a **Reactive Forms** con validaciones en Login, Nueva PQRS y Nuevo Evento.

### Paginación
- Implementada del lado del cliente (slice de arrays).
- 10 elementos por página en gestión de usuarios y PQRS.
- 6 elementos por página en cartelera de actividades.

---

## 10. Cómo Ejecutar el Proyecto

### Requisitos Previos
- Node.js instalado
- MongoDB ejecutándose en `localhost` puerto por defecto (27017)
- Angular CLI instalado globalmente (`npm install -g @angular/cli`)

### Backend
```bash
cd backend
npm install
npm run dev
```
El servidor se inicia en `http://localhost:3001`

### Frontend
```bash
cd frontend
npm install
ng serve
```
La aplicación se inicia en `http://localhost:4200`

---

## 11. Estado del Proyecto

### Funcionalidades Completadas
- [x] Sistema de registro e inicio de sesión
- [x] Hash de contraseñas con bcryptjs
- [x] Autenticación con JWT (generación, verificación, expiración 8h)
- [x] Protección de rutas con Guards (AuthGuard, AdminGuard, ResidentGuard)
- [x] Protección de rutas API con middleware JWT y control de roles
- [x] Validación de datos en el backend con express-validator
- [x] HTTP Interceptor para inyección automática de token JWT
- [x] AuthService centralizado para gestión de sesión
- [x] HTTP Interceptor con manejo de errores 401/403 (auto-logout)
- [x] Environment variables centralizadas (dev/prod)
- [x] Centralización de localStorage vía AuthService (eliminación de llamadas directas)
- [x] Migración de formularios clave a Reactive Forms (Login, New PQRS, Nuevo Evento)
- [x] Validación en formularios del frontend (required, email, minLength, maxLength)
- [x] Sistema de notificaciones Toast (success, error, warning, info)
- [x] Reemplazo de todos los `alert()` por Toast notifications
- [x] Estados de carga unificados (loading) en componentes de datos
- [x] Prevención de duplicados (email y documento) en registro
- [x] Respuestas del API excluyen contraseñas
- [x] Dashboard de administrador con estadísticas y gráficos
- [x] Gestión completa de usuarios (CRUD)
- [x] Sistema PQRS completo (crear, listar, filtrar, cambiar estado, notas internas, respuestas)
- [x] Gestión de eventos/actividades (CRUD)
- [x] Cartelera de actividades para residentes y administradores
- [x] Perfiles de usuario con subida de foto
- [x] Paginación en vistas de listado
- [x] Filtros avanzados en gestión de PQRS
- [x] Estadísticas agregadas en dashboard
- [x] Páginas informativas públicas (Historia, Misión/Visión, Equipo Directivo, Valores)

---

## 12. Arquitectura de Seguridad (Implementada)

### Backend

| Archivo | Función |
|---------|---------|
| `helpers/auth.js` | Hash/compare de contraseñas con bcryptjs, generación/verificación de JWT |
| `middleware/auth.js` | `authMiddleware` (verifica token JWT) y `roleMiddleware` (verifica rol del usuario) |

### Protección de Rutas API

| Ruta | Autenticación | Roles Permitidos |
|------|:------------:|:----------------:|
| `POST /api/usuarios/login` | No | Público |
| `POST /api/usuarios` (registro) | No | Público |
| `GET /api/usuarios` | Sí | Cualquier rol |
| `GET /api/usuarios/:id` | Sí | Cualquier rol |
| `PUT /api/usuarios/:id` | Sí | Cualquier rol |
| `PATCH /api/usuarios/:id/foto` | Sí | Cualquier rol |
| `DELETE /api/usuarios/:id` | Sí | Solo Admin |
| Todas las rutas `/api/pqrs/*` | Sí | Cualquier rol (delete: solo Admin) |
| Todas las rutas `/api/eventos/*` | Sí | Cualquier rol (POST/PUT/DELETE: solo Admin) |
| `GET /api/estadisticas` | Sí | Solo Admin |

### Frontend

| Archivo | Función |
|---------|---------|
| `services/auth.service.ts` | AuthService centralizado (login, logout, guardar sesión, obtener token/usuario) |
| `services/auth.interceptor.ts` | AuthInterceptor (inyecta `Authorization: Bearer <token>` en cada petición HTTP) |
| `guards/auth.guard.ts` | `authGuard` - Verifica que el usuario esté autenticado |
| `guards/admin.guard.ts` | `adminGuard` - Verifica que el usuario sea Administrador/Empleado |
| `guards/resident.guard.ts` | `residentGuard` - Verifica que el usuario NO sea administrador |

### Frontend - Servicios y Componentes Transversales

| Componente/Servicio | Ubicación | Descripción |
|---------------------|-----------|-------------|
| AuthService | `services/auth.service.ts` | Gestión centralizada de sesión (login, logout, token, usuario) |
| AuthInterceptor | `services/auth.interceptor.ts` | Inyección automática de JWT y manejo de errores 401/403 |
| ToastService | `services/toast.service.ts` | Notificaciones visuales (success, error, warning, info) |
| ToastComponent | `component/toast/toast.ts` | Componente global de notificaciones con animaciones |

### Validaciones Backend (express-validator)

- **Registro/Login**: email válido, contraseña ≥ 6 caracteres, campos obligatorios
- **PQRS**: tipo válido (peticion/queja/reclamo/sugerencia), asunto ≤ 200 chars, IDs MongoDB válidos
- **Eventos**: tipo válido (maintenance/meeting/announcement), fechas ISO8601, IDs MongoDB válidos
- **Usuarios**: nombre, tipoDocumento, numeroDocumento, email, telefono, tipoUsuario, tipoResidente, conjuntoResidencial, numeroBloque, numeroApartamento obligatorios

### Funcionalidades Pendientes o en Desarrollo
- [ ] Páginas de Servicios (consultoría, desarrollo web, marketing digital, soporte técnico)
- [ ] Sección de Noticias (últimas, eventos, comunicados, blog)
- [ ] Sección de Contacto (formulario, oficinas, teléfonos, trabaja con nosotros)
- [ ] Recuperación de contraseña
- [ ] Edición completa de datos de usuario desde gestión de usuarios
- [ ] Notificaciones en tiempo real