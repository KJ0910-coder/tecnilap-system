document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioCrear");

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const cantidad_total = parseInt(document.getElementById("cantidad_total").value);
        const stock_actual = parseInt(document.getElementById("stock_actual").value);
        const proveedor_id = document.getElementById("proveedor_id").value;

        const nuevoMaterial = {
            nombre, cantidad_total, stock_actual, proveedor_id
        };

        try {
            const response = await fetch("http://localhost:3000/materiales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoMaterial)
            });

            if (response.ok) {
                // --- AQUÍ ESTÁ LA AUDITORÍA ---
                if (window.registrarAuditoria) {
                    await window.registrarAuditoria(
                        "CREAR_MATERIAL", 
                        `Se registró un nuevo material en el inventario: "${nombre}" (Stock inicial: ${stock_actual})`
                    );
                }
                
                alert("Material ingresado con éxito al inventario.");
                window.location.href = "../../view/material/indexMateriales.html";
            } else {
                const errorData = await response.json();
                alert("Error al registrar: " + (errorData.error || "Verifica los datos y el ID del proveedor."));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});