document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioActualizar");
    const eventoId = new URLSearchParams(window.location.search).get("id");

    if (!eventoId) {
        alert("Error: No se encontró el ID del evento.");
        window.location.href = "../../view/evento/indexEventos.html";
        return;
    }

    // Cargar datos actuales
    fetch(`http://localhost:3000/eventos/${eventoId}`)
        .then(res => { if(!res.ok) throw new Error("Error"); return res.json(); })
        .then(data => {
            const e = Array.isArray(data) ? data[0] : data;
            document.getElementById("titulo").value = e.titulo;
            document.getElementById("descripcion").value = e.descripcion;
            document.getElementById("tipo").value = e.tipo;
            
            // Acomodar la fecha para el input datetime-local (corta los segundos/zona horaria)
            if (e.fecha_hora) {
                // Formato de BD a Formato HTML: "YYYY-MM-DDTHH:MM"
                const fechaLimpia = new Date(e.fecha_hora).toISOString().slice(0, 16);
                document.getElementById("fecha_hora").value = fechaLimpia;
            }
        })
        .catch(err => {
            console.error(err);
            alert("Error al cargar los datos del evento.");
        });

    // Enviar datos actualizados
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const actualizacion = {
            titulo: document.getElementById("titulo").value,
            descripcion: document.getElementById("descripcion").value,
            tipo: document.getElementById("tipo").value,
            fecha_hora: document.getElementById("fecha_hora").value
        };

        try {
            const response = await fetch(`http://localhost:3000/eventos/${eventoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(actualizacion)
            });

            if (response.ok) {
                // --- AQUÍ ESTÁ EL AWAIT ---
                if(window.registrarAuditoria) {
                    await window.registrarAuditoria(
                        "ACTUALIZAR_EVENTO", 
                        `Se reprogramó el evento: ${actualizacion.titulo} (${actualizacion.tipo}) para el ${actualizacion.fecha_hora.replace('T', ' a las ')}`
                    );
                }
                
                alert("Evento reprogramado correctamente.");
                window.location.href = "../../view/evento/indexEventos.html";
            } else {
                alert("Hubo un error al actualizar.");
            }
        } catch (error) {
            alert("Error de conexión.");
        }
    });
});