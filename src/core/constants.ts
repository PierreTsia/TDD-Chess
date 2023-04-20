import type { PieceType, XYValue } from '~/core/types'

export const BOARD_SIZE = 8

export const COORDS = [0, 1, 2, 3, 4, 5, 6, 7] as const
export const INIT_PIECES_COORDS: Record<
  Exclude<PieceType, 'pawn'>,
  Array<[XYValue, XYValue]>
> = {
  rook: [
    [0, 0],
    [7, 0],
    [0, 7],
    [7, 7],
  ],
  bishop: [
    [2, 0],
    [5, 0],
    [2, 7],
    [5, 7],
  ],
  knight: [
    [1, 0],
    [6, 0],
    [1, 7],
    [6, 7],
  ],
  queen: [
    [3, 0],
    [3, 7],
  ],
  king: [
    [4, 0],
    [4, 7],
  ],
}

export const PIECES_WEIGHT: Record<PieceType, number> = {
  king: 0,
  queen: 9,
  rook: 5,
  bishop: 3,
  knight: 3,
  pawn: 1,
}
