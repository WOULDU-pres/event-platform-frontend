import { Form, Input, DatePicker, InputNumber, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { RaffleEventFormData } from '../../types/raffle'
import styles from './RaffleForm.module.css'

const { TextArea } = Input
const { RangePicker } = DatePicker

interface RaffleFormProps {
  initialData?: Partial<RaffleEventFormData>
  onSubmit: (data: RaffleEventFormData) => void
  onCancel: () => void
}

export function RaffleForm({ initialData, onSubmit, onCancel }: RaffleFormProps) {
  const [form] = Form.useForm()

  const handleSubmit = (values: any) => {
    const formData: RaffleEventFormData = {
      ...values,
      startDate: values.eventPeriod[0].format(),
      endDate: values.eventPeriod[1].format(),
      drawDate: values.drawDate.format(),
    }
    onSubmit(formData)
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialData}
      onFinish={handleSubmit}
      className={styles.form}
    >
      <Form.Item
        label="이벤트명"
        name="title"
        rules={[{ required: true, message: '이벤트명을 입력해주세요' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="이벤트 설명"
        name="description"
        rules={[{ required: true, message: '이벤트 설명을 입력해주세요' }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="응모 기간"
        name="eventPeriod"
        rules={[{ required: true, message: '응모 기간을 선택해주세요' }]}
      >
        <RangePicker showTime format="YYYY-MM-DD HH:mm" />
      </Form.Item>

      <Form.Item
        label="추첨일"
        name="drawDate"
        rules={[{ required: true, message: '추첨일을 선택해주세요' }]}
      >
        <DatePicker showTime format="YYYY-MM-DD HH:mm" />
      </Form.Item>

      <div className={styles.numberGroup}>
        <Form.Item
          label="최대 참여자 수"
          name="maxParticipants"
          rules={[{ required: true, message: '최대 참여자 수를 입력해주세요' }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item
          label="당첨자 수"
          name="numberOfWinners"
          rules={[{ required: true, message: '당첨자 수를 입력해주세요' }]}
        >
          <InputNumber min={1} />
        </Form.Item>
      </div>

      <div className={styles.prizes}>
        <div className={styles.prizesHeader}>
          <h3>경품 정보</h3>
          <Button 
            type="dashed" 
            icon={<PlusOutlined />}
            onClick={() => {/* 경품 추가 로직 */}}
          >
            경품 추가
          </Button>
        </div>
        {/* 경품 목록 Form.List 구현 */}
      </div>

      <div className={styles.actions}>
        <Button onClick={onCancel}>취소</Button>
        <Button type="primary" htmlType="submit">저장</Button>
      </div>
    </Form>
  )
} 