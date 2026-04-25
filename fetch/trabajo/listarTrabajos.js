document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("cuerpoTabla");
    const btnAnterior = document.getElementById("paginaAnterior");
    const btnSiguiente = document.getElementById("paginaSiguiente");
    const selectFilas = document.getElementById("filasPorPagina");

    let trabajosData = [];
    let paginaActual = 1;
    let filasPorPagina = parseInt(selectFilas.value);

    function obtenerTrabajos() {
        fetch(`http://localhost:3000/trabajos`)
            .then((response) => response.json())
            .then((data) => {
                trabajosData = data;
                renderizarTabla();
            })
            .catch((error) => console.error("Error:", error));
    }

    function renderizarTabla() {
        tabla.innerHTML = "";
        const inicio = (paginaActual - 1) * filasPorPagina;
        const fin = inicio + filasPorPagina;
        const paginados = trabajosData.slice(inicio, fin);

        paginados.forEach((t) => {
            const row = document.createElement("tr");
            
            const idCorto = t.id ? t.id.substring(0, 8) + '...' : 'N/A';
            const clienteIdCorto = t.cliente_id ? t.cliente_id.substring(0, 8) + '...' : 'N/A';
            const fRealizacion = t.fecha_realizacion ? new Date(t.fecha_realizacion).toLocaleDateString() : 'N/A';
            const fEntrega = t.fecha_entrega ? new Date(t.fecha_entrega).toLocaleDateString() : 'N/A';
            
            let badgeClass = 'bg-secondary';
            if (t.estado === 'COMPLETADO') badgeClass = 'bg-success';
            if (t.estado === 'EN PROGRESO') badgeClass = 'bg-primary';
            if (t.estado === 'PENDIENTE') badgeClass = 'bg-warning text-dark';
            if (t.estado === 'CANCELADO') badgeClass = 'bg-danger';

            row.innerHTML = `
                <td class="text-center" title="${t.id}">${t.consecutivo || idCorto}</td>
                <td title="${t.descripcion}">${t.descripcion.substring(0, 30)}...</td>
                <td class="text-center" title="${t.cliente_id}">${clienteIdCorto}</td>
                <td class="text-center"><span class="badge ${badgeClass}">${t.estado || 'N/A'}</span></td>
                <td class="text-center">${fRealizacion}</td>
                <td class="text-center">${fEntrega}</td>
                
                <td class="text-center px-1"> 
                    <button id="ir_materiales" value="${t.id}" class="btn btn-info btn-sm text-white w-100 mb-1">Ver Materiales</button> 
                    <button id="ir_factura" value="${t.id}" class="btn btn-secondary btn-sm w-100 mb-1">Crear Factura</button> 
                    <button id="ir_evento" value="${t.id}" class="btn btn-primary btn-sm w-100">Programar Evento</button> 
                </td>
                <td class="text-center px-1"> 
                    <button id="editar" value="${t.id}" class="btn btn-warning btn-sm w-100 mb-1">Editar</button> 
                </td>
                <td class="text-center px-1"> 
                    <button id="borrar" value="${t.id}" class="btn btn-danger btn-sm w-100 mb-1">Eliminar</button> 
                </td>
            `;
            tabla.appendChild(row);
        });
        actualizarBotones();
    }

    function actualizarBotones() {
        const totalPaginas = Math.ceil(trabajosData.length / filasPorPagina);
        btnAnterior.style.display = paginaActual > 1 ? "inline-block" : "none";
        btnSiguiente.style.display = paginaActual < totalPaginas ? "inline-block" : "none";
    }

    selectFilas.addEventListener("change", (e) => {
        filasPorPagina = parseInt(e.target.value);
        paginaActual = 1;
        renderizarTabla();
    });

    btnAnterior.addEventListener("click", () => { if (paginaActual > 1) { paginaActual--; renderizarTabla(); } });
    btnSiguiente.addEventListener("click", () => {
        const totalPaginas = Math.ceil(trabajosData.length / filasPorPagina);
        if (paginaActual < totalPaginas) { paginaActual++; renderizarTabla(); }
    });

    tabla.addEventListener("click", (event) => {
        const id = event.target.value;
        
        if (event.target.id === "borrar") {
            // Buscamos el trabajo exacto en nuestra lista de datos antes de borrarlo
            const trabajoBorrando = trabajosData.find(t => t.id === id);
            
            // Si tiene consecutivo, mostramos eso, sino, mostramos las primeras 20 letras de la descripción
            let descMostrar = "Desconocido";
            if (trabajoBorrando) {
                if (trabajoBorrando.consecutivo) {
                    descMostrar = `(Consecutivo: ${trabajoBorrando.consecutivo})`;
                } else {
                    descMostrar = `"${trabajoBorrando.descripcion.substring(0, 20)}..."`;
                }
            }

            if (confirm(`¿Seguro que deseas eliminar este Trabajo: ${descMostrar}?`)) {
                fetch(`http://localhost:3000/trabajos/${id}`, { method: "DELETE" })
                .then(async(res) => { 
                    if (res.ok) { 
                        // --- AQUÍ ESTÁ LA AUDITORÍA ---
                        if (window.registrarAuditoria) {
                            await window.registrarAuditoria("ELIMINAR_TRABAJO", `Se eliminó el trabajo: ${descMostrar}`);
                        }
                        
                        trabajosData = trabajosData.filter(t => t.id !== id); 
                        renderizarTabla(); 
                    } 
                });
            }
        } else if (event.target.id === "editar") {
            window.location.href = `../../view/trabajo/actualizarTrabajo.html?id=${id}`;
        } 
        
        // Si hace clic en cualquiera de los 3 botones de conexión
        else if (["ir_materiales", "ir_factura", "ir_evento"].includes(event.target.id)) {
            navigator.clipboard.writeText("ID Trabajo: " + id).then(() => {
                alert("ID del Trabajo copiado al portapapeles. Redirigiendo...");
                
                if (event.target.id === "ir_materiales") {
                    window.location.href = `../../view/trabajo_material/indexTrabajoMaterial.html?trabajo_id=${id}`;
                } else if (event.target.id === "ir_factura") {
                    window.location.href = `../../view/factura/crearFactura.html?trabajo_id=${id}`;
                } else if (event.target.id === "ir_evento") {
                    window.location.href = `../../view/evento/crearEvento.html?trabajo_id=${id}`;
                }
            });
        }
    });

    obtenerTrabajos();
});