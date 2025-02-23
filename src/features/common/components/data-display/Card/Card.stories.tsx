import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import { Badge } from '../Badge/Badge'

const meta: Meta<typeof Card> = {
  title: 'Components/DataDisplay/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof Card> = {
  render: () => (
    <Card
      title="카드 제목"
      subtitle="카드 부제목"
      footer={<button className="btn-primary">자세히 보기</button>}
    >
      <p>카드 내용입니다.</p>
    </Card>
  )
}

export const WithBadge: StoryObj<typeof Card> = {
  render: () => (
    <Card
      title={
        <div className="flex items-center gap-2">
          <span>프로젝트 상태</span>
          <Badge variant="success">진행중</Badge>
        </div>
      }
    >
      <p>프로젝트 상세 내용입니다.</p>
    </Card>
  )
} 