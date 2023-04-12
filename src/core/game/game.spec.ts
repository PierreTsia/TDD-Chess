import { beforeEach, describe, expect, it } from 'vitest'
import { Game } from '~/core/game/game'
import { Move } from '~/core/moves/move'
import { Bishop } from '~/core/pieces/bishop'
import { King } from '~/core/pieces/king'
import { Queen } from '~/core/pieces/queen'
import { Rook } from '~/core/pieces/rook'
import type { IGame, IPlayer, Position } from '~/core/types'
import {
  Bc4,
  Nc6,
  Nf6,
  Qh5,
  Qxf7,
  e4,
  e5,
  e6,
  f3,
  g4,
  isStartingPositionCorrect,
} from '~/core/game/helpers'

describe('Chess Game', () => {
  describe('Game Initialization', () => {
    it('should set up the board with the correct starting position', () => {
      const game: IGame = new Game()
      game.initializeGame()
      expect(isStartingPositionCorrect(game.board)).toBe(true)
    })
  })

  describe('Check', () => {
    let game: IGame
    let player1: IPlayer
    let player2: IPlayer
    beforeEach(() => {
      game = new Game()
      player1 = game.players[0]
      player2 = game.players[1]
    })
    it('should detect check', () => {
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
    it('should only allow moves defending check', () => {
      // Set up board for check scenario
      game.board.setPieceAt({ x: 0, y: 0 }, new King('white', { x: 0, y: 0 }))
      game.board.setPieceAt({ x: 7, y: 7 }, new Rook('white', { x: 7, y: 7 }))
      game.board.setPieceAt({ x: 4, y: 7 }, new King('black', { x: 4, y: 7 }))
      game.board.setPieceAt({ x: 3, y: 2 }, new Queen('black', { x: 3, y: 2 }))

      game.currentPlayer = game.players[1]

      const checkMove = new Move(
        game.board.getPieceAt({
          x: 3,
          y: 2,
        })!,
        {
          x: 3,
          y: 2,
        },
        {
          x: 0,
          y: 2,
        },
        null
      )
      player2.makeMove(checkMove, game)

      // Player1 is in check
      expect(game.status).toBe('check')

      expect(game.currentPlayer).toBe(player1)

      // Invalid move that doesn't defend against check
      const invalidMove = new Move(
        game.board.getPieceAt({
          x: 7,
          y: 7,
        })!,
        {
          x: 7,
          y: 7,
        },
        {
          x: 7,
          y: 0,
        },
        null
      )

      expect(player1.makeMove(invalidMove, game)).toBe(false)

      expect(game.status).toBe('check')
    })

    it('should allow a player to block the check by moving another piece in between', () => {
      // Set up board for check scenario
      game.board.setPieceAt({ x: 0, y: 0 }, new King('white', { x: 0, y: 0 }))
      game.board.setPieceAt({ x: 4, y: 7 }, new King('black', { x: 4, y: 7 }))
      game.board.setPieceAt({ x: 4, y: 2 }, new Bishop('black', { x: 4, y: 2 }))
      game.board.setPieceAt({ x: 5, y: 2 }, new Rook('white', { x: 5, y: 2 }))

      game.currentPlayer = game.players[1]

      const checkMove = new Move(
        game.board.getPieceAt({ x: 4, y: 2 })!,
        { x: 4, y: 2 },
        { x: 3, y: 3 },
        null
      )
      player2.makeMove(checkMove, game)

      // Player1 is in check
      expect(game.status).toBe('check')

      // Valid move to block the check by moving the rook in between
      const validMove = new Move(
        game.board.getPieceAt({ x: 5, y: 2 })!,
        { x: 5, y: 2 },
        { x: 2, y: 2 },
        null
      )
      expect(player1.makeMove(validMove, game)).toBe(true)
      expect(game.status).toBe('ongoing')
    })

    it('should allow a player to capture the attacking piece to get out of check', () => {
      game.board.setPieceAt({ x: 0, y: 0 }, new King('white', { x: 0, y: 0 }))
      game.board.setPieceAt({ x: 4, y: 7 }, new King('black', { x: 4, y: 7 }))
      game.board.setPieceAt({ x: 4, y: 2 }, new Bishop('black', { x: 4, y: 2 }))
      game.board.setPieceAt({ x: 7, y: 3 }, new Rook('white', { x: 7, y: 3 }))

      game.currentPlayer = game.players[1]

      const checkMove = new Move(
        game.board.getPieceAt({ x: 4, y: 2 })!,
        { x: 4, y: 2 },
        { x: 3, y: 3 },
        null
      )
      player2.makeMove(checkMove, game)

      // Player1 is in check
      expect(game.status).toBe('check')

      // Valid move to capture the attacking piece
      const validMove = new Move(
        game.board.getPieceAt({ x: 7, y: 3 })!,
        { x: 7, y: 3 },
        { x: 3, y: 3 },
        null
      )
      expect(player1.makeMove(validMove, game)).toBe(true)
      expect(game.status).toBe('ongoing')
    })

    it('should allow a player to move their king out of the attack line to get out of check', () => {
      // Set up board for check scenario
      game.board.setPieceAt({ x: 0, y: 0 }, new King('white', { x: 0, y: 0 }))
      game.board.setPieceAt({ x: 4, y: 7 }, new King('black', { x: 4, y: 7 }))
      game.board.setPieceAt({ x: 4, y: 2 }, new Bishop('black', { x: 4, y: 2 }))

      game.currentPlayer = game.players[1]

      const checkMove = new Move(
        game.board.getPieceAt({ x: 4, y: 2 })!,
        { x: 4, y: 2 },
        { x: 3, y: 3 },
        null
      )
      player2.makeMove(checkMove, game)

      // Player1 is in check
      expect(game.status).toBe('check')

      // Valid move to move the king out of the attack line
      const validMove = new Move(
        game.board.getPieceAt({ x: 0, y: 0 })!,
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        null
      )
      expect(player1.makeMove(validMove, game)).toBe(true)
      expect(game.status).toBe('ongoing')
    })
  })

  describe('Checkmate', () => {
    let game: IGame
    // @ts-expect-error blabla
    let player1: IPlayer
    let player2: IPlayer
    beforeEach(() => {
      game = new Game()
      player1 = game.players[0]
      player2 = game.players[1]
    })

    it('should detect simple checkmate when attacked King has no possible moves', () => {
      const whiteKingPosition: Position = { x: 0, y: 0 } // a8
      const blackKingPosition: Position = { x: 2, y: 1 } // c7
      const blackRookPosition: Position = { x: 2, y: 7 } // c1

      game.board.setPieceAt(
        whiteKingPosition,
        new King('white', whiteKingPosition)
      )

      game.board.setPieceAt(
        blackKingPosition,
        new King('black', blackKingPosition)
      )
      game.board.setPieceAt(
        blackRookPosition,
        new Rook('black', blackRookPosition)
      )

      game.currentPlayer = game.players[1]
      expect(game.status).toBe('ongoing')

      // move rook to c1 to checkmate

      const checkmateMove = new Move(
        game.board.getPieceAt(blackRookPosition)!,
        blackRookPosition,
        { x: 0, y: 7 }
      )

      player2.makeMove(checkmateMove, game)
      expect(game.status).toBe('checkmate')
    })

    it('should not call checkmate when the attacking piece can be captured', () => {
      // setup check scenario with rook and the king attacking the white king but with white queen able to capture the rook

      const whiteKingPosition: Position = { x: 0, y: 0 } // a8
      const whiteQueenPosition: Position = { x: 1, y: 6 } // b2

      const blackKingPosition: Position = { x: 2, y: 1 } // c7
      const blackRookPosition: Position = { x: 3, y: 7 } // d1

      game.board.setPieceAt(
        whiteKingPosition,
        new King('white', whiteKingPosition)
      )
      game.board.setPieceAt(
        whiteQueenPosition,
        new Queen('white', whiteQueenPosition)
      )

      game.board.setPieceAt(
        blackKingPosition,
        new King('black', blackKingPosition)
      )

      game.board.setPieceAt(
        blackRookPosition,
        new Rook('black', blackRookPosition)
      )

      game.currentPlayer = game.players[1]
      expect(game.status).toBe('ongoing')

      // move rook to a1 to check but not mate
      const checkMove = new Move(
        game.board.getPieceAt(blackRookPosition)!,
        blackRookPosition,
        { x: 0, y: 7 }
      )

      player2.makeMove(checkMove, game)
      expect(game.status).toBe('check')
    })

    describe('Real Game Checkmates Scenarii', () => {
      let game: IGame
      let player1: IPlayer
      let player2: IPlayer

      beforeEach(() => {
        game = new Game()
        player1 = game.players[0]
        player2 = game.players[1]
        game.initializeGame()
      })

      it("should execute the fool's mate scenario successfully", () => {
        // 1. f3
        const move1 = f3(game.board)
        expect(player1.makeMove(move1, game)).toBe(true)

        // 1... e6
        const move2 = e6(game.board)
        expect(player2.makeMove(move2, game)).toBe(true)

        // 2. g4
        const move3 = g4(game.board)
        expect(player1.makeMove(move3, game)).toBe(true)

        // 2... Qh4#
        const move4 = new Move(
          game.board.getPieceAt({ x: 3, y: 0 })!,
          { x: 3, y: 0 },
          { x: 7, y: 4 }
        )

        expect(player2.makeMove(move4, game)).toBe(true)

        // Check if the game status is checkmate
        expect(game.status).toBe('checkmate')
      })

      it("should execute the scholar's mate scenario successfully", () => {
        // 1. e4
        const move1 = e4(game.board)

        expect(player1.makeMove(move1, game)).toBe(true)

        // 1... e5
        const move2 = e5(game.board)
        expect(player2.makeMove(move2, game)).toBe(true)

        // 2. Bc4
        const move3 = Bc4(game.board)
        expect(player1.makeMove(move3, game)).toBe(true)

        // 2... Nc6
        const move4 = Nc6(game.board)
        expect(player2.makeMove(move4, game)).toBe(true)

        // 3. Qh5
        const move5 = Qh5(game.board)
        expect(player1.makeMove(move5, game)).toBe(true)

        // 3... Nf6??
        const move6 = Nf6(game.board)
        expect(player2.makeMove(move6, game)).toBe(true)

        // 4. Qxf7#
        const move7 = Qxf7(game.board)
        expect(player1.makeMove(move7, game)).toBe(true)

        // Check if the game status is checkmate
        expect(game.status).toBe('checkmate')
      })
    })
  })

  describe('Castling', () => {
    let game: Game

    beforeEach(() => {
      game = new Game()
    })

    it('should allow simple kingside castling for boths kings', () => {
      // white
      game.board.setPieceAt({ x: 4, y: 7 }, new King('white', { x: 4, y: 7 }))
      game.board.setPieceAt({ x: 7, y: 7 }, new Rook('white', { x: 7, y: 7 }))

      // black
      game.board.setPieceAt({ x: 4, y: 0 }, new King('black', { x: 4, y: 0 }))
      game.board.setPieceAt({ x: 7, y: 0 }, new Rook('black', { x: 7, y: 0 }))

      expect(game.board.getPieceAt({ x: 4, y: 7 })!.type).toBe('king')
      expect(game.board.getPieceAt({ x: 7, y: 7 })!.type).toBe('rook')

      expect(game.board.getPieceAt({ x: 4, y: 0 })!.type).toBe('king')
      expect(game.board.getPieceAt({ x: 7, y: 0 })!.type).toBe('rook')

      const whiteCastle = new Move(
        game.board.getPieceAt({ x: 4, y: 7 })!,
        { x: 4, y: 7 },
        { x: 6, y: 7 },
        'castling'
      )

      expect(game.makeMove(whiteCastle)).toBe(true)
      expect(game.board.getPieceAt({ x: 6, y: 7 })).toMatchObject({
        type: 'king',
        color: 'white',
      })

      expect(game.board.getPieceAt({ x: 5, y: 7 })).toMatchObject({
        type: 'rook',
        color: 'white',
      })

      const blackCastle = new Move(
        game.board.getPieceAt({ x: 4, y: 0 })!,
        { x: 4, y: 0 },
        { x: 6, y: 0 },
        'castling'
      )

      expect(game.makeMove(blackCastle)).toBe(true)
      expect(game.board.getPieceAt({ x: 6, y: 0 })).toMatchObject({
        type: 'king',
        color: 'black',
      })
      expect(game.board.getPieceAt({ x: 5, y: 0 })).toMatchObject({
        type: 'rook',
        color: 'black',
      })
    })
    it('should allow simple queenside castling for both kings', () => {
      // white
      game.board.setPieceAt({ x: 4, y: 7 }, new King('white', { x: 4, y: 7 }))
      game.board.setPieceAt({ x: 0, y: 7 }, new Rook('white', { x: 7, y: 7 }))
      expect(game.board.getPieceAt({ x: 4, y: 7 })!.type).toBe('king')
      expect(game.board.getPieceAt({ x: 0, y: 7 })!.type).toBe('rook')

      // black
      game.board.setPieceAt({ x: 4, y: 0 }, new King('black', { x: 4, y: 0 }))
      game.board.setPieceAt({ x: 0, y: 0 }, new Rook('black', { x: 7, y: 0 }))
      expect(game.board.getPieceAt({ x: 4, y: 0 })!.type).toBe('king')
      expect(game.board.getPieceAt({ x: 0, y: 0 })!.type).toBe('rook')

      const whiteCastle = new Move(
        game.board.getPieceAt({ x: 4, y: 7 })!,
        { x: 4, y: 7 },
        { x: 2, y: 7 },
        'castling'
      )

      const blackCastle = new Move(
        game.board.getPieceAt({ x: 4, y: 0 })!,
        { x: 4, y: 0 },
        { x: 2, y: 0 },
        'castling'
      )

      expect(game.makeMove(whiteCastle)).toBe(true)
      expect(game.board.getPieceAt({ x: 2, y: 7 })).toMatchObject({
        type: 'king',
        color: 'white',
      })
      expect(game.board.getPieceAt({ x: 3, y: 7 })).toMatchObject({
        type: 'rook',
        color: 'white',
      })

      expect(game.makeMove(blackCastle)).toBe(true)
      expect(game.board.getPieceAt({ x: 2, y: 0 })).toMatchObject({
        type: 'king',
        color: 'black',
      })
      expect(game.board.getPieceAt({ x: 3, y: 0 })).toMatchObject({
        type: 'rook',
        color: 'black',
      })
    })
  })
})
