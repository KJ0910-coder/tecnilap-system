document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioActualizar");
    
    // 1. Extraer el ID de la URL (Ejemplo: actualizarUsuario.html?id=df45g...)
    const parametrosURL = new URLSearchParams(window.location.search);
    const usuarioId = parametrosURL.get("id");

    if (!usuarioId) {
        alert("Error: No se encontró el ID del usuario.");
        window.location.href = "../../view/usuarios/indexUsuarios.html";
        return; // Detenemos la ejecución
    }

    // 2. Traer los datos de ese usuario específico al cargar la página
    cargarDatosUsuario(usuarioId);

    function cargarDatosUsuario(id) {
        fetch(`http://localhost:3000/usuarios/${id}`)
            .then(response => {
                if (!response.ok) throw new Error("Error al obtener datos");
                return response.json();
            })
            .then(data => {
                const usuario = Array.isArray(data) ? data[0] : data;
                
                // Llenamos los campos del HTML
                document.getElementById("nombre_completo").value = usuario.nombre_completo;
                document.getElementById("correo").value = usuario.correo;
                document.getElementById("rol").value = usuario.rol;
                document.getElementById("estado").value = usuario.estado;
            })
            .catch(error => {
                console.error("Error cargando el usuario:", error);
                alert("No se pudieron cargar los datos del usuario a editar.");
            });
    }

    // 3. Enviar los datos modificados cuando se envíe el formulario
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Recolectamos los nuevos valores
        const nombre_completo = document.getElementById("nombre_completo").value;
        const correo = document.getElementById("correo").value;
        const rol = document.getElementById("rol").value;
        const estado = document.getElementById("estado").value;

        const datosActualizados = {
            nombre_completo: nombre_completo,
            correo: correo,
            rol: rol,
            estado: estado
        };

        try {
            const response = await fetch(`http://localhost:3000/usuarios/${usuarioId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosActualizados)
            });

            if (response.ok) {
                // --- AUDITORÍA ---
                if (window.registrarAuditoria) {
                    await window.registrarAuditoria(
                        "ACTUALIZAR_USUARIO", 
                        `Se actualizaron los datos de acceso de: ${datosActualizados.nombre_completo} (Rol: ${datosActualizados.rol}, Estado: ${datosActualizados.estado})`
                    );
                }

                alert("Usuario actualizado correctamente");
                window.location.href = "../../view/usuarios/indexUsuarios.html";
            } else {
                alert("Hubo un problema al actualizar el usuario en la base de datos.");
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});