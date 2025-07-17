import { ref, onUnmounted } from 'vue'

export interface BaseParticle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  opacity: number
}

export interface SparkleParticle extends BaseParticle {
  type: 'sparkle'
  scale: number
}

export interface ConfettiParticle extends BaseParticle {
  type: 'confetti'
  color: string
  size: number
}

export type Particle = SparkleParticle | ConfettiParticle

export interface ParticleConfig {
  type: 'sparkle' | 'confetti'
  spawnRate?: number
  maxParticles?: number
  duration?: number
  colors?: string[]
  spawnArea?: {
    width: number
    height: number
  }
  velocity?: {
    minX: number
    maxX: number
    minY: number
    maxY: number
  }
  gravity?: number
  fadeRate?: number
}

/**
 * Handles the creation of different types of particles for effects in the game
 * (sparkles and confetti).
 *
 * @param config - The configuration for the particle system
 * @returns An object containing the particles, whether the particles are active, and functions to start and stop the particles
 */
export function useParticleSystem(config: ParticleConfig) {
  const particles = ref<Particle[]>([])
  const isActive = ref(false)
  let animationFrame: number | null = null
  let particleId = 0
  let spawnInterval: number | null = null

  const defaultConfig: Required<ParticleConfig> = {
    type: config.type,
    spawnRate: config.spawnRate ?? 0.3,
    maxParticles: config.maxParticles ?? 50,
    duration: config.duration ?? 3000,
    colors: config.colors ?? ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    spawnArea: config.spawnArea ?? { width: 60, height: 60 },
    velocity: config.velocity ?? { minX: -2, maxX: 2, minY: -3, maxY: 1 },
    gravity: config.gravity ?? 0.05,
    fadeRate: config.fadeRate ?? 0.02,
  }

  /**
   * Creates a sparkle particle at a given position.
   *
   * @param x - The x position of the particle
   * @param y - The y position of the particle
   * @returns The created particle
   */
  function createSparkleParticle(x: number, y: number): SparkleParticle {
    return {
      id: particleId++,
      type: 'sparkle',
      x,
      y,
      vx:
        Math.random() * (defaultConfig.velocity.maxX - defaultConfig.velocity.minX) +
        defaultConfig.velocity.minX,
      vy:
        Math.random() * (defaultConfig.velocity.maxY - defaultConfig.velocity.minY) +
        defaultConfig.velocity.minY,
      opacity: 1,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }
  }

  /**
   * Creates a confetti particle at a given position.
   *
   * @param x - The x position of the particle
   * @param y - The y position of the particle
   * @returns The created particle
   */
  function createConfettiParticle(x: number, y: number): ConfettiParticle {
    return {
      id: particleId++,
      type: 'confetti',
      x,
      y,
      vx:
        Math.random() * (defaultConfig.velocity.maxX - defaultConfig.velocity.minX) +
        defaultConfig.velocity.minX,
      vy:
        Math.random() * (defaultConfig.velocity.maxY - defaultConfig.velocity.minY) +
        defaultConfig.velocity.minY,
      opacity: 1,
      color: defaultConfig.colors[Math.floor(Math.random() * defaultConfig.colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }
  }

  /**
   * Factory function to create a particle at a given position.
   *
   * @param x - The x position of the particle
   * @param y - The y position of the particle
   * @returns The created particle
   */
  function createParticle(x: number, y: number): Particle {
    if (defaultConfig.type === 'sparkle') {
      return createSparkleParticle(x, y)
    } else {
      return createConfettiParticle(x, y)
    }
  }

  /**
   * Spawns a given number of particles at a given position.
   *
   * @param x - The x position of the particles
   * @param y - The y position of the particles
   * @param count - The number of particles to spawn
   */
  function spawnParticles(x: number, y: number, count: number = 1) {
    for (let i = 0; i < count; i++) {
      if (particles.value.length < defaultConfig.maxParticles) {
        particles.value.push(createParticle(x, y))
      }
    }
  }

  /**
   * Updates the particles by applying gravity and fading them out.
   */
  function updateParticles() {
    particles.value = particles.value.filter((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.rotation += particle.rotationSpeed
      particle.vy += defaultConfig.gravity
      particle.opacity -= defaultConfig.fadeRate

      return particle.opacity > 0 && particle.y > -50
    })
  }

  /**
   * Animates the particles by updating their position and spawning new particles.
   */
  function animate() {
    if (!isActive.value) return

    updateParticles()

    if (Math.random() < defaultConfig.spawnRate) {
      const x = Math.random() * defaultConfig.spawnArea.width - defaultConfig.spawnArea.width / 2
      const y = Math.random() * defaultConfig.spawnArea.height - defaultConfig.spawnArea.height / 2
      spawnParticles(x, y, 1)
    }

    animationFrame = requestAnimationFrame(animate)
  }

  /**
   * Starts the particle system
   */
  function start() {
    isActive.value = true
    particles.value = []
    animate()
  }

  /**
   * Stops the particle system
   */
  function stop() {
    isActive.value = false
    particles.value = []
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
    if (spawnInterval) {
      clearInterval(spawnInterval)
      spawnInterval = null
    }
  }

  /**
   * Creates a burst of particles at a given position.
   *
   * @param count - The number of particles to burst
   * @param x - The x position of the burst
   * @param y - The y position of the burst
   */
  function burst(count: number, x: number = 0, y: number = 0) {
    for (let i = 0; i < count; i++) {
      if (particles.value.length < defaultConfig.maxParticles) {
        const offsetX = (Math.random() - 0.5) * defaultConfig.spawnArea.width
        const offsetY = (Math.random() - 0.5) * defaultConfig.spawnArea.height
        particles.value.push(createParticle(x + offsetX, y + offsetY))
      }
    }
  }

  onUnmounted(() => stop())

  return {
    particles,
    isActive,
    start,
    stop,
    burst,
  }
}
