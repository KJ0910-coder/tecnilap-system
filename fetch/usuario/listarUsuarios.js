document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("cuerpoTabla");
    const btnAnterior = document.getElementById("paginaAnterior");
    const btnSiguiente = document.getElementById("paginaSiguiente");
    const selectFilas = document.getElementById("filasPorPagina");

    let usuariosData = []; // Aquí guardaremos todos los usuarios de la base de datos
    let paginaActual = 1;
    let filasPorPagina = parseInt(selectFilas.value); 

    // 1. Obtener todos los usuarios de la API
    function obtenerUsuarios() {
        fetch(`http://localhost:3000/usuarios`)
            .then((response) => response.json())
            .then((data) => {
                usuariosData = data;
                renderizarTabla(); 
            })
            .catch((error) => console.error("Error al obtener datos de la API:", error));
    }

    // 2. Función para dibujar solo los usuarios de la página actual
    function renderizarTabla() {
        tabla.innerHTML = "";

        const inicio = (paginaActual - 1) * filasPorPagina;
        const fin = inicio + filasPorPagina;
        const usuariosPaginados = usuariosData.slice(inicio, fin);

        usuariosPaginados.forEach((user) => {
            const row = document.createElement("tr");
            
            const fechaLimpia = new Date(user.created_at).toLocaleDateString();
            const idCorto = user.id.substring(0, 8) + '...';
            const estadoBadge = user.estado === 'ACTIVO' ? 'bg-success' : 'bg-danger';

            row.innerHTML = `
                <td class="text-center" title="${user.id}">${idCorto}</td>
                <td class="text-center">${user.nombre_completo}</td>
                <td class="text-center">${user.correo}</td>
                <td class="text-center">${user.rol}</td>
                <td class="text-center"><span class="badge ${estadoBadge}">${user.estado}</span></td>
                <td class="text-center">${fechaLimpia}</td>
                <td class="text-center"> <button id="editar" value="${user.id}" class="btn btn-warning btn-sm">Editar</button> </td>
                <td class="text-center"> <button id="borrar" value="${user.id}" class="btn btn-danger btn-sm">Eliminar</button> </td>
            `;
            tabla.appendChild(row);
        });

        actualizarBotones();
    }

    function actualizarBotones() {
        const totalPaginas = Math.ceil(usuariosData.length / filasPorPagina);
        btnAnterior.style.display = paginaActual > 1 ? "inline-block" : "none";
        btnSiguiente.style.display = paginaActual < totalPaginas ? "inline-block" : "none";
    }

    selectFilas.addEventListener("change", (e) => {
        filasPorPagina = parseInt(e.target.value);
        paginaActual = 1; 
        renderizarTabla();
    });

    btnAnterior.addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarTabla();
        }
    });

    btnSiguiente.addEventListener("click", () => {
        const totalPaginas = Math.ceil(usuariosData.length / filasPorPagina);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            renderizarTabla();
        }
    });

    // 6. Acciones para Editar y Eliminar
    tabla.addEventListener("click", (event) => {
        const idUsuario = event.target.value;

        if (event.target.id === "borrar") {
            // Buscamos el nombre del usuario antes de borrarlo para la auditoría
            const usuarioABorrar = usuariosData.find(u => u.id === idUsuario);
            const nombreUsuario = usuarioABorrar ? usuarioABorrar.nombre_completo : "Desconocido";

            const confirmacion = confirm(`¿Estás seguro de que deseas eliminar al usuario: ${nombreUsuario}?`);
            
            if (confirmacion) {
                fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
                    method: "DELETE",
                })
                .then(async(response) => {
                    if (!response.ok) throw new Error("Error al eliminar el usuario");
                    
                    // --- AUDITORÍA ---
                    if (window.registrarAuditoria) {
                        await window.registrarAuditoria(
                            "ELIMINAR_USUARIO", 
                            `Se eliminó el acceso al sistema del usuario: ${nombreUsuario} (ID: ${idUsuario.substring(0,8)}...)`
                        );
                    }
                    
                    // Actualizamos el arreglo local
                    usuariosData = usuariosData.filter(u => u.id !== idUsuario);
                    
                    const totalPaginas = Math.ceil(usuariosData.length / filasPorPagina);
                    if (paginaActual > totalPaginas && paginaActual > 1) {
                        paginaActual--;
                    }
                    
                    renderizarTabla();
                })
                .catch((error) => console.error("Error al eliminar usuario:", error));
            }
        } else if (event.target.id === "editar") {
            window.location.href = "../../view/usuarios/actualizarUsuario.html?id=" + idUsuario; 
        }
    });

    obtenerUsuarios();
});