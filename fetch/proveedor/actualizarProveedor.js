document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioActualizar");
    const proveedorId = new URLSearchParams(window.location.search).get("id");

    if (!proveedorId) {
        alert("Error: No se encontró el ID del proveedor.");
        window.location.href = "../../view/proveedor/indexProveedores.html";
        return;
    }

    // Cargar datos actuales
    fetch(`http://localhost:3000/proveedores/${proveedorId}`)
        .then(res => { if(!res.ok) throw new Error("Error"); return res.json(); })
        .then(data => {
            const p = Array.isArray(data) ? data[0] : data;
            document.getElementById("nit").value = p.nit || '';
            document.getElementById("nombre").value = p.nombre;
            document.getElementById("tipo_producto").value = p.tipo_producto;
            document.getElementById("telefono").value = p.telefono;
            document.getElementById("correo").value = p.correo;
            document.getElementById("direccion").value = p.direccion;
        })
        .catch(err => {
            console.error(err);
            alert("Error al cargar los datos del proveedor.");
        });

    // Enviar datos actualizados
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const actualizacion = {
            nit: document.getElementById("nit").value,
            nombre: document.getElementById("nombre").value,
            tipo_producto: document.getElementById("tipo_producto").value,
            telefono: document.getElementById("telefono").value,
            correo: document.getElementById("correo").value,
            direccion: document.getElementById("direccion").value
        };

        try {
            const response = await fetch(`http://localhost:3000/proveedores/${proveedorId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(actualizacion)
            });

            if (response.ok) {
                // --- AQUÍ ESTÁ LA AUDITORÍA ---
                if (window.registrarAuditoria) {
                    await window.registrarAuditoria(
                        "ACTUALIZAR_PROVEEDOR", 
                        `Se actualizaron los datos del proveedor: ${actualizacion.nombre} (NIT/CC: ${actualizacion.nit})`
                    );
                }
                
                alert("Proveedor actualizado correctamente.");
                window.location.href = "../../view/proveedor/indexProveedores.html";
            } else {
                alert("Hubo un error al actualizar los datos en la base de datos.");
            }
        } catch (error) {
            alert("Error de conexión al intentar actualizar.");
        }
    });
});