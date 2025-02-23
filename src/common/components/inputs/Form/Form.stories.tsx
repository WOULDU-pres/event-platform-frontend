import type { Meta, StoryObj } from '@storybook/react'
import { Form, FormItem } from './Form'
import { Button } from '../Button/Button'
import { Select } from '../Select/Select'

const meta: Meta<typeof Form> = {
  title: 'Components/Inputs/Form',
  component: Form,
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof Form> = {
  render: () => (
    <Form onSubmit={(e) => console.log('Form submitted', e)}>
      <FormItem label="이름" required>
        <input type="text" className="form-input" />
      </FormItem>
      <FormItem label="이메일" error="올바른 이메일 형식이 아닙니다">
        <input type="email" className="form-input" />
      </FormItem>
      <FormItem label="구분">
        <Select>
          <option value="">선택하세요</option>
          <option value="1">옵션 1</option>
          <option value="2">옵션 2</option>
        </Select>
      </FormItem>
      <Button type="submit">제출</Button>
    </Form>
  )
} 