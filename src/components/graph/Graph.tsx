import '@/assets/style/graph.scss'
import { useEffect, useRef, useState } from 'react'

import KeyboardAndMouseUtils from '@/lib/KeyboardAndMouseUtils'
import { Transform, Vector } from '@/lib/Geometry'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { actions } from '@/state/graph/graphSlice'

import GraphNode from '@/components/graph/GraphNode'
import GraphCoordDebug from '@/components/graph/GraphCoordDebug'
import { findNodeById, findNodesWithinRange } from '@/utils/graph-utils'
import { Simulate } from 'react-dom/test-utils'
import drag = Simulate.drag

// Constant options for the graph.
const OPTIONS = {
  minZoom: 0.5,
  maxZoom: 2,
  dragIncrement: 10
}

interface CanvasEvents {
  onMouseDown: (e: MouseEvent) => void
  onMouseUp: (e: MouseEvent) => void
  onMouseMove?: (e: MouseEvent) => void
  onWheel: (e: WheelEvent) => void
  onKeyDown: (e: KeyboardEvent) => void
}

const Graph = () => {
  const graphElement = useRef<HTMLDivElement | null>(null)

  const [lastClickPosition, setLastClickPosition] = useState<FVector>(Vector.Zero)

  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragTargets, setDragTargets] = useState<{id: number, offset: FVector}[]>([])

  const [isPanning, setIsPanning] = useState<boolean>(false)
  const [panPosition, setPanPosition] = useState<FVector>(Vector.Zero)
  const [prevPanMousePosition, setPrevPanMousePosition] = useState<FVector>(Vector.Zero)

  const [isBoxSelecting, setIsBoxSelecting] = useState<boolean>(false)
  const [boxSelectionTransform, setBoxSelectionTransform] = useState<FTransform>(Transform.Zero)

  const [zoomLevel, setZoomLevel] = useState<number>(1)

  const dispatch = useAppDispatch()
  const graphNodes = useAppSelector(state => state.graph.nodes)
  const selectedNodes = useAppSelector(state => state.graph.selectedNodes)

  useEffect(() => {
    const range = [
      boxSelectionTransform.position,
      Vector.Add(boxSelectionTransform.position, boxSelectionTransform.size)
    ]

    const nodesFound = findNodesWithinRange(graphNodes, range)

    dispatch(actions.updateSelectedNodes(nodesFound.map(n => n.id)))
  }, [boxSelectionTransform])

  const screenToViewport = (screenPos: FVector): FVector => ({
    x: screenPos.x - graphElement.current?.offsetLeft,
    y: screenPos.y - graphElement.current?.offsetTop
  })

  const screenToCanvas = (screenPos: FVector): FVector => {
    const viewportPos = screenToViewport(screenPos)

    return {
      x: (viewportPos.x - panPosition.x) * (1 / zoomLevel),
      y: (viewportPos.y - panPosition.y) * (1 / zoomLevel)
    }
  }

  const processDragNodes = (e: MouseEvent) => {
    const pos = screenToCanvas(KeyboardAndMouseUtils.GetMousePosition(e))

    const updateList: {[key: number]: FVector} = dragTargets.reduce((carry, target) => {
      carry[target.id] = Vector.Round(Vector.Subtract(pos, target.offset), OPTIONS.dragIncrement)
      return carry
    }, {})

    dispatch(actions.updateMultipleNodePosition(updateList))
  }

  const processBoxSelection = (e: MouseEvent) => {
    const screenPos = screenToCanvas(KeyboardAndMouseUtils.GetMousePosition(e))
    const posDiff = Vector.Subtract(screenPos, lastClickPosition)
    const posDiffInverted = Vector.Subtract(lastClickPosition, screenPos)

    const direction = Vector.Sign(posDiff)

    setBoxSelectionTransform(() => {
      let position = {...lastClickPosition}
      let size = {...posDiff}

      if (direction.x < 0) {
        position.x = screenPos.x
        size.x = posDiffInverted.x
      }

      if (direction.y < 0) {
        position.y = screenPos.y
        size.y = posDiffInverted.y
      }

      return {position, size}
    })
  }

  const handleMouseDown = (e: MouseEvent) => {
    const screenPos = KeyboardAndMouseUtils.GetMousePosition(e)
    const canvasPos = screenToCanvas(screenPos)

    if (KeyboardAndMouseUtils.IsMouseLeft(e)) {
      setIsDragging(true)
      setLastClickPosition(canvasPos)

      // Detect click on a Node.
      const targetNodeElement = (e.target as HTMLElement).closest('.graph-node')

      if (targetNodeElement instanceof HTMLElement) {
        const targetNodeId = Number(targetNodeElement.dataset.id)

        // Check if the Node is currently selected.
        //
        // If it is, it means that the user is trying to move the current
        // list of selected Nodes and all of them should be moved at once.
        //
        // We're updating the list of selected nodes right away, so we don't
        // need to run the same offset calculations twice.
        let selected = [...selectedNodes]

        if (selected.indexOf(targetNodeId) === -1) {
          // This is a new selection.
          selected = [targetNodeId]
          dispatch(actions.updateSelectedNodes(selected))
        }

        // Calculate the difference between the mouse position and the target Node position.
        // This is used to offset the movement.
        const targets = selected.reduce((carry, nodeId) => {
          const node = findNodeById(graphNodes, nodeId)

          if (node) {
            carry.push({
              id: nodeId,
              offset: Vector.Subtract(canvasPos, node.position)
            })
          }

          return carry
        }, [])

        setDragTargets(targets)
      } else {
        // No Node was clicked.
        // Clear target IDs, selected nodes and possibly begin drawing a selection box.
        setDragTargets([])
        dispatch(actions.updateSelectedNodes([]))

        setIsBoxSelecting(true)
        setBoxSelectionTransform({
          position: screenToCanvas(screenPos),
          size: Vector.Zero
        })
      }
    } else if (KeyboardAndMouseUtils.IsMouseMiddle(e)) {
      setIsPanning(true)
      setPrevPanMousePosition(screenPos)
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (KeyboardAndMouseUtils.IsMouseLeft(e)) {
      setIsDragging(false)
      setIsBoxSelecting(false)
    } else {
      setIsPanning(false)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      if (dragTargets.length > 0) {
        processDragNodes(e)
      } else {
        processBoxSelection(e)
      }
    }

    if (isPanning) {
      const pos = KeyboardAndMouseUtils.GetMousePosition(e)

      setPanPosition(prevPos => ({
        x: prevPos.x + (pos.x - prevPanMousePosition.x),
        y: prevPos.y + (pos.y - prevPanMousePosition.y)
      }))

      setPrevPanMousePosition(pos)
    }
  }

  const handleWheel = (e: WheelEvent) => {
    setZoomLevel(prevZoom => {
      const newZoom = Number((prevZoom - (e.deltaY / 1000)).toFixed(2))
      return Math.min(OPTIONS.maxZoom, Math.max(OPTIONS.minZoom, newZoom))
    })
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Delete') {
      dispatch(actions.deleteNodes(selectedNodes))
    }
  }

  // Determine what events we'll be listening to on the main canvas element.
  const canvasEvents: CanvasEvents = {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onWheel: handleWheel,
    onKeyDown: handleKeyDown
  }

  if (isDragging || isPanning) {
    canvasEvents.onMouseMove = handleMouseMove
  }

  return (
    <div
      ref={graphElement}
      className="graph"
      tabIndex={0}
      style={{
        backgroundPosition: `${panPosition.x}px ${panPosition.y}px`,
        backgroundSize: `${zoomLevel * 100}px`
      }}
      {...canvasEvents}
    >
      {/* Do not add elements here. */}
      <div
        className="graph-content"
        style={Vector.ToStyle(panPosition, zoomLevel)}
      >
        {isBoxSelecting && (
          <div
            className="graph-box-selection"
            style={Transform.ToStyle(boxSelectionTransform)}
          ></div>
        )}

        {graphNodes.map(node => (
          <GraphCoordDebug key={node.id} position={node.position}/>
        ))}
        {graphNodes.map(node => (
          <GraphNode
            key={node.id}
            node={node}
            isSelected={selectedNodes.indexOf(node.id) !== -1}
          />
        ))}
      </div>
    </div>
  )
}

export default Graph