const GraphCoordDebug = ({position}) => {
  return (
    <span
      className="graph-coord-debug"
      style={{
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`
      }}>
      {position.x},{position.y}
    </span>
  )
}

export default GraphCoordDebug