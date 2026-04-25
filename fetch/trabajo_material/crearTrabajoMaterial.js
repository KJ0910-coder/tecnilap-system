document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioCrear");

    // --- REGALO EXTRA: Pre-llenar campos si venimos de otra pantalla ---
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('trabajo_id')) {
        document.getElementById("trabajo_id").value = urlParams.get('trabajo_id');
    }
    if (urlParams.get('material_id')) {
        document.getElementById("material_id").value = urlParams.get('material_id');
    }

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const trabajo_id = document.getElementById("trabajo_id").value.trim();
        const material_id = document.getElementById("material_id").value.trim();
        const cantidad_usada = parseInt(document.getElementById("cantidad_usada").value);

        const nuevoRegistro = {
            trabajo_id: trabajo_id,
            material_id: material_id,
            cantidad_usada: cantidad_usada
        };

        try {
            const response = await fetch("http://localhost:3000/trabajo-material", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoRegistro)
            });

            if (response.ok) {
                // --- AQUÍ ESTÁ LA AUDITORÍA ---
                if (window.registrarAuditoria) {
                    // Acortamos los IDs para que se vean bien en la bitácora
                    const trabCorto = trabajo_id.substring(0, 8) + '...';
                    const matCorto = material_id.substring(0, 8) + '...';

                    await window.registrarAuditoria(
                        "ASIGNAR_MATERIAL", 
                        `Se asignaron ${cantidad_usada} unidades del material (${matCorto}) al trabajo (${trabCorto})`
                    );
                }

                alert("Asignación de material registrada con éxito");
                window.location.href = "../../view/trabajo_material/indexTrabajoMaterial.html";
            } else {
                const errorData = await response.json();
                alert("Error al registrar: " + (errorData.message || errorData.error || "Verifica los UUIDs y la cantidad."));
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor de la API.");
        }
    });
});