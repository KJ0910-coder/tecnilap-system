# 🛠️ TecniLAP System | Sistema de Gestión Automatizado

![Version](https://img.shields.io/badge/Versión-1.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)
![Supabase](https://img.shields.io/badge/Supabase-Database_&_Cloud-3ECF8E?logo=supabase)

**TecniLAP System** es una solución Full-Stack diseñada para digitalizar y automatizar el flujo de trabajo de talleres técnicos y de mantenimiento. Permite la gestión eficiente de inventarios, órdenes de trabajo y revoluciona la comunicación con el cliente mediante un sistema de alertas automatizadas.

## ✨ Características Principales

* **📦 Gestión de Inventario y Trabajos:** Control total (CRUD) sobre clientes, materiales, reportes y facturación.
* **🤖 Notificaciones Serverless (Telegram):** Integración nativa con bots de Telegram usando **Supabase Edge Functions**, eliminando la necesidad de mantener el servidor local encendido para las alertas.
* **⏰ Tareas Programadas (Cron Jobs):** Ejecución autónoma de alertas de vencimiento de trabajos (a 1 y 3 días) directamente desde el motor de PostgreSQL.
* **🚀 Despliegue Local Automatizado:** Incluye un script inteligente (`.bat`) que autodetecta dependencias, instala el entorno de Node.js de forma silenciosa (`msiexec`) y lanza el sistema en segundo plano.
* **🧠 Ciclo de Vida Inteligente (Heartbeat):** El servidor local detecta cuándo el usuario cierra el navegador y libera los puertos de forma automática.

## 💻 Tecnologías Utilizadas

* **Frontend:** Vanilla JS, HTML5, CSS3.
* **Backend:** Node.js, Express.js.
* **Base de Datos:** PostgreSQL (alojado en Supabase).
* **Nube / DevOps:** Supabase Edge Functions, pg_cron, Windows Batch Scripting (PowerShell).

## 📸 Pantallas del Sistema

> **Nota para el creador:** ¡Aquí debes poner tus fotos! Para hacerlo en GitHub, solo arrastra la imagen desde tu computadora hacia la ventana de edición de GitHub y se generará un link automático.

*Reemplaza este texto con capturas de pantalla de:*
1. La pantalla de Login.
2. El panel principal (Dashboard).
3. Una captura de pantalla del celular mostrando el bot de Telegram funcionando.

## ⚙️ Arquitectura de Notificaciones

El sistema utiliza un enfoque moderno para reducir el consumo de recursos locales:
1. El evento se registra en la tabla `evento` de PostgreSQL.
2. Un **Cron Job** (`pg_cron`) evalúa las fechas diariamente.
3. Si hay coincidencias, la base de datos hace una petición HTTP `POST` a la **Edge Function** en la nube.
4. La Edge Function se comunica con la API de Telegram y entrega el mensaje al cliente/técnico.

## 🚀 Instalación y Uso (Para Desarrolladores)

Si deseas clonar y probar este proyecto en tu entorno local:

1. Clona el repositorio:
   ```bash
   git clone [https://github.com/TU_USUARIO/tecnilap-system.git](https://github.com/TU_USUARIO/tecnilap-system.git)