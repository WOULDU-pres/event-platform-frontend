import { ReactNode } from 'react'

interface FeatureCard {
  id: string
  title: string
  description: string
  path: string
  icon: ReactNode
  backgroundColor: string
} 

export type { FeatureCard }