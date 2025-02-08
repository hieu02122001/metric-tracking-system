import express from 'express'
import { addMetric, getMetrics } from '../controllers/metricControllers'

const router = express.Router()

router.post('/', addMetric)
router.get('/', getMetrics)

export default router
