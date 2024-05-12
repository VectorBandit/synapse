import { createSlice } from '@reduxjs/toolkit'
import r from './graphSlice.reducers'
import s from './graphSlice.selectors'

const initialState: IGraphSliceState = {
  nodes: [
    {
      id: 1,
      type: 'variable',
      title: 'var1',
      position: {
        x: 40,
        y: 40
      }
    },
    {
      id: 2,
      type: 'function',
      title: 'Log',
      position: {
        x: 140,
        y: 40
      }
    },
    {
      id: 3,
      type: 'branch',
      title: 'Branch',
      position: {
        x: 220,
        y: 40
      }
    }
  ],
  selectedNodes: []
}

export const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: r
})

export const actions = graphSlice.actions
export const selectors = s