document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("cuerpoTabla");
    const btnAnterior = document.getElementById("paginaAnterior");
    const btnSiguiente = document.getElementById("paginaSiguiente");
    const selectFilas = document.getElementById("filasPorPagina");

    let clientesData = [];
    let paginaActual = 1;
    let filasPorPagina = parseInt(selectFilas.value);

    function obtenerClientes() {
        fetch(`http://localhost:3000/clientes`)
            .then((response) => response.json())
            .then((data) => {
                clientesData = data;
                renderizarTabla();
            })
            .catch((error) => console.error("Error al obtener datos:", error));
    }

    function renderizarTabla() {
        tabla.innerHTML = "";
        const inicio = (paginaActual - 1) * filasPorPagina;
        const fin = inicio + filasPorPagina;
        const paginados = clientesData.slice(inicio, fin);

        paginados.forEach((c) => {
            const row = document.createElement("tr");
            
            const idCorto = c.id ? c.id.substring(0, 8) + '...' : 'N/A';
            const tipoBadge = c.tipo_cliente === 'EMPRESA' ? 'bg-primary' : 'bg-success';

            // BOTONES DE NAVEGACIÓN
            row.innerHTML = `
                <td class="text-center" title="${c.id}">${idCorto}</td>
                <td class="fw-bold">${c.nit || 'N/A'}</td>
                <td>${c.nombre}</td>
                <td class="text-center"><span class="badge ${tipoBadge}">${c.tipo_cliente}</span></td>
                <td class="text-center">${c.telefono}</td>
                <td>${c.correo}</td>
                
                <td class="text-center px-1"> 
                    <button id="ir_trabajo" value="${c.id}" class="btn btn-info btn-sm text-white w-100 mb-1"> Trabajo</button> 
                    <button id="ir_factura" value="${c.id}" class="btn btn-secondary btn-sm w-100"> Factura</button> 
                </td>
                <td class="text-center px-1"> 
                    <button id="editar" value="${c.id}" class="btn btn-warning btn-sm w-100 mb-1">Editar</button> 
                </td>
                <td class="text-center px-1"> 
                    <button id="borrar" value="${c.id}" class="btn btn-danger btn-sm w-100 mb-1">Eliminar</button> 
                </td>
            `;
            tabla.appendChild(row);
        });
        actualizarBotones();
    }

    function actualizarBotones() {
        const totalPaginas = Math.ceil(clientesData.length / filasPorPagina);
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
        const totalPaginas = Math.ceil(clientesData.length / filasPorPagina);
        if (paginaActual < totalPaginas) { paginaActual++; renderizarTabla(); }
    });

    tabla.addEventListener("click", (event) => {
        const id = event.target.value;
        
        if (event.target.id === "borrar") {
            // Buscamos el nombre del cliente antes de borrarlo para la auditoría
            const clienteBorrando = clientesData.find(c => c.id === id);
            const nombreMostrar = clienteBorrando ? clienteBorrando.nombre : "Desconocido";

            if (confirm(`¿Seguro que deseas eliminar el cliente: ${nombreMostrar}?`)) {
                fetch(`http://localhost:3000/clientes/${id}`, { method: "DELETE" })
                .then(async (response) => {
                    if (!response.ok) throw new Error("Error al eliminar");
                    
                    // --- AQUÍ ESTÁ LA AUDITORÍA ---
                    if (window.registrarAuditoria) {
                        await window.registrarAuditoria("ELIMINAR_CLIENTE", `Se eliminó del sistema al cliente: ${nombreMostrar}`);
                    }

                    clientesData = clientesData.filter(c => c.id !== id);
                    const totalPaginas = Math.ceil(clientesData.length / filasPorPagina);
                    if (paginaActual > totalPaginas && paginaActual > 1) paginaActual--;
                    renderizarTabla();
                });
            }
        } else if (event.target.id === "editar") {
            window.location.href = `../../view/cliente/actualizarCliente.html?id=${id}`;
        } 
        
        // ---(Copiar y redirigir) ---
        else if (["ir_trabajo", "ir_factura"].includes(event.target.id)) {
            navigator.clipboard.writeText("ID Cliente: " + id).then(() => {
                alert("ID del Cliente copiado al portapapeles. Redirigiendo...");
                
                if (event.target.id === "ir_trabajo") {
                    window.location.href = `../../view/trabajo/crearTrabajo.html?cliente_id=${id}`;
                } else if (event.target.id === "ir_factura") {
                    window.location.href = `../../view/factura/indexFacturas.html?cliente_id=${id}`;
                }
            });
        }
    });

    obtenerClientes();
});