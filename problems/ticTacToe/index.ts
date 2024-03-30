/*
 * Questions?
 *  - How many players?
 *  - Board Size?
 *
 * Objects
 *  - Square
 *  - Board
 *  - Player
 *  - Game
 * */

import { Game } from "./game";
import { Player } from "./player";
import { PlayerSymbol } from "./playerSymbol";

async function ticTacToe(): Promise<void> {
  const player1 = new Player("Pranav", PlayerSymbol.CROSS);
  const player2 = new Player("Kartik", PlayerSymbol.NAUGHT);
  const game = new Game(3, [player1, player2]);
  await game.startGame();
}

export default ticTacToe;
