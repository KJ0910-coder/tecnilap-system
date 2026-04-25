import express from 'express'
import {
  registrarProveedor,
  actualizarProveedor,
  eliminarProveedor,
  obtenerProveedor,
  listarProveedores
} from '../controllers/proveedor.controller.js'

const router = express.Router()

router.post('/', registrarProveedor)
router.get('/', listarProveedores)
router.get('/:id', obtenerProveedor)
router.put('/:id', actualizarProveedor)
router.delete('/:id', eliminarProveedor)

export default router