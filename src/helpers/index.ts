import isNaN from 'lodash/fp/isNaN'
import { DATE_PERIOD_REGEX, DATE_REGEX, TYPE, TYPE_VALUES, UNIT_VALUES } from '../constants'

export function isValidType(type: number): boolean {
  return TYPE_VALUES.includes(type)
}

export function isValidUnit(unit: string): boolean {
  return UNIT_VALUES.includes(unit)
}

export function getTypeOfUnit(unit: string): number | undefined {
  return Object.values(TYPE).find(type => type.UNITS.includes(unit))?.VALUE
}

export function isUnitMatchType(unit: string, type: number): boolean {
  return getTypeOfUnit(unit) === type
}

export function isValidDate(date: string): boolean {
  if (!DATE_REGEX.test(date)) {
    return false
  }

  const dateObj = new Date(date)

  return !isNaN(dateObj.getTime())
}

export function isValidDatePeriod(datePeriod: string): boolean {
  if (!DATE_PERIOD_REGEX.test(datePeriod)) {
    return false
  }

  const [startDate, endDate] = getDatesFromDatePeriod(datePeriod)

  return !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate <= endDate
}

export function getDatesFromDatePeriod(datePeriod: string): [Date, Date] {
  const [startDate, endDate] = datePeriod.split(',')
  const startDateObj = new Date(startDate)
  const endDateObj = new Date(endDate)

  return [startDateObj, endDateObj]
}
