import express from 'express'
import {
  registrarTrabajoMaterial,
  eliminarTrabajoMaterial,
  listarMaterialesPorTrabajo
} from '../controllers/trabajoMaterial.controller.js'

const router = express.Router()

router.post('/', registrarTrabajoMaterial)
router.get('/trabajo/:trabajo_id', listarMaterialesPorTrabajo)
router.delete('/:id', eliminarTrabajoMaterial)

export default router