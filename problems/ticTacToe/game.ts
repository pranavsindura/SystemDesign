import { type IPlayer } from "./player";
import { type IPlayingBoard, PlayingBoard } from "./playingBoard";
import {
  type GameState,
  GameTurnState,
  GameYetToStartState,
  GameWonState,
  GameTieState,
} from "./gameState";

export class Game {
  private readonly board: IPlayingBoard;
  private readonly players: IPlayer[];
  private nextPlayerIndex: number;
  private gameState: GameState;
  private readonly gameYetToStartState: GameState;
  private readonly gameTurnState: GameState;
  private readonly gameTieState: GameTieState;
  private readonly gameWonState: GameWonState;
  private winner: IPlayer | null;

  constructor(boardSize: number, players: IPlayer[]) {
    this.board = new PlayingBoard(boardSize);
    this.players = players;
    this.nextPlayerIndex = 0;
    this.gameYetToStartState = new GameYetToStartState();
    this.gameTurnState = new GameTurnState();
    this.gameWonState = new GameWonState();
    this.gameTieState = new GameTieState();
    this.gameState = this.gameYetToStartState;
    this.winner = null;
  }

  setState(state: GameState): void {
    this.gameState = state;
  }

  getTieState(): GameState {
    return this.gameTieState;
  }

  getWonState(): GameState {
    return this.gameWonState;
  }

  getYetToStartState(): GameState {
    return this.gameYetToStartState;
  }

  getTurnState(): GameState {
    return this.gameTurnState;
  }

  setNextPlayerIndex(nextPlayerIndex: number): void {
    this.nextPlayerIndex = nextPlayerIndex;
  }

  getNextPlayerIndex(): number {
    return this.nextPlayerIndex;
  }

  getPlayers(): IPlayer[] {
    return this.players;
  }

  getBoard(): IPlayingBoard {
    return this.board;
  }

  setWinner(winner: IPlayer): void {
    this.winner = winner;
  }

  getWinner(): IPlayer | null {
    return this.winner;
  }

  async startGame(): Promise<void> {
    this.gameState.startGame(this);
    await this.gameState.turn(this);
  }

  printResult(): void {
    this.gameState.printResult(this);
  }
}
