const getNodeById = (state: IGraphSliceState, id: number): FGraphNode | undefined => {
  return state.nodes.filter(n => n.id === id)[0]
}

// Export
const s = {
  getNodeById
}

export default s