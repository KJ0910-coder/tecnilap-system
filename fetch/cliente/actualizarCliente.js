document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioActualizar");
    const clienteId = new URLSearchParams(window.location.search).get("id");

    if (!clienteId) {
        alert("Error: No se encontró el ID del cliente.");
        window.location.href = "../../view/cliente/indexClientes.html";
        return;
    }

    // Cargar datos actuales
    fetch(`http://localhost:3000/clientes/${clienteId}`)
        .then(res => { if(!res.ok) throw new Error("Error"); return res.json(); })
        .then(data => {
            const c = Array.isArray(data) ? data[0] : data;
            document.getElementById("nit").value = c.nit || '';
            document.getElementById("nombre").value = c.nombre;
            
            if(c.tipo_cliente) {
                document.getElementById("tipo_cliente").value = c.tipo_cliente;
            }
            
            document.getElementById("telefono").value = c.telefono;
            document.getElementById("correo").value = c.correo;
            document.getElementById("direccion").value = c.direccion;
        })
        .catch(err => {
            console.error(err);
            alert("Error al cargar los datos del cliente.");
        });

    // Enviar datos actualizados
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Estos son los datos frescos que el usuario acaba de escribir
        const actualizacion = {
            nit: document.getElementById("nit").value,
            nombre: document.getElementById("nombre").value,
            tipo_cliente: document.getElementById("tipo_cliente").value,
            telefono: document.getElementById("telefono").value,
            correo: document.getElementById("correo").value,
            direccion: document.getElementById("direccion").value
        };

        try {
            const response = await fetch(`http://localhost:3000/clientes/${clienteId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(actualizacion)
            });

            if (response.ok) {
                // --- AQUÍ ESTÁ EL AWAIT ---
                if(window.registrarAuditoria) {
                    await window.registrarAuditoria(
                        "ACTUALIZAR_CLIENTE", 
                        `Se actualizaron los datos del cliente: ${actualizacion.nombre} (NIT/CC: ${actualizacion.nit})`
                    );
                }
                
                alert("Datos del cliente actualizados.");
                window.location.href = "../../view/cliente/indexClientes.html";
            } else {
                alert("Hubo un error al actualizar los datos.");
            }
        } catch (error) {
            alert("Error de conexión al intentar actualizar.");
        }
    });
});