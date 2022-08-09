export interface Media {
  active: boolean
  isPending: boolean
  className?: string
}

export const BoundaryVariant = {
  mobile: 'mobile', // Desktop
  desktop: 'desktop' // Mobile
} as const

export type TBoundaryVariant =
  typeof BoundaryVariant[keyof typeof BoundaryVariant]
