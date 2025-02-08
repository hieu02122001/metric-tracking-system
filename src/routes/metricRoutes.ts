import express from 'express'
import { addMetric } from '../controllers/metricControllers'

const router = express.Router()

router.post('/', addMetric)

export default router
