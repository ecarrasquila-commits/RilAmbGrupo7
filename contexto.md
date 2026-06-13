# Contexto del proyecto rilAmb

## Descripción general
rilAmb es un sistema inteligente de detección y monitoreo de gases en espacios cerrados. El proyecto está dividido en tres capas principales:
- Backend en Python con FastAPI.
- Frontend en React con JavaScript y CSS.
- Base de datos PostgreSQL, con integración adicional para IoT mediante ESP32, Arduino IDE, MQTT y Mosquitto.

## Estructura actual del proyecto
```text
RilAmbGrupo7/
├── README.md
├── ESTRUCTURA_PROYECTO_COMPLETA.txt
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── database/
│   │   ├── db.py
│   │   └── session.py
│   ├── middleware/
│   ├── models/
│   │   ├── alert.py
│   │   ├── device.py
│   │   ├── enums.py
│   │   ├── password_reset.py
│   │   ├── sensor_reading.py
│   │   ├── user_device.py
│   │   └── user.py
│   ├── routes/
│   │   └── auth.py
│   ├── schemas/
│   │   ├── alert_schema.py
│   │   ├── auth_schema.py
│   │   ├── device_schema.py
│   │   └── user_schema.py
│   ├── services/
│   │   ├── auth_service.py
│   │   └── password_reset_service.py
│   ├── tests/
│   │   └── integration/
│   │       └── test_auth_integration.py
│   └── utils/
│       ├── email_sender.py
│       ├── jwt_handler.py
│       └── security.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── playwright.config.js
│   ├── README.md
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── homeComponents.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── admin/
│   │   │   ├── authentication/
│   │   │   │   ├── AuthLogo.jsx
│   │   │   │   ├── bgPattern.jsx
│   │   │   │   ├── passwordEye.jsx
│   │   │   │   ├── PasswordField.jsx
│   │   │   │   └── progressDots.jsx
│   │   │   └── user/
│   │   ├── constants/
│   │   │   └── sensors.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useReveal.js
│   │   ├── pages/
│   │   │   ├── dashboard.jsx
│   │   │   ├── home.jsx
│   │   │   ├── authentication/
│   │   │   │   ├── login.jsx
│   │   │   │   ├── recoverPassword.jsx
│   │   │   │   └── register.jsx
│   │   │   └── user/
│   │   ├── router/
│   │   │   └── index.jsx
│   │   ├── services/
│   │   │   └── authService.js
│   │   └── styles/
│   │       ├── admin/
│   │       ├── authentication/
│   │       │   ├── login.css
│   │       │   ├── recoverPassword.css
│   │       │   └── register.css
│   │       ├── home/
│   │       │   └── home.css
│   │       └── user/
│   ├── test-results/
│   │   └── auth-register-register-end-to-end-flow/
│   │       └── error-context.md
│   └── tests/
│       ├── setup.js
│       ├── e2e/
│       │   └── auth/
│       │       ├── login.spec.js
│       │       └── register.spec.js
│       ├── integrationTests/
│       │   └── auth/
│       │       ├── login.integration.test.jsx
│       │       ├── recoverPassword.integration.test.jsx
│       │       └── register.integration.test.jsx
│       └── unitTests/
│           ├── home.test.jsx
│           └── auth/
│               ├── login.test.jsx
│               ├── recoverPassword.test.jsx
│               └── register.test.jsx
└── vistas por implementar/
    ├── notifications.css
    ├── Notifications.jsx
    └── proyectico/
        ├── adminDevices.jsx
        ├── adminReports.jsx
        ├── home.jsx
        ├── login.jsx
        ├── logoInicioAparece.html
        ├── monitoring.jsx
        ├── perfil.jsx
        ├── recoverPassword.jsx
        ├── register.jsx
        ├── userAdmin.jsx
        ├── userDevices.jsx
        └── userReports.jsx
```

## Conexiones actuales entre frontend y backend

### Frontend
- El archivo [frontend/src/services/authService.js](frontend/src/services/authService.js) centraliza la comunicación con el backend de autenticación.
- La URL base actual es `http://127.0.0.1:8000/auth`.
- Desde el frontend se consumen estas rutas:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/forgot-password`
  - `POST /auth/verify-reset-code`
  - `POST /auth/reset-password`
- Al iniciar sesión, el token JWT se guarda en `localStorage`.
- El hook [frontend/src/hooks/useAuth.js](frontend/src/hooks/useAuth.js) valida autenticación leyendo el token guardado.
- El componente [frontend/src/components/ProtectedRoute.jsx](frontend/src/components/ProtectedRoute.jsx) bloquea rutas privadas si no existe token.

### Rutas del frontend
El enrutador principal está en [frontend/src/router/index.jsx](frontend/src/router/index.jsx) y actualmente expone:
- `/` -> Home
- `/login` -> Login
- `/recover-password` -> Recuperar contraseña
- `/register` -> Registro
- `/dashboard` -> vista protegida de monitoreo
- `/reports` -> vista protegida de reportes
- `/devices` -> vista protegida de dispositivos
- `/perfil` -> vista protegida de perfil

### Páginas del frontend que consumen backend
- [frontend/src/pages/authentication/login.jsx](frontend/src/pages/authentication/login.jsx) usa `loginUser`.
- [frontend/src/pages/authentication/register.jsx](frontend/src/pages/authentication/register.jsx) usa `registerUser`.
- [frontend/src/pages/authentication/recoverPassword.jsx](frontend/src/pages/authentication/recoverPassword.jsx) usa `forgotPassword`, `verifyResetCode` y `resetPassword`.

## Backend
- El punto de entrada está en [backend/main.py](backend/main.py).
- FastAPI está configurado con `CORSMiddleware` para permitir origen desde el frontend local:
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`
- El backend registra actualmente el router de autenticación con `app.include_router(auth_router)`.
- La raíz `/` responde con un mensaje simple de verificación: `Backend working`.

### Router de autenticación
El router principal de autenticación está en [backend/routes/auth.py](backend/routes/auth.py) y usa el prefijo `/auth`.

Rutas activas:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/verify-reset-code`
- `POST /auth/reset-password`
- `DELETE /auth/delete/{correo}`

### Servicios del backend
- [backend/services/auth_service.py](backend/services/auth_service.py) maneja:
  - creación de usuario
  - inicio de sesión
  - eliminación de usuario por correo
- [backend/services/password_reset_service.py](backend/services/password_reset_service.py) maneja:
  - generación de código de recuperación
  - verificación del código
  - cambio de contraseña
  - envío de correo de recuperación

## Resumen del estado actual
- La integración frontend-backend activa hoy está centrada en autenticación y recuperación de contraseña.
- El frontend ya navega correctamente entre login, registro, recuperación y rutas protegidas.
- El backend ya expone el API de auth y permite CORS para desarrollo local.
- Todavía no se observa una conexión frontend-backend implementada para dispositivos, reportes, monitoreo o administración más allá de las rutas/pantallas preparadas en el frontend.

## Comandos de desarrollo usados en local
- Base de datos: `docker start postgres-fastapi`
- Backend: `uvicorn main:app --reload`
- Frontend: `npm run dev`
- Pruebas frontend: `npm test` y `npm run e2e:slow`
- Pruebas backend: `pytest`

## Nota de contexto
Este archivo resume el estado actual del proyecto en esta versión del repositorio. Si se agregan nuevos routers, servicios o páginas, conviene actualizar este documento para mantener sincronizado el mapa de arquitectura.
