import express from 'express'
import { addMetric, getMetrics, getChartData } from '../controllers/metricControllers'

const router = express.Router()

router.post('/', addMetric)
router.get('/', getMetrics)
router.get('/chart', getChartData)

export default router
