document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("cuerpoTabla");
    const btnAnterior = document.getElementById("paginaAnterior");
    const btnSiguiente = document.getElementById("paginaSiguiente");
    const selectFilas = document.getElementById("filasPorPagina");

    const inputBuscarCliente = document.getElementById("inputBuscarCliente");
    const inputBuscarTrabajo = document.getElementById("inputBuscarTrabajo");
    const btnFiltrar = document.getElementById("btnFiltrar");
    const btnLimpiar = document.getElementById("btnLimpiarFiltro");

    let facturasData = [];
    let paginaActual = 1;
    let filasPorPagina = parseInt(selectFilas.value);

    // Verificar si venimos desde Cliente o Trabajo
    const urlParams = new URLSearchParams(window.location.search);
    const clientePreFiltro = urlParams.get('cliente_id');

    function obtenerFacturas() {
        fetch(`http://localhost:3000/facturas`)
            .then((response) => response.json())
            .then((data) => {
                facturasData = data;
                renderizarTabla();
            })
            .catch((error) => console.error("Error al obtener datos:", error));
    }

    // Buscador por Cliente (¡AQUÍ ESTABA EL ERROR DE LA "S"!)
    function buscarPorCliente(clienteId) {
        fetch(`http://localhost:3000/facturas/cliente/${clienteId}`) // <-- Corregido a "cliente"
            .then((response) => {
                if (!response.ok) throw new Error("Error en la ruta del servidor");
                return response.json();
            })
            .then((data) => {
                facturasData = data;
                paginaActual = 1;
                if(facturasData.length === 0) {
                    tabla.innerHTML = `<tr><td colspan="10" class="text-center text-danger">Este cliente no tiene facturas registradas.</td></tr>`;
                    actualizarBotones();
                } else {
                    renderizarTabla();
                }
            })
            .catch((error) => console.error("Error al filtrar:", error));
    }

    // Doble Buscador (Cliente o Trabajo)
    btnFiltrar.addEventListener("click", () => {
        const clienteVal = inputBuscarCliente.value.trim();
        const trabajoVal = inputBuscarTrabajo.value.trim();

        if (clienteVal) {
            buscarPorCliente(clienteVal);
        } else if (trabajoVal) {
            fetch(`http://localhost:3000/facturas`)
                .then(r => r.json())
                .then(data => { 
                    facturasData = data.filter(f => f.trabajo_id === trabajoVal); 
                    paginaActual = 1; 
                    renderizarTabla(); 
                });
        }
    });

    btnLimpiar.addEventListener("click", () => {
        inputBuscarCliente.value = "";
        inputBuscarTrabajo.value = "";
        window.history.replaceState({}, document.title, window.location.pathname);
        obtenerFacturas();
    });

    function renderizarTabla() {
        tabla.innerHTML = "";
        const inicio = (paginaActual - 1) * filasPorPagina;
        const fin = inicio + filasPorPagina;
        const paginados = facturasData.slice(inicio, fin);
        const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

        paginados.forEach((f) => {
            const row = document.createElement("tr");
        
            // Verificamos si la propiedad existe, si no, intentamos con nombres comunes de BD
            const idFactura = f.id || f.factura_id;
            const idTrabajo = f.trabajo_id || f.id_trabajo;
            const idCliente = f.cliente_id || f.id_cliente;

            const idCorto = idFactura ? idFactura.substring(0, 8) + '...' : 'N/A';
            const trabajoIdCorto = idTrabajo ? idTrabajo.substring(0, 8) + '...' : 'N/A';
            const clienteIdCorto = idCliente ? idCliente.substring(0, 8) + '...' : 'N/A';
        
            const fechaFormateada = f.fecha ? new Date(f.fecha).toLocaleDateString() : 'N/A';
        
            let badgeClass = f.metodo_pago === 'PENDIENTE' ? 'bg-danger' : 'bg-success';
            let botonPagar = f.metodo_pago === 'PENDIENTE' ? `<button id="pagar" value="${idFactura}" class="btn btn-success btn-sm w-100 mb-1">Pagar</button>` : '';

            row.innerHTML = `
                <td class="text-center" title="${idFactura}">${idCorto}</td>
                <td title="${f.concepto}">${f.concepto ? f.concepto.substring(0, 25) + '...' : 'Sin concepto'}</td>
                <td class="text-end fw-bold text-success">${formatter.format(f.monto || 0)}</td>
                <td class="text-center">${fechaFormateada}</td>
                <td class="text-center"><span class="badge ${badgeClass}">${f.metodo_pago || 'N/A'}</span></td>
                <td class="text-center" title="${idTrabajo || ''}">${trabajoIdCorto}</td>
                <td class="text-center" title="${idCliente || ''}">${clienteIdCorto}</td>
            
                <td class="text-center px-1"> 
                    ${botonPagar}
                    <button id="ir_evento" value="${idFactura}" class="btn btn-primary btn-sm w-100 mb-1">Evento</button>
                </td>
                <td class="text-center px-1"> 
                    <button id="editar" value="${idFactura}" class="btn btn-warning btn-sm w-100 mb-1">Editar</button> 
                </td>
                <td class="text-center px-1"> 
                    <button id="borrar" value="${idFactura}" class="btn btn-danger btn-sm w-100 mb-1">Eliminar</button> 
                </td>
            `;
            tabla.appendChild(row);
        });
        actualizarBotones();
    }

    function actualizarBotones() {
        const totalPaginas = Math.ceil(facturasData.length / filasPorPagina);
        btnAnterior.style.display = paginaActual > 1 ? "inline-block" : "none";
        btnSiguiente.style.display = paginaActual < totalPaginas ? "inline-block" : "none";
    }

    selectFilas.addEventListener("change", (e) => { filasPorPagina = parseInt(e.target.value); paginaActual = 1; renderizarTabla(); });
    btnAnterior.addEventListener("click", () => { if (paginaActual > 1) { paginaActual--; renderizarTabla(); } });
    btnSiguiente.addEventListener("click", () => { if (paginaActual < Math.ceil(facturasData.length / filasPorPagina)) { paginaActual++; renderizarTabla(); } });

    tabla.addEventListener("click", async (event) => {
        const boton = event.target;
        const id = boton.value;
        
        // 1. LÓGICA PARA PAGAR (UNIFICADA)
        if (boton.id === "pagar") {
            const facturaPagando = facturasData.find(f => f.id === id);
            const conceptoMostrar = facturaPagando ? facturaPagando.concepto : "Desconocida";

            const metodoNuevo = prompt("Ingrese método de pago (EFECTIVO, TRANSFERENCIA, TARJETA):", "EFECTIVO");
            
            if (metodoNuevo) {
                const metodoLimpio = metodoNuevo.toUpperCase().trim();
                
                try {
                    const response = await fetch(`http://localhost:3000/facturas/${id}/pagar`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            metodo_pago: metodoLimpio, 
                            fecha_pago: new Date().toISOString().split('T')[0] 
                        })
                    });

                    if (response.ok) {
                        if (window.registrarAuditoria) {
                            await window.registrarAuditoria(
                                "PAGO_FACTURA", 
                                `Se registró el pago de la factura "${conceptoMostrar}" mediante ${metodoLimpio}`
                            );
                        }
                        alert("¡Pago registrado con éxito!");
                        obtenerFacturas(); // Recarga la lista para que el badge cambie
                    } else {
                        const error = await response.json();
                        alert("Error al pagar: " + error.error);
                    }
                } catch (err) {
                    console.error("Error en la petición:", err);
                    alert("No se pudo conectar con el servidor.");
                }
            }
        } 
        
        // 2. LÓGICA PARA BORRAR
        else if (boton.id === "borrar") {
            const facturaBorrando = facturasData.find(f => f.id === id);
            const conceptoMostrar = facturaBorrando ? facturaBorrando.concepto : "Desconocida";

            if (confirm(`¿Seguro que deseas eliminar la factura: "${conceptoMostrar}"?`)) {
                fetch(`http://localhost:3000/facturas/${id}`, { method: "DELETE" })
                .then(async(res) => { 
                    if (res.ok) {
                        if (window.registrarAuditoria) {
                            await window.registrarAuditoria("ELIMINAR_FACTURA", `Se eliminó la factura: "${conceptoMostrar}"`);
                        }
                        facturasData = facturasData.filter(f => f.id !== id); 
                        renderizarTabla(); 
                    }
                });
            }
        } 

        // 3. LÓGICA PARA EDITAR
        else if (boton.id === "editar") {
            window.location.href = `../../view/factura/actualizarFactura.html?id=${id}`;
        } 

        // 4. LÓGICA PARA EVENTO (COPIAR ID)
        else if (boton.id === "ir_evento") {
            navigator.clipboard.writeText("ID Factura: " + id).then(() => {
                alert("ID de la Factura copiado al portapapeles. Redirigiendo a crear evento...");
                window.location.href = `../../view/evento/crearEvento.html?factura_id=${id}`;
            });
        }
    });
    
    if (clientePreFiltro) {
        inputBuscarCliente.value = clientePreFiltro;
        buscarPorCliente(clientePreFiltro);
    } else {
        obtenerFacturas();
    }
});