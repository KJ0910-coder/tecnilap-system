document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("cuerpoTabla");
    const btnAnterior = document.getElementById("paginaAnterior");
    const btnSiguiente = document.getElementById("paginaSiguiente");
    const selectFilas = document.getElementById("filasPorPagina");
    
    // Elementos del buscador
    const inputBuscar = document.getElementById("inputBuscarMaterial");
    const btnBuscar = document.getElementById("btnBuscarMaterial");
    const btnLimpiar = document.getElementById("btnLimpiarBuscador");

    let materialesData = [];
    let paginaActual = 1;
    let filasPorPagina = parseInt(selectFilas.value);

    // Cargar todos los materiales
    function obtenerMateriales() {
        fetch(`http://localhost:3000/materiales`)
            .then((response) => response.json())
            .then((data) => {
                materialesData = data;
                renderizarTabla();
            })
            .catch((error) => console.error("Error al obtener datos:", error));
    }

    // Función para buscar un material por ID
    btnBuscar.addEventListener("click", () => {
        const id = inputBuscar.value.trim();
        if (!id) {
            alert("Por favor ingresa un ID válido.");
            return;
        }

        fetch(`http://localhost:3000/materiales/${id}`)
            .then((response) => {
                if (!response.ok) throw new Error("Material no encontrado");
                return response.json();
            })
            .then((data) => {
                const material = Array.isArray(data) ? data[0] : data;
                if (!material || !material.id) throw new Error("Vacío");

                materialesData = [material];
                paginaActual = 1;
                renderizarTabla();
            })
            .catch((error) => {
                tabla.innerHTML = `<tr><td colspan="8" class="text-center text-danger">No se encontró ningún material con ese ID.</td></tr>`;
                materialesData = [];
                actualizarBotones();
            });
    });

    // Función para limpiar el buscador y ver todo de nuevo
    btnLimpiar.addEventListener("click", () => {
        inputBuscar.value = "";
        obtenerMateriales();
    });

    function renderizarTabla() {
        tabla.innerHTML = "";
        const inicio = (paginaActual - 1) * filasPorPagina;
        const fin = inicio + filasPorPagina;
        const paginados = materialesData.slice(inicio, fin);

        paginados.forEach((m) => {
            const row = document.createElement("tr");
            
            const idCorto = m.id ? m.id.substring(0, 8) + '...' : 'N/A';
            const proveedorIdCorto = m.proveedor_id ? m.proveedor_id.substring(0, 8) + '...' : 'N/A';
            
            let stockClass = m.stock_actual > 5 ? 'text-success fw-bold' : 'text-danger fw-bold';
            let advertenciaStock = m.stock_actual <= 5 ? ' <span class="badge bg-danger ms-1">¡Bajo!</span>' : '';

            row.innerHTML = `
                <td class="text-center" title="${m.id}">${idCorto}</td>
                <td class="fw-bold">${m.nombre}</td>
                <td class="text-center">${m.cantidad_total}</td>
                <td class="text-center ${stockClass}">${m.stock_actual} ${advertenciaStock}</td>
                <td class="text-center" title="${m.proveedor_id}">${proveedorIdCorto}</td>
                
                <td class="text-center"> 
                    <button id="copiar_id" value="${m.id}" class="btn btn-info btn-sm text-white" title="Copiar ID para usar en Trabajos"> Asignar</button> 
                </td>
                <td class="text-center"> 
                    <button id="editar" value="${m.id}" class="btn btn-warning btn-sm">Editar</button> 
                </td>
                <td class="text-center"> 
                    <button id="borrar" value="${m.id}" class="btn btn-danger btn-sm">Eliminar</button> 
                </td>
            `;
            tabla.appendChild(row);
        });
        actualizarBotones();
    }

    function actualizarBotones() {
        const totalPaginas = Math.ceil(materialesData.length / filasPorPagina);
        btnAnterior.style.display = paginaActual > 1 ? "inline-block" : "none";
        btnSiguiente.style.display = paginaActual < totalPaginas ? "inline-block" : "none";
    }

    selectFilas.addEventListener("change", (e) => {
        filasPorPagina = parseInt(e.target.value);
        paginaActual = 1;
        renderizarTabla();
    });

    btnAnterior.addEventListener("click", () => {
        if (paginaActual > 1) { paginaActual--; renderizarTabla(); }
    });

    btnSiguiente.addEventListener("click", () => {
        const totalPaginas = Math.ceil(materialesData.length / filasPorPagina);
        if (paginaActual < totalPaginas) { paginaActual++; renderizarTabla(); }
    });

    tabla.addEventListener("click", (event) => {
        const id = event.target.value;
        
        if (event.target.id === "borrar") {
            // Buscamos el material exacto en nuestra lista de datos antes de borrarlo
            const materialBorrando = materialesData.find(m => m.id === id);
            const nombreMostrar = materialBorrando ? materialBorrando.nombre : "Desconocido";

            if (confirm(`¿Seguro que deseas eliminar el material "${nombreMostrar}" del inventario?`)) {
                fetch(`http://localhost:3000/materiales/${id}`, { method: "DELETE" })
                .then(async(response) => {
                    if (!response.ok) throw new Error("Error al eliminar");
                    
                    // --- AQUÍ ESTÁ LA AUDITORÍA ---
                    if (window.registrarAuditoria) {
                        await window.registrarAuditoria("ELIMINAR_MATERIAL", `Se eliminó el material del inventario: "${nombreMostrar}"`);
                    }
                    
                    materialesData = materialesData.filter(m => m.id !== id);
                    renderizarTabla();
                });
            }
        } else if (event.target.id === "editar") {
            window.location.href = `actualizarMaterial.html?id=${id}`;
        } else if (event.target.id === "copiar_id") {
            navigator.clipboard.writeText("ID Material: " + id).then(() => {
                alert("ID del Material copiado. Redirigiendo a asignación...");
                // AQUÍ LE AGREGAMOS EL PARÁMETRO A LA URL:
                window.location.href = `../../view/trabajo_material/crearTrabajoMaterial.html?material_id=${id}`;
            });
        }
    });

    obtenerMateriales();
});