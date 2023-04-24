import { CoinsRegister } from "./coins-register.model"

export interface CoinsReport {
  totalCoins: number,
  report: {
    content: CoinsRegister[],
    empty: boolean,
    first: boolean
    last: boolean
    number: number
    numberOfElements: number
    size: number
    sort: { empty: boolean, sorted: boolean, unsorted: boolean }
    totalElements: number
    totalPages: number
  },
}