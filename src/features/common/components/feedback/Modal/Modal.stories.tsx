import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../../inputs/Button/Button'

const meta: Meta<typeof Modal> = {
  title: 'Components/Feedback/Modal',
  component: Modal,
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof Modal> = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>모달 열기</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="기본 모달"
          footer={
            <div>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                취소
              </Button>
              <Button onClick={() => setIsOpen(false)}>확인</Button>
            </div>
          }
        >
          <p>모달 내용입니다.</p>
        </Modal>
      </>
    )
  }
}

export const Sizes: StoryObj<typeof Modal> = {
  render: () => {
    const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium')
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <div className="flex gap-4">
          <Button onClick={() => { setSize('small'); setIsOpen(true) }}>
            Small
          </Button>
          <Button onClick={() => { setSize('medium'); setIsOpen(true) }}>
            Medium
          </Button>
          <Button onClick={() => { setSize('large'); setIsOpen(true) }}>
            Large
          </Button>
        </div>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={`${size} 모달`}
          size={size}
        >
          <p>다양한 크기의 모달을 지원합니다.</p>
        </Modal>
      </>
    )
  }
} 