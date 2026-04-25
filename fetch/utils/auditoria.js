// fetch/utils/auditoria.js

async function registrarAuditoria(accion, descripcion) {
    // 1. Revisar quién está usando el sistema
    const sesionString = localStorage.getItem("tecnilap_sesion");
    
    // Si no hay sesión (alguien entró sin login), no hacemos nada
    if (!sesionString) return; 

    const usuarioActualId = JSON.parse(sesionString).id;

    // 2. Mandar el reporte a la base de datos de manera silenciosa
    try {
        await fetch("http://localhost:3000/actividades", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: usuarioActualId,
                accion: accion.toUpperCase(),
                descripcion: descripcion
            })
        });
        // Nota: No ponemos "alert" aquí porque esto debe ser invisible para el usuario
    } catch (error) {
        console.error("Fallo silencioso en auditoría:", error);
    }
}

// Hacemos que la función esté disponible para todo el proyecto
window.registrarAuditoria = registrarAuditoria;