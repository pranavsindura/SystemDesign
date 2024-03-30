import readline from "node:readline/promises";
import { type IPlayer } from "./player";
import { type IPlayingBoard, PlayingBoard } from "./playingBoard";

export class Game {
  private readonly board: IPlayingBoard;
  private readonly players: IPlayer[];
  nextPlayerIndex: number;

  constructor(boardSize: number, players: IPlayer[]) {
    this.board = new PlayingBoard(boardSize);
    this.players = players;
    this.nextPlayerIndex = 0;
  }

  async startGame(): Promise<void> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    while (true) {
      this.board.print();
      const winner = this.board.getWinnerPlayer();
      if (winner != null) {
        console.log(
          "Player",
          winner.getName(),
          `(${winner.getSymbol()})`,
          "won!",
        );
        rl.close();
        return;
      } else if (!this.board.isEmptySquareAvailable()) {
        console.log("Game is tie!");
        rl.close();
        return;
      }

      const player = this.players[this.nextPlayerIndex];

      try {
        const answer = await rl.question(
          `Player ${player.getName()}(${player.getSymbol()}), choose your square (row col)\n`,
        );
        const [row, col] = answer.split(" ").map(Number);
        this.board.setSymbol(row, col, player);
        this.nextPlayerIndex = (this.nextPlayerIndex + 1) % this.players.length;
      } catch (err) {
        console.error(err?.toString());
      }
    }
  }
}
