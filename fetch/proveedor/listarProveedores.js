document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("cuerpoTabla");
    const btnAnterior = document.getElementById("paginaAnterior");
    const btnSiguiente = document.getElementById("paginaSiguiente");
    const selectFilas = document.getElementById("filasPorPagina");

    let proveedoresData = [];
    let paginaActual = 1;
    let filasPorPagina = parseInt(selectFilas.value);

    function obtenerProveedores() {
        fetch(`http://localhost:3000/proveedores`)
            .then((response) => response.json())
            .then((data) => {
                proveedoresData = data;
                renderizarTabla();
            })
            .catch((error) => console.error("Error al obtener datos:", error));
    }

    function renderizarTabla() {
        tabla.innerHTML = "";
        const inicio = (paginaActual - 1) * filasPorPagina;
        const fin = inicio + filasPorPagina;
        const paginados = proveedoresData.slice(inicio, fin);

        paginados.forEach((p) => {
            const row = document.createElement("tr");
            
            // Acortar UUID para no desbordar tabla
            const idCorto = p.id ? p.id.substring(0, 8) + '...' : 'N/A';

            row.innerHTML = `
                <td class="text-center" title="${p.id}">${idCorto}</td>
                <td class="fw-bold">${p.nit || 'N/A'}</td>
                <td>${p.nombre}</td>
                <td>${p.tipo_producto}</td>
                <td class="text-center">${p.telefono}</td>
                <td>${p.correo}</td>
                
                <td class="text-center"> 
                    <button id="copiar_id" value="${p.id}" class="btn btn-info btn-sm text-white" title="Copiar ID para usar en Materiales">Copiar ID</button> 
                </td>
                <td class="text-center"> 
                    <button id="editar" value="${p.id}" class="btn btn-warning btn-sm">Editar</button> 
                </td>
                <td class="text-center"> 
                    <button id="borrar" value="${p.id}" class="btn btn-danger btn-sm">Eliminar</button> 
                </td>
            `;
            tabla.appendChild(row);
        });
        actualizarBotones();
    }

    function actualizarBotones() {
        const totalPaginas = Math.ceil(proveedoresData.length / filasPorPagina);
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
        const totalPaginas = Math.ceil(proveedoresData.length / filasPorPagina);
        if (paginaActual < totalPaginas) { paginaActual++; renderizarTabla(); }
    });

    tabla.addEventListener("click", (event) => {
        const id = event.target.value;
        
        if (event.target.id === "borrar") {
            // Buscamos el proveedor en nuestra lista para extraer su nombre
            const proveedorBorrando = proveedoresData.find(p => p.id === id);
            const nombreMostrar = proveedorBorrando ? proveedorBorrando.nombre : "Desconocido";

            if (confirm(`¿Seguro que deseas eliminar al proveedor "${nombreMostrar}" del sistema?`)) {
                fetch(`http://localhost:3000/proveedores/${id}`, { method: "DELETE" })
                .then(async(response) => {
                    if (!response.ok) throw new Error("Error al eliminar");
                    
                    // --- AQUÍ ESTÁ LA AUDITORÍA ---
                    if (window.registrarAuditoria) {
                        await window.registrarAuditoria("ELIMINAR_PROVEEDOR", `Se eliminó del sistema al proveedor: "${nombreMostrar}"`);
                    }

                    proveedoresData = proveedoresData.filter(p => p.id !== id);
                    const totalPaginas = Math.ceil(proveedoresData.length / filasPorPagina);
                    if (paginaActual > totalPaginas && paginaActual > 1) paginaActual--;
                    renderizarTabla();
                })
                .catch((error) => console.error("Error al eliminar:", error));
            }
        } else if (event.target.id === "editar") {
            window.location.href = `actualizarProveedor.html?id=${id}`;
        } else if (event.target.id === "copiar_id") {
            navigator.clipboard.writeText("ID Proveedor: " + id).then(() => {
                alert("ID del Proveedor copiado al portapapeles. ¡Listo para usar al registrar materiales!");
                window.location.href = "../../view/material/indexMateriales.html";
            });
        }
    });

    obtenerProveedores();
});