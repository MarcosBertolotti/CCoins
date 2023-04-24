export interface CoinsReport {
  totalCoins: number,
  report: {
    content: {
      coinsId: number,
      date: string,
      coins: number,
      activity: string,
      client: string,
      state: string,
    }[],
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