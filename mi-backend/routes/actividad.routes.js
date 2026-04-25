import express from 'express'
import {
  registrarActividad,
  eliminarActividad,
  obtenerActividad,
  listarActividades
} from '../controllers/actividad.controller.js'

const router = express.Router()

router.post('/', registrarActividad)
router.get('/', listarActividades)
router.get('/:id', obtenerActividad)
router.delete('/:id', eliminarActividad)

export default router