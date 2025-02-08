import { Prisma } from '@prisma/client'
import prisma from '../services/database'

export async function createMetric(input: Prisma.MetricCreateInput) {
  return prisma.metric.create({
    data: input
  })
}

export async function getMetrics(input: Prisma.MetricFindManyArgs) {
  return prisma.metric.findMany(input)
}

export async function findFirstMetrics(input: Prisma.MetricFindFirstArgs) {
  if (!input.where || !Object.keys(input.where).length) {
    return null
  }

  return prisma.metric.findFirst(input)
}
