import { beforeEach, describe, expect, it } from 'vitest'
import { isEqual } from 'lodash'
import { Game } from '~/core/game/game'
import { Move } from '~/core/moves/move'
import { Bishop } from '~/core/pieces/bishop'
import { Knight } from '~/core/pieces/knight'
import type { IBoard, IPiece, IPlayer, Position } from '~/core/types'

describe('Moves', () => {
  let game: Game
  let board: IBoard
  let player1: IPlayer
  let player2: IPlayer
  describe('Pawn Moves', () => {
    beforeEach(() => {
      game = new Game()
      game.initializeGame()
      board = game.board
      player1 = game.players[0]
      player2 = game.players[1]
    })
    it('A pawn can move vertically from one square', () => {
      const piece: IPiece = board.getPieceAt({
        x: 0,
        y: 1,
      })! // Assuming this is a white pawn
      const startPosition: Position = {
        x: 0,
        y: 1,
      }
      const endPosition: Position = {
        x: 0,
        y: 2,
      }
      const result = player1.makeMove(
        new Move(piece, startPosition, endPosition),
        game
      )
      expect(result).toBe(true)
    })
    it('A pawn can move vertically from two squares if has not moved', () => {
      const piece: IPiece = board.getPieceAt({
        x: 0,
        y: 1,
      })! // Assuming this is a white pawn
      const startPosition: Position = {
        x: 0,
        y: 1,
      }
      const endPosition: Position = {
        x: 0,
        y: 3,
      }
      const move = new Move(piece, startPosition, endPosition)
      const result = player1.makeMove(move, game)
      expect(result).toBe(true)
    })

    it('can not move unless it is the current player', () => {
      const blackPiece: IPiece = board.getPieceAt({
        x: 0,
        y: 6,
      })! // Assuming this is a black pawn
      const endPosition: Position = {
        x: 0,
        y: 5,
      }
      const move = new Move(blackPiece, blackPiece.position, endPosition)
      const result = player1.makeMove(move, game)
      expect(result).toBe(false)
    })

    it('a player can not play twice', () => {
      const e4 = new Move(
        board.getPieceAt({
          x: 4,
          y: 1,
        })!,
        {
          x: 4,
          y: 1,
        },
        {
          x: 4,
          y: 3,
        }
      )
      const d5 = new Move(
        board.getPieceAt({
          x: 3,
          y: 6,
        })!,
        {
          x: 3,
          y: 6,
        },
        {
          x: 3,
          y: 4,
        }
      )

      const falseMove = new Move(
        board.getPieceAt({
          x: 4,
          y: 6,
        })!,
        {
          x: 4,
          y: 6,
        },
        {
          x: 4,
          y: 5,
        }
      ) // this is a black pawn

      const firstMove = player1.makeMove(e4, game)
      const secondMove = player1.makeMove(d5, game)
      expect(firstMove).toBe(true)
      expect(secondMove).toBe(true)
      expect(player1.makeMove(falseMove, game)).toBe(false)
    })

    it('cannot move forward if the square is occupied', () => {
      const e4 = new Move(
        board.getPieceAt({
          x: 4,
          y: 1,
        })!,
        {
          x: 4,
          y: 1,
        },
        {
          x: 4,
          y: 3,
        }
      )
      expect(player1.makeMove(e4, game)).toBe(true)
      const e5 = new Move(
        board.getPieceAt({
          x: 4,
          y: 6,
        })!,
        {
          x: 4,
          y: 6,
        },
        {
          x: 4,
          y: 4,
        }
      )
      expect(player2.makeMove(e5, game)).toBe(true)

      const blockedPawn = new Move(
        board.getPieceAt({
          x: 4,
          y: 3,
        })!,
        {
          x: 4,
          y: 3,
        },
        {
          x: 4,
          y: 4,
        }
      )

      expect(player1.makeMove(blockedPawn, game)).toBe(false)
    })

    it('can move diagonally if there is an enemy piece', () => {
      const e4 = new Move(
        board.getPieceAt({
          x: 4,
          y: 1,
        })!,
        {
          x: 4,
          y: 1,
        },
        {
          x: 4,
          y: 3,
        }
      )
      expect(player1.makeMove(e4, game)).toBe(true)
      const d5 = new Move(
        board.getPieceAt({
          x: 3,
          y: 6,
        })!,
        {
          x: 3,
          y: 6,
        },
        {
          x: 3,
          y: 4,
        }
      )
      expect(player2.makeMove(d5, game)).toBe(true)

      const exd5 = new Move(
        board.getPieceAt({
          x: 4,
          y: 3,
        })!,
        {
          x: 4,
          y: 3,
        },
        {
          x: 3,
          y: 4,
        }
      )

      const exf5 = new Move(
        board.getPieceAt({
          x: 4,
          y: 3,
        })!,
        {
          x: 4,
          y: 3,
        },
        {
          x: 5,
          y: 4,
        }
      )

      expect(player1.makeMove(exf5, game)).toBe(false) // there is no piece at f5
      expect(player1.makeMove(exd5, game)).toBe(true) // there is a piece at e5
      expect(
        board.getPieceAt({
          x: 3,
          y: 4,
        })?.color
      ).toBe('white')
    })
  })
  describe('Knight', () => {
    beforeEach(() => {
      game = new Game()
      game.initializeGame()
      board = game.board
      player1 = game.players[0]
      player2 = game.players[1]
    })

    it('getPossibleMoves should return valid moves for a knight', () => {
      const knight = new Knight('white', { x: 4, y: 4 })
      board.setPieceAt({ x: 4, y: 4 }, knight)
      const possibleMoves = knight.getPossibleMoves(board)
      expect(possibleMoves.length).toBe(8)
    })

    it('should have two possible moves at game start', () => {
      const knightMoves = game.board
        .getPieceAt({ x: 1, y: 0 })
        ?.getPossibleMoves(game.board)
      expect(knightMoves?.length).toBe(2)
      expect(knightMoves?.[0].endPosition).toEqual({ x: 2, y: 2 })
      expect(knightMoves?.[1].endPosition).toEqual({ x: 0, y: 2 })
    })

    it('should not be able to move to a square occupied by a friendly piece', () => {
      const knight = new Knight('white', { x: 4, y: 4 })
      const friendlyPiece = new Knight('white', { x: 2, y: 3 })
      board.setPieceAt({ x: 4, y: 4 }, knight)
      board.setPieceAt({ x: 2, y: 3 }, friendlyPiece)

      const possibleMoves = knight.getPossibleMoves(board)
      expect(
        possibleMoves.some((move) => isEqual(move.endPosition, { x: 2, y: 3 }))
      ).toBe(false)
    })

    it('should be able to capture an enemy piece', () => {
      const knight = new Knight('white', { x: 4, y: 4 })
      const enemyPiece = new Knight('black', { x: 2, y: 3 })
      board.setPieceAt({ x: 4, y: 4 }, knight)
      board.setPieceAt({ x: 2, y: 3 }, enemyPiece)

      const possibleMoves = knight.getPossibleMoves(board)
      expect(
        possibleMoves.some((move) => isEqual(move.endPosition, { x: 2, y: 3 }))
      ).toBe(true)
    })

    it('should not be able to move off the board', () => {
      const knight = new Knight('white', {
        x: 0,
        y: 0,
      })
      board.setPieceAt(
        {
          x: 0,
          y: 0,
        },
        knight
      )

      const possibleMoves = knight.getPossibleMoves(board)
      const offBoardPositions = [
        {
          x: -1,
          y: -2,
        },
        {
          x: -1,
          y: 2,
        },
        {
          x: 1,
          y: -2,
        },
      ]

      offBoardPositions.forEach((position) => {
        expect(
          possibleMoves.some((move) => isEqual(move.endPosition, position))
        ).toBe(false)
      })
    })
  })
  describe('Bishop', () => {
    beforeEach(() => {
      game = new Game()
      board = game.board
      player2 = game.players[1]
    })
    it('getPossibleMoves should return valid moves for a bishop', () => {
      const bishop = new Bishop('white', { x: 4, y: 4 })
      board.setPieceAt({ x: 4, y: 4 }, bishop)
      const possibleMoves = bishop.getPossibleMoves(board)
      expect(possibleMoves.length).toBe(13)
    })

    it('should not be able to move to a square occupied by a friendly piece', () => {
      const bishop = new Bishop('white', { x: 4, y: 4 })
      const friendlyPiece = new Knight('white', { x: 6, y: 6 })
      board.setPieceAt({ x: 4, y: 4 }, bishop)
      board.setPieceAt({ x: 6, y: 6 }, friendlyPiece)

      const possibleMoves = bishop.getPossibleMoves(board)
      expect(
        possibleMoves.some((move) => isEqual(move.endPosition, { x: 6, y: 6 }))
      ).toBe(false)
    })

    it('should be able to capture an enemy piece', () => {
      const bishop = new Bishop('white', { x: 4, y: 4 })
      const enemyPiece = new Knight('black', { x: 6, y: 6 })
      board.setPieceAt({ x: 4, y: 4 }, bishop)
      board.setPieceAt({ x: 6, y: 6 }, enemyPiece)

      const possibleMoves = bishop.getPossibleMoves(board)
      expect(
        possibleMoves.some((move) => isEqual(move.endPosition, { x: 6, y: 6 }))
      ).toBe(true)
    })

    it('should not be able to move off the board', () => {
      const bishop = new Bishop('white', { x: 0, y: 0 })
      board.setPieceAt({ x: 0, y: 0 }, bishop)

      const possibleMoves = bishop.getPossibleMoves(board)
      const offBoardPositions = [
        { x: -1, y: -1 },
        { x: 1, y: -1 },
      ]

      offBoardPositions.forEach((position) => {
        expect(
          possibleMoves.some((move) => isEqual(move.endPosition, position))
        ).toBe(false)
      })
    })

    it('should stop moving when an enemy piece is captured', () => {
      const bishop = new Bishop('white', { x: 4, y: 4 })
      const enemyPiece = new Knight('black', { x: 6, y: 6 })
      board.setPieceAt({ x: 4, y: 4 }, bishop)
      board.setPieceAt({ x: 6, y: 6 }, enemyPiece)

      const possibleMoves = bishop.getPossibleMoves(board)
      expect(
        possibleMoves.some((move) => isEqual(move.endPosition, { x: 7, y: 7 }))
      ).toBe(false)
    })
  })
})
