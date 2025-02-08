import z from 'zod'
import { DATE_INVALID, TYPE_INVALID, UNIT_INVALID } from '../error-messages.ts'
import { getTypeOfUnit, isUnitMatchType, isValidDate, isValidType, isValidUnit } from '../helpers'
import isNil from 'lodash/fp/isNil'

const numberSchema = z.union([
  z
    .string()
    .transform(value => parseInt(value))
    .refine(value => typeof value === 'number'),
  z.number()
])

export const addMetricSchema = z
  .object({
    value: z.number(),
    unit: z.string(),
    date: z.string().refine(value => isValidDate(value), { message: DATE_INVALID })
  })
  .refine(data => isValidUnit(data.unit), { message: UNIT_INVALID })
export type AddMetricInput = z.infer<typeof addMetricSchema>

export const getMetricsSchema = z
  .object({
    type: numberSchema.refine(value => isValidType(value), { message: TYPE_INVALID }),
    unit: z.string().nullable().optional()
  })
  .refine(data => isNil(data.unit) || isUnitMatchType(data.unit, data.type), { message: UNIT_INVALID })
export type GetMetricsInput = z.infer<typeof getMetricsSchema>
