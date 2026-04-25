document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioCrear");

    // Revisar si venimos redirigidos desde un Trabajo o Factura (para la conexión)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('trabajo_id')) document.getElementById("trabajo_id").value = urlParams.get('trabajo_id');
    if (urlParams.get('factura_id')) document.getElementById("factura_id").value = urlParams.get('factura_id');

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        // El datetime-local devuelve "YYYY-MM-DDTHH:MM", Postgres lo lee perfectamente
        let tr_id = document.getElementById("trabajo_id").value.trim();
        let fc_id = document.getElementById("factura_id").value.trim();

        const nuevoEvento = {
            titulo: document.getElementById("titulo").value,
            descripcion: document.getElementById("descripcion").value,
            tipo: document.getElementById("tipo").value,
            fecha_hora: document.getElementById("fecha_hora").value,
            trabajo_id: tr_id === "" ? null : tr_id,
            factura_id: fc_id === "" ? null : fc_id
        };

        try {
            const response = await fetch("http://localhost:3000/eventos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoEvento)
            });

            if (response.ok) {
                // --- AQUÍ ESTÁ TU CÓDIGO CON LA PROTECCIÓN EXTRA ---
                if (window.registrarAuditoria) {
                    await window.registrarAuditoria(
                        "CREAR_EVENTO", 
                        `Se programó el evento: ${nuevoEvento.titulo} (${nuevoEvento.tipo}) para el ${nuevoEvento.fecha_hora.replace('T', ' a las ')}`
                    );
                }
                
                alert("Evento/Recordatorio programado con éxito.");
                window.location.href = "../../view/evento/indexEventos.html";
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.error || "Verifica los datos y los UUIDs."));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});