import type {PieceType} from "~/core/types";

export const BOARD_SIZE = 8

export const COORDS = [...Array(BOARD_SIZE).keys()] as const
export const INIT_PIECES_COORDS: Record<
  Exclude<PieceType, 'pawn'>,
  Array<[number, number]>
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
