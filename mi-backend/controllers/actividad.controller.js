import { supabase } from '../supabaseClient.js'

// Registrar actividad
export const registrarActividad = async (req, res) => {
  const { usuario_id, accion, descripcion } = req.body

  const { data, error } = await supabase.rpc('registrar_actividad', {
    p_usuario_id: usuario_id,
    p_accion: accion,
    p_descripcion: descripcion
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data[0] || data) // Esto asegura que el frontend reciba el objeto directo
}

// Eliminar actividad
export const eliminarActividad = async (req, res) => {
  const { id } = req.params

  const { error } = await supabase.rpc('eliminar_actividad', {
    p_id: id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Actividad eliminada correctamente' })
}

// Obtener actividad
export const obtenerActividad = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase.rpc('obtener_actividad', {
    p_id: id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data);
}

// la función listar Actividades
export const listarActividades = async (req, res) => {
  const { data, error } = await supabase.rpc('listar_actividades')

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
}
