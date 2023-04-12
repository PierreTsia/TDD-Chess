import { describe, expect, it } from 'vitest'
import { Game } from '~/core/game/game'
import { Move } from '~/core/moves/move'
import { King } from '~/core/pieces/king'
import { Queen } from '~/core/pieces/queen'
import type { IGame} from '~/core/types'
import { isStartingPositionCorrect } from '~/core/game/helpers'

describe('Chess Game', () => {
  describe('Game Initialization', () => {
    it('should set up the board with the correct starting position', () => {
      const game: IGame = new Game()
      game.initializeGame()
      expect(isStartingPositionCorrect(game.board)).toBe(true)
    })
  })

  describe('Check', () => {
    it('should detect check', () => {
      const game = new Game()
      const [_, player2] = game.players

      // Set up board for check scenario
      game.board.setPieceAt({ x: 0, y: 0 }, new King('white', { x: 0, y: 0 }))
      game.board.setPieceAt({ x: 4, y: 7 }, new King('black', { x: 4, y: 7 }))
      game.board.setPieceAt({ x: 3, y: 2 }, new Queen('black', { x: 3, y: 2 }))

      game.currentPlayer = game.players[1]

      expect(game.status).toBe('ongoing')

      const checkMove = new Move(
        game.board.getPieceAt({ x: 3, y: 2 })!,
        { x: 3, y: 2 },
        { x: 0, y: 2 },
        null
      )
      player2.makeMove(checkMove, game)

      expect(game.status).toBe('check')
    })
  })
})
