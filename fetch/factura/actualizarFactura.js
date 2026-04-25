document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioActualizar");
    const facturaId = new URLSearchParams(window.location.search).get("id");

    if (!facturaId) {
        alert("Error: No se encontró el ID de la factura.");
        window.location.href = "../../view/factura/indexFacturas.html";
        return;
    }

    // Cargar datos actuales
    fetch(`http://localhost:3000/facturas/${facturaId}`)
        .then(res => { if(!res.ok) throw new Error("Error"); return res.json(); })
        .then(data => {
            const f = Array.isArray(data) ? data[0] : data;
            document.getElementById("concepto").value = f.concepto;
            document.getElementById("monto").value = f.monto;
            
            if (f.fecha) {
                document.getElementById("fecha").value = f.fecha.split('T')[0];
            }
            if (f.metodo_pago) {
                document.getElementById("metodo_pago").value = f.metodo_pago;
            }
        })
        .catch(err => {
            console.error(err);
            alert("Error al cargar los datos de la factura.");
        });

    // Enviar datos actualizados
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const actualizacion = {
            concepto: document.getElementById("concepto").value,
            monto: parseFloat(document.getElementById("monto").value),
            fecha: document.getElementById("fecha").value,
            metodo_pago: document.getElementById("metodo_pago").value
        };

        try {
            const response = await fetch(`http://localhost:3000/facturas/${facturaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(actualizacion)
            });

            if (response.ok) {
                // --- AQUÍ ESTÁ EL AWAIT ---
                if (window.registrarAuditoria) {
                    const montoFormateado = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(actualizacion.monto);
                    await window.registrarAuditoria(
                        "ACTUALIZAR_FACTURA", 
                        `Se actualizaron los datos de la factura "${actualizacion.concepto}" (Nuevo monto: ${montoFormateado}, Estado de pago: ${actualizacion.metodo_pago})`
                    );
                }
                alert("Factura actualizada correctamente.");
                window.location.href = "../../view/factura/indexFacturas.html";
            } else {
                alert("Hubo un error al actualizar.");
            }
        } catch (error) {
            alert("Error de conexión.");
        }
    });
});