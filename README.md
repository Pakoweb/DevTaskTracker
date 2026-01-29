# DevTask Tracker

**DevTask Tracker** es una aplicación web para la gestión de tareas técnicas de desarrollo. Permite crear tareas, asignarlas a tecnologías específicas, marcar su estado y mantener un historial (Backlog) de las tareas eliminadas.

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla).
- **Backend**: Node.js, Express.
- **Base de Datos**: MongoDB (Atlas).

## Estructura del Proyecto

- `frontend/`: Código fuente de la interfaz de usuario.
- `backend/`: API REST y conexión a base de datos.

## Instalación y Configuración

### Prerrequisitos
- Node.js instalado.
- Una base de datos MongoDB (URI de conexión).

### 1. Configurar el Backend

1. Navega a la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la carpeta `backend` con tu conexión a MongoDB:
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nombre_db
   PORT=3001
   ```
4. Inicia el servidor:
   ```bash
   npm start
   ```

### 2. Ejecutar el Frontend

1. Navega a la carpeta `frontend`.
2. Simplemente abre el archivo `index.html` en tu navegador web.
   - Opcionalmente, puedes usar una extensión como "Live Server" en VS Code.

## Funcionalidades

- **Crear Tarea**: Registra nuevas tareas con título, descripción, tecnología y estado.
- **Listar Tareas**: Visualiza todas las tareas pendientes y completadas.
- **Eliminar y Archivar**: Al eliminar una tarea, esta se mueve automáticamente al **Historial**.
- **Ver Historial**: Botón para alternar la vista entre tareas activas y el historial de tareas eliminadas (Backlog).

## API Endpoints

- `GET /api/tasks`: Obtener todas las tareas activas.
- `POST /api/tasks`: Crear una nueva tarea.
- `DELETE /api/tasks/:id`: Eliminar una tarea (la mueve a Backlog).
- `GET /api/backlog`: Obtener el historial de tareas eliminadas.
