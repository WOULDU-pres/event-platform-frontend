import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Inputs/Button',
  component: Button,
  tags: ['autodocs'],
}

export default meta

export const Variants: StoryObj<typeof Button> = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  )
}

export const Sizes: StoryObj<typeof Button> = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  )
}

export const WithIcon: StoryObj<typeof Button> = {
  render: () => (
    <Button icon={<span className="material-icons">add</span>}>
      Add Item
    </Button>
  )
}

export const Loading: StoryObj<typeof Button> = {
  render: () => (
    <div className="flex gap-4">
      <Button loading>Loading</Button>
      <Button loading variant="outline">Loading</Button>
    </div>
  )
} 