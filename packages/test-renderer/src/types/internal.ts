export type CreateCanvasParameters = {
  beforeReturn?: (canvas: HTMLCanvasElement) => void
  width?: number
  height?: number
}

export interface Obj {
  [key: string]: unknown
}

/**
 * this is an empty object of unknown,
 * the data is passed to a new event
 * and subsequently passed to the
 * event handler you're calling
 */
export type MockEventData = {
  [key: string]: unknown
}

export interface TestInstanceChildOpts {
  exhaustive: boolean
}
