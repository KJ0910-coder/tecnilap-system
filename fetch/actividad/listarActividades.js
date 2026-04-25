document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("cuerpoTabla");
    const btnAnterior = document.getElementById("paginaAnterior");
    const btnSiguiente = document.getElementById("paginaSiguiente");
    const selectFilas = document.getElementById("filasPorPagina");

    let actividadesData = [];
    let usuariosData = [];
    let paginaActual = 1;
    let filasPorPagina = parseInt(selectFilas.value);

    // 1. Cargar Usuarios primero para mapear los nombres
    async function cargarDatos() {
        try {
            const resUsuarios = await fetch("http://localhost:3000/usuarios");
            if (resUsuarios.ok) usuariosData = await resUsuarios.json();

            const resActividades = await fetch("http://localhost:3000/actividades");
            if (resActividades.ok) {
                const data = await resActividades.json();
                // Ordenamos para que las más recientes salgan arriba
                actividadesData = data.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
                renderizarTabla();
            }
        } catch (error) {
            console.error("Error cargando auditoría:", error);
            tabla.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error de conexión</td></tr>`;
        }
    }

    function renderizarTabla() {
        tabla.innerHTML = "";
        const inicio = (paginaActual - 1) * filasPorPagina;
        const fin = inicio + filasPorPagina;
        const paginados = actividadesData.slice(inicio, fin);

        paginados.forEach((act) => {
            const row = document.createElement("tr");
            
            // Buscar el nombre del usuario
            const usuarioObj = usuariosData.find(u => u.id === act.usuario_id);
            const nombreUsuario = usuarioObj ? usuarioObj.nombre_completo : 'Sistema / Desconocido';
            
            // Formatear Fecha y Hora
            const fechaFmt = new Date(act.fecha_hora).toLocaleString('es-CO');

            // Colores para la Acción
            let badgeColor = 'bg-secondary';
            if (act.accion.includes('CREAR') || act.accion.includes('NUEVO')) badgeColor = 'bg-success';
            if (act.accion.includes('ELIMINAR') || act.accion.includes('BORRAR')) badgeColor = 'bg-danger';
            if (act.accion.includes('ACTUALIZAR') || act.accion.includes('EDITAR')) badgeColor = 'bg-warning text-dark';
            if (act.accion.includes('LOGIN')) badgeColor = 'bg-info text-dark';

            row.innerHTML = `
                <td class="text-center small">${fechaFmt}</td>
                <td class="text-center fw-bold" title="ID: ${act.usuario_id}">${nombreUsuario}</td>
                <td class="text-center"><span class="badge ${badgeColor}">${act.accion}</span></td>
                <td>${act.descripcion}</td>
                <td class="text-center px-1"> 
                    <button id="borrar" value="${act.id}" class="btn btn-outline-danger btn-sm">X</button> 
                </td>
            `;
            tabla.appendChild(row);
        });
        actualizarBotones();
    }

    function actualizarBotones() {
        const totalPaginas = Math.ceil(actividadesData.length / filasPorPagina);
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
        if (paginaActual < Math.ceil(actividadesData.length / filasPorPagina)) { paginaActual++; renderizarTabla(); }
    });

    tabla.addEventListener("click", (event) => {
        if (event.target.id === "borrar") {
            if (confirm(`¿Eliminar este registro de auditoría?`)) {
                fetch(`http://localhost:3000/actividades/${event.target.value}`, { method: "DELETE" })
                .then((res) => { if (res.ok) { actividadesData = actividadesData.filter(a => a.id !== event.target.value); renderizarTabla(); } });
            }
        }
    });

    cargarDatos();
});