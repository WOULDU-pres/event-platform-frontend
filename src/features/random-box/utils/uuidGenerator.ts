/**
 * 사용자 식별을 위한 UUID 생성 및 관리
 */

const UUID_STORAGE_KEY = 'random-box-user-uuid'

/**
 * 저장된 UUID를 가져오거나 없으면 새로 생성하여 저장
 */
export const getUserUuid = (): string => {
  // 저장된 UUID가 있는지 확인
  let uuid = localStorage.getItem(UUID_STORAGE_KEY)
  
  // 없으면 새로 생성하고 저장
  if (!uuid) {
    uuid = generateUuid()
    localStorage.setItem(UUID_STORAGE_KEY, uuid)
  }
  
  return uuid
}

/**
 * 새로운 UUID 생성
 */
export const generateUuid = (): string => {
  return crypto.randomUUID()
}

/**
 * 현재 UUID 초기화 및 재생성
 */
export const resetUserUuid = (): string => {
  const newUuid = generateUuid()
  localStorage.setItem(UUID_STORAGE_KEY, newUuid)
  return newUuid
} 