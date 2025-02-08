import { Request, Response } from 'express'
import prisma from '../services/database'
import { addMetricSchema } from '../models/MetricSchema'
import { getTypeOfUnit } from '../helpers'
import { METRIC_EXISTS, UNIT_INVALID } from '../error-messages.ts'
import { createMetric, findFirstMetrics } from '../services/metricService'

export async function addMetric(req: Request, res: Response) {
  const input = addMetricSchema.safeParse(req.body)

  if (!input.success) {
    res.status(400).send({ error: input.error.errors })
    return
  }

  const { value, unit, date } = input.data
  const { id: userId } = req.user

  const type = getTypeOfUnit(unit)
  if (!type) {
    res.status(400).send({ error: UNIT_INVALID })
    return
  }

  const existingMetric = await findFirstMetrics({
    where: {
      userId,
      date: new Date(date),
      type,
      unit
    }
  })
  if (existingMetric) {
    res.status(400).send({ error: METRIC_EXISTS })
    return
  }

  try {
    const metric = await createMetric({
      userId,
      value,
      unit,
      type,
      date: new Date(date)
    })

    res.status(201).send(metric)
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }

  return
}
