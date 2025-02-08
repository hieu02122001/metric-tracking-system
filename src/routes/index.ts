import express from 'express'
import metricRoutes from './metricRoutes'

const router = express.Router()

router.use('/metrics', metricRoutes)

router.get('/', (_, res) => {
  res.send({
    message: 'Everything is working!'
  })
})

export default router
