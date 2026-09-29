export const ottTokens = {
  color: {
    brand: {
      navy: '#0D1B3D',
      blue: '#1677E8',
      sky: '#3FA9F5',
      lightBlue: '#8ACBFF',
      gold: '#FFC43D',
      teal: '#35C7A4',
      lavender: '#AFA2F5',
      peach: '#FFB084',
      coral: '#FF6B5A',
    },
    neutral: {
      softWhite: '#F8FAFD',
      white: '#FFFFFF',
      cream: '#FFF9F0',
      dark: '#091326',
      muted: '#5B6680',
      mutedLight: '#A9B4C8',
      hairline: '#E7EBF2',
      borderStrong: '#CBD5E1',
      darkBorder: '#28405E',
    },
    semantic: {
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },
  typography: {
    display: 'Instrument Sans, Geist, sans-serif',
    ui: 'Geist, Inter, sans-serif',
    mono: 'Geist Mono, ui-monospace, monospace',
  },
  spacing: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128] as const,
  radius: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    pill: 9999,
  },
  motion: {
    fast: 80,
    standard: 160,
    emphasis: 240,
    world: 420,
    celebration: 720,
  },
  breakpoint: {
    mobile: 768,
    tablet: 1024,
    desktop: 1440,
  },
  three: {
    floor: {
      height: 0.9,
      depth: 6,
      width: 12,
      spacing: 0.12,
    },
    tower: {
      baseHeight: 4,
      setbackEvery: 12,
      glassOpacity: 0.72,
    },
    camera: {
      defaultDistance: 34,
      minDistance: 14,
      maxDistance: 88,
    },
    environment: {
      fogNear: 45,
      fogFar: 160,
    },
  },
} as const

export type OttWorldState = 'day' | 'sunset' | 'night'

export const ottWorldState = {
  day: {
    skyColor: '#83CBFF',
    waterColor: '#46B8EA',
    ambientLight: 1.1,
    directionalLight: 2.6,
    buildingWindowIntensity: 0.1,
    cloudBrightness: 1,
    aircraftLightIntensity: 0.2,
    signageBrightness: 0.6,
    mascotHighlight: 1,
  },
  sunset: {
    skyColor: '#F49A72',
    waterColor: '#C98787',
    ambientLight: 0.75,
    directionalLight: 1.8,
    buildingWindowIntensity: 0.8,
    cloudBrightness: 0.86,
    aircraftLightIntensity: 0.8,
    signageBrightness: 1,
    mascotHighlight: 1.15,
  },
  night: {
    skyColor: '#081529',
    waterColor: '#0F4266',
    ambientLight: 0.22,
    directionalLight: 0.45,
    buildingWindowIntensity: 2.2,
    cloudBrightness: 0.35,
    aircraftLightIntensity: 1.8,
    signageBrightness: 1.6,
    mascotHighlight: 1.3,
  },
} satisfies Record<OttWorldState, {
  skyColor: string
  waterColor: string
  ambientLight: number
  directionalLight: number
  buildingWindowIntensity: number
  cloudBrightness: number
  aircraftLightIntensity: number
  signageBrightness: number
  mascotHighlight: number
}>

export const ottComponentTokens = {
  maxContentWidth: 1280,
  buttonHeight: 44,
  inputHeight: 48,
  minTouchTarget: 44,
  featureCardRadius: 24,
  heroArtworkRadius: 32,
} as const
