document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("cuerpoTabla");
    const btnAnterior = document.getElementById("paginaAnterior");
    const btnSiguiente = document.getElementById("paginaSiguiente");
    const selectFilas = document.getElementById("filasPorPagina");
    const btnBuscar = document.getElementById("btnBuscar");
    const inputTrabajoId = document.getElementById("inputTrabajoId");

    let registrosData = [];
    let paginaActual = 1;
    let filasPorPagina = parseInt(selectFilas.value);

    function obtenerRegistros(trabajoId) {
        fetch(`http://localhost:3000/trabajo-material/trabajo/${trabajoId}`)
            .then((response) => {
                if (!response.ok) throw new Error("Trabajo no encontrado o error en el servidor");
                return response.json();
            })
            .then((data) => {
                registrosData = data;
                paginaActual = 1; 
                
                if (registrosData.length === 0) {
                    tabla.innerHTML = `<tr><td colspan="5" class="text-center text-danger">No se encontraron materiales para este trabajo.</td></tr>`;
                    actualizarBotones();
                } else {
                    renderizarTabla();
                }
            })
            .catch((error) => {
                tabla.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Ocurrió un error al buscar. Verifica el ID.</td></tr>`;
                registrosData = [];
                actualizarBotones();
            });
    }

    btnBuscar.addEventListener("click", () => {
        const id = inputTrabajoId.value.trim();
        if (id === "") {
            alert("Por favor, ingresa un ID de Trabajo válido.");
            return;
        }
        obtenerRegistros(id);
    });

    function renderizarTabla() {
        tabla.innerHTML = "";
        const inicio = (paginaActual - 1) * filasPorPagina;
        const fin = inicio + filasPorPagina;
        const registrosPaginados = registrosData.slice(inicio, fin);

        registrosPaginados.forEach((registro) => {
            const row = document.createElement("tr");
            
            const idCorto = registro.id ? registro.id.substring(0, 8) + '...' : 'N/A';
            const materialIdCorto = registro.material_id ? registro.material_id.substring(0, 8) + '...' : 'N/A';

            row.innerHTML = `
                <td class="text-center" title="${registro.id}">${idCorto}</td>
                <td class="text-center" title="${registro.material_id}">${materialIdCorto}</td>
                <td class="text-center fw-bold text-primary">${registro.cantidad_usada}</td>
                <td class="text-center"> 
                    <button id="copiar_material" value="${registro.material_id}" class="btn btn-info btn-sm text-white" title="Copiar ID para buscarlo en Inventario">Copiar ID Mat.</button> 
                    <button id="borrar" value="${registro.id}" class="btn btn-danger btn-sm ms-2">Eliminar</button> 
                </td>
            `;
            tabla.appendChild(row);
        });
        actualizarBotones();
    }

    function actualizarBotones() {
        const totalPaginas = Math.ceil(registrosData.length / filasPorPagina);
        btnAnterior.style.display = paginaActual > 1 ? "inline-block" : "none";
        btnSiguiente.style.display = paginaActual < totalPaginas ? "inline-block" : "none";
    }

    selectFilas.addEventListener("change", (e) => {
        filasPorPagina = parseInt(e.target.value);
        paginaActual = 1;
        if(registrosData.length > 0) renderizarTabla();
    });

    btnAnterior.addEventListener("click", () => {
        if (paginaActual > 1) { paginaActual--; renderizarTabla(); }
    });

    btnSiguiente.addEventListener("click", () => {
        const totalPaginas = Math.ceil(registrosData.length / filasPorPagina);
        if (paginaActual < totalPaginas) { paginaActual++; renderizarTabla(); }
    });

    tabla.addEventListener("click", (event) => {
        const registroId = event.target.value; 

        if (event.target.id === "borrar") {
            const reg = registrosData.find(r => r.id === registroId);
            
            // --- VALIDACIÓN MEJORADA ---
            // Verificamos que 'reg' exista Y que el campo id también
            const matIdCorto = (reg && reg.material_id) 
                               ? reg.material_id.substring(0, 8) + '...' 
                               : 'N/A';
            
            const trabIdCorto = (reg && reg.trabajo_id) 
                                ? reg.trabajo_id.substring(0, 8) + '...' 
                                : 'N/A';

            if (confirm(`¿Estás seguro de que deseas eliminar este material del trabajo?`)) {
                fetch(`http://localhost:3000/trabajo-material/${registroId}`, { method: "DELETE" })
                .then(async(response) => {
                    if (!response.ok) throw new Error("Error al eliminar");
                    
                    if (window.registrarAuditoria) {
                        await window.registrarAuditoria(
                            "DESVINCULAR_MATERIAL", 
                            `Se eliminó la asignación del material (${matIdCorto}) del trabajo (${trabIdCorto})`
                        );
                    }

                    registrosData = registrosData.filter(r => r.id !== registroId);
                    const totalPaginas = Math.ceil(registrosData.length / filasPorPagina);
                    if (paginaActual > totalPaginas && paginaActual > 1) paginaActual--;
                    
                    if (registrosData.length === 0) {
                        tabla.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No quedan materiales en este trabajo.</td></tr>`;
                    } else {
                        renderizarTabla();
                    }
                })
                .catch(err => alert("Error al eliminar: " + err.message));
            }
        }
        else if (event.target.id === "copiar_material") {
            navigator.clipboard.writeText("ID Material: " + registroId).then(() => {
                alert("ID del Material copiado al portapapeles.");
                window.location.href = "../../view/material/indexMateriales.html";
            });
        }
    });
});