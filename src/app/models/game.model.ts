import { GameType } from "./game-type.model";

export interface Game {
    id?: number,
    name: string;
    rules: string;
    points: number;
    active?: boolean;
    bar?: number;
    gameType?: GameType;
    type?: string;
    openTime?: string;
    closeTime?: string;
  }