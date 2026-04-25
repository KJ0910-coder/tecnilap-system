import express from 'express'
import { reporteFinancieroMensual } from '../controllers/reporte.controller.js'

const router = express.Router()

router.get('/financiero/:anio/:mes', reporteFinancieroMensual)

export default router