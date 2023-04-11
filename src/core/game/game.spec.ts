import { describe, expect, it } from 'vitest'
import { Game } from '~/core/game/game'
import type { IGame } from '~/core/types'
import { isStartingPositionCorrect } from '~/core/game/helpers'

describe('Chess Game', () => {
  describe('Game Initialization', () => {
    it('should set up the board with the correct starting position', () => {
      const game: IGame = new Game()
      game.initializeGame()

      // Check the starting positions of pieces on the board
      // You can use helper functions to assert the position of each piece type
      expect(isStartingPositionCorrect(game.board)).toBe(true)
    })
  })



  /*   describe('makeMove', () => {
    it('should make a valid move with a pawn', () => {
      // Initialize a new Game and set the starting position
      const game: IGame = new Game();
      game.initializeGame();
      game.startGame();

      // Define a valid pawn move
      const startPosition: Position = { x: 4, y: 1 }; // e2
      const endPosition: Position = { x: 4, y: 2 }; // e3
      const movingPiece = game.board.getPieceAt(startPosition)!;
      const move: IMove = new Move(movingPiece, startPosition, endPosition);

      // Make the move and assert that it was successful
      expect(game.makeMove(move)).toBe(true);

      // Check if the piece was moved to the new position
      expect(game.board.getPieceAt(endPosition)).toBe(movingPiece);
    });
  }); */
})
