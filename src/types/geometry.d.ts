declare type FVector = {
  x: number
  y: number
}

declare type FTransform = {
  position: FVector,
  size: FVector
}

declare type FVectorCSS = {
  transform: string
}

declare type FTransformCSS = {
  transform: string
  width: string
  height: string
}