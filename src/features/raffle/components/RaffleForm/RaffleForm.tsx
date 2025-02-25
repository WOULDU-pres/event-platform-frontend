import { Form, Input, DatePicker, InputNumber, Button, Upload, Card, Row, Col, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { RaffleEventFormData } from '../../types/raffle'
import styles from './RaffleForm.module.css'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const { TextArea } = Input
const { RangePicker } = DatePicker

interface RaffleFormProps {
  initialData?: Partial<RaffleEventFormData>
  onSubmit: (data: RaffleEventFormData) => void
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
};

export function RaffleForm({ initialData, onSubmit, onCancel }: RaffleFormProps) {
  const [form] = Form.useForm()
  const [prizeImagePreviews, setPrizeImagePreviews] = useState<Record<string, string>>({})

  const initialValues = initialData
    ? {
        ...initialData,
        eventPeriod: [
          stringToMoment(initialData.startDate),
          stringToMoment(initialData.endDate)
        ],
        drawDate: stringToMoment(initialData.drawDate),
        prizes: initialData.prizes || [{}]
      }
    : {
        prizes: [{}]
      };

  const handleSubmit = (values: any) => {
    const formattedData: RaffleEventFormData = {
      ...values,
      startDate: values.eventPeriod?.[0]?.toISOString() || '',
      endDate: values.eventPeriod?.[1]?.toISOString() || '',
      drawDate: values.drawDate?.toISOString() || '',
      prizes: (values.prizes || []).map((prize: any) => ({
        ...prize,
        imageFile: prize.imageFile?.fileList?.[0]?.originFileObj
      }))
    }
    onSubmit(formattedData)
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  const handlePrizeImageChange = (info: any, fieldKey: number) => {
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      const reader = new FileReader()
      reader.onload = () => {
        setPrizeImagePreviews(prev => ({ 
          ...prev, 
          [fieldKey]: reader.result as string 
        }))
      }
      reader.readAsDataURL(info.file.originFileObj)
    }
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
        label="응모 기간"
        name="eventPeriod"
        rules={[{ required: true, message: '응모 기간을 선택해주세요' }]}
      >
        <RangePicker 
          showTime 
          format="YYYY-MM-DD HH:mm" 
          placeholder={['시작일', '종료일']}
          style={{ width: '100%' }}
        />
      </Form.Item>
      
      <Form.Item
        label="추첨일"
        name="drawDate"
        rules={[{ required: true, message: '추첨일을 입력해주세요' }]}
      >
        <DatePicker 
          showTime 
          format="YYYY-MM-DD HH:mm" 
          placeholder="추첨일 선택" 
          style={{ width: '100%' }} 
        />
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
        </div>
        
        <Form.List name="prizes">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card 
                  key={key} 
                  className={styles.prizeCard}
                  title={`경품 ${name + 1}`}
                  extra={
                    <Button 
                      type="text" 
                      danger 
                      icon={<MinusCircleOutlined />} 
                      onClick={() => remove(name)} 
                    />
                  }
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        label="경품명"
                        rules={[{ required: true, message: '경품명을 입력해주세요' }]}
                      >
                        <Input placeholder="경품명" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'rank']}
                        label="순위"
                        rules={[{ required: true, message: '순위를 입력해주세요' }]}
                      >
                        <InputNumber min={1} placeholder="순위" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                    label="설명"
                  >
                    <TextArea rows={2} placeholder="경품 설명" />
                  </Form.Item>
                  
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        label="수량"
                        rules={[{ required: true, message: '수량을 입력해주세요' }]}
                      >
                        <InputNumber min={1} placeholder="수량" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'imageFile']}
                        label="이미지"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                      >
                        <Upload
                          name="image"
                          listType="picture-card"
                          beforeUpload={() => false}
                          onChange={(info) => handlePrizeImageChange(info, name)}
                          maxCount={1}
                        >
                          {!prizeImagePreviews[name] && (
                            <div>
                              <UploadOutlined />
                              <div style={{ marginTop: 8 }}>이미지 업로드</div>
                            </div>
                          )}
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))}
              
              <Form.Item className={styles.addPrizeButton}>
                <Button 
                  type="dashed" 
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  block
                >
                  경품 추가
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>

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