import { ErrorCode } from '../../types/error'
import { toast } from 'react-hot-toast'

interface SessionHandlerOptions {
  refreshTokenEndpoint: string
  onSessionExpired: () => void
}

export class SessionHandler {
  private options: SessionHandlerOptions

  constructor(options: SessionHandlerOptions) {
    this.options = options
  }

  async handleAuthError(error: Error): Promise<boolean> {
    if (error.message.includes(ErrorCode.UNAUTHORIZED)) {
      try {
        const refreshed = await this.refreshSession()
        if (refreshed) {
          return true
        }
      } catch (refreshError) {
        console.error('Failed to refresh session:', refreshError)
      }
      
      this.handleSessionExpired()
      return false
    }
    return false
  }

  private async refreshSession(): Promise<boolean> {
    try {
      const response = await fetch(this.options.refreshTokenEndpoint, {
        method: 'POST',
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to refresh token')
      }

      return true
    } catch (error) {
      return false
    }
  }

  private handleSessionExpired(): void {
    toast.error('세션이 만료되었습니다. 다시 로그인해주세요.')
    this.options.onSessionExpired()
  }
}

export const sessionHandler = new SessionHandler({
  refreshTokenEndpoint: '/api/auth/refresh',
  onSessionExpired: () => {
    window.location.href = '/login'
  }
}) 