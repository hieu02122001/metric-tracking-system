import isNaN from 'lodash/fp/isNaN'
import { DATE_REGEX, TYPE, TYPE_VALUES, UNIT_VALUES } from '../constants'

export function isValidType(type: number): boolean {
  return TYPE_VALUES.includes(type)
}

export function isValidUnit(unit: string): boolean {
  return UNIT_VALUES.includes(unit)
}

export function getTypeOfUnit(unit: string): number | undefined {
  return Object.values(TYPE).find(type => type.UNITS.includes(unit))?.VALUE
}

export function isValidDate(date: string): boolean {
  if (!DATE_REGEX.test(date)) {
    return false
  }

  const dateObj = new Date(date)

  return !isNaN(dateObj.getTime())
}
