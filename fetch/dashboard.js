document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Verificar si hay alguien "logueado" en localStorage
    const sesionInfo = localStorage.getItem("tecnilap_sesion");

    if (!sesionInfo) {
        // Si no hay sesión, lo expulsamos al login
        window.location.href = "login.html"; 
        return;
    }

    // 2. Extraer los datos del usuario
    const usuario = JSON.parse(sesionInfo);
    
    // Poner su nombre en la barra de arriba
    document.getElementById("nombreUsuario").textContent = usuario.nombre;

    // (Opcional) Si es OPERADOR, ocultar el botón de "Usuarios" para que no vea esa tabla
    if (usuario.rol !== "ADMIN") {
        const cardUsuarios = document.getElementById("cardUsuarios");
        if(cardUsuarios) cardUsuarios.style.display = "none";
    }

    // 3. Lógica para Cerrar Sesión
    document.getElementById("btnSalir").addEventListener("click", () => {
        if(confirm("¿Seguro que deseas cerrar la sesión?")) {
            localStorage.removeItem("tecnilap_sesion"); // Borrar la memoria
            window.location.href = "login.html"; // Volver al inicio
        }
        else {
            alert("Por favor seleccione un usuario válido.");
        }
    });

});