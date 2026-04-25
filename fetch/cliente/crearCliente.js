document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioCrear");

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nit = document.getElementById("nit").value;
        const nombre = document.getElementById("nombre").value;
        const tipo_cliente = document.getElementById("tipo_cliente").value;
        const telefono = document.getElementById("telefono").value;
        const correo = document.getElementById("correo").value;
        const direccion = document.getElementById("direccion").value;

        const nuevoCliente = {
            nit, nombre, tipo_cliente, telefono, correo, direccion
        };

        try {
            const response = await fetch("http://localhost:3000/clientes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoCliente)
            });

            if (response.ok) {
                // --- AQUÍ ESTÁ LA AUDITORÍA ---
                if (window.registrarAuditoria) {
                    await window.registrarAuditoria(
                        "CREAR_CLIENTE", 
                        `Se registró un nuevo cliente: ${nombre} (NIT/CC: ${nit})`
                    );
                }
                
                alert("Cliente registrado con éxito.");
                window.location.href = "../../view/cliente/indexClientes.html";
            } else {
                // --- VALIDACIÓN PARA EL NIT DUPLICADO ---
                const errorData = await response.json();
                let mensajeError = errorData.error || "Verifica los datos.";

                if (mensajeError.includes("duplicate key") || mensajeError.includes("cliente_nit_key")) {
                    mensajeError = "Ya existe un cliente registrado con ese NIT / Cédula. Por favor verifica.";
                }

                alert("Error al registrar: " + mensajeError);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});