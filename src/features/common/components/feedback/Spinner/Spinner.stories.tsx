import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Components/Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
}

export default meta

export const Sizes: StoryObj<typeof Spinner> = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="small" />
      <Spinner size="medium" />
      <Spinner size="large" />
    </div>
  )
}

export const Colors: StoryObj<typeof Spinner> = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner color="#2563eb" />
      <Spinner color="#16a34a" />
      <Spinner color="#dc2626" />
    </div>
  )
} 