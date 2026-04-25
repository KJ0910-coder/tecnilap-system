import { supabase } from '../supabaseClient.js'

// Crear trabajo con factura
export const crearTrabajoConFactura = async (req, res) => {
  const { descripcion, cliente_id, monto, metodo_pago } = req.body

  const { data, error } = await supabase.rpc('crear_trabajo_con_factura', {
    p_descripcion: descripcion,
    p_cliente_id: cliente_id,
    p_monto: monto,
    p_metodo_pago: metodo_pago
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data[0] || data) // Esto asegura que el frontend reciba el objeto directo
}


// registrar Uso Material
export const registrarUsoMaterial = async (req, res) => {
  const { trabajo_id, material_id, cantidad } = req.body

  const { error } = await supabase.rpc('registrar_uso_material', {
    p_trabajo_id: trabajo_id,
    p_material_id: material_id,
    p_cantidad: cantidad
  })

  // Si el trigger de la DB lanza "No hay suficiente stock", este catch lo captura
  if (error) {
    return res.status(400).json({ 
      error: error.message || 'Error al descontar material' 
    })
  }

  res.json({ message: 'Material registrado y stock actualizado automáticamente' })
}


// Cambiar estado del trabajo
export const cambiarEstadoTrabajo = async (req, res) => {
  const { id } = req.params
  const { nuevo_estado, usuario_id } = req.body

  const { error } = await supabase.rpc('cambiar_estado_trabajo', {
    p_trabajo_id: id,
    p_nuevo_estado: nuevo_estado,
    p_usuario_id: usuario_id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Estado actualizado correctamente' })
}



// Registrar trabajo
export const registrarTrabajo = async (req, res) => {
  const {
    descripcion,
    fecha_realizacion,
    fecha_entrega,
    cliente_id,
    consecutivo
  } = req.body

  const { data, error } = await supabase.rpc('registrar_trabajo', {
    p_descripcion: descripcion,
    p_fecha_realizacion: fecha_realizacion,
    p_fecha_entrega: fecha_entrega,
    p_cliente_id: cliente_id,
    p_consecutivo: consecutivo || null
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data[0] || data) // Esto asegura que el frontend reciba el objeto directo
}


// Actualizar trabajo
export const actualizarTrabajo = async (req, res) => {
  const { id } = req.params
  const {
    descripcion,
    estado,
    fecha_realizacion,
    fecha_entrega
  } = req.body

  const { error } = await supabase.rpc('actualizar_trabajo', {
    p_id: id,
    p_descripcion: descripcion,
    p_estado: estado,
    p_fecha_realizacion: fecha_realizacion,
    p_fecha_entrega: fecha_entrega
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Trabajo actualizado correctamente' })
}


// Eliminar trabajo
export const eliminarTrabajo = async (req, res) => {
  const { id } = req.params

  const { error } = await supabase.rpc('eliminar_trabajo', {
    p_id: id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Trabajo eliminado correctamente' })
}


// Obtener trabajo
export const obtenerTrabajo = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase.rpc('obtener_trabajo', {
    p_id: id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data[0] || data) // Esto asegura que el frontend reciba el objeto directo
}


// Listar trabajos
export const listarTrabajos = async (req, res) => {
  const { data, error } = await supabase.rpc('listar_trabajos')

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
}