export interface Table {
    id: number,
    number: number,
    active: boolean,
    bar: number,
    qrCode: string,
    code: string,
    startDate: any, // Date | number[]
//
    partyId?: number,
    partyName?: string,
    partyActive?: boolean,
}