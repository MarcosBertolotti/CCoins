import { Table } from "./table.model";

export interface PartyTableInfo extends Table {
  partyId: number,
  partyName: string,
  partyActive: boolean,
}