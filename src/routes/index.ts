import express from 'express'

const router = express.Router()

router.get('/', (_, res) => {
  res.send({
    message: 'Everything is working!'
  })
})

export default router
