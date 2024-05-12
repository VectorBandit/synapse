export const findNodeById = (nodes: FGraphNode[], id: number): FGraphNode | undefined => {
  return nodes.filter(node => node.id === id)[0]
}

export const findNodesWithinRange = (nodes: FGraphNode[], range: FVector[2]): FGraphNode[] => {
  return nodes.filter(node => {
    return (
      node.position.x >= range[0].x &&
      node.position.x <= range[1].x &&
      node.position.y >= range[0].y &&
      node.position.y <= range[1].y
    )
  })
}