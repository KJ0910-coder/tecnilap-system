document.addEventListener("DOMContentLoaded", () => {
    const selectUsuario = document.getElementById("usuario_id");
    const formularioLogin = document.getElementById("formularioLogin");

    let usuariosRegistrados = [];

    // 1. Cargar la lista de usuarios desde tu API
    fetch("http://localhost:3000/usuarios")
        .then(response => response.json())
        .then(data => {
            usuariosRegistrados = data;
            selectUsuario.innerHTML = '<option value="" selected disabled>Seleccione su nombre...</option>';
            
            // Llenamos el select solo con usuarios activos (opcional, pero buena práctica)
            const activos = data.filter(u => u.estado === 'ACTIVO' || !u.estado); 
            
            activos.forEach(u => {
                const option = document.createElement("option");
                option.value = u.id;
                option.textContent = `${u.nombre_completo} (${u.rol})`;
                selectUsuario.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al cargar usuarios:", error);
            selectUsuario.innerHTML = '<option value="" disabled>Error conectando al servidor</option>';
        });

    // 2. Procesar el "Inicio de Sesión"
    formularioLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const idSeleccionado = selectUsuario.value;
        const usuarioInfo = usuariosRegistrados.find(u => u.id === idSeleccionado);

        if (usuarioInfo) {
            // Guardamos la info del usuario en la "memoria local" del navegador
            localStorage.setItem("tecnilap_sesion", JSON.stringify({
                id: usuarioInfo.id,
                nombre: usuarioInfo.nombre_completo,
                rol: usuarioInfo.rol
            }));

            // ¡Redirigimos al menú principal!
            window.location.href = "../view/dashboard.html"; // Ajusta la ruta si es necesario
        }
    });
});