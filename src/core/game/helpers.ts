import {BOARD_SIZE} from "~/core/constants";
import type { IBoard, IPiece, PieceType } from '~/core/types'

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
    const whitePawn = board.getPieceAt({ x, y: 1 })
    const blackPawn = board.getPieceAt({ x, y: 6 })

    if (!doesPieceExist('pawn', whitePawn, blackPawn)) {
      return false
    }
  }

  return true
}

const areRooksInStartingPosition = (board: IBoard): boolean => {
  for (let x = 0; x < BOARD_SIZE; x += 7) {
    const whiteRook = board.getPieceAt({ x, y: 0 })
    const blackRook = board.getPieceAt({ x, y: 7 })

    if (!doesPieceExist('rook', whiteRook, blackRook)) {
      return false
    }
  }
  return true
}

const areKnightsInStartingPosition = (board: IBoard): boolean => {
  // Implement the helper function to check the starting position of knights
  for (let x = 1; x < BOARD_SIZE; x += 5) {
    const whiteKnight = board.getPieceAt({ x, y: 0 })
    const blackKnight = board.getPieceAt({ x, y: 7 })

    if (!doesPieceExist('knight', whiteKnight, blackKnight)) {
      return false
    }
  }
  return true
}

const areBishopsInStartingPosition = (board: IBoard): boolean => {
  for (let x = 2; x < BOARD_SIZE; x += 3) {
    const whiteBishop = board.getPieceAt({ x, y: 0 })
    const blackBishop = board.getPieceAt({ x, y: 7 })

    if (!doesPieceExist('bishop', whiteBishop, blackBishop)) {
      return false
    }
  }
  return true
}

const isQueenInStartingPosition = (board: IBoard): boolean => {
  const whiteQueen = board.getPieceAt({ x: 3, y: 0 })
  const blackQueen = board.getPieceAt({ x: 3, y: 7 })
  return doesPieceExist('queen', whiteQueen, blackQueen)
}

const isKingInStartingPosition = (board: IBoard): boolean => {
  const whiteKing = board.getPieceAt({ x: 4, y: 0 })
  const blackKing = board.getPieceAt({ x: 4, y: 7 })
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
