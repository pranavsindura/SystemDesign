import { type IPlayer } from "./player";
import { type IPlayingSquare, PlayingSquare } from "./playingSquare";

export interface IPlayingBoard {
  getSize: () => number;
  getBoard: () => IPlayingSquare[][];
  isEmptySquareAvailable: () => boolean;
  getWinnerPlayer: () => IPlayer | null;
  setSymbol: (row: number, col: number, player: IPlayer) => void;
  print: () => void;
}

export class PlayingBoard implements IPlayingBoard {
  private readonly size: number;
  private readonly board: IPlayingSquare[][];
  private emptySquareCount: number;

  constructor(size: number) {
    this.size = size;
    this.board = [];
    for (let i = 0; i < this.size; i++) {
      this.board.push([]);
      for (let j = 0; j < this.size; j++) {
        this.board[i].push(new PlayingSquare());
      }
    }
    this.emptySquareCount = this.size * this.size;
  }

  private isValidPosition(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.size &&
      col >= 0 &&
      col < this.size &&
      !this.board[row][col].isOccupied()
    );
  }

  getSize(): number {
    return this.size;
  }

  getBoard(): IPlayingSquare[][] {
    return this.board;
  }

  isEmptySquareAvailable(): boolean {
    return this.emptySquareCount > 0;
  }

  getWinnerPlayer(): IPlayer | null {
    const playerCount = new Map<IPlayer, number>();

    // check each row
    for (let i = 0; i < this.size; i++) {
      playerCount.clear();
      for (let j = 0; j < this.size; j++) {
        const player = this.board[i][j].getPlayer();
        if (player == null) {
          break;
        }
        const count = (playerCount.get(player) ?? 0) + 1;
        if (count === this.size) {
          return player;
        }
        playerCount.set(player, count);
      }
    }

    // check each column
    for (let i = 0; i < this.size; i++) {
      playerCount.clear();
      for (let j = 0; j < this.size; j++) {
        const player = this.board[j][i].getPlayer();
        if (player == null) {
          break;
        }
        const count = (playerCount.get(player) ?? 0) + 1;
        if (count === this.size) {
          return player;
        }
        playerCount.set(player, count);
      }
    }

    // check left diagonal
    playerCount.clear();
    for (let i = 0; i < this.size; i++) {
      const player = this.board[i][i].getPlayer();
      if (player == null) {
        break;
      }
      const count = (playerCount.get(player) ?? 0) + 1;
      if (count === this.size) {
        return player;
      }
      playerCount.set(player, count);
    }

    // check right diagonal
    playerCount.clear();
    for (let i = 0; i < this.size; i++) {
      const player = this.board[this.size - i - 1][i].getPlayer();
      if (player == null) {
        break;
      }
      const count = (playerCount.get(player) ?? 0) + 1;
      if (count === this.size) {
        return player;
      }
      playerCount.set(player, count);
    }

    return null;
  }

  setSymbol(row: number, col: number, player: IPlayer): void {
    if (!this.isValidPosition(row, col)) {
      throw new Error("position is invalid or occupied");
    }

    this.board[row][col].setPlayer(player);
    this.emptySquareCount -= 1;
  }

  print(): void {
    for (let i = 0; i < this.size; i++) {
      let row = "";
      let separator = "";

      for (let j = 0; j < this.size; j++) {
        row += j > 0 ? "|" : "";
        separator += j > 0 ? "-" : "";
        row += " ";
        row += this.board[i][j].getPlayer()?.getSymbol() ?? " ";
        row += " ";
        separator += "---";
      }

      if (i > 0) {
        console.log(separator);
      }
      console.log(row);
    }
  }
}
