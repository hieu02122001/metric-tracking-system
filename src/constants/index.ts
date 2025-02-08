export const TYPE = {
  DISTANCE: {
    VALUE: 1,
    UNITS: ['m', 'cm', 'in', 'ft', 'yd']
  },
  TEMPERATURE: {
    VALUE: 2,
    UNITS: ['C', 'F', 'K']
  }
}

export const TYPE_VALUES = Object.values(TYPE).map(type => type.VALUE)
export const UNIT_VALUES = Object.values(TYPE).flatMap(type => type.UNITS)

export const DATE_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'
