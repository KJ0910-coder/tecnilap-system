document.addEventListener("DOMContentLoaded", () => {
    // Apuntamos al ID exacto que le pusimos en el HTML
    const formulario = document.getElementById("formularioCrear");

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evitamos que la página se recargue de golpe

        // Capturamos los valores que ingresó el usuario
        const nombre_completo = document.getElementById("nombre_completo").value;
        const correo = document.getElementById("correo").value;
        const rol = document.getElementById("rol").value;
        const estado = document.getElementById("estado").value;

        // Armamos el objeto que vamos a enviar a la API
        const nuevoUsuario = {
            nombre_completo: nombre_completo,
            correo: correo,
            rol: rol,
            estado: estado
        };

        try {
            const response = await fetch("http://localhost:3000/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevoUsuario)
            });

            if (response.ok) {
                // --- AUDITORÍA ---
                if (window.registrarAuditoria) {
                    await window.registrarAuditoria(
                        "CREAR_USUARIO", 
                        `Se creó un nuevo acceso para: ${nombre_completo} con el rol de ${rol}`
                    );
                }
                
                alert("Usuario registrado con éxito");
                window.location.href = "../../view/usuarios/indexUsuarios.html"; // Redirigimos a la tabla
            } else {
                const errorData = await response.json();
                alert("Error al registrar: " + (errorData.message || "Verifica los datos"));
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor de la API.");
        }
    });
});