import { supabase } from '../supabaseClient.js'

// Registrar proveedor
export const registrarProveedor = async (req, res) => {
  const {
    nombre,
    tipo_producto,
    telefono,
    correo,
    direccion,
    nit
  } = req.body

  const { data, error } = await supabase.rpc('registrar_proveedor', {
    p_nombre: nombre,
    p_tipo_producto: tipo_producto,
    p_telefono: telefono,
    p_correo: correo,
    p_direccion: direccion,
    p_nit: nit
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data[0] || data) // Esto asegura que el frontend reciba el objeto directo
}


// Actualizar proveedor
export const actualizarProveedor = async (req, res) => {
  const { id } = req.params
  const {
    nombre,
    tipo_producto,
    telefono,
    correo,
    direccion,
    nit
  } = req.body

  const { error } = await supabase.rpc('actualizar_proveedor', {
    p_id: id,
    p_nombre: nombre,
    p_tipo_producto: tipo_producto,
    p_telefono: telefono,
    p_correo: correo,
    p_direccion: direccion,
    p_nit: nit
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Proveedor actualizado correctamente' })
}


// Eliminar proveedor
export const eliminarProveedor = async (req, res) => {
  const { id } = req.params

  const { error } = await supabase.rpc('eliminar_proveedor', {
    p_id: id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Proveedor eliminado correctamente' })
}


// Obtener proveedor
export const obtenerProveedor = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase.rpc('obtener_proveedor', {
    p_id: id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data[0] || data) // Esto asegura que el frontend reciba el objeto directo
}


// Listar proveedores
export const listarProveedores = async (req, res) => {
  const { data, error } = await supabase.rpc('listar_proveedores')

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
}