export class Vector {
  static Round(v: FVector, to: number): FVector {
    let {x, y} = v

    if (x % to !== 0) x -= x % to
    if (y % to !== 0) y -= y % to

    return {x: x, y: y}
  }

  static Add = (v1: FVector, v2: FVector): FVector => ({
    x: v1.x + v2.x,
    y: v1.y + v2.y
  })

  static Subtract = (v1: FVector, v2: FVector): FVector => ({
    x: v1.x - v2.x,
    y: v1.y - v2.y
  })

  static Sign = (v: FVector) => ({
    x: Math.sign(v.x),
    y: Math.sign(v.y)
  })

  static ToStyle = (v: FVector, scale?: number): FVectorCSS => {
    let t = `translate(${v.x}px, ${v.y}px)`
    if (scale) t += ` scale(${scale})`
    return {transform: t}
  }

  static Zero: FVector = {
    x: 0,
    y: 0
  }
}

export class Transform {
  static Zero: FTransform = {
    position: Vector.Zero,
    size: Vector.Zero
  }

  static ToStyle = (t: FTransform): FTransformCSS => ({
    transform: Vector.ToStyle(t.position).transform,
    width: `${t.size.x}px`,
    height: `${t.size.y}px`
  })
}