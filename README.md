# Ruta Limpia UPB

Sistema web full-stack desarrollado para la gestion, control de calidad y verificacion en tiempo real de las labores de limpieza y mantenimiento de instalaciones en la Universidad Pontificia Bolivariana (UPB).

---

## Arquitectura del Proyecto

El sistema esta compuesto por dos servicios independientes alojados en Microsoft Azure App Service:
- Frontend: Aplicacion de Single Page Application (SPA) construida con React, Vite, Material UI y Zustand, servida mediante un servidor estatico de Node (`serve`) en Azure.
- Backend: API REST y servidor de eventos en tiempo real construidos con Node.js, Express y Socket.IO, conectado a Supabase como base de datos central.

---

## Que Hace el Sistema (Modulos y Funcionalidades)

El flujo operativo y funcional de Ruta Limpia UPB se divide en los siguientes modulos principales:

### 1. Sistema de Autenticacion y Control de Accesos (RBAC)
- **Inicio de Sesion Seguro:** Formulario validado con Formik y Yup, conectado al endpoint `/api/auth/login` para autenticar credenciales de usuarios almacenados en Supabase.
- **Enrutamiento por Roles:** Redireccion automatizada tras el login segun el rol del usuario:
  - **Administrador:** Acceso al panel de supervision y control global (`/dashboard`).
  - **Operario:** Acceso a la vista de ejecucion de tareas de limpieza (`/operario`).
- **Persistencia de Sesion:** Gestion de tokens de autorizacion (`Bearer Token`) mediante almacenamiento local (`localStorage`) e hidratacion de estado global con Zustand y Axios Interceptors.

### 2. Flujo Operativo de Aseo (Modulo de Operarios)
- **Filtro de Seguridad Quimica:** Antes de habilitar las herramientas de trabajo en campo, el sistema exige superar un riguroso cuestionario interactivo de 5 preguntas de verdadero/falso sobre manejo seguro de quimicos de limpieza.
- **Escaneo y Verificacion de Zonas (QR):** Sistema de control de presencia mediante lectura de codigos QR asociados a bloques e instalaciones especificas de la universidad (por ejemplo, validacion de codigo para Baño Bloque 9 - Piso 3).
- **Mapa Interactivo de Instalaciones:** Interfaz grafica que desglosa baños, sanitarios, lavamanos y areas comunes para marcar estados de manera intuitiva.
- **Captura y Validacion de Evidencia Fotografica:** Obligatoriedad de capturar foto en tiempo real mediante la camara del dispositivo (bloqueando la subida desde galeria) con validacion de metadatos EXIF y hashes unicos procesados a traves de microservicios para garantizar la veracidad del reporte.

### 3. Supervision en Tiempo Real (Modulo de Administracion)
- **Monitoreo de Estados de Zonas:** Control en vivo del ciclo de vida de cada espacio bajo las categorias:
  - `pending` (Pendiente)
  - `in_progress` (En proceso de aseo)
  - `completed` (Finalizado y verificado)
  - `issue` (Novedad o reporte de incidencia)
- **Actualizaciones Instantaneas via WebSockets:** Integracion con **Socket.IO** tanto en el backend como en el frontend para emitir y recibir eventos en tiempo real (`cleaning:start`, `cleaning:finished`, `cleaning:novelty`) reflejando los cambios de los operarios directamente en el panel del administrador sin necesidad de recargar la pagina.

---

## Tecnologias Utilizadas

### Frontend
- React 18 / Vite (Empaquetador y entorno de desarrollo)
- TypeScript (Tipado estatico)
- Material UI (MUI) (Libreria de componentes visuales)
- Formik & Yup (Manejo y validacion de formularios)
- Zustand (Gestion de estado global de autenticacion)
- Axios (Cliente HTTP para consumo de API)
- React Router DOM (Enrutamiento protegido por roles)

### Backend
- Node.js (LTS 22) & Express (Servidor HTTP y enrutamiento de API)
- Socket.IO (Comunicacion bidireccional en tiempo real para control de aseos)
- Supabase (PostgreSQL) (Base de datos y autenticacion de usuarios)
- CORS, Helmet & Morgan (Seguridad y logging de peticiones HTTP)

---

## Estructura del Repositorio

```text
├── backend/
│   ├── src/
│   │   ├── config/       # Configuracion de Supabase y servicios
│   │   ├── controllers/  # Logica de negocio (auth, zones, cleanings, admin)
│   │   ├── middlewares/  # Control de CORS, seguridad y validaciones
│   │   ├── routes/       # Definicion de endpoints (/api/auth, /api/zones, etc.)
│   │   ├── app.js        # Configuracion de Express
│   │   └── server.js     # Inicializacion de HTTP Server y Socket.IO
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/          # Configuracion central de Axios (axios.client.ts)
    │   ├── components/   # Componentes modulares (Modales, Privacidad, UI)
    │   ├── pages/        # Vistas principales (LoginPage, Dashboard, Operario)
    │   ├── routes/       # Proteccion de rutas por roles (Admin / Operario)
    │   ├── schemas/      # Validaciones con Yup
    │   └── store/        # Estado global con Zustand
    ├── public/           # Archivos estaticos y .deployment para Azure
    └── package.json
