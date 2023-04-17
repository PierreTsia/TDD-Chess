import { beforeEach, describe, expect, it } from 'vitest'
import { Game } from '~/core/game/game'
import { Move } from '~/core/moves/move'
import { Bishop } from '~/core/pieces/bishop'
import { King } from '~/core/pieces/king'
import { Pawn } from '~/core/pieces/pawn'
import { Queen } from '~/core/pieces/queen'
import { Rook } from '~/core/pieces/rook'
import type { IGame, IPlayer, Position } from '~/core/types'
import {
  Bc4,
  BlackQueenSideCastle,
  Nc6,
  Nf6,
  Qh5,
  Qxf7,
  WhiteKingSideCastle,
  WhiteQueenSideCastle,
  d5,
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
      game.startGame()
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
      // set up the board with a check scenario
      // white king in a8 and black queen in e5

      const game: IGame = new Game()

      game.startGame()

      expect(game.status).toBe('ongoing')

      game.board.setPieceAt({ x: 0, y: 0 }, new King('white', { x: 0, y: 0 }))
      game.board.setPieceAt({ x: 7, y: 1 }, new Rook('white', { x: 7, y: 1 }))

      game.board.setPieceAt({ x: 4, y: 3 }, new Queen('black', { x: 4, y: 3 }))

      game.currentPlayer = game.players[1]

      const QueenMove = new Move(
        game.board.getPieceAt({ x: 4, y: 3 })!,
        { x: 4, y: 3 },
        { x: 0, y: 3 }
      )

      player2.makeMove(QueenMove, game)
      expect(game.status).toBe('check')

      const notDefendingMove = new Move(
        game.board.getPieceAt({ x: 7, y: 1 })!,
        { x: 7, y: 1 },
        { x: 7, y: 0 }
      )

      expect(player1.makeMove(notDefendingMove, game)).toBe(false)

      const defendingMove = new Move(
        game.board.getPieceAt({ x: 7, y: 1 })!,
        { x: 7, y: 1 },
        { x: 0, y: 1 }
      )

      expect(player1.makeMove(defendingMove, game)).toBe(true)

      expect(game.status).toBe('ongoing')
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

    let player2: IPlayer
    beforeEach(() => {
      game = new Game()

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

      game.startGame()
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
      game.startGame()

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

  describe('Stalemate', () => {
    it('should detect a stalemate', () => {
      const game = new Game()
      const player1 = game.players[0]
      const player2 = game.players[1]
      game.board.resetBoard()

      game.board.setPieceAt({ x: 0, y: 0 }, new King('black', { x: 0, y: 0 }))
      game.board.setPieceAt({ x: 1, y: 2 }, new Pawn('white', { x: 1, y: 2 }))

      game.board.setPieceAt({ x: 0, y: 2 }, new King('white', { x: 0, y: 2 }))

      game.startGame()
      expect(game.status).toBe('ongoing')

      expect(player1.makeMove(new Move(game.board.getPieceAt({ x: 1, y: 2 })!, { x: 1, y: 2 }, { x: 1, y: 1 }), game)).toBe(true)
      expect(game.status).toBe('check')

      expect(player2.makeMove(new Move(game.board.getPieceAt({ x: 0, y: 0 })!, { x: 0, y: 0 }, { x: 1, y: 0 }), game)).toBe(true)
      expect(game.status).toBe('ongoing')

      expect(player1.makeMove(new Move(game.board.getPieceAt({ x: 0, y: 2 })!, { x: 0, y: 2 }, { x: 1, y: 2 }), game)).toBe(true)
      expect(game.status).toBe('stalemate')

    })

    it('should not detect a stalemate if there is a piece to move', () => {
      const game = new Game()
      const player1 = game.players[0]
      const player2 = game.players[1]
      game.board.resetBoard()

      game.board.setPieceAt({ x: 0, y: 0 }, new King('black', { x: 0, y: 0 }))
      game.board.setPieceAt({ x: 7, y: 1 }, new Pawn('black', { x: 7, y: 1 }))

      game.board.setPieceAt({ x: 1, y: 2 }, new Pawn('white', { x: 1, y: 2 }))

      game.board.setPieceAt({ x: 0, y: 2 }, new King('white', { x: 0, y: 2 }))

      game.startGame()
      expect(game.status).toBe('ongoing')

      expect(player1.makeMove(new Move(game.board.getPieceAt({ x: 1, y: 2 })!, { x: 1, y: 2 }, { x: 1, y: 1 }), game)).toBe(true)
      expect(game.status).toBe('check')

      expect(player2.makeMove(new Move(game.board.getPieceAt({ x: 0, y: 0 })!, { x: 0, y: 0 }, { x: 1, y: 0 }), game)).toBe(true)
      expect(game.status).toBe('ongoing')

      expect(player1.makeMove(new Move(game.board.getPieceAt({ x: 0, y: 2 })!, { x: 0, y: 2 }, { x: 1, y: 2 }), game)).toBe(true)
      expect(game.status).toBe('ongoing')

     expect(player2.makeMove(new Move(game.board.getPieceAt({ x: 7, y: 1 })!, { x: 7, y: 1 }, { x: 7, y: 3 }), game)).toBe(true)

    })
  })

  describe('Castling', () => {
    let game: Game
    let player1: IPlayer
    let player2: IPlayer

    beforeEach(() => {
      game = new Game()
      player1 = game.players[0]
      player2 = game.players[1]
    })

    it('should allow simple kingside castling', () => {
      // white
      game.board.setPieceAt({ x: 4, y: 7 }, new King('white', { x: 4, y: 7 }))
      game.board.setPieceAt({ x: 7, y: 7 }, new Rook('white', { x: 7, y: 7 }))

      expect(game.board.getPieceAt({ x: 4, y: 7 })!.type).toBe('king')
      expect(game.board.getPieceAt({ x: 7, y: 7 })!.type).toBe('rook')

      const whiteCastle = WhiteKingSideCastle(game.board)

      expect(game.makeMove(whiteCastle)).toBe(true)
      expect(game.board.getPieceAt({ x: 6, y: 7 })).toMatchObject({
        type: 'king',
        color: 'white',
      })

      expect(game.board.getPieceAt({ x: 5, y: 7 })).toMatchObject({
        type: 'rook',
        color: 'white',
      })
    })
    it('should allow simple queenside castling ', () => {
      // black
      game.board.setPieceAt({ x: 4, y: 0 }, new King('black', { x: 4, y: 0 }))
      game.board.setPieceAt({ x: 0, y: 0 }, new Rook('black', { x: 7, y: 0 }))
      expect(game.board.getPieceAt({ x: 4, y: 0 })!.type).toBe('king')
      expect(game.board.getPieceAt({ x: 0, y: 0 })!.type).toBe('rook')

      game.currentPlayer = game.players[1]

      const blackCastle = BlackQueenSideCastle(game.board)

      const wrongCastle = new Move(
        game.board.getPieceAt({ x: 4, y: 0 })!,
        { x: 4, y: 0 },
        { x: 1, y: 0 },
        'castling'
      )

      expect(game.makeMove(wrongCastle)).toBe(false)

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

    it('should not allow castling if the king has moved', () => {
      game.board.setPieceAt({ x: 4, y: 7 }, new King('white', { x: 4, y: 7 }))
      game.board.setPieceAt({ x: 0, y: 7 }, new Rook('white', { x: 7, y: 7 }))
      expect(game.board.getPieceAt({ x: 4, y: 7 })!.type).toBe('king')
      expect(game.board.getPieceAt({ x: 0, y: 7 })!.type).toBe('rook')

      game.board.setPieceAt({ x: 1, y: 1 }, new Pawn('black', { x: 1, y: 1 }))

      const whiteKingMove = new Move(
        game.board.getPieceAt({ x: 4, y: 7 })!,
        { x: 4, y: 7 },
        { x: 5, y: 7 }
      )

      player1.makeMove(whiteKingMove, game)

      const blackPawnMove = new Move(
        game.board.getPieceAt({ x: 1, y: 1 })!,
        { x: 1, y: 1 },
        { x: 1, y: 2 }
      )

      player2.makeMove(blackPawnMove, game)

      const whiteMoveBack = new Move(
        game.board.getPieceAt({ x: 5, y: 7 })!,
        { x: 5, y: 7 },
        { x: 4, y: 7 }
      )

      const blackMove2 = new Move(
        game.board.getPieceAt({ x: 1, y: 2 })!,
        { x: 1, y: 2 },
        { x: 1, y: 3 }
      )

      player1.makeMove(whiteMoveBack, game)
      player2.makeMove(blackMove2, game)

      expect(game.board.getPieceAt({ x: 4, y: 7 })!.type).toBe('king')
      expect(game.board.getPieceAt({ x: 0, y: 7 })!.type).toBe('rook')
      expect(game.board.getPieceAt({ x: 1, y: 3 })!.type).toBe('pawn')

      const whiteCastle = WhiteQueenSideCastle(game.board)

      expect(game.makeMove(whiteCastle)).toBe(false)
    })
    it('should not allow castling if one piece is between king and rook', () => {
      game.board.setPieceAt({ x: 4, y: 7 }, new King('white', { x: 4, y: 7 }))
      game.board.setPieceAt({ x: 0, y: 7 }, new Rook('white', { x: 0, y: 7 }))
      game.board.setPieceAt({ x: 3, y: 7 }, new Queen('white', { x: 3, y: 7 }))

      const whiteCastle = WhiteQueenSideCastle(game.board)
      expect(game.currentPlayer).toBe(player1)

      const res = player1.makeMove(whiteCastle, game)
      expect(res).toBe(false)
    })
    it("should not allow castling if one opponent's piece is threatening on square of the castling path ", () => {
      game.board.setPieceAt({ x: 4, y: 7 }, new King('white', { x: 4, y: 7 }))
      game.board.setPieceAt({ x: 0, y: 7 }, new Rook('white', { x: 0, y: 7 }))

      game.board.setPieceAt({ x: 4, y: 5 }, new Queen('black', { x: 4, y: 5 }))

      const whiteCastle = WhiteQueenSideCastle(game.board)
      expect(game.currentPlayer).toBe(player1)

      const res = player1.makeMove(whiteCastle, game)
      expect(res).toBe(false)

      // remove black queen
      game.board.setPieceAt({ x: 4, y: 5 }, null)
      expect(game.makeMove(whiteCastle)).toBe(true)
    })
  })

  describe('En passant', () => {
    it('should detect en passant pawn move', () => {
      const game = new Game()
      const player1 = game.players[0]
      const player2 = game.players[1]
      const whitePawn = new Pawn('white', { x: 4, y: 6 })
      const blackPawn = new Pawn('black', { x: 5, y: 4 })
      game.board.setPieceAt({ x: 4, y: 6 }, whitePawn)
      game.board.setPieceAt({ x: 5, y: 4 }, blackPawn)

      game.startGame()
      expect(game.board.getPieceAt({ x: 4, y: 6 })!.type).toBe('pawn')
      expect(game.board.getPieceAt({ x: 5, y: 4 })!.type).toBe('pawn')
      expect(game.currentPlayer).toBe(player1)

      const e4Move = new Move(whitePawn, { x: 4, y: 6 }, { x: 4, y: 4 })

      expect(player1.makeMove(e4Move, game)).toBe(true)

      expect(game.board.getPieceAt({ x: 4, y: 4 })!.type).toBe('pawn')

      const enPassantMove = new Move(blackPawn, { x: 5, y: 4 }, { x: 4, y: 5 })

      expect(player2.makeMove(enPassantMove, game)).toBe(true)

      expect(game.board.getPieceAt({ x: 4, y: 5 })!.type).toBe('pawn')
      expect(game.board.getPieceAt({ x: 4, y: 5 })!.color).toBe('black')

      expect(game.board.getPieceAt({ x: 5, y: 4 })).toBe(null)
      expect(game.board.getPieceAt({ x: 4, y: 4 })).toBe(null)
    })
  })

  describe('Nailed piece', () => {
    it('should not allow a piece that is nailed to move', () => {
      const game = new Game()
      const whiteKing = new King('white', { x: 4, y: 7 })
      const whiteRook = new Rook('white', { x: 4, y: 6 })

      const blackQueen = new Queen('black', { x: 4, y: 5 }) // nails white rook

      game.board.setPieceAt({ x: 4, y: 7 }, whiteKing)
      game.board.setPieceAt({ x: 4, y: 6 }, whiteRook)
      game.board.setPieceAt({ x: 4, y: 5 }, blackQueen)

      const whiteRookMove = new Move(whiteRook, { x: 4, y: 6 }, { x: 3, y: 6 })

      expect(game.makeMove(whiteRookMove)).toBe(false)
    })

    it('should  allow a piece to move if not nailed', () => {
      const game = new Game()
      const whiteKing = new King('white', { x: 4, y: 7 })
      const whiteRook = new Rook('white', { x: 4, y: 6 })

      const blackQueen = new Queen('black', { x: 3, y: 5 }) // nails white rook

      game.board.setPieceAt({ x: 4, y: 7 }, whiteKing)
      game.board.setPieceAt({ x: 4, y: 6 }, whiteRook)
      game.board.setPieceAt({ x: 3, y: 5 }, blackQueen)

      const whiteRookMove = new Move(whiteRook, { x: 4, y: 6 }, { x: 3, y: 6 })

      expect(game.makeMove(whiteRookMove)).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    // bug scenarios

    it('should not block player after a bad queenside castle move', () => {
      const game = new Game()
      const whitePlayer = game.players[0]
      game.board.resetBoard()
      game.board.setPieceAt({ x: 4, y: 7 }, new King('white', { x: 4, y: 7 }))
      game.board.setPieceAt({ x: 0, y: 7 }, new Rook('white', { x: 0, y: 7 }))
      game.board.setPieceAt({ x: 7, y: 7 }, new Rook('white', { x: 7, y: 7 }))
      game.board.setPieceAt({ x: 7, y: 6 }, new Pawn('white', { x: 7, y: 6 }))

      // black queen prevents white from castling
      game.board.setPieceAt({ x: 5, y: 4 }, new Queen('black', { x: 5, y: 4 }))

      game.startGame()
      expect(game.currentPlayer?.color).toBe('white')
      const queenSideCastle = WhiteQueenSideCastle(game.board)
      expect(whitePlayer.makeMove(queenSideCastle, game)).toBe(false)

      // other white moves should be allowed
      const whitePawnMove = new Move(
        game.board.getPieceAt({ x: 7, y: 6 })!,
        { x: 7, y: 6 },
        { x: 7, y: 5 }
      )
      expect(whitePlayer.makeMove(whitePawnMove, game)).toBe(true)
    })

    // then queen side castling is not allowed which is normal but the player cannot do anything else

    it('should allow the king to run away from check', () => {
      // bug scenario
      // 1.e4 - e5
      // 2- Qg4 - f6
      // 3- Qg6 - Ke7 should be valid
      // 4- Qxg6#

      const game = new Game()
      game.initializeGame()
      const [player1, player2] = game.players

      expect(player1.makeMove(e4(game.board), game)).toBe(true)
      expect(player2.makeMove(e5(game.board), game)).toBe(true)

      const Qg4 = new Move(
        game.board.getPieceAt({ x: 3, y: 7 })!,
        { x: 3, y: 7 },
        { x: 6, y: 4 }
      )
      expect(player1.makeMove(Qg4, game)).toBe(true)
      expect(game.board.getPieceAt({ x: 6, y: 4 })!.type).toBe('queen')

      const f6 = new Move(
        game.board.getPieceAt({ x: 5, y: 1 })!,
        { x: 5, y: 1 },
        { x: 5, y: 2 }
      )
      expect(player2.makeMove(f6, game)).toBe(true)

      const Qg7 = new Move(
        game.board.getPieceAt({ x: 6, y: 4 })!,
        { x: 6, y: 4 },
        { x: 6, y: 2 }
      )

      expect(player1.makeMove(Qg7, game)).toBe(true)
      expect(game.status).toBe('check')

      const Ke7 = new Move(
        game.board.getPieceAt({ x: 4, y: 0 })!,
        { x: 4, y: 0 },
        { x: 4, y: 1 }
      )

      expect(player2.makeMove(Ke7, game)).toBe(true)
      expect(game.status).toBe('ongoing')
    })
    it('should not allow a pinned knight to move', () => {
      const game = new Game()
      game.initializeGame()
      const [player1, player2] = game.players

      expect(player1.makeMove(e4(game.board), game)).toBe(true)
      expect(player2.makeMove(d5(game.board), game)).toBe(true)

      const knightC3 = new Move(
        game.board.getPieceAt({ x: 1, y: 7 })!,
        { x: 1, y: 7 },
        { x: 2, y: 5 }
      )

      const knightC6 = new Move(
        game.board.getPieceAt({ x: 1, y: 0 })!,
        { x: 1, y: 0 },
        { x: 2, y: 2 }
      )

      expect(player1.makeMove(knightC3, game)).toBe(true)
      expect(player2.makeMove(knightC6, game)).toBe(true)

      const bishopB4 = new Move(
        game.board.getPieceAt({ x: 5, y: 7 })!,
        { x: 5, y: 7 },
        { x: 1, y: 3 }
      )

      expect(player1.makeMove(bishopB4, game)).toBe(true)

      // knight is pinned and should not be able to move
      const knightC6Move = new Move(
        game.board.getPieceAt({ x: 2, y: 2 })!,
        { x: 2, y: 2 },
        { x: 3, y: 4 }
      )
      expect(player2.makeMove(knightC6Move, game)).toBe(false)
    })
  })
})
