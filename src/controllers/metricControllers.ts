import { Request, Response } from 'express'
import { addMetricSchema, getChartDataSchema, getMetricsSchema } from '../models/MetricSchema'
import { getDatesFromDatePeriod, getTypeOfUnit } from '../helpers'
import { METRIC_EXISTS, UNIT_INVALID } from '../error-messages.ts'
import { convertMetrics, createMetric, findFirstMetrics, findMetrics, getDataForChart } from '../services/metricService'

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

export async function getMetrics(req: Request, res: Response) {
  const input = getMetricsSchema.safeParse(req.query)

  if (!input.success) {
    res.status(400).send({ error: input.error.errors })
    return
  }

  const { type, unit } = input.data
  const { id: userId } = req.user

  try {
    const metrics = await findMetrics({
      where: {
        userId,
        type
      }
    })

    if (!unit) {
      res.send(metrics)
      return
    }

    const convertedMetrics = convertMetrics(metrics, unit)

    res.send(convertedMetrics)
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }

  return
}

export async function getChartData(req: Request, res: Response) {
  const input = getChartDataSchema.safeParse(req.query)

  if (!input.success) {
    res.status(400).send({ error: input.error.errors })
    return
  }

  const { id: userId } = req.user
  const { type, datePeriod, unit } = input.data
  const [startDate, endDate] = getDatesFromDatePeriod(datePeriod)

  try {
    const metrics = await findMetrics({
      where: {
        userId,
        type,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    const chartData = getDataForChart(metrics, unit)

    res.send(chartData)
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }

  return
}
