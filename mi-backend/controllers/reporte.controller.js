import { supabase } from '../supabaseClient.js'

//pedir un reporte financiero del mes
export const reporteFinancieroMensual = async (req, res) => {
  const { anio, mes } = req.params

  const { data, error } = await supabase.rpc('reporte_financiero_mensual', {
    p_anio: parseInt(anio),
    p_mes: parseInt(mes)
  })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
}