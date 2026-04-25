import { supabase } from '../supabaseClient.js'

// Registrar material
export const registrarMaterial = async (req, res) => {
  const {
    nombre,
    cantidad_total,
    stock_actual,
    proveedor_id
  } = req.body

  const { data, error } = await supabase.rpc('registrar_material', {
    p_nombre: nombre,
    p_cantidad_total: cantidad_total,
    p_stock_actual: stock_actual,
    p_proveedor_id: proveedor_id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data[0] || data) // Esto asegura que el frontend reciba el objeto directo
}


// Actualizar material
export const actualizarMaterial = async (req, res) => {
  const { id } = req.params
  const {
    nombre,
    cantidad_total,
    stock_actual,
    proveedor_id
  } = req.body

  const { error } = await supabase.rpc('actualizar_material', {
    p_id: id,
    p_nombre: nombre,
    p_cantidad_total: cantidad_total,
    p_stock_actual: stock_actual,
    p_proveedor_id: proveedor_id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Material actualizado correctamente' })
}


// Eliminar material
export const eliminarMaterial = async (req, res) => {
  const { id } = req.params

  const { error } = await supabase.rpc('eliminar_material', {
    p_id: id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Material eliminado correctamente' })
}


// Obtener material
export const obtenerMaterial = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase.rpc('obtener_material', {
    p_id: id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data[0] || data) // Esto asegura que el frontend reciba el objeto directo
}


// Listar materiales
export const listarMateriales = async (req, res) => {
  const { data, error } = await supabase.rpc('listar_materiales')

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
}