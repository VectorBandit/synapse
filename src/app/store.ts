import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { graphSlice } from '@/state/graph/graphSlice'

const rootReducer = combineSlices(graphSlice)
export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
}

export const store = makeStore()

export type AppStore = typeof store
export type AppDispatch = AppStore['dispatch']