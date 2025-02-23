import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Toast, ToastContainer } from './Toast'
import { Button } from '../../inputs/Button/Button'

const meta: Meta<typeof Toast> = {
  title: 'Components/Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
}

export default meta

export const Types: StoryObj<typeof Toast> = {
  render: () => {
    const [toasts, setToasts] = useState<Array<{ id: number; type: 'info' | 'success' | 'warning' | 'error'; message: string }>>([])

    const addToast = (type: 'info' | 'success' | 'warning' | 'error') => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, type, message: `${type} 메시지입니다.` }])
    }

    const removeToast = (id: number) => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }

    return (
      <>
        <div className="flex gap-4">
          <Button onClick={() => addToast('info')}>Info</Button>
          <Button onClick={() => addToast('success')}>Success</Button>
          <Button onClick={() => addToast('warning')}>Warning</Button>
          <Button onClick={() => addToast('error')}>Error</Button>
        </div>
        <ToastContainer>
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </ToastContainer>
      </>
    )
  }
} 