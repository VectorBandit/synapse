declare type TGraphNodeType = (
  'variable' |
  'function' |
  'coreFunction' |
  'branch'
)

declare type FGraphNode = {
  id: number
  type: TGraphNodeType
  title: string
  position: FVector
}