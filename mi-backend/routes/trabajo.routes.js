import express from 'express'
import {
  registrarTrabajo,
  actualizarTrabajo,
  eliminarTrabajo,
  obtenerTrabajo,
  listarTrabajos,
  crearTrabajoConFactura,
  registrarUsoMaterial,
  cambiarEstadoTrabajo
} from '../controllers/trabajo.controller.js'

const router = express.Router()

// CRUD básico
router.post('/', registrarTrabajo)
router.get('/', listarTrabajos)
router.get('/:id', obtenerTrabajo)
router.put('/:id', actualizarTrabajo)
router.delete('/:id', eliminarTrabajo)

// Rutas especiales
router.post('/crear-con-factura', crearTrabajoConFactura)
router.post('/uso-material', registrarUsoMaterial)
router.put('/:id/estado', cambiarEstadoTrabajo)

export default router

import {

} from '../controllers/trabajo.controller.js'