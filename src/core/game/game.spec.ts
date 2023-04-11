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



})
