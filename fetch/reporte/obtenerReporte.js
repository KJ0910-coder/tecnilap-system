document.addEventListener("DOMContentLoaded", () => {
    const btnGenerar = document.getElementById("btnGenerar");
    const selectMes = document.getElementById("mes");
    const inputAnio = document.getElementById("anio");
    
    const tarjetaResultado = document.getElementById("tarjetaResultado");
    const totalDinero = document.getElementById("totalDinero");
    const textoPeriodo = document.getElementById("textoPeriodo");

    // Datos del tiempo real
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth() + 1; // Enero es 0, por eso sumamos 1

    // Nombres de los meses para crear las opciones
    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Configurar el input del año con límites estrictos
    inputAnio.min = 2025; // sistema inició en 2025
    inputAnio.max = anioActual; // No pueden buscar años futuros
    inputAnio.value = anioActual; // Por defecto mostramos el año actual


    function actualizarMeses() {
        let anioSeleccionado = parseInt(inputAnio.value);
        
        // Si el usuario borra el campo o pone un año menor a 2025, forzamos a 2025
        if (!anioSeleccionado || anioSeleccionado < 2025) {
            anioSeleccionado = 2025;
        } 
        // Si pone un año mayor al actual, lo regresamos al año actual
        else if (anioSeleccionado > anioActual) {
            anioSeleccionado = anioActual;
            inputAnio.value = anioActual;
        }

        selectMes.innerHTML = ""; // Limpiamos la lista desplegable

        // Si es el año actual, solo mostramos hasta el mes actual. Si es un año pasado, mostramos los 12.
        let limiteMes = (anioSeleccionado === anioActual) ? mesActual : 12;

        for (let i = 1; i <= limiteMes; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = nombresMeses[i - 1];
            
            // Seleccionar automáticamente el mes actual al cargar
            if (i === mesActual && anioSeleccionado === anioActual) {
                option.selected = true;
            }
            
            selectMes.appendChild(option);
        }
    }

    // Escuchar cada vez que el usuario cambia o escribe un año
    inputAnio.addEventListener("change", actualizarMeses);
    inputAnio.addEventListener("keyup", actualizarMeses);

    // Ejecutar la primera vez al cargar la página
    actualizarMeses();

    // --- (El Fetch) ---
    btnGenerar.addEventListener("click", async () => {
        const mes = selectMes.value;
        const anio = inputAnio.value;
        const nombreMes = selectMes.options[selectMes.selectedIndex].text;

        try {
            // Petición al API (Asegúrate de que la 's' de reportes coincida con tu backend)
            const response = await fetch(`http://localhost:3000/reportes/financiero/${anio}/${mes}`);
            
            if (!response.ok) {
                throw new Error("Error al obtener el reporte del servidor");
            }

            const data = await response.json();

            let total = 0;
            if (Array.isArray(data) && data.length > 0) {
                total = parseFloat(data[0].total) || 0;
            } else if (data && data.total) {
                total = parseFloat(data.total) || 0;
            }

            const formatoMoneda = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP', 
                minimumFractionDigits: 0
            }).format(total);

            totalDinero.textContent = formatoMoneda;
            textoPeriodo.textContent = `Período: ${nombreMes} de ${anio}`;
            
            tarjetaResultado.style.display = "block";

        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al generar el reporte. Revisa la consola.");
        }
    });
});