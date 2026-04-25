document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioActualizar");
    const trabajoId = new URLSearchParams(window.location.search).get("id");

    if (!trabajoId) {
        alert("Error: No se encontró el ID.");
        window.location.href = "../../view/trabajo/indexTrabajos.html";
        return;
    }

    // Cargar datos
    fetch(`http://localhost:3000/trabajos/${trabajoId}`)
        .then(res => { if(!res.ok) throw new Error("Error"); return res.json(); })
        .then(data => {
            const t = Array.isArray(data) ? data[0] : data;
            document.getElementById("descripcion").value = t.descripcion;
            
            // Asegurarnos de que el select agarre el valor correcto si existe
            if(t.estado) {
                document.getElementById("estado").value = t.estado;
            }
            
            // Las fechas vienen con formato largo, hay que cortarlas para el input type="date"
            if(t.fecha_realizacion) document.getElementById("fecha_realizacion").value = t.fecha_realizacion.split('T')[0];
            if(t.fecha_entrega) document.getElementById("fecha_entrega").value = t.fecha_entrega.split('T')[0];
        })
        .catch(err => {
            console.error(err);
            alert("Error al cargar datos.");
        });

    // Enviar datos actualizados
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const actualizacion = {
            descripcion: document.getElementById("descripcion").value,
            estado: document.getElementById("estado").value,
            fecha_realizacion: document.getElementById("fecha_realizacion").value || null,
            fecha_entrega: document.getElementById("fecha_entrega").value || null
        };

        try {
            const response = await fetch(`http://localhost:3000/trabajos/${trabajoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(actualizacion)
            });

            if (response.ok) {
                // --- AQUÍ ESTÁ LA AUDITORÍA ---
                if (window.registrarAuditoria) {
                    // Acortamos la descripción por si es muy larga
                    const descCorta = actualizacion.descripcion.length > 30 
                                      ? actualizacion.descripcion.substring(0, 30) + "..." 
                                      : actualizacion.descripcion;
                                      
                    await window.registrarAuditoria(
                        "ACTUALIZAR_TRABAJO", 
                        `Se actualizó el trabajo: "${descCorta}" (Nuevo estado: ${actualizacion.estado})`
                    );
                }
                
                alert("Trabajo actualizado.");
                window.location.href = "../../view/trabajo/indexTrabajos.html";
            } else {
                alert("Error al actualizar.");
            }
        } catch (error) {
            alert("Error de conexión.");
        }
    });
});