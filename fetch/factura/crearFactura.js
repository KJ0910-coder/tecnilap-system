document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioCrear");

    // Poner la fecha de hoy por defecto
    document.getElementById("fecha").value = new Date().toISOString().split('T')[0];

    // Leer la URL por si venimos desde Clientes o Trabajos
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('cliente_id')) {
        document.getElementById("cliente_id").value = urlParams.get('cliente_id');
    }
    if (urlParams.get('trabajo_id')) {
        document.getElementById("trabajo_id").value = urlParams.get('trabajo_id');
    }

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nuevaFactura = {
            concepto: document.getElementById("concepto").value,
            monto: parseFloat(document.getElementById("monto").value),
            fecha: document.getElementById("fecha").value,
            metodo_pago: document.getElementById("metodo_pago").value,
            trabajo_id: document.getElementById("trabajo_id").value,
            cliente_id: document.getElementById("cliente_id").value
        };

        try {
            const response = await fetch("http://localhost:3000/facturas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaFactura)
            });

            if (response.ok) {
                // --- AQUÍ ESTÁ LA AUDITORÍA ---
                if (window.registrarAuditoria) {
                    const montoFmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(nuevaFactura.monto);
                    
                    await window.registrarAuditoria(
                        "CREAR_FACTURA", 
                        `Se generó una nueva factura: "${nuevaFactura.concepto}" por valor de ${montoFmt} (Estado: ${nuevaFactura.metodo_pago})`
                    );
                }

                alert("Factura registrada con éxito.");
                window.location.href = "../../view/factura/indexFacturas.html";
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.error || "Verifica los UUIDs ingresados."));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});