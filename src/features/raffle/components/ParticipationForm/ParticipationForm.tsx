import { Form, Input, Checkbox, Button } from 'antd'
import { RaffleParticipationFormData } from '../../types/raffle'
import styles from './ParticipationForm.module.css'

interface ParticipationFormProps {
  onSubmit: (data: RaffleParticipationFormData) => void
}

export function ParticipationForm({ onSubmit }: ParticipationFormProps) {
  const [form] = Form.useForm()

  const handleSubmit = (values: RaffleParticipationFormData) => {
    if (values.agreement) {
      onSubmit(values)
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className={styles.form}
    >
      <Form.Item
        label="이름"
        name="userName"
        rules={[{ required: true, message: '이름을 입력해주세요' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="이메일"
        name="email"
        rules={[
          { required: true, message: '이메일을 입력해주세요' },
          { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="전화번호"
        name="phoneNumber"
        rules={[
          { required: true, message: '전화번호를 입력해주세요' },
          { pattern: /^[0-9]{10,11}$/, message: '올바른 전화번호 형식이 아닙니다' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          { 
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('개인정보 수집에 동의해주세요')),
          },
        ]}
      >
        <Checkbox>
          개인정보 수집에 동의합니다
        </Checkbox>
      </Form.Item>

      <Form.Item className={styles.actions}>
        <Button type="primary" htmlType="submit" block>
          참여하기
        </Button>
      </Form.Item>
    </Form>
  )
}