import { Button, Card, Typography, Spin, Space, Flex, QRCode, Tag } from 'antd'
import { SyncOutlined, ReloadOutlined } from '@ant-design/icons'
import { useGenerateQRCode } from '../../api/attendanceApi'
import styles from './QRCodeGenerator.module.css'
import { useState, useEffect } from 'react'
import { AttendanceQRCode } from '../../types/attendance'
import { ATTENDANCE_QR_COLORS } from '../../constants/attendanceConstants'

const { Title, Text } = Typography

interface QRCodeGeneratorProps {
  eventId: string
  validMinutes: number
}

export function QRCodeGenerator({ eventId, validMinutes }: QRCodeGeneratorProps) {
  const [qrCode, setQrCode] = useState<AttendanceQRCode | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const { mutate: generateQRCode, isPending } = useGenerateQRCode()

  // QR 코드 생성
  const handleGenerateQRCode = () => {
    generateQRCode(eventId, {
      onSuccess: (data) => {
        setQrCode(data)
        const expiresIn = Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000)
        setTimeLeft(expiresIn > 0 ? expiresIn : 0)
      }
    })
  }

  // 남은 시간 카운트다운
  useEffect(() => {
    if (!timeLeft) return
    
    const intervalId = setInterval(() => {
      setTimeLeft(prevTimeLeft => {
        if (prevTimeLeft <= 1) {
          clearInterval(intervalId)
          return 0
        }
        return prevTimeLeft - 1
      })
    }, 1000)
    
    return () => clearInterval(intervalId)
  }, [timeLeft])

  // 시간 형식화 (MM:SS)
  const formatTimeLeft = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // 남은 시간에 따른 색상 설정
  const getColorByTimeLeft = () => {
    const percentage = (timeLeft / (validMinutes * 60)) * 100
    
    if (percentage > 50) return ATTENDANCE_QR_COLORS.HIGH
    if (percentage > 20) return ATTENDANCE_QR_COLORS.MEDIUM
    return ATTENDANCE_QR_COLORS.LOW
  }

  return (
    <Card className={styles.card} title="QR 코드 출석체크">
      <div className={styles.qrContainer}>
        {isPending ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : qrCode && timeLeft > 0 ? (
          <Flex vertical align="center" gap="middle">
            <QRCode
              value={qrCode.code}
              size={240}
              color={getColorByTimeLeft()}
              bordered={false}
              errorLevel="H"
              icon="/logo192.png"
              status={timeLeft < 30 ? "expired" : "active"}
            />
            <Space direction="vertical" align="center">
              <Tag color={timeLeft < 30 ? "error" : "success"}>
                {timeLeft < 30 ? "만료 임박" : "활성화"}
              </Tag>
              <Text strong style={{ fontSize: '18px' }}>
                남은 시간: {formatTimeLeft(timeLeft)}
              </Text>
              <Text type="secondary">
                {validMinutes}분 동안 유효한 QR 코드입니다
              </Text>
            </Space>
          </Flex>
        ) : (
          <div className={styles.empty}>
            <Title level={4}>QR 코드를 생성하세요</Title>
            <Text type="secondary">
              {validMinutes}분 동안 유효한 QR 코드가 생성됩니다.
              참석자들이 이 QR 코드를 스캔하여 출석할 수 있습니다.
            </Text>
          </div>
        )}
      </div>
      
      <div className={styles.buttonContainer}>
        <Button
          type="primary"
          icon={qrCode && timeLeft > 0 ? <ReloadOutlined /> : <SyncOutlined />}
          onClick={handleGenerateQRCode}
          loading={isPending}
          size="large"
          className={styles.generateButton}
        >
          {qrCode && timeLeft > 0 ? 'QR 코드 새로 생성하기' : 'QR 코드 생성하기'}
        </Button>
      </div>
    </Card>
  )
} 