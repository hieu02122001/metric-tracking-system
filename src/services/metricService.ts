import { Prisma, Metric } from '@prisma/client'
import prisma from '../services/database'
import { getTypeOfUnit } from '../helpers'
import { DISTANCE_CONVERSIONS, TYPE } from '../constants'
import get from 'lodash/fp/get'

export async function createMetric(input: Prisma.MetricCreateInput) {
  return prisma.metric.create({
    data: input
  })
}

export async function findMetrics(input: Prisma.MetricFindManyArgs) {
  return prisma.metric.findMany(input)
}

export async function findFirstMetrics(input: Prisma.MetricFindFirstArgs) {
  if (!input.where || !Object.keys(input.where).length) {
    return null
  }

  return prisma.metric.findFirst(input)
}

export function convertMetrics(metrics: Metric[], unit: string) {
  const type = getTypeOfUnit(unit)

  const convertFunction = type === TYPE.DISTANCE.VALUE ? convertDistance : convertTemperature

  return metrics.map(metric => {
    return {
      ...metric,
      value: convertFunction(metric.value, metric.unit, unit),
      unit
    }
  })
}

function convertDistance(value: number, from: string, to: string): number {
  const conversions = DISTANCE_CONVERSIONS
  // Convert the value to the base unit (meters)
  const baseValue = value / get(from, conversions)
  // Convert the base value to the target unit
  return baseValue * get(to, conversions)
}

function convertTemperature(value: number, from: string, to: string) {
  // define constant for 273.15
  const KELVIN = 273.15
  // Convert the value to the base unit (Celsius)
  let baseValue
  switch (from) {
    case 'F':
      // C = (5/9) * (F - 32)
      baseValue = (5 / 9) * (value - 32)
      break
    case 'K':
      baseValue = value - KELVIN
      break
    default:
      baseValue = value
  }

  // Convert the base value to the target unit
  switch (to) {
    case 'F':
      // F = (C * 9/5) + 32
      return (baseValue * 9) / 5 + 32
    case 'K':
      return baseValue + KELVIN
    default:
      return baseValue
  }
}

export function getDataForChart(metrics: Metric[], unit?: string | null): Metric[] {
  const groupedMetrics = metrics.reduce((acc, metric) => {
    const date = metric.date.toISOString().split('T')[0]

    if (!acc[date] || acc[date].date < metric.date) {
      acc[date] = metric
    }

    return acc
  }, {} as Record<string, Metric>)

  if (!unit) {
    return Object.values(groupedMetrics)
  }

  return convertMetrics(Object.values(groupedMetrics), unit)
}
