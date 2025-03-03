import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Button, Card, Spin, Result } from 'antd'
import { ArrowLeftOutlined, QrcodeOutlined, ReloadOutlined } from '@ant-design/icons'
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner'
import { useAttendanceQR } from '../../hooks/useAttendance'
import styles from './AttendanceScanPage.module.css'

const { Title, Text, Paragraph } = Typography

export function AttendanceScanPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [scanComplete, setScanComplete] = useState(false)
  const [scanResult, setScanResult] = useState<{success: boolean, message: string} | null>(null)
  
  const { 
    handleCheckIn, 
    isCheckingIn, 
    contextHolder 
  } = useAttendanceQR(id)

  // 카메라 권한 확인
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach(track => track.stop())
        setHasCameraPermission(true)
      } catch (error) {
        console.error('카메라 권한 오류:', error)
        setHasCameraPermission(false)
        setCameraError('카메라에 접근할 수 없습니다. 권한을 확인해주세요.')
      }
    }
    
    checkCameraPermission()
  }, [])

  // QR 코드 스캔 처리
  const handleScan = async (data: string) => {
    if (data && !isCheckingIn && !scanComplete) {
      setScanComplete(true)
      
      try {
        const result = await handleCheckIn(data, id)
        setScanResult({
          success: true,
          message: '출석체크가 완료되었습니다.'
        })
      } catch (error) {
        setScanResult({
          success: false,
          message: '출석체크에 실패했습니다. 유효하지 않은 QR 코드입니다.'
        })
      }
    }
  }

  // 에러 처리
  const handleScanError = (error: Error) => {
    console.error('QR 스캔 오류:', error)
    setCameraError(`QR 스캔 중 오류가 발생했습니다: ${error.message}`)
  }

  // 다시 스캔
  const handleRescan = () => {
    setScanComplete(false)
    setScanResult(null)
  }

  // 뒤로가기
  const handleBack = () => {
    navigate(`/attendance/${id}`)
  }

  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.header}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          className={styles.backButton}
        >
          돌아가기
        </Button>
        <Title level={2} className={styles.title}>QR 코드 스캔</Title>
      </div>

      <Card className={styles.scannerCard}>
        {/* 로딩 상태 */}
        {hasCameraPermission === null && (
          <div className={styles.centeredContent}>
            <Spin size="large" />
            <Text className={styles.loadingText}>카메라 권한 확인 중...</Text>
          </div>
        )}

        {/* 카메라 권한 없음 */}
        {hasCameraPermission === false && (
          <Result
            status="warning"
            title="카메라 접근 권한이 필요합니다"
            subTitle={cameraError || '브라우저 설정에서 카메라 권한을 허용해주세요'}
            extra={
              <Button type="primary" onClick={() => window.location.reload()}>
                다시 시도
              </Button>
            }
          />
        )}

        {/* 카메라 에러 */}
        {cameraError && hasCameraPermission !== false && (
          <Result
            status="error"
            title="카메라 오류"
            subTitle={cameraError}
            extra={
              <Button type="primary" onClick={() => window.location.reload()}>
                다시 시도
              </Button>
            }
          />
        )}

        {/* 스캔 결과 */}
        {scanResult && (
          <Result
            status={scanResult.success ? "success" : "error"}
            title={scanResult.success ? "출석체크 완료" : "출석체크 실패"}
            subTitle={scanResult.message}
            extra={[
              <Button 
                key="rescan" 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={handleRescan}
              >
                다시 스캔하기
              </Button>,
              <Button 
                key="back" 
                onClick={handleBack}
              >
                이벤트로 돌아가기
              </Button>
            ]}
          />
        )}

        {/* QR 스캐너 */}
        {hasCameraPermission && !cameraError && !scanResult && (
          <>
            <div className={styles.scannerContainer}>
              <Scanner
                onScan={(detectedCodes: IDetectedBarcode[]) => {
                  if (detectedCodes && detectedCodes.length > 0) {
                    handleScan(detectedCodes[0].rawValue)
                  }
                }}
                onError={(error: unknown) => handleScanError(error as Error)}
                constraints={{
                  facingMode: 'environment'
                }}
              />
              <div className={styles.overlay}>
                <div className={styles.scannerFrame} />
              </div>
            </div>
            <div className={styles.scannerInstructions}>
              <Paragraph>
                <QrcodeOutlined className={styles.qrIcon} />
                <Text strong>QR 코드를 프레임 안에 위치시켜주세요</Text>
              </Paragraph>
              <Text type="secondary">
                출석체크용 QR 코드가 자동으로 인식됩니다
              </Text>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
