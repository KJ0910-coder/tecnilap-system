import express from 'express'
import cors from 'cors'
import clienteRoutes from './routes/cliente.routes.js'
import trabajoRoutes from './routes/trabajo.routes.js'
import actividadRoutes from './routes/actividad.routes.js'
import reporteRoutes from './routes/reporte.routes.js'
import trabajoMaterialRoutes from './routes/trabajoMaterial.routes.js'
import materialRoutes from './routes/material.routes.js'
import usuarioRoutes from './routes/usuario.routes.js'
import proveedorRoutes from './routes/proveedor.routes.js'
import facturaRoutes from './routes/factura.routes.js'
import eventoRoutes from './routes/evento.routes.js'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/clientes', clienteRoutes)
app.use('/trabajos', trabajoRoutes)
app.use('/actividades', actividadRoutes)
app.use('/reportes', reporteRoutes)
app.use('/trabajo-material', trabajoMaterialRoutes)
app.use('/materiales', materialRoutes)
app.use('/usuarios', usuarioRoutes)
app.use('/proveedores', proveedorRoutes)
app.use('/facturas', facturaRoutes)
app.use('/eventos', eventoRoutes)

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000')
})