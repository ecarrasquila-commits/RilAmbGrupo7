# rilAmb
Sistema Inteligente de Detección y Monitoreo de Gases en Espacios Cerrados.

# MVP Proyecto - rilAmb

## Integrantes
- Nombre - Luisa Carolina Araque Guillen.
- Nombre - Estivenson David Carrasquilla Robles.

## Tecnologías usadas
- Backend: Python + FastAPI.
- Frontend: React + JavaScript + CSS.
- Base de datos: PostgreSQL.
- Capa IoT: ESP32 + Arduino IDE + MQTT + Mosquitto.

## Estado actual
Desarrollo 

## Correr poyecto en local 
* Base de datos 
- iniciar bd: docker start postgres-fastapi
- Verificar: docker ps

* Backend
- navegar a la carpeta: cd D:\paginasUniversidad\RilAmbGrupo7\backend
- iniciar el backend: uvicorn main:app --reload

* Frontend
- navegar a la carpeta: cd D:\paginasUniversidad\RilAmbGrupo7\frontend
- iniciar el backend: npm run dev

# Correr pruebas en local 

* unitarias 
- cd D:\paginasUniversidad\RilAmbGrupo7\frontend
- npm test -- tests/unitTests/login.test.jsx
- npm test -- tests/unitTests/register.test.jsx


* integracion 
- cd D:\paginasUniversidad\RilAmbGrupo7\frontend
- npm test -- tests/integrationTests/

o

- cd D:\paginasUniversidad\RilAmbGrupo7\backend
- pytest tests/integration/c


* e2e       
- cd D:\paginasUniversidad\RilAmbGrupo7\backend
- python -m uvicorn main:app --host 127.0.0.1 --port 8000

- cd D:\paginasUniversidad\RilAmbGrupo7\frontend
- npm run e2e:slow -- tests/e2e/auth/login.spec.js
- npm run e2e:slow -- tests/e2e/auth/register.spec.js
