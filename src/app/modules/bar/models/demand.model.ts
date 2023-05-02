import { DemandTypes } from "../enums/demand-types.enum";

export interface Demand {
  coinsId: number,
  date: string,
  tableNumber: number,
  prizeName: string,
  state: DemandTypes
}