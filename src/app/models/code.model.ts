import { Prize } from "./prize.model"

export interface Code {
  id: number,
  matchId: number,
  startDate: string,
  endDate: string,
  code: string,
  points: number,
  prize: Prize,
  perPerson: boolean,
  oneUse: boolean,
  active: boolean,
  state: string,
  closeable: boolean,
  editable: boolean,
  game: number,
}