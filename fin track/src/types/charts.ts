// Chart-related type definitions
export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

export interface TimeSeriesDataPoint {
  month: string
  income: number
  expenses: number
  net: number
}

export interface TooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color?: string
    dataKey: string
  }>
  label?: string
}

export interface ChartConfig {
  dataKey: string
  color: string
  name: string
}
