document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("cuerpoTabla");
    const btnAnterior = document.getElementById("paginaAnterior");
    const btnSiguiente = document.getElementById("paginaSiguiente");
    const selectFilas = document.getElementById("filasPorPagina");

    let eventosData = [];
    let paginaActual = 1;
    let filasPorPagina = parseInt(selectFilas.value);

    function obtenerEventos() {
        fetch(`http://localhost:3000/eventos`)
            .then((response) => response.json())
            .then((data) => {
                // Ordenar para que los más recientes (futuros) salgan primero
                eventosData = data.sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));
                renderizarTabla();
            })
            .catch((error) => console.error("Error al obtener datos:", error));
    }

    function renderizarTabla() {
        tabla.innerHTML = "";
        const inicio = (paginaActual - 1) * filasPorPagina;
        const fin = inicio + filasPorPagina;
        const paginados = eventosData.slice(inicio, fin);

        const ahora = new Date();

        paginados.forEach((e) => {
            const row = document.createElement("tr");
            
            // --- ACORTADORES PARA LOS 3 IDs ---
            const idCorto = e.id ? e.id.substring(0, 8) + '...' : 'N/A';
            const trabajoIdCorto = e.trabajo_id ? e.trabajo_id.substring(0, 8) + '...' : '';
            const facturaIdCorto = e.factura_id ? e.factura_id.substring(0, 8) + '...' : '';
            
            const fechaEvento = new Date(e.fecha_hora);
            
            // Formatear: "15/03/2026, 14:30"
            const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit' };
            const fechaFormateada = fechaEvento.toLocaleString('es-CO', opcionesFecha);

            // Lógica de Estado (Pasado, Hoy, Futuro)
            let estadoHTML = '';
            if (fechaEvento < ahora && fechaEvento.toDateString() !== ahora.toDateString()) {
                estadoHTML = `<span class="badge bg-secondary">Ya Pasó</span>`;
                row.classList.add("table-light", "text-muted"); 
            } else if (fechaEvento.toDateString() === ahora.toDateString()) {
                estadoHTML = `<span class="badge bg-warning text-dark">¡Es Hoy!</span>`;
                row.classList.add("table-warning"); 
            } else {
                estadoHTML = `<span class="badge bg-success">Próximo</span>`;
            }

            // Mostrar Vínculos con los IDs acortados
            let vinculos = '';
            if(e.trabajo_id) vinculos += `<span class="badge bg-info text-dark mb-1" title="ID Completo: ${e.trabajo_id}">Trabajo: ${trabajoIdCorto}</span><br>`;
            if(e.factura_id) vinculos += `<span class="badge bg-primary" title="ID Completo: ${e.factura_id}">Factura: ${facturaIdCorto}</span>`;
            if(!e.trabajo_id && !e.factura_id) vinculos = '-';

            // Botón hacia factura (solo aparece si hay un trabajo vinculado)
            let botonFactura = '';
            if (e.trabajo_id) {
                // Le ponemos de value el ID del trabajo para poder copiarlo después
                botonFactura = `<button id="ir_factura" value="${e.trabajo_id}" class="btn btn-secondary btn-sm w-100 mb-1">Factura</button>`;
            }

            row.innerHTML = `
                <td class="text-center text-muted" title="${e.id}">${idCorto}</td>
                <td class="text-center">${estadoHTML}</td>
                <td class="text-center fw-bold">${fechaFormateada}</td>
                <td title="${e.descripcion}">${e.titulo}</td>
                <td class="text-center">${e.tipo}</td>
                <td class="text-center">${vinculos}</td>
                
                <td class="text-center px-1"> 
                    ${botonFactura}
                    <button id="editar" value="${e.id}" class="btn btn-warning btn-sm w-100 mb-1">Reprogramar</button> 
                </td>
                <td class="text-center px-1"> 
                    <button id="borrar" value="${e.id}" class="btn btn-danger btn-sm w-100">Eliminar</button> 
                </td>
            `;
            tabla.appendChild(row);
        });
        actualizarBotones();
    }

    function actualizarBotones() {
        const totalPaginas = Math.ceil(eventosData.length / filasPorPagina);
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
        const totalPaginas = Math.ceil(eventosData.length / filasPorPagina);
        if (paginaActual < totalPaginas) { paginaActual++; renderizarTabla(); }
    });

    tabla.addEventListener("click", (event) => {
        const id = event.target.value;
        
        if (event.target.id === "borrar") {
            // Buscamos el evento exacto en nuestra lista de datos antes de borrarlo
            const eventoBorrando = eventosData.find(e => e.id === id);
            const tituloMostrar = eventoBorrando ? eventoBorrando.titulo : "Desconocido";

            if (confirm(`¿Seguro que deseas eliminar el evento: "${tituloMostrar}"? No se enviará la notificación.`)) {
                fetch(`http://localhost:3000/eventos/${id}`, { method: "DELETE" })
                .then(async(response) => {
                    if (!response.ok) throw new Error("Error al eliminar");
                    
                    // --- AQUÍ ESTÁ LA AUDITORÍA ---
                    if (window.registrarAuditoria) {
                        await window.registrarAuditoria("ELIMINAR_EVENTO", `Se canceló y eliminó el evento: ${tituloMostrar}`);
                    }
                    
                    eventosData = eventosData.filter(e => e.id !== id);
                    renderizarTabla();
                });
            }
        } else if (event.target.id === "editar") {
            window.location.href = `../../view/evento/actualizarEvento.html?id=${id}`;
        } 
        
        // --- EVENTO PARA EL BOTÓN DE FACTURA ---
        else if (event.target.id === "ir_factura") {
            // "id" en este caso específico tiene el valor de e.trabajo_id porque se lo asignamos en el HTML
            navigator.clipboard.writeText("ID Trabajo: " + id).then(() => {
                alert("ID del Trabajo copiado al portapapeles. Redirigiendo a crear factura...");
                window.location.href = `../../view/factura/indexFacturas.html?trabajo_id=${id}`;
            });
        }
    });

    obtenerEventos();
});