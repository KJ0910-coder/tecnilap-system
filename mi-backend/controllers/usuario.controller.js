import { supabase } from '../supabaseClient.js'

// Registrar usuario
export const registrarUsuario = async (req, res) => {
  const {
    nombre_completo,
    correo,
    rol,
    estado
  } = req.body

  const { data, error } = await supabase.rpc('registrar_usuario', {
    p_nombre_completo: nombre_completo,
    p_correo: correo,
    p_rol: rol,
    p_estado: estado
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
}


// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  const { id } = req.params
  const {
    nombre_completo,
    correo,
    rol,
    estado
  } = req.body

  const { error } = await supabase.rpc('actualizar_usuario', {
    p_id: id,
    p_nombre_completo: nombre_completo,
    p_correo: correo,
    p_rol: rol,
    p_estado: estado
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Usuario actualizado correctamente' })
}


// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  const { id } = req.params

  const { error } = await supabase.rpc('eliminar_usuario', {
    p_id: id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Usuario eliminado correctamente' })
}


// Obtener usuario
export const obtenerUsuario = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase.rpc('obtener_usuario', {
    p_id: id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data[0] || data) // Esto asegura que el frontend reciba el objeto directo
}


// Listar usuarios
export const listarUsuarios = async (req, res) => {
  const { data, error } = await supabase.rpc('listar_usuarios')

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
}