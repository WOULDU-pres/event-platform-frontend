import type { Meta, StoryObj } from '@storybook/react'
import { Grid, GridItem } from './Grid'

const meta: Meta<typeof Grid> = {
  title: 'Components/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
}

export default meta

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-blue-100 p-4 text-center rounded">
    {children}
  </div>
)

export const Basic: StoryObj<typeof Grid> = {
  render: () => (
    <Grid columns={12} gap={16}>
      <GridItem span={3}>
        <Box>Span 3</Box>
      </GridItem>
      <GridItem span={6}>
        <Box>Span 6</Box>
      </GridItem>
      <GridItem span={3}>
        <Box>Span 3</Box>
      </GridItem>
    </Grid>
  )
}

export const WithOffset: StoryObj<typeof Grid> = {
  render: () => (
    <Grid columns={12} gap={16}>
      <GridItem span={4}>
        <Box>Span 4</Box>
      </GridItem>
      <GridItem span={4} offset={4}>
        <Box>Span 4, Offset 4</Box>
      </GridItem>
    </Grid>
  )
}

export const Responsive: StoryObj<typeof Grid> = {
  render: () => (
    <Grid columns={12} gap={16}>
      {Array.from({ length: 12 }).map((_, i) => (
        <GridItem key={i}>
          <Box>{i + 1}</Box>
        </GridItem>
      ))}
    </Grid>
  )
} 