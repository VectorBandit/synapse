interface GraphNodeProps {
  node: FGraphNode,
  isSelected: boolean
}

const GraphNode = (props: GraphNodeProps) => {
  const getNodeIcon = () => {
    switch (props.node.type) {
      case 'branch':
        return 'arrow_split'
      default:
        return props.node.type
    }
  }

  return (
    <div
      className={`graph-node ${props.isSelected ? 'is-selected' : ''}`}
      data-id={props.node.id}
      data-x={props.node.position.x}
      data-y={props.node.position.y}
      style={{
        transform: `translate(${props.node.position.x}px, ${props.node.position.y}px)`
      }}
    >
      {props.node.type === 'variable' ? (
        <div className="node type--variable">
          {props.node.title}
        </div>
      ) : (
        <div className={`node type--execution type--execution--${props.node.type}`}>
          <div className="node-header">
            <span className="mi mi--filled">
              {getNodeIcon()}
            </span>
            {props.node.title}
          </div>

          <div className="node-body">
            <div className="node-pins node-pins--left">
              <div className="pin pin--exec">
                <button></button>
              </div>

              <div className="pin pin--var pin--var-string">
                <button></button>
                <span className="pin-text">Text</span>
              </div>
            </div>

            <div className="node-pins node-pins--right">
              <div className="pin pin--exec">
                <button></button>
              </div>
              <div className="pin pin--var pin--var-int">
                <span className="pin-text">Return Value</span>
                <button></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GraphNode