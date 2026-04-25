@echo off
:: --- BLOQUE DE AUTO-ELEVACION ---
:checkPrivileges
NET FILE 1>NUL 2>NUL
if '%errorlevel%' == '0' ( goto gotAdmin ) else ( goto getAdmin )
:getAdmin
powershell -Command "Start-Process -FilePath '%0' -Verb RunAs"
exit /b
:gotAdmin
pushd "%CD%"
CD /D "%~dp0"

set BASE_DIR=%~dp0
title Sistema TecniLAP - Instalador

:: 1. VERIFICAR / INSTALAR NODE.JS
:: Definimos las rutas absolutas asumiendo la ruta de instalacion por defecto
set "NODE_EXE=C:\Program Files\nodejs\node.exe"
set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"

node -v >nul 2>&1
if %errorlevel% neq 0 (
    if not exist "%NODE_EXE%" (
        echo [!] Node.js no detectado. Iniciando instalador...
        echo [!] Aparecera una barra de progreso, por favor espera a que termine.
        :: Usamos /passive para ver la barra de progreso sin requerir clics del usuario
        start /wait msiexec /i "%BASE_DIR%node-v24.14.0-x64.msi" /passive /norestart
        echo [OK] Motor instalado correctamente.
    )
) else (
    :: Si node ya esta registrado globalmente en el sistema, usamos el comando normal
    set "NODE_EXE=node"
    set "NPM_CMD=npm"
)

:: 2. INSTALAR LIBRERIAS (SI FALTAN)
cd /d "%BASE_DIR%mi-backend"
if not exist "node_modules\" (
    echo [!] Configurando librerias por primera vez...
    call "%NPM_CMD%" install --quiet
)

:: 3. LANZAR EL SERVIDOR EN MODO OCULTO
echo [OK] Iniciando servidor en segundo plano...
powershell -Command "Start-Process '%NODE_EXE%' -ArgumentList 'index.js' -WindowStyle Hidden -WorkingDirectory '%BASE_DIR%mi-backend'"

:: 4. ABRIR LA INTERFAZ
timeout /t 3 >nul
start "" "%BASE_DIR%view\login.html"

:: 5. FINALIZAR
echo [EXITO] Sistema cargado.
timeout /t 2 >nul
exit