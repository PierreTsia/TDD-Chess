import { beforeEach, describe, expect, it } from 'vitest'
import { isEqual } from 'lodash'
import { Board } from '~/core/board/board'
import { Game } from '~/core/game/game'
import { Move } from '~/core/moves/move'
import { Bishop } from '~/core/pieces/bishop'
import { King } from '~/core/pieces/king'
import { Knight } from '~/core/pieces/knight'
import { Pawn } from '~/core/pieces/pawn'
import { Queen } from '~/core/pieces/queen'
import { Rook } from '~/core/pieces/rook'
import type { IBoard, IMove, IPiece, IPlayer, Position } from '~/core/types'
import { d5, e4, e5, exd5, exf5 } from '~/core/game/helpers'

describe('Pieces Base Moves', () => {
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
        y: 6,
      })! // Assuming this is a white pawn
      const startPosition: Position = {
        x: 0,
        y: 6,
      }
      const endPosition: Position = {
        x: 0,
        y: 5,
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
        y: 6,
      })! // Assuming this is a white pawn
      const startPosition: Position = {
        x: 0,
        y: 6,
      }
      const endPosition: Position = {
        x: 0,
        y: 4,
      }
      const move = new Move(piece, startPosition, endPosition)
      const result = player1.makeMove(move, game)
      expect(result).toBe(true)
    })

    it('can not move unless it is the current player', () => {
      const blackPiece: IPiece = board.getPieceAt({
        x: 0,
        y: 1,
      })! // Assuming this is a black pawn
      const endPosition: Position = {
        x: 0,
        y: 2,
      }
      const move = new Move(blackPiece, blackPiece.position, endPosition)
      const result = player1.makeMove(move, game)
      expect(result).toBe(false)
    })

    it('a player can not play twice', () => {
      const falseMove = new Move(
        board.getPieceAt({
          x: 3,
          y: 1,
        })!,
        {
          x: 3,
          y: 1,
        },
        {
          x: 3,
          y: 3,
        }
      ) // this is a black pawn

      const firstMove = player1.makeMove(e4(board), game)
      const secondMove = player2.makeMove(d5(board), game)
      expect(firstMove).toBe(true)
      expect(secondMove).toBe(true)
      expect(game.currentPlayer).toBe(player1)
      expect(player2.makeMove(falseMove, game)).toBe(false)
    })

    it('cannot move forward if the square is occupied', () => {
      expect(player1.makeMove(e4(board), game)).toBe(true)

      expect(player2.makeMove(e5(board), game)).toBe(true)

      const blockedPawn = new Move(
        board.getPieceAt({
          x: 4,
          y: 4,
        })!,
        {
          x: 4,
          y: 4,
        },
        {
          x: 4,
          y: 3,
        }
      )

      expect(player1.makeMove(blockedPawn, game)).toBe(false)
    })

    it('can move diagonally if there is an enemy piece', () => {
      expect(player1.makeMove(e4(board), game)).toBe(true)

      expect(player2.makeMove(d5(board), game)).toBe(true)

      expect(player1.makeMove(exf5(board), game)).toBe(false) // there is no piece at f5
      expect(player1.makeMove(exd5(board), game)).toBe(true) // there is a piece at e5
      expect(
        board.getPieceAt({
          x: 3,
          y: 3,
        })?.color
      ).toBe('white')
    })
  })
  describe('Knight', () => {
    beforeEach(() => {
      game = new Game()
      board = game.board
      player1 = game.players[0]
      player2 = game.players[1]
    })

    it('getPossibleMoves should return valid moves for a knight', () => {
      const knight = new Knight('white', {
        x: 4,
        y: 4,
      })
      board.setPieceAt(
        {
          x: 4,
          y: 4,
        },
        knight
      )
      const possibleMoves = knight.getPossibleMoves(board)
      expect(possibleMoves.length).toBe(8)
    })

    it('should have two possible moves at game start', () => {
      game.initializeGame()
      const knightMoves = game.board
        .getPieceAt({
          x: 1,
          y: 7,
        })
        ?.getPossibleMoves(game.board)
      expect(knightMoves?.length).toBe(2)
      expect(knightMoves?.[0].endPosition).toEqual({
        x: 2,
        y: 5,
      })
      expect(knightMoves?.[1].endPosition).toEqual({
        x: 0,
        y: 5,
      })
    })

    it('should not be able to move to a square occupied by a friendly piece', () => {
      const knight = new Knight('white', {
        x: 4,
        y: 4,
      })
      const friendlyPiece = new Knight('white', {
        x: 2,
        y: 3,
      })
      board.setPieceAt(
        {
          x: 4,
          y: 4,
        },
        knight
      )
      board.setPieceAt(
        {
          x: 2,
          y: 3,
        },
        friendlyPiece
      )

      const possibleMoves = knight.getPossibleMoves(board)
      expect(
        possibleMoves.some((move: IMove) =>
          isEqual(move.endPosition, {
            x: 2,
            y: 3,
          })
        )
      ).toBe(false)
    })

    it('should be able to capture an enemy piece', () => {
      const knight = new Knight('white', {
        x: 4,
        y: 4,
      })
      const enemyPiece = new Knight('black', {
        x: 2,
        y: 3,
      })
      board.setPieceAt(
        {
          x: 4,
          y: 4,
        },
        knight
      )
      board.setPieceAt(
        {
          x: 2,
          y: 3,
        },
        enemyPiece
      )

      const possibleMoves = knight.getPossibleMoves(board)
      expect(
        possibleMoves.some((move: IMove) =>
          isEqual(move.endPosition, {
            x: 2,
            y: 3,
          })
        )
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
      const bishop = new Bishop('white', {
        x: 4,
        y: 4,
      })
      board.setPieceAt(
        {
          x: 4,
          y: 4,
        },
        bishop
      )
      const possibleMoves = bishop.getPossibleMoves(board)
      expect(possibleMoves.length).toBe(13)
    })

    it('should not be able to move to a square occupied by a friendly piece', () => {
      const bishop = new Bishop('white', {
        x: 4,
        y: 4,
      })
      const friendlyPiece = new Knight('white', {
        x: 6,
        y: 6,
      })
      board.setPieceAt(
        {
          x: 4,
          y: 4,
        },
        bishop
      )
      board.setPieceAt(
        {
          x: 6,
          y: 6,
        },
        friendlyPiece
      )

      const possibleMoves = bishop.getPossibleMoves(board)
      expect(
        possibleMoves.some((move) =>
          isEqual(move.endPosition, {
            x: 6,
            y: 6,
          })
        )
      ).toBe(false)
    })

    it('should be able to capture an enemy piece', () => {
      const bishop = new Bishop('white', {
        x: 4,
        y: 4,
      })
      const enemyPiece = new Knight('black', {
        x: 6,
        y: 6,
      })
      board.setPieceAt(
        {
          x: 4,
          y: 4,
        },
        bishop
      )
      board.setPieceAt(
        {
          x: 6,
          y: 6,
        },
        enemyPiece
      )

      const possibleMoves = bishop.getPossibleMoves(board)
      expect(
        possibleMoves.some((move) =>
          isEqual(move.endPosition, {
            x: 6,
            y: 6,
          })
        )
      ).toBe(true)
    })

    it('should not be able to move off the board', () => {
      const bishop = new Bishop('white', {
        x: 0,
        y: 0,
      })
      board.setPieceAt(
        {
          x: 0,
          y: 0,
        },
        bishop
      )

      const possibleMoves = bishop.getPossibleMoves(board)
      const offBoardPositions = [
        {
          x: -1,
          y: -1,
        },
        {
          x: 1,
          y: -1,
        },
      ]

      offBoardPositions.forEach((position) => {
        expect(
          possibleMoves.some((move) => isEqual(move.endPosition, position))
        ).toBe(false)
      })
    })

    it('should stop moving when an enemy piece is captured', () => {
      const bishop = new Bishop('white', {
        x: 4,
        y: 4,
      })
      const enemyPiece = new Knight('black', {
        x: 6,
        y: 6,
      })
      board.setPieceAt(
        {
          x: 4,
          y: 4,
        },
        bishop
      )
      board.setPieceAt(
        {
          x: 6,
          y: 6,
        },
        enemyPiece
      )

      const possibleMoves = bishop.getPossibleMoves(board)
      expect(
        possibleMoves.some((move) =>
          isEqual(move.endPosition, {
            x: 7,
            y: 7,
          })
        )
      ).toBe(false)
    })
  })
  describe('Rook', () => {
    beforeEach(() => {
      game = new Game()
      board = game.board
      player2 = game.players[1]
    })

    it('getPossibleMoves should return valid moves for a rook', () => {
      const rook = new Rook('white', {
        x: 4,
        y: 4,
      })
      board.setPieceAt(
        {
          x: 4,
          y: 4,
        },
        rook
      )
      const possibleMoves = rook.getPossibleMoves(board)
      expect(possibleMoves.length).toBe(14)
    })

    it('should not be able to move to a square occupied by a friendly piece', () => {
      const rook = new Rook('white', {
        x: 4,
        y: 4,
      })
      const friendlyPiece = new Knight('white', {
        x: 4,
        y: 6,
      })
      board.setPieceAt(
        {
          x: 4,
          y: 4,
        },
        rook
      )
      board.setPieceAt(
        {
          x: 4,
          y: 6,
        },
        friendlyPiece
      )

      const possibleMoves = rook.getPossibleMoves(board)
      expect(
        possibleMoves.some((move) =>
          isEqual(move.endPosition, {
            x: 4,
            y: 6,
          })
        )
      ).toBe(false)
    })

    it('should be able to capture an enemy piece', () => {
      const rook = new Rook('white', {
        x: 4,
        y: 4,
      })
      const enemyPiece = new Knight('black', {
        x: 4,
        y: 6,
      })
      board.setPieceAt(
        {
          x: 4,
          y: 4,
        },
        rook
      )
      board.setPieceAt(
        {
          x: 4,
          y: 6,
        },
        enemyPiece
      )

      const possibleMoves = rook.getPossibleMoves(board)
      expect(
        possibleMoves.some((move) =>
          isEqual(move.endPosition, {
            x: 4,
            y: 6,
          })
        )
      ).toBe(true)
    })

    it('should not be able to move off the board', () => {
      const rook = new Rook('white', {
        x: 0,
        y: 0,
      })
      board.setPieceAt(
        {
          x: 0,
          y: 0,
        },
        rook
      )

      const possibleMoves = rook.getPossibleMoves(board)
      const offBoardPositions = [
        {
          x: -1,
          y: 0,
        },
        {
          x: 0,
          y: -1,
        },
      ]

      offBoardPositions.forEach((position) => {
        expect(
          possibleMoves.some((move) => isEqual(move.endPosition, position))
        ).toBe(false)
      })
    })

    it('should stop moving when an enemy piece is captured', () => {
      const rook = new Rook('white', {
        x: 4,
        y: 4,
      })
      const enemyPiece = new Knight('black', {
        x: 4,
        y: 6,
      })
      board.setPieceAt(
        {
          x: 4,
          y: 4,
        },
        rook
      )
      board.setPieceAt(
        {
          x: 4,
          y: 6,
        },
        enemyPiece
      )

      const possibleMoves = rook.getPossibleMoves(board)
      expect(
        possibleMoves.some((move) =>
          isEqual(move.endPosition, {
            x: 4,
            y: 7,
          })
        )
      ).toBe(false)
    })
  })
  describe('Queen', () => {
    beforeEach(() => {
      game = new Game()
      board = game.board
      player1 = game.players[0]
      player2 = game.players[1]
    })

    it('getPossibleMoves should return valid moves for a queen', () => {
      const queen = new Queen('white', {
        x: 4,
        y: 4,
      })
      board.setPieceAt(
        {
          x: 4,
          y: 4,
        },
        queen
      )
      const possibleMoves = queen.getPossibleMoves(board)
      expect(possibleMoves.length).toBe(27)
    })

    it('should not be able to move to a square occupied by a friendly piece', () => {
      const queen = new Queen('white', {
        x: 4,
        y: 4,
      })
      const friendlyPiece = new Knight('white', {
        x: 4,
        y: 6,
      })
      board.setPieceAt(
        {
          x: 4,
          y: 4,
        },
        queen
      )
      board.setPieceAt(
        {
          x: 4,
          y: 6,
        },
        friendlyPiece
      )

      const possibleMoves = queen.getPossibleMoves(board)
      expect(
        possibleMoves.some((move) =>
          isEqual(move.endPosition, {
            x: 4,
            y: 6,
          })
        )
      ).toBe(false)
    })

    it('should be able to capture an enemy piece', () => {
      const queen = new Queen('white', {
        x: 4,
        y: 4,
      })
      const enemyPiece = new Knight('black', {
        x: 4,
        y: 6,
      })
      board.setPieceAt(
        {
          x: 4,
          y: 4,
        },
        queen
      )
      board.setPieceAt(
        {
          x: 4,
          y: 6,
        },
        enemyPiece
      )

      const possibleMoves = queen.getPossibleMoves(board)
      expect(
        possibleMoves.some((move) =>
          isEqual(move.endPosition, {
            x: 4,
            y: 6,
          })
        )
      ).toBe(true)
    })

    it('should not be able to moveoff the board', () => {
      const queen = new Queen('white', {
        x: 0,
        y: 0,
      })
      board.setPieceAt(
        {
          x: 0,
          y: 0,
        },
        queen
      )

      const possibleMoves = queen.getPossibleMoves(board)
      const offBoardPositions = [
        {
          x: -1,
          y: 0,
        },
        {
          x: 0,
          y: -1,
        },
        {
          x: -1,
          y: -1,
        },
      ]

      offBoardPositions.forEach((position) => {
        expect(
          possibleMoves.some((move) => isEqual(move.endPosition, position))
        ).toBe(false)
      })
    })

    it('should stop moving when an enemy piece is captured', () => {
      const queen = new Queen('white', {
        x: 4,
        y: 4,
      })
      const enemyPiece = new Knight('black', {
        x: 4,
        y: 6,
      })
      board.setPieceAt(
        {
          x: 4,
          y: 4,
        },
        queen
      )
      board.setPieceAt(
        {
          x: 4,
          y: 6,
        },
        enemyPiece
      )

      const possibleMoves = queen.getPossibleMoves(board)
      expect(
        possibleMoves.some((move) =>
          isEqual(move.endPosition, {
            x: 4,
            y: 7,
          })
        )
      ).toBe(false)
    })
  })
  describe('King', () => {
    it('returns the correct moves for a king in the center of the board', () => {
      const board = new Board()
      const king = new King('white', {
        x: 3,
        y: 3,
      } as Position)

      const moves = king.getPossibleMoves(board)

      expect(moves).toHaveLength(8)
      const movePositions: Array<Position> = moves.map(
        (move) => move.endPosition
      )

      const EXPECTED_POSITIONS = [
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 2, y: 4 },
        { x: 3, y: 2 },
        { x: 3, y: 4 },
        { x: 4, y: 2 },
        { x: 4, y: 3 },
        { x: 4, y: 4 },
      ]
      EXPECTED_POSITIONS.forEach((position) => {
        expect(movePositions).toContainEqual(position)
      })
    })

    it('returns the correct moves when a friendly pieces is blocking', () => {
      const board = new Board()
      const king = new King('white', { x: 4, y: 4 })

      // Add a white pawn in front of the king
      const pawn = new Pawn('white', { x: 4, y: 3 })
      board.setPieceAt(pawn.position, pawn)

      const moves = king.getPossibleMoves(board).map((move) => move.endPosition)

      // The king should only be able to move to the squares that are not occupied by a white piece
      expect(moves).toHaveLength(7)
      expect(moves).not.toContainEqual({ x: 4, y: 3 })
      const expectedMoves = [
        { x: 3, y: 3 },
        { x: 3, y: 4 },
        { x: 3, y: 5 },
        { x: 4, y: 5 },
        { x: 5, y: 3 },
        { x: 5, y: 4 },
        { x: 5, y: 5 },
      ]

      expectedMoves.forEach((position) => {
        expect(moves).toContainEqual(position)
      })
    })

    it('returns correct moves when enemy piece is threatening some squares', () => {
      const board = new Board()
      const king = new King('white', {
        x: 4,
        y: 4,
      })
      // Add a black rook threatening the king's position
      const rook = new Rook('black', {
        x: 4,
        y: 7,
      })
      board.setPieceAt(rook.position, rook)
      const moves = king.getPossibleMoves(board).map((move) => move.endPosition)

      // The king should not be able to move to the square threatened by the black rook
      expect(moves).toHaveLength(6)

      expect(moves).not.toContainEqual({
        x: 4,
        y: 7,
      })
      const expectedMoves = [
        { x: 5, y: 4 },
        { x: 3, y: 4 },
        { x: 5, y: 5 },
        { x: 5, y: 3 },
        { x: 3, y: 5 },
        { x: 3, y: 3 },
      ]

      expectedMoves.forEach((position) => {
        expect(moves).toContainEqual(position)
      })
    })

    it('should be able to capture an enemy piece', () => {
      const game = new Game()
      const player1 = game.players[0]
      const king = new King('white', { x: 4, y: 4 })
      const enemyPiece = new Knight('black', { x: 3, y: 3 })
      game.board.setPieceAt({ x: 4, y: 4 }, king)
      game.board.setPieceAt({ x: 3, y: 3 }, enemyPiece)

      const kingTakesKnight = new Move(king, king.position, enemyPiece.position)
      expect(player1.makeMove(kingTakesKnight, game)).toBe(true)
      expect(game.board.getPieceAt({ x: 3, y: 3 })).toBe(king)
    })

    it('should not be able to capture a piece that is protected', () => {
      const game = new Game()
      const player1 = game.players[0]
      const king = new King('white', { x: 4, y: 4 })
      const enemyPiece = new Knight('black', { x: 3, y: 3 })
      const enemyPiece2 = new Knight('black', { x: 5, y: 5 })
    })
  })
})
