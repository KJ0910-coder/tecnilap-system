import express from 'express'
import {
  registrarEvento,
  actualizarEvento,
  eliminarEvento,
  obtenerEvento,
  listarEventos
} from '../controllers/evento.controller.js'

const router = express.Router()

router.post('/', registrarEvento)
router.get('/', listarEventos)
router.get('/:id', obtenerEvento)
router.put('/:id', actualizarEvento)
router.delete('/:id', eliminarEvento)

export default router