import { COORDS } from '~/core/constants'
// 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export interface IGame {
  board: IBoard
  currentPlayer: IPlayer
  players: [IPlayer, IPlayer]
  status: GameStatus
  moveHistory: IMoveHistory
  initializeGame(): void
  startGame(): void
  makeMove(move: IMove): boolean
  isGameOver(): boolean
  getWinner(): IPlayer | null
  getValidMovesForCurrentPlayer(): Array<IMove>
  switchPlayer(): void
}

export interface IBoard {
  squares: Array<Array<IPiece | null>>
  initializeBoard(): void

  resetBoard(): void
  setStartingPosition(): void
  getPieceAt(position: Position): IPiece | null
  setPieceAt(position: Position, piece: IPiece | null): void
  applyMove(move: IMove, lastMove?: IMove): void
  isPositionUnderAttack(position: Position, attackingColor: Color): boolean
  getAllPieces(color: Color): Array<IPiece>
  isEmptySquare(position: Position): boolean
  isOutOfBounds(position: Position): boolean
  isEnemyPieceAt(position: Position, color: Color): boolean
  isAllyPieceAt(position: Position, color: Color): boolean
  isKingInCheck(color: Color): boolean
  isMate(color: Color): boolean
  wouldBeInCheckAfterMove(move: IMove): boolean
}

export interface IPiece {
  type: PieceType
  color: Color
  position: Position
  hasMoved: boolean
  directionOffsets: Array<{ x: Modifier; y: Modifier }>

  getPotentialReach(board: IBoard): Array<Position>
  getMoveSquares(board: IBoard): Array<Position>
  getPossibleMoves(board: IBoard): Array<IMove>
  canMoveTo(position: Position, board: IBoard): boolean

  getOppositeColor(): Color
}

export interface IPlayer {
  color: Color
  makeMove(move: IMove, game: IGame): boolean
}

export interface IMove {
  piece: IPiece
  startPosition: Position
  endPosition: Position
  specialMoveType: SpecialMoveType | null
  isValid(board: IBoard, lastMove: IMove): boolean
}

export type GameStatus =
  | 'not_started'
  | 'ongoing'
  | 'check'
  | 'checkmate'
  | 'stalemate'
  | 'draw'

export type Color = 'white' | 'black'

export interface Position {
  x: XYValue
  y: XYValue
}

// MoveHistory interface
export interface IMoveHistory {
  moves: Array<IMove>
  addMove(move: IMove): void
  undoMove(game: IGame): boolean
  redoMove(game: IGame): boolean
  getMoves(): Array<IMove>
}

export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'

export type SpecialMoveType = 'castling' | 'en_passant' | 'promotion'

export type XYValue = (typeof COORDS)[number]

export type Modifier = -1 | 1 | 0 | -2 | 2

export const isValidXY = (n: any): n is XYValue => {
  return COORDS.includes(n)
}
