import { Bar } from "./bar-model";
import { GameType } from "./game-type.model";

export interface Game {
    id?: number,
    name: string;
    rules: string;
    points: number;
    active?: boolean;
    bar?: Bar;
    gameType?: GameType;
    startDate?: Date;
    endDate?: Date;
  }