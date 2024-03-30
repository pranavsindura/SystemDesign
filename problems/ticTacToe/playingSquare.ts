import { type IPlayer } from "./player";

export interface IPlayingSquare {
  isOccupied: () => boolean;
  getPlayer: () => IPlayer | null;
  setPlayer: (player: IPlayer) => void;
}

export class PlayingSquare implements IPlayingSquare {
  private player: IPlayer | null;

  constructor() {
    this.player = null;
  }

  isOccupied(): boolean {
    return this.player != null;
  }

  getPlayer(): IPlayer | null {
    return this.player;
  }

  setPlayer(player: IPlayer): void {
    this.player = player;
  }
}
