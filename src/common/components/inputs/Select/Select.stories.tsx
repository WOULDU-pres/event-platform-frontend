import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'

const meta: Meta<typeof Select> = {
  title: 'Components/Inputs/Select',
  component: Select,
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof Select> = {
  render: () => (
    <Select>
      <option value="">선택하세요</option>
      <option value="1">옵션 1</option>
      <option value="2">옵션 2</option>
      <option value="3">옵션 3</option>
    </Select>
  )
}

export const WithLabel: StoryObj<typeof Select> = {
  render: () => (
    <Select label="선택">
      <option value="">선택하세요</option>
      <option value="1">옵션 1</option>
      <option value="2">옵션 2</option>
      <option value="3">옵션 3</option>
    </Select>
  )
}

export const WithError: StoryObj<typeof Select> = {
  render: () => (
    <Select
      label="선택"
      error="필수 항목입니다"
    >
      <option value="">선택하세요</option>
      <option value="1">옵션 1</option>
      <option value="2">옵션 2</option>
      <option value="3">옵션 3</option>
    </Select>
  )
} 