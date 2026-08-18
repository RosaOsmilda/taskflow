\# TaskFlow — Sistema de Gestión de Tareas Personales



Proyecto final de Programación III. Aplicación web full-stack para crear, organizar y dar seguimiento a tareas personales, desarrollada aplicando la metodología Scrum.



\## Tecnologías



\- \*\*Backend:\*\* Node.js, Express.js

\- \*\*Base de datos:\*\* MongoDB Atlas (Mongoose)

\- \*\*Autenticación:\*\* JWT (JSON Web Tokens) + bcrypt para el cifrado de contraseñas

\- \*\*Frontend:\*\* HTML5, CSS3, JavaScript (vanilla)

\- \*\*Pruebas:\*\* Jest (unitarias) y Postman/Newman (API y automatización)



\## Estructura del repositorio





\## Funcionalidades (Historias de Usuario)



\- Registro e inicio de sesión de usuarios

\- Crear, editar y eliminar tareas

\- Asignar prioridad (alta/media/baja) y fecha límite

\- Marcar tareas como completadas

\- Filtrar tareas por estado y ordenar por fecha o prioridad

\- Indicador visual de tareas vencidas



\## Cómo correrlo localmente



\### Backend

```bash

cd backend

npm install

\# Crear archivo .env con MONGO\_URI, JWT\_SECRET y PORT (ver .env.example)

npm start

```



\### Frontend

```bash

cd frontend

npx http-server -p 5500

```

Luego abrir `http://127.0.0.1:5500` en el navegador.



\### Pruebas automatizadas (Postman/Newman)

```bash

newman run "TaskFlow API.postman\_collection.json"

```



\## Endpoints principales



| Método | Ruta | Descripción |

|---|---|---|

| POST | `/auth/register` | Registrar usuario |

| POST | `/auth/login` | Iniciar sesión (devuelve JWT) |

| GET | `/tasks` | Listar tareas (soporta `?status=` y `?sort=`) |

| POST | `/tasks` | Crear tarea |

| PUT | `/tasks/:id` | Editar tarea o marcar como completada |

| DELETE | `/tasks/:id` | Eliminar tarea |



\## Autora



Rosa Osmilda Batista — Proyecto Final, Programación III







