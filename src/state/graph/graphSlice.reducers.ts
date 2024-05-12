import { PayloadAction } from '@reduxjs/toolkit'

export const updateNodePosition = (
  state: IGraphSliceState,
  action: PayloadAction<{
    id: number,
    position: FVector
  }>
) => {
  state.nodes = state.nodes.map(node => {
    if (node.id === action.payload.id) {
      node.position = action.payload.position
    }

    return node
  })
}

export const updateMultipleNodePosition = (
  state: IGraphSliceState,
  action: PayloadAction<{
    [key: number]: FVector
  }>
) => {
  state.nodes = state.nodes.map(node => {
    if (typeof action.payload[node.id] !== 'undefined') {
      node.position = action.payload[node.id]
    }

    return node
  })
}

export const updateSelectedNodes = (
  state: IGraphSliceState,
  action: PayloadAction<number[]>
) => {
  state.selectedNodes = action.payload
}

export const deleteNodes = (
  state: IGraphSliceState,
  action: PayloadAction<number[]>
) => {
  state.nodes = state.nodes.filter(n => action.payload.indexOf(n.id) === -1)
}

const r = {
  updateNodePosition,
  updateMultipleNodePosition,
  updateSelectedNodes,
  deleteNodes
}

export default r
