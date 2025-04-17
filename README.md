# 📚 CMPC Libros

Aplicación fullstack para la gestión de libros. Incluye operaciones CRUD, filtros, búsqueda, ordenamiento, exportación CSV y carga de imágenes de portadas.

---

## 🚀 Tecnologías utilizadas

| Categoría   | Tecnologías                          |
|-------------|--------------------------------------|
| Backend     | NestJS, Sequelize, PostgreSQL        |
| Frontend    | React, Vite, Redux Toolkit, MUI      |
| DevOps      | Docker, Docker Compose               |
| Tipado      | TypeScript en frontend y backend     |
| Otros       | Swagger, ESLint, Prettier            |

---

## 📦 Entrega

- Repositorio: [GitHub CMPC Libros](https://github.com/tu-usuario/tu-repo) ← *ajustar con tu repo real*
- Docker Compose: incluye configuración para frontend
- Documentación en este mismo README

---

## ⚙️ Instalación y ejecución local

### 🔸 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

---

### 🔸 2. Ejecutar manualmente (sin Docker)

#### 📦 Backend

```bash
cd backend
npm install
npm run start:dev
```

- Asegurate de tener una base de datos PostgreSQL corriendo en `localhost:5432`
- Las variables de entorno están en `.env`
- El `seed.ts` carga datos y usuario de prueba automáticamente

#### 💻 Frontend

```bash
cd frontend
npm install
npm run dev
```

- Asegurate de que la API esté corriendo en `http://localhost:3000`

---

### 🔸 3. Ejecutar el Frontend con Docker Compose

Podés levantar el frontend con Vite usando Docker Compose:

```bash
docker-compose up --build
```

Esto inicia solo el contenedor del frontend en:

```
http://localhost:5173
```

### 🖼 Servidor de subida de imágenes

Además del frontend, el sistema incluye un pequeño servidor Express que guarda las imágenes localmente en `public/uploads/libros`.

Este corre en `http://localhost:4001/upload` y se inicia automáticamente con:

```bash
npm run dev

---

### 🐳 Levantar el entorno con Docker

```bash
docker-compose up --build
```

## 🔐 Credenciales de prueba

```json
{
  "email": "admin@cmpc.com",
  "password": "admin123"
}
```

---

## 🔎 Rutas principales

| Recurso    | Ruta                              |
|------------|-----------------------------------|
| Frontend   | http://localhost:5173             |
| Backend    | http://localhost:3000             |
| Swagger    | http://localhost:3000/api         |
| Imágenes   | http://localhost:3000/uploads/... |

---

## 🧪 Funcionalidades implementadas

✅ Listado de libros con filtros y ordenamiento  
✅ CRUD de libros (con soft delete)  
✅ Carga y vista previa de portada (imagen)  
✅ Exportación de libros en CSV  
✅ Validaciones frontend y backend  
✅ Documentación automática Swagger  
✅ Interfaz responsiva con Material UI  
✅ Tipado completo con TypeScript  
✅ Seed con datos de prueba  

---

## 📁 Estructura del proyecto

```
/frontend              # App React con Vite + MUI
/backend               # API REST NestJS
  └── uploads/libros   # Portadas (cargadas desde el front)
  └── src/books        # Módulo principal (CRUD libros)
  └── src/database     # Seed, modelos y configuración
/docker-compose.yml    # Frontend (Vite)
.env                   # Variables para base de datos
```

---

## 🧠 Descripción técnica y decisiones de diseño

- **NestJS**: estructura modular, escalabilidad, inyección de dependencias.
- **Sequelize**: ORM maduro con soporte de relaciones y migraciones.
- **React + Vite**: rendimiento óptimo, tooling moderno y DX.
- **Redux Toolkit**: manejo de estado global y asincronismo claro.
- **Imágenes**: se almacenan en `/uploads/libros` accesibles por ruta pública.
- **Soft delete**: no se eliminan registros, se ocultan con `deleted_at`.

---

## 🛠 To-do / mejoras futuras

- Subida de portadas a S3 o similar
- Testing (Jest + React Testing Library)
- Roles de usuario y permisos (admin/editor)
- Gestión de usuarios
- Paginación del lado del servidor
- Logging y monitoring

---

## 👨‍💻 Autor

Desarrollado por **[Tu Nombre]** como parte del sistema de gestión de libros para **CMPC**.

Con ❤️ y café ☕ usando herramientas modernas de desarrollo.

---

## 📝 Licencia

Este proyecto está licenciado bajo MIT.