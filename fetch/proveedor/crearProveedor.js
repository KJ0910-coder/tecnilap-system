document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioCrear");

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nit = document.getElementById("nit").value;
        const nombre = document.getElementById("nombre").value;
        const tipo_producto = document.getElementById("tipo_producto").value;
        const telefono = document.getElementById("telefono").value;
        const correo = document.getElementById("correo").value;
        const direccion = document.getElementById("direccion").value;

        const nuevoProveedor = {
            nit, nombre, tipo_producto, telefono, correo, direccion
        };

        try {
            const response = await fetch("http://localhost:3000/proveedores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProveedor)
            });

            if (response.ok) {
                // --- AQUÍ ESTÁ LA AUDITORÍA ---
                if (window.registrarAuditoria) {
                    await window.registrarAuditoria(
                        "CREAR_PROVEEDOR", 
                        `Se registró un nuevo proveedor: ${nombre} (NIT/CC: ${nit})`
                    );
                }
                
                alert("Proveedor registrado con éxito.");
                window.location.href = "../../view/proveedor/indexProveedores.html";
            } else {
                const errorData = await response.json();
                let mensajeError = errorData.error || "Verifica los datos ingresados.";

                // --- VALIDACIÓN PARA EL NIT DUPLICADO ---
                if (mensajeError.includes("duplicate key") || mensajeError.includes("nit_key")) {
                    mensajeError = "Ya existe un proveedor registrado con ese NIT / Cédula. Por favor verifica.";
                }

                alert("Error al registrar: " + mensajeError);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});