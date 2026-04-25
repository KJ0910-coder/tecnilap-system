document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioActualizar");
    const materialId = new URLSearchParams(window.location.search).get("id");

    if (!materialId) {
        alert("Error: No se encontró el ID del material.");
        window.location.href = "../../view/material/indexMateriales.html";
        return;
    }

    // Cargar datos actuales
    fetch(`http://localhost:3000/materiales/${materialId}`)
        .then(res => { if(!res.ok) throw new Error("Error"); return res.json(); })
        .then(data => {
            const m = Array.isArray(data) ? data[0] : data;
            document.getElementById("nombre").value = m.nombre;
            document.getElementById("cantidad_total").value = m.cantidad_total;
            document.getElementById("stock_actual").value = m.stock_actual;
            document.getElementById("proveedor_id").value = m.proveedor_id;
        })
        .catch(err => {
            console.error(err);
            alert("Error al cargar los datos del material.");
        });

    // Enviar datos actualizados
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Los datos frescos que el usuario acaba de escribir
        const actualizacion = {
            nombre: document.getElementById("nombre").value,
            cantidad_total: parseInt(document.getElementById("cantidad_total").value),
            stock_actual: parseInt(document.getElementById("stock_actual").value),
            proveedor_id: document.getElementById("proveedor_id").value
        };

        try {
            const response = await fetch(`http://localhost:3000/materiales/${materialId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(actualizacion)
            });

            if (response.ok) {
                // --- AQUÍ ESTÁ LA AUDITORÍA---
                if (window.registrarAuditoria) {
                    await window.registrarAuditoria(
                        "ACTUALIZAR_MATERIAL", 
                        `Se actualizó el material: "${actualizacion.nombre}" (Nuevo stock actual: ${actualizacion.stock_actual})`
                    );
                }
                
                alert("Inventario actualizado correctamente.");
                window.location.href = "../../view/material/indexMateriales.html";
            } else {
                alert("Hubo un error al actualizar los datos en la base de datos.");
            }
        } catch (error) {
            alert("Error de conexión al intentar actualizar.");
        }
    });
});