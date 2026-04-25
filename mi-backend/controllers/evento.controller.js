import { supabase } from '../supabaseClient.js'

// Registrar evento
export const registrarEvento = async (req, res) => {
  const {
    titulo,
    descripcion,
    tipo,
    fecha_hora,
    trabajo_id,
    factura_id
  } = req.body

  const { data, error } = await supabase.rpc('registrar_evento', {
    p_titulo: titulo,
    p_descripcion: descripcion,
    p_tipo: tipo,
    p_fecha_hora: fecha_hora,
    p_trabajo_id: trabajo_id || null,
    p_factura_id: factura_id || null
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data[0] || data) // Esto asegura que el frontend reciba el objeto directo
}


// Actualizar evento
export const actualizarEvento = async (req, res) => {
  const { id } = req.params
  const { titulo, descripcion, tipo, fecha_hora } = req.body

  const { error } = await supabase.rpc('actualizar_evento', {
    p_id: id,
    p_titulo: titulo,
    p_descripcion: descripcion,
    p_tipo: tipo,
    p_fecha_hora: fecha_hora
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Evento actualizado correctamente' })
}


// Eliminar evento
export const eliminarEvento = async (req, res) => {
  const { id } = req.params

  const { error } = await supabase.rpc('eliminar_evento', {
    p_id: id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Evento eliminado correctamente' })
}


// Obtener evento
export const obtenerEvento = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase.rpc('obtener_evento', {
    p_id: id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data[0] || data) // Esto asegura que el frontend reciba el objeto directo
}


// Listar eventos
export const listarEventos = async (req, res) => {
  const { data, error } = await supabase.rpc('listar_eventos')

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
}