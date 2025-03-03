import { useEffect } from 'react'
import { Form, Input, Button, InputNumber, Switch, Space } from 'antd'
import { PickerFormData, PickerConfig } from '../../types/picker'
import styles from './PickerForm.module.css'

const { TextArea } = Input

interface PickerFormProps {
  initialData?: PickerConfig
  onSubmit: (data: PickerFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function PickerForm({ initialData, onSubmit, onCancel }: PickerFormProps) {
  const [form] = Form.useForm()
  
  // 초기값 설정
  useEffect(() => {
    if (initialData) {
      // 항목 배열을 줄바꿈으로 구분된 문자열로 변환
      const itemsText = initialData.items.map(item => item.content).join('\n')
      
      form.setFieldsValue({
        title: initialData.title,
        description: initialData.description,
        items: itemsText,
        pickCount: initialData.pickCount,
        allowDuplicates: initialData.allowDuplicates
      })
    }
  }, [initialData, form])
  
  const handleSubmit = (values: PickerFormData) => {
    onSubmit(values)
  }
  
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        title: '',
        description: '',
        items: '',
        pickCount: 1,
        allowDuplicates: false
      }}
      onFinish={handleSubmit}
      className={styles.form}
    >
      <Form.Item
        label="제목"
        name="title"
        rules={[{ required: true, message: '제목을 입력해주세요' }]}
      >
        <Input placeholder="랜덤 뽑기 제목" />
      </Form.Item>
      
      <Form.Item
        label="설명"
        name="description"
      >
        <TextArea 
          placeholder="랜덤 뽑기에 대한 설명을 입력하세요" 
          rows={2} 
        />
      </Form.Item>
      
      <Form.Item
        label="항목 목록"
        name="items"
        rules={[{ required: true, message: '최소 한 개 이상의 항목을 입력해주세요' }]}
        extra="각 항목을 줄바꿈으로 구분하여 입력하세요"
      >
        <TextArea 
          placeholder="항목 1&#10;항목 2&#10;항목 3" 
          rows={8} 
          className={styles.itemsTextarea}
        />
      </Form.Item>
      
      <div className={styles.settings}>
        <Form.Item
          label="선택할 항목 수"
          name="pickCount"
          rules={[{ required: true, message: '선택할 항목 수를 입력해주세요' }]}
        >
          <InputNumber min={1} />
        </Form.Item>
        
        <Form.Item
          label="중복 선택 허용"
          name="allowDuplicates"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </div>
      
      <Form.Item className={styles.actions}>
        <Space>
          <Button onClick={onCancel}>취소</Button>
          <Button type="primary" htmlType="submit">
            {initialData ? '수정' : '생성'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
} 