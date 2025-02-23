import { toast } from 'react-hot-toast'

interface OfflineQueueItem {
  id: string
  timestamp: number
  retry: () => Promise<void>
}

export class OfflineManager {
  private queue: OfflineQueueItem[] = []
  private isOnline: boolean = navigator.onLine
  private maxQueueAge = 1000 * 60 * 60 // 1시간

  constructor() {
    this.setupListeners()
  }

  private setupListeners() {
    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)
  }

  private handleOnline = async () => {
    this.isOnline = true
    toast.success('네트워크가 복구되었습니다')
    await this.processQueue()
  }

  private handleOffline = () => {
    this.isOnline = false
    toast.error('네트워크 연결이 끊겼습니다')
  }

  private async processQueue() {
    const now = Date.now()
    const validItems = this.queue.filter(item => now - item.timestamp < this.maxQueueAge)
    
    if (validItems.length !== this.queue.length) {
      toast.error('일부 작업이 만료되어 다시 시도해주세요')
    }

    this.queue = validItems
    
    for (const item of this.queue) {
      try {
        await item.retry()
        this.queue = this.queue.filter(i => i.id !== item.id)
      } catch (error) {
        console.error('Failed to process queued item:', error)
      }
    }
  }

  enqueue(id: string, retryFn: () => Promise<void>) {
    this.queue.push({
      id,
      timestamp: Date.now(),
      retry: retryFn
    })
    
    if (!this.isOnline) {
      toast('오프라인 상태입니다. 네트워크 연결 시 자동으로 재시도됩니다.')
    }
  }

  cleanup() {
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)
  }
}

export const offlineManager = new OfflineManager() 