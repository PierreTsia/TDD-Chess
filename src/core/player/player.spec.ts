import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Game } from '~/core/game/game'
import { Move } from '~/core/moves/move'
import type { IBoard, IPiece, IPlayer, Position } from '~/core/types'

describe('Player', () => {
  let game: Game
  let board: IBoard
  let player1: IPlayer
  let player2: IPlayer

  beforeEach(() => {
    game = new Game()
    game.initializeGame()
    board = game.board
    player1 = game.players[0]
    player2 = game.players[1]
  })

  it('should make a valid move and update the game state', () => {
    // Set up the initial state

    const switchPlayerSpy = vi.spyOn(game, 'switchPlayer')
    const moveHistorySpy = vi.spyOn(game.moveHistory, 'addMove')
    const piece: IPiece = board.getPieceAt({ x: 0, y: 6 })! // Assuming this is a white pawn
    const startPosition: Position = { x: 0, y: 6 }
    const endPosition: Position = { x: 0, y: 4 }

    expect(game.currentPlayer).toBe(player1)

    const move = new Move(piece, startPosition, endPosition)
    const result = player1.makeMove(move, game)

    expect(result).toBe(true)
    expect(board.getPieceAt(endPosition)).toBe(piece)
    expect(board.getPieceAt(startPosition)).toBeNull()

    expect(switchPlayerSpy).toHaveBeenCalled()
    expect(moveHistorySpy).toHaveBeenCalledWith(move)

    expect(game.currentPlayer).not.toBe(player1)
    expect(game.currentPlayer).toBe(player2)
  })
})
