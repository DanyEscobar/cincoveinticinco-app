# CincoveinticincoApp

🌐 **Demo en vivo**: [cincoveinticinco-app.netlify.app](https://cincoveinticinco-app.netlify.app)

Aplicación de gestión de usuarios desarrollada con **Angular 21** y **Bootstrap 5**. Permite registrar nuevos usuarios desde una Landing Page pública e incluye un Dashboard privado para consultar, buscar y editar registros.

---

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js `>= 18`
- npm `>= 11`
- Angular CLI `>= 21`

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm start
# o
ng serve
```

La aplicación estará disponible en: **http://localhost:4200/**

---

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la build de producción en `dist/` |
| `npm run watch` | Build en modo watch para desarrollo |
| `ng test` | Ejecuta pruebas unitarias con Vitest |

---

## 🗺️ Rutas de la Aplicación

| Ruta | Descripción |
|---|---|
| `/contact` | Landing Page — Formulario de registro de usuario |
| `/dashboard/users` | Lista de usuarios registrados |
| `/dashboard/users/new-user` | Formulario para añadir un nuevo usuario |
| `/dashboard/users/edit-user/:id` | Formulario para editar un usuario existente |
| `**` | Redirige automáticamente a `/contact` |

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una arquitectura feature-based con lazy loading:

```
src/app/
  ├── landing/                  # Módulo público (Landing Page)
  │   ├── components/
  │   │   └── contact-form/     # Formulario de registro con validaciones dinámicas
  │   └── pages/
  │       └── contact/          # Página principal de registro
  │
  ├── dashboard/                # Módulo privado (Dashboard de Administración)
  │   ├── components/
  │   │   ├── sidebar/          # Navegación lateral responsive
  │   │   └── navbar/           # Barra de navegación superior
  │   ├── layouts/
  │   │   └── dashboard-layout/ # Layout con sidebar + contenido principal
  │   └── pages/
  │       └── user/
  │           ├── user-index/   # Tabla de usuarios con búsqueda y ordenamiento
  │           └── edit-user/    # Formulario de edición/creación de usuario
  │
  └── shared/                   # Módulo compartido (reutilizable)
      ├── components/
      │   ├── dynamic-form/     # Formulario dinámico dirigido por configuración JSON
      │   ├── breadcrumbs/      # Navegación de migas de pan
      │   ├── loading-spinner/  # Spinner de carga global
      │   ├── error-message/    # Mensajes de error de formulario
      │   └── search-box/       # Caja de búsqueda reutilizable
      ├── services/
      │   ├── user.service.ts       # Gestión de estado de usuarios (BehaviorSubject)
      │   ├── toast.service.ts      # Notificaciones tipo toast (MatSnackBar)
      │   ├── loarder.service.ts    # Estado del loading global
      │   ├── validators.service.ts # Vinculador de validadores del formulario dinámico
      │   ├── form-config.service.ts# Carga de configuración de formularios desde JSON
      │   └── singleton.service.ts  # Utilidades compartidas
      ├── interceptors/
      │   └── loader.interceptor.ts # Interceptor HTTP que activa el loading spinner
      ├── validators/
      │   └── validations.ts        # Validadores personalizados (validateAge, etc.)
      └── directives/
          └── trim.directive.ts     # Directiva para recortar espacios en campos de texto
```

---

## ✨ Funcionalidades Principales

### Landing Page (`/contact`)
- Formulario de registro completo con validación reactiva.
- Datos requeridos: Sexo, Fecha de Nacimiento, Nombre, Apellido, Email, Dirección, País, Departamento (solo Colombia), Ciudad, Comentarios.
- **Validación de mayoría de edad**: El usuario debe tener 18 años o más. Si no los tiene, se muestra un toast de advertencia y el formulario no se envía.
- Toast de confirmación al registrar exitosamente.

### Dashboard (`/dashboard/users`)
- Tabla de usuarios cargados desde API externa (`cincoveinticinco.com/users.json`) + registros locales.
- **Búsqueda** por nombre, apellido, email o país.
- **Ordenamiento** por cualquier columna (ascendente/descendente).
- **Paginación** configurable.
- Acciones por fila: **Editar**.

### Edición de Usuarios (`/dashboard/users/edit-user/:id`)
- Formulario pre-rellenado con los datos del usuario seleccionado.
- Lógica de cascada para País → Departamento (solo Colombia) → Ciudad.
- Toast de confirmación al guardar los cambios.

---

## ⚙️ Características Técnicas

### Formulario Dinámico (Data-Driven)
El componente `DynamicForm` genera campos de formulario de forma dinámica a partir de un archivo de configuración JSON (`/public/form-config/contact-form.json`). Esto permite agregar o modificar campos sin tocar el código del componente.

### Gestión de Estado Reactivo
`UserService` utiliza un `BehaviorSubject` que actúa como una store local en memoria. Los cambios (añadir, editar, eliminar) persisten durante la sesión y se fusionan inteligentemente con los datos del servidor, dando prioridad siempre al estado local.

### Interceptor HTTP con Loading Spinner
`httpLoaderInterceptor` intercepta **todas** las peticiones HTTP. Antes de completarse, activa el spinner global de carga. Al finalizar (vía `finalize`), lo desactiva tras un breve retardo para una mejor experiencia visual.

### Toast Notifications
`ToastService` encapsula `MatSnackBar` de Angular Material para mostrar notificaciones no intrusivas en la esquina superior derecha:
- 🟢 **Éxito** (verde): Operación completada correctamente.
- 🟠 **Advertencia** (naranja): Acción no permitida (ej. usuario menor de edad).
- 🔴 **Error** (rojo): Fallo en una operación.

---

```bash
ng test
```

---

## 📦 Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 21.x | Framework principal |
| Angular Material | 21.x | Componentes UI (Snackbar) |
| Bootstrap | 5.3.x | Sistema de grilla y estilos |
| Bootstrap Icons | 1.13.x | Iconografía |
| RxJS | 7.8.x | Programación reactiva |
| TypeScript | 5.9.x | Tipado estático |
| Vitest | 4.x | Testing |

