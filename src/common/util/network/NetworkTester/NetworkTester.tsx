import { useState, useEffect } from 'react'

const NetworkTester = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const testOfflineRequest = async () => {
    try {
      // 오프라인 상태에서 API 요청
      const response = await fetch('https://api.example.com/test')
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error('Offline request error:', error)
    }
  }

  return (
    <div>
      <div>네트워크 상태: {isOnline ? '온라인' : '오프라인'}</div>
      <button onClick={testOfflineRequest}>
        오프라인 요청 테스트
      </button>
      <p className="text-sm text-gray-500">
        * 개발자 도구의 Network 탭에서 "Offline" 설정 후 테스트 가능
      </p>
    </div>
  )
}

export default NetworkTester 