import { supabase } from '../supabaseClient.js'

//registrar un cliente
export const registrarCliente = async (req, res) => {
    try {
        // 1. EXTRAER TODO (Aquí es donde estaba el fallo)
        const { nombre, correo, telefono, direccion, tipo_cliente, nit } = req.body;

        // 2. VALIDACIÓN (Para que no llegue nada vacío a la DB)
        if (!nombre || !nit) {
            return res.status(400).json({ error: 'El nombre y el NIT son obligatorios.' });
        }

        // 3. LLAMADA AL RPC (Asegúrate que los nombres coincidan con tu SQL)
        const { data, error } = await supabase.rpc('registrar_cliente', {
            p_nombre: nombre,
            p_correo: correo,
            p_telefono: telefono,
            p_direccion: direccion,
            p_tipo_cliente: tipo_cliente,
            p_nit: nit
        });

        // 4. MANEJO DE ERRORES DE SUPABASE
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // 5. RESPUESTA EXITOSA
        res.json({ cliente_id: data });

    } catch (err) {
        console.error("Error fatal en el servidor:", err);
        res.status(500).json({ error: "Error interno del servidor. Revisa la consola." });
    }
}


//actualizar un cliente
export const actualizarCliente = async (req, res) => {

  const { id } = req.params
  const { nombre, correo, telefono, direccion, tipo_cliente, nit } = req.body

  const { error } = await supabase.rpc('actualizar_cliente', {
    p_id: id,
    p_nombre: nombre,
    p_correo: correo,
    p_telefono: telefono,
    p_direccion: direccion,
    p_tipo_cliente: tipo_cliente,
    p_nit: nit
  })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ message: 'Cliente actualizado correctamente' })
}


//eliminar un cliente
export const eliminarCliente = async (req, res) => {
  const { id } = req.params

  const { error } = await supabase.rpc('eliminar_cliente', {
    p_id: id
  })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ message: 'Cliente eliminado correctamente' })
}


//obtener un cliente
export const obtenerCliente = async (req, res) => {

  const { id } = req.params

  const { data, error } = await supabase.rpc('obtener_cliente', {
    p_id: id
  })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json(data)
}


//listar los clientes
export const listarClientes = async (req, res) => {

  const { data, error } = await supabase.rpc('listar_clientes')

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json(data)
}



