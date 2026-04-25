import express from 'express'
import {
  registrarCliente,
  actualizarCliente,
  eliminarCliente,
  obtenerCliente,
  listarClientes
} from '../controllers/cliente.controller.js'

const router = express.Router()

router.post('/', registrarCliente)
router.get('/', listarClientes)
router.get('/:id', obtenerCliente)
router.put('/:id', actualizarCliente)
router.delete('/:id', eliminarCliente)

export default router