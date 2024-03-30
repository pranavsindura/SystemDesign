import readline from "node:readline/promises";
import { type Game } from "./game";

export interface GameState {
  startGame: (game: Game) => void;
  turn: (game: Game) => Promise<void>;
  printResult: (game: Game) => void;
}

export class GameYetToStartState implements GameState {
  startGame(game: Game): void {
    game.setState(game.getTurnState());
  }

  async turn(): Promise<void> {
    console.log("game has not yet started");
  }

  printResult(): void {
    console.log("game has not yet started");
  }
}

export class GameTurnState implements GameState {
  private readonly input: readline.Interface;

  constructor() {
    this.input = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  startGame(): void {
    console.log("game is already in progress");
  }

  async turn(game: Game): Promise<void> {
    while (true) {
      game.getBoard().print();
      const winner = game.getBoard().getWinnerPlayer();

      if (winner != null) {
        game.setWinner(winner);
        this.input.close();
        game.setState(game.getWonState());
        return;
      }

      if (!game.getBoard().isEmptySquareAvailable()) {
        this.input.close();
        game.setState(game.getTieState());
        return;
      }

      const player = game.getPlayers()[game.getNextPlayerIndex()];

      try {
        const answer = await this.input.question(
          `Player ${player.getName()}(${player.getSymbol()}), choose your square (row col)\n`,
        );
        const [row, col] = answer.split(" ").map(Number);
        game.getBoard().setSymbol(row, col, player);
        game.setNextPlayerIndex(
          (game.getNextPlayerIndex() + 1) % game.getPlayers().length,
        );
      } catch (err) {
        console.error(err);
      }
    }
  }

  printResult(): void {
    console.log("game is in progress");
  }
}

export class GameWonState implements GameState {
  startGame(): void {
    console.log("game has ended");
  }

  async turn(): Promise<void> {
    console.log("game has ended");
  }

  printResult(game: Game): void {
    const winner = game.getWinner();
    if (winner == null) {
      throw new Error(
        "winner is null in won state, there was a wrong state transition",
      );
    }
    console.log("Player", winner.getName(), `(${winner.getSymbol()})`, "won!");
  }
}

export class GameTieState implements GameState {
  startGame(): void {
    console.log("game has ended");
  }

  async turn(): Promise<void> {
    console.log("game has ended");
  }

  printResult(): void {
    console.log("Game is tie!");
  }
}
