export interface Prize {
  id?: number,
  name: string,
  points: number,
  startDate?: any // Date | number[]
  endDate?: any // Date | number[]
  active: boolean,
  bar: number,
}