import express from 'express'
import {
  registrarFactura,
  actualizarFactura,
  eliminarFactura,
  obtenerFactura,
  listarFacturas,
  listarFacturasPorCliente,
  marcarFacturaPagada
} from '../controllers/factura.controller.js'

const router = express.Router()

router.post('/', registrarFactura)
router.get('/', listarFacturas)
router.get('/:id', obtenerFactura)
router.put('/:id', actualizarFactura)
router.delete('/:id', eliminarFactura)

router.get('/cliente/:cliente_id', listarFacturasPorCliente)
router.put('/:id/pagar', marcarFacturaPagada)

export default router