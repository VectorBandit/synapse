class KeyboardAndMouseUtils {
  static IsMouseLeft(e: MouseEvent): boolean {
    return e.button === 0
  }

  static IsMouseMiddle(e: MouseEvent): boolean {
    return e.button === 1
  }

  static IsMouseRight(e: MouseEvent): boolean {
    return e.button === 2
  }

  static GetMousePosition(e: MouseEvent): FVector {
    return {
      x: e.pageX,
      y: e.pageY
    }
  }
}

export default KeyboardAndMouseUtils