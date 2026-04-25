import express from 'express'
import {
  registrarUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuario,
  listarUsuarios
} from '../controllers/usuario.controller.js'

const router = express.Router()

router.post('/', registrarUsuario)
router.get('/', listarUsuarios)
router.get('/:id', obtenerUsuario)
router.put('/:id', actualizarUsuario)
router.delete('/:id', eliminarUsuario)

export default router