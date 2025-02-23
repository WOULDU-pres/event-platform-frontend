import type { Meta, StoryObj } from '@storybook/react'
import { Image } from './Image'

const meta = {
  title: 'Components/DataDisplay/Image',
  component: Image,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: '이미지 URL',
    },
    alt: {
      control: 'text',
      description: '이미지 대체 텍스트',
    },
    fallbackSrc: {
      control: 'text',
      description: '이미지 로드 실패 시 표시할 대체 이미지 URL',
    },
    width: {
      control: 'text',
      description: '이미지 너비',
    },
    height: {
      control: 'text',
      description: '이미지 높이',
    },
    onClick: {
      action: 'clicked',
      description: '이미지 클릭 시 실행할 함수',
    },
  },
} satisfies Meta<typeof Image>

export default meta
type Story = StoryObj<typeof Image>

export const Default: Story = {
  args: {
    src: 'https://picsum.photos/300/200',
    alt: '샘플 이미지',
  },
}

export const WithCustomSize: Story = {
  args: {
    src: 'https://picsum.photos/300/200',
    alt: '크기가 지정된 이미지',
    width: 200,
    height: 150,
  },
}

export const WithFallback: Story = {
  args: {
    src: 'invalid-image-url',
    alt: '잘못된 이미지 URL',
    fallbackSrc: '/placeholder-image.png',
    width: 300,
    height: 200,
  },
}

export const Clickable: Story = {
  args: {
    src: 'https://picsum.photos/300/200',
    alt: '클릭 가능한 이미지',
    onClick: () => alert('이미지가 클릭되었습니다!'),
  },
} 