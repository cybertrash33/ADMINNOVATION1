# API de Residentes 🏢

API REST para la gestión de residentes desarrollada con Node.js, Express y MongoDB.

## 🚀 Características

- CRUD completo de residentes
- Base de datos MongoDB Atlas
- Validación de datos
- Fechas automáticas de creación y actualización
- API RESTful

## 📦 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/api-residentes.git
cd api-residentes
Instalar dependencias:

bash
npm install
Configurar variables de entorno:

bash
cp .env.example .env
# Editar .env con tus configuraciones
Ejecutar en desarrollo:

bash
npm run dev
🔧 Variables de Entorno
Crear archivo .env:

env
MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/tudatabase?retryWrites=true&w=majority
PORT=5000
📚 Endpoints
Residentes
GET /api/residentes - Obtener todos los residentes

POST /api/residentes - Crear nuevo residente

GET /api/residentes/:id - Obtener residente por ID

PUT /api/residentes/:id - Actualizar residente

DELETE /api/residentes/:id - Eliminar residente

🛠️ Tecnologías
Node.js

Express.js

MongoDB Atlas

Mongoose

dotenv

CORS

text

## 🔄 Comandos Git útiles:

```bash
# Ver estado de los archivos
git status

# Agregar archivos específicos
git add server.js routes/ models/

# Hacer commit
git commit -m "Mensaje descriptivo"

# Subir cambios
git push origin main

# Ver historial de commits
git log --oneline
📋 Para subir cambios futuros:
bash
# Flujo normal de trabajo:
git add .
git commit -m "Descripción del cambio"
git push origin main

