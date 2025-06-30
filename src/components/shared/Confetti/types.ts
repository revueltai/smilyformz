export interface ConfettiProps {
  isActive: boolean
  duration?: number
}

export interface ConfettiPiece {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  color: string
  size: number
  opacity: number
}
