import express from 'express'
import {
  registrarMaterial,
  actualizarMaterial,
  eliminarMaterial,
  obtenerMaterial,
  listarMateriales
} from '../controllers/material.controller.js'

const router = express.Router()

router.post('/', registrarMaterial)
router.get('/', listarMateriales)
router.get('/:id', obtenerMaterial)
router.put('/:id', actualizarMaterial)
router.delete('/:id', eliminarMaterial)

export default router