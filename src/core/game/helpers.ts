import { BOARD_SIZE } from '~/core/constants'
import { Move } from '~/core/moves/move'
import type { IBoard, IPiece, PieceType, Position } from '~/core/types'

const doesPieceExist = (
  pieceType: PieceType,
  white: IPiece | null,
  black: IPiece | null
): boolean => {
  return !!(
    white &&
    white?.type === pieceType &&
    white?.color === 'white' &&
    black &&
    black?.type === pieceType &&
    black?.color === 'black'
  )
}

const arePawnsInStartingPosition = (board: IBoard): boolean => {
  // Implement the helper function to check the starting position of pawns

  // Implement the logic to check if pawns are in their correct starting positions
  for (let x = 0; x < BOARD_SIZE; x++) {
    const whitePawn = board.getPieceAt({ x, y: 6 } as Position)
    const blackPawn = board.getPieceAt({ x, y: 1 } as Position)

    if (!doesPieceExist('pawn', whitePawn, blackPawn)) {
      return false
    }
  }

  return true
}

const areRooksInStartingPosition = (board: IBoard): boolean => {
  for (let x = 0; x < BOARD_SIZE; x += 7) {
    const whiteRook = board.getPieceAt({ x, y: 7 } as Position)
    const blackRook = board.getPieceAt({ x, y: 0 } as Position)

    if (!doesPieceExist('rook', whiteRook, blackRook)) {
      return false
    }
  }
  return true
}

const areKnightsInStartingPosition = (board: IBoard): boolean => {
  // Implement the helper function to check the starting position of knights
  for (let x = 1; x < BOARD_SIZE; x += 5) {
    const whiteKnight = board.getPieceAt({ x, y: 7 } as Position)
    const blackKnight = board.getPieceAt({ x, y: 0 } as Position)

    if (!doesPieceExist('knight', whiteKnight, blackKnight)) {
      return false
    }
  }
  return true
}

const areBishopsInStartingPosition = (board: IBoard): boolean => {
  for (let x = 2; x < BOARD_SIZE; x += 3) {
    const whiteBishop = board.getPieceAt({ x, y: 7 } as Position)
    const blackBishop = board.getPieceAt({ x, y: 0 } as Position)

    if (!doesPieceExist('bishop', whiteBishop, blackBishop)) {
      return false
    }
  }
  return true
}

const isQueenInStartingPosition = (board: IBoard): boolean => {
  const whiteQueen = board.getPieceAt({ x: 3, y: 7 })
  const blackQueen = board.getPieceAt({ x: 3, y: 0 })
  return doesPieceExist('queen', whiteQueen, blackQueen)
}

const isKingInStartingPosition = (board: IBoard): boolean => {
  const whiteKing = board.getPieceAt({ x: 4, y: 7 })
  const blackKing = board.getPieceAt({ x: 4, y: 0 })
  return doesPieceExist('king', whiteKing, blackKing)
}

export const isStartingPositionCorrect = (board: IBoard): boolean => {
  // Implement the helper function to check the starting position of each piece type
  return (
    arePawnsInStartingPosition(board) &&
    areRooksInStartingPosition(board) &&
    areKnightsInStartingPosition(board) &&
    areBishopsInStartingPosition(board) &&
    isQueenInStartingPosition(board) &&
    isKingInStartingPosition(board)
  )
}

export const e4 = (board: IBoard) =>
  new Move(
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

export const exd5 = (board: IBoard) =>
  new Move(
    board.getPieceAt({
      x: 4,
      y: 4,
    })!,
    {
      x: 4,
      y: 4,
    },
    {
      x: 3,
      y: 3,
    }
  )

export const exf5 = (board: IBoard) =>
  new Move(
    board.getPieceAt({
      x: 4,
      y: 4,
    })!,
    {
      x: 4,
      y: 4,
    },
    {
      x: 5,
      y: 3,
    }
  )

export const d5 = (board: IBoard) =>
  new Move(
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
  )

export const e5 = (board: IBoard) =>
  new Move(
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

export const Bc4 = (board: IBoard) =>
  new Move(board.getPieceAt({ x: 5, y: 7 })!, { x: 5, y: 7 }, { x: 2, y: 4 })

export const Nc6 = (board: IBoard) =>
  new Move(board.getPieceAt({ x: 1, y: 0 })!, { x: 1, y: 0 }, { x: 2, y: 2 })

export const Qh5 = (board: IBoard) =>
  new Move(board.getPieceAt({ x: 3, y: 7 })!, { x: 3, y: 7 }, { x: 7, y: 3 })

export const Nf6 = (board: IBoard) =>
  new Move(board.getPieceAt({ x: 6, y: 0 })!, { x: 6, y: 0 }, { x: 5, y: 2 })

export const Qxf7 = (board: IBoard) =>
  new Move(board.getPieceAt({ x: 7, y: 3 })!, { x: 7, y: 3 }, { x: 5, y: 1 })

export const f3 = (board: IBoard) =>
  new Move(board.getPieceAt({ x: 5, y: 6 })!, { x: 5, y: 6 }, { x: 5, y: 5 })

export const e6 = (board: IBoard) =>
  new Move(board.getPieceAt({ x: 4, y: 1 })!, { x: 4, y: 1 }, { x: 4, y: 2 })

export const g4 = (board: IBoard) =>
  new Move(board.getPieceAt({ x: 6, y: 6 })!, { x: 6, y: 6 }, { x: 6, y: 4 })

export const WhiteKingSideCastle = (board: IBoard) =>
  new Move(
    board.getPieceAt({ x: 4, y: 7 })!,
    { x: 4, y: 7 },
    { x: 6, y: 7 },
    'castling'
  )

export const WhiteQueenSideCastle = (board: IBoard) =>
  new Move(
    board.getPieceAt({ x: 4, y: 7 })!,
    { x: 4, y: 7 },
    { x: 2, y: 7 },
    'castling'
  )

export const BlackKingSideCastle = (board: IBoard) =>
  new Move(
    board.getPieceAt({ x: 4, y: 0 })!,
    { x: 4, y: 0 },
    { x: 6, y: 0 },
    'castling'
  )

export const BlackQueenSideCastle = (board: IBoard) =>
  new Move(
    board.getPieceAt({ x: 4, y: 0 })!,
    { x: 4, y: 0 },
    { x: 2, y: 0 },
    'castling'
  )
