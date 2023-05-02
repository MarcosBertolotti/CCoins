import { Demand } from "./demand.model";

export interface DemandReport {
  code: string,
  data: Demand[]
  message: string,
}