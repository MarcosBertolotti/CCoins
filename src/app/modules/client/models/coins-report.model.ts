export interface CoinsReport {
  totalCoins: number,
  report: {
    coinsId: number,
    date: string,
    coins: number,
    activity: string,
    client: string,
  }[],
}