import { supabase } from '../supabaseClient.js'

// Registrar material en un trabajo
export const registrarTrabajoMaterial = async (req, res) => {
  const { trabajo_id, material_id, cantidad_usada } = req.body

  const { data, error } = await supabase.rpc('registrar_trabajo_material', {
    p_trabajo_id: trabajo_id,
    p_material_id: material_id,
    p_cantidad_usada: cantidad_usada
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data[0] || data) // Esto asegura que el frontend reciba el objeto directo
}


// Eliminar material de un trabajo
export const eliminarTrabajoMaterial = async (req, res) => {
  const { id } = req.params

  const { error } = await supabase.rpc('eliminar_trabajo_material', {
    p_id: id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Material eliminado del trabajo correctamente' })
}


// Listar materiales de un trabajo
export const listarMaterialesPorTrabajo = async (req, res) => {
  const { trabajo_id } = req.params

  const { data, error } = await supabase.rpc('listar_materiales_por_trabajo', {
    p_trabajo_id: trabajo_id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
}