document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioCrear");

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Extraer el usuario que inició sesión
        const sesionString = localStorage.getItem("tecnilap_sesion");
        let usuarioActualId = null;
        
        if (sesionString) {
            const sesionData = JSON.parse(sesionString);
            usuarioActualId = sesionData.id;
        } else {
            alert("No hay una sesión activa. Redirigiendo al login...");
            window.location.href = "../../view/login.html";
            return;
        }

        const nuevaActividad = {
            usuario_id: usuarioActualId,
            accion: document.getElementById("accion").value.toUpperCase().replace(/ /g, "_"), // Convierte "Nota manual" a "NOTA_MANUAL"
            descripcion: document.getElementById("descripcion").value
        };

        try {
            const response = await fetch("http://localhost:3000/actividades", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaActividad)
            });

            if (response.ok) {
                alert("Nota agregada a la bitácora.");
                window.location.href = "../../view/actividad/indexActividades.html";
            } else {
                alert("Error al registrar actividad.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});