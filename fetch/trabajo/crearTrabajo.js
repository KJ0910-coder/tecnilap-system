document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioCrear");

    // Leer la URL por si venimos desde el módulo de Clientes
    const urlParams = new URLSearchParams(window.location.search);
    const clientePreCargado = urlParams.get('cliente_id');
    
    if (clientePreCargado) {
        document.getElementById("cliente_id").value = clientePreCargado;
    }

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const descripcion = document.getElementById("descripcion").value;
        const cliente_id = document.getElementById("cliente_id").value;
        const fecha_realizacion = document.getElementById("fecha_realizacion").value || null;
        const fecha_entrega = document.getElementById("fecha_entrega").value || null;
        let consecutivo = document.getElementById("consecutivo").value;
        
        if (consecutivo.trim() === "") consecutivo = null;

        const nuevoTrabajo = {
            descripcion, cliente_id, fecha_realizacion, fecha_entrega, consecutivo
        };

        try {
            const response = await fetch("http://localhost:3000/trabajos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoTrabajo)
            });

            if (response.ok) {
                // --- AQUÍ ESTÁ LA AUDITORÍA ---
                if (window.registrarAuditoria) {
                    // Acortamos la descripción por si es muy larga
                    const descCorta = descripcion.length > 30 
                                      ? descripcion.substring(0, 30) + "..." 
                                      : descripcion;
                    
                    // Armamos el mensaje (le agregamos el consecutivo solo si lo escribiste)
                    let msjAuditoria = `Se registró un nuevo trabajo: "${descCorta}"`;
                    if (consecutivo) {
                        msjAuditoria += ` (Consecutivo: ${consecutivo})`;
                    }

                    await window.registrarAuditoria("CREAR_TRABAJO", msjAuditoria);
                }
                
                alert("Trabajo registrado con éxito");
                window.location.href = "../../view/trabajo/indexTrabajos.html";
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.error || "Verifica los datos"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});