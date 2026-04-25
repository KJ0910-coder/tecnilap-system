import { supabase } from '../supabaseClient.js'

// Registrar factura
export const registrarFactura = async (req, res) => {
  const {
    concepto,
    monto,
    metodo_pago,
    fecha,
    trabajo_id,
    cliente_id
  } = req.body

  const { data, error } = await supabase.rpc('registrar_factura', {
    p_concepto: concepto,
    p_monto: monto,
    p_metodo_pago: metodo_pago,
    p_fecha: fecha,
    p_trabajo_id: trabajo_id,
    p_cliente_id: cliente_id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data[0] || data) // Esto asegura que el frontend reciba el objeto directo
}


// Actualizar factura
export const actualizarFactura = async (req, res) => {
  const { id } = req.params
  const { concepto, monto, metodo_pago, fecha } = req.body

  const { error } = await supabase.rpc('actualizar_factura', {
    p_id: id,
    p_concepto: concepto,
    p_monto: monto,
    p_metodo_pago: metodo_pago,
    p_fecha: fecha
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Factura actualizada correctamente' })
}


// Eliminar factura
export const eliminarFactura = async (req, res) => {
  const { id } = req.params

  const { error } = await supabase.rpc('eliminar_factura', {
    p_id: id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Factura eliminada correctamente' })
}


// Obtener factura
export const obtenerFactura = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase.rpc('obtener_factura', {
    p_id: id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data[0] || data) // Esto asegura que el frontend reciba el objeto directo
}


// Listar facturas
export const listarFacturas = async (req, res) => {
  const { data, error } = await supabase.rpc('listar_facturas')

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
}


// Listar facturas por cliente
export const listarFacturasPorCliente = async (req, res) => {
  const { cliente_id } = req.params

  // Validamos que el ID exista antes de llamar a la DB
  if (!cliente_id) return res.status(400).json({ error: 'ID de cliente requerido' })

  const { data, error } = await supabase.rpc('listar_facturas_por_cliente', {
    p_cliente_id: cliente_id
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data || []) // Retorna un array vacío si no hay facturas, evitando errores en el front
}


// Marcar factura como pagada
export const marcarFacturaPagada = async (req, res) => {
  const { id } = req.params
  const { fecha_pago, metodo_pago, usuario_id } = req.body

  const { error } = await supabase.rpc('marcar_factura_pagada', {
    p_factura_id: id,
    p_fecha_pago: fecha_pago || null,
    p_metodo_pago: metodo_pago || null,
    p_usuario_id: usuario_id || null
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ message: 'Factura marcada como pagada correctamente' })
}