import { useState } from 'react'
import { Button } from '../../../../common/components/inputs/Button/Button'
import styles from './ParticipationForm.module.css'
import { RaffleParticipationFormData } from '../../types/raffle'

interface ParticipationFormProps {
  onSubmit: (data: RaffleParticipationFormData) => void
}

export function ParticipationForm({ onSubmit }: ParticipationFormProps) {
  const [formData, setFormData] = useState<RaffleParticipationFormData>({
    userName: '',
    email: '',
    phoneNumber: '',
    agreement: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.agreement) {
      onSubmit(formData)
    } else {
      alert('개인정보 수집에 동의해주세요.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formItem}>
        <label>이름</label>
        <input
          type="text"
          value={formData.userName}
          onChange={e => setFormData({ ...formData, userName: e.target.value })}
          required
        />
      </div>
      <div className={styles.formItem}>
        <label>이메일</label>
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className={styles.formItem}>
        <label>전화번호</label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />
      </div>
      <div className={styles.formItem}>
        <label>
          <input
            type="checkbox"
            checked={formData.agreement}
            onChange={e => setFormData({ ...formData, agreement: e.target.checked })}
          />
          개인정보 수집에 동의합니다.
        </label>
      </div>
      <Button type="submit">참여하기</Button>
    </form>
  )
}