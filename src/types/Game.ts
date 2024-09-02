import type { Locale, Data } from './Locale'
export interface Player {
  symbol: 'X' | 'O' | undefined
  points: number
  active: boolean
  type: 'human' | 'robot'
}

export interface HumanPlayer extends Player {
  type: 'human'
}

export interface RobotPlayer extends Player {
  type: 'robot'
}

export interface GameStats {
  human: HumanPlayer
  robot: RobotPlayer
  started: boolean
  loading: boolean
}

export const CANVAS_CENTER = [0.5312-0.1773, 0.2988-0.1495] as const
export const CANVAS_SIZE = [0.12, 0.12] as const
// export const CANVAS_CENTER = [ 540, 414 ] as const;
// export const CANVAS_SIZE = [0.1] as const

type GridItem = 'X' | 'O' | ' '

type GridRow = [GridItem, GridItem, GridItem]

export type Grid = [GridRow, GridRow, GridRow]

export interface DrawGridRequest {
  center: readonly [number, number]
  size: readonly [number, number]
}

export interface DrawGridResponse {
  message: string
}

export interface PlayMoveRequest {
  image: string
}

export interface PlayMoveResponse {
  grid_state: string[][]
  move: string
  game_is_finished: boolean
  winner: 'human' | 'robot' | null
}

export interface GameState {
  loading: boolean
  game: GameStats
  error: any
  gridMessage: string | null
  winner: 'human' | 'robot' | null
  finished: boolean
  gridState: string[][] | null
  move: string | null
  CMS: {
    locale: Locale
    data: Data
  }
}
