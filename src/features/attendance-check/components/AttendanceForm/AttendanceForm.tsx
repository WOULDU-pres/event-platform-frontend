import { Form, Input, DatePicker, InputNumber, Button, Upload, Switch, Space } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { AttendanceEventFormData, AttendanceEvent } from '../../types/attendance'
import styles from './AttendanceForm.module.css'
import dayjs from 'dayjs'
import type { RangePickerProps } from 'antd/es/date-picker'

const { TextArea } = Input
const { RangePicker } = DatePicker

interface AttendanceFormProps {
  initialData?: AttendanceEvent
  onSubmit: (data: AttendanceEventFormData) => void
  onCancel: () => void
}

const stringToMoment = (dateString: string | undefined) => {
  if (!dateString) return undefined;
  try {
    return dayjs(dateString);
  } catch (error) {
    console.error('날짜 변환 오류:', error);
    return undefined;
  }
}

export function AttendanceForm({ initialData, onSubmit, onCancel }: AttendanceFormProps) {
  const [form] = Form.useForm()
  const [qrEnabled, setQrEnabled] = useState(initialData?.qrCodeEnabled || false)

  // 파일 업로드 처리
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // 초기값 설정
  const initialValues = initialData ? {
    title: initialData.title,
    description: initialData.description,
    eventPeriod: [
      stringToMoment(initialData.startDate),
      stringToMoment(initialData.endDate)
    ],
    location: initialData.location,
    maxParticipants: initialData.maxParticipants,
    qrCodeEnabled: initialData.qrCodeEnabled,
    qrCodeValidMinutes: initialData.qrCodeValidMinutes || 5
  } : {
    qrCodeEnabled: false,
    qrCodeValidMinutes: 5
  }

  const handleSubmit = (values: any) => {
    const formData: AttendanceEventFormData = {
      title: values.title,
      description: values.description,
      startDate: values.eventPeriod[0].toISOString(),
      endDate: values.eventPeriod[1].toISOString(),
      location: values.location,
      maxParticipants: values.maxParticipants,
      qrCodeEnabled: values.qrCodeEnabled,
      qrCodeValidMinutes: values.qrCodeValidMinutes,
      checkInMethod: values.checkInMethod || 'QR',
      allowLateCheckIn: values.allowLateCheckIn || false,
      lateThresholdMinutes: values.lateThresholdMinutes || 15
    }

    // 이미지 파일 처리
    if (values.imageUrl && values.imageUrl.length > 0) {
      formData.imageUrl = values.imageUrl[0].originFileObj
    }

    onSubmit(formData)
  }

  const handleQRToggle = (checked: boolean) => {
    setQrEnabled(checked);
    form.setFieldsValue({ qrCodeEnabled: checked });
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
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
        label="이벤트 기간"
        name="eventPeriod"
        rules={[{ required: true, message: '이벤트 기간을 선택해주세요' }]}
      >
        <RangePicker 
          showTime 
          format="YYYY-MM-DD HH:mm" 
          placeholder={['시작일', '종료일']}
          style={{ width: '100%' }}
        />
      </Form.Item>
      
      <Form.Item
        label="장소"
        name="location"
        rules={[{ required: true, message: '장소를 입력해주세요' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        label="최대 참여자 수"
        name="maxParticipants"
        rules={[{ required: true, message: '최대 참여자 수를 입력해주세요' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item
        label="QR 코드 출석체크 사용"
        name="qrCodeEnabled"
        valuePropName="checked"
      >
        <Switch onChange={handleQRToggle} />
      </Form.Item>
      
      {qrEnabled && (
        <Form.Item
          label="QR 코드 유효 시간(분)"
          name="qrCodeValidMinutes"
          rules={[{ required: true, message: 'QR 코드 유효 시간을 입력해주세요' }]}
        >
          <InputNumber min={1} max={60} style={{ width: '100%' }} />
        </Form.Item>
      )}
      
      <Form.Item
        label="이미지"
        name="imageFile"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload 
          name="image" 
          listType="picture" 
          maxCount={1}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>이미지 업로드</Button>
        </Upload>
      </Form.Item>

      <Form.Item className={styles.buttons}>
        <Space>
          <Button onClick={onCancel}>취소</Button>
          <Button type="primary" htmlType="submit">
            {initialData ? '수정하기' : '등록하기'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
} 