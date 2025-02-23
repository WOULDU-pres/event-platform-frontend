import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
}

export default meta

export const Types: StoryObj<typeof Alert> = {
  render: () => (
    <div>
      <Alert type="info" title="정보">
        일반적인 정보를 표시합니다.
      </Alert>
      <Alert type="success" title="성공">
        작업이 성공적으로 완료되었습니다.
      </Alert>
      <Alert type="warning" title="경고">
        주의가 필요한 상황입니다.
      </Alert>
      <Alert type="error" title="오류">
        오류가 발생했습니다.
      </Alert>
    </div>
  )
}

export const Closable: StoryObj<typeof Alert> = {
  render: () => (
    <Alert type="info" onClose={() => console.log('Alert closed')}>
      닫기 버튼이 있는 알림입니다.
    </Alert>
  )
} 