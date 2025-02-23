import type { Meta, StoryObj } from '@storybook/react'
import { Container } from './Container'

const meta: Meta<typeof Container> = {
  title: 'Components/Layout/Container',
  component: Container,
  tags: ['autodocs'],
}

export default meta

export const Sizes: StoryObj<typeof Container> = {
  render: () => (
    <div style={{ background: '#f3f4f6' }}>
      <Container size="small" className="bg-white p-4 mb-4">
        <p>Small Container</p>
      </Container>
      <Container size="medium" className="bg-white p-4 mb-4">
        <p>Medium Container</p>
      </Container>
      <Container size="large" className="bg-white p-4 mb-4">
        <p>Large Container</p>
      </Container>
      <Container size="full" className="bg-white p-4">
        <p>Full Width Container</p>
      </Container>
    </div>
  )
}

export const Fluid: StoryObj<typeof Container> = {
  render: () => (
    <Container fluid className="bg-gray-100 p-4">
      <p>Fluid Container with larger padding on desktop</p>
    </Container>
  )
} 