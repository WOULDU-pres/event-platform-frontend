import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Components/DataDisplay/Badge',
  component: Badge,
  tags: ['autodocs'],
}

export default meta

export const Variants: StoryObj<typeof Badge> = {
  render: () => (
    <div className="flex gap-4">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  )
}

export const Sizes: StoryObj<typeof Badge> = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge size="small">Small</Badge>
      <Badge size="medium">Medium</Badge>
      <Badge size="large">Large</Badge>
    </div>
  )
}

export const WithDot: StoryObj<typeof Badge> = {
  render: () => (
    <div className="flex gap-4">
      <Badge dot variant="success">활성</Badge>
      <Badge dot variant="error">비활성</Badge>
    </div>
  )
} 