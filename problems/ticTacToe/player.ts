import { type PlayerSymbol } from "./playerSymbol";

export interface IPlayer {
  getName: () => string;
  getSymbol: () => PlayerSymbol;
}

export class Player implements IPlayer {
  name: string;
  symbol: PlayerSymbol;

  constructor(name: string, symbol: PlayerSymbol) {
    this.name = name;
    this.symbol = symbol;
  }

  getName(): string {
    return this.name;
  }

  getSymbol(): PlayerSymbol {
    return this.symbol;
  }
}
