import z from 'zod'
import { TYPE, TYPE_VALUES } from '../constants'
import { DATE_INVALID, TYPE_INVALID, UNIT_INVALID } from '../error-messages.ts'
import { isValidDate, isValidType, isValidUnit } from '../helpers'

export const addMetricSchema = z
  .object({
    value: z.number(),
    unit: z.string(),
    date: z.string().refine(value => isValidDate(value), { message: DATE_INVALID })
  })
  .refine(data => isValidUnit(data.unit), { message: UNIT_INVALID })
export type AddMetricInput = z.infer<typeof addMetricSchema>
