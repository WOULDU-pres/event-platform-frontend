import { useState } from 'react'
import { Form, FormItem } from '../../../../common/components/inputs/Form/Form'
import { Button } from '../../../../common/components/inputs/Button/Button'
import styles from './RaffleForm.module.css'

interface RaffleFormProps {
  initialData?: Partial<RaffleEventFormData>
  onSubmit: (data: RaffleEventFormData) => void
  onCancel: () => void
}

export function RaffleForm({ 
  initialData, 
  onSubmit, 
  onCancel 
}: RaffleFormProps) {
  const [formData, setFormData] = useState<RaffleEventFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    drawDate: initialData?.drawDate || '',
    maxParticipants: initialData?.maxParticipants || 100,
    numberOfWinners: initialData?.numberOfWinners || 1,
    prizes: initialData?.prizes || [{
      name: '',
      description: '',
      quantity: 1,
      rank: 1
    }]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addPrize = () => {
    setFormData(prev => ({
      ...prev,
      prizes: [
        ...prev.prizes,
        {
          name: '',
          description: '',
          quantity: 1,
          rank: prev.prizes.length + 1
        }
      ]
    }))
  }

  const removePrize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index)
    }))
  }

  return (
    <Form onSubmit={handleSubmit} className={styles.form}>
      <FormItem label="이벤트명" required>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="form-input"
          required
        />
      </FormItem>

      <FormItem label="이벤트 설명" required>
        <textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="form-input"
          rows={4}
          required
        />
      </FormItem>

      <div className={styles.dateGroup}>
        <FormItem label="시작일" required>
          <input
            type="datetime-local"
            value={formData.startDate}
            onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="form-input"
            required
          />
        </FormItem>

        <FormItem label="종료일" required>
          <input
            type="datetime-local"
            value={formData.endDate}
            onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="form-input"
            required
          />
        </FormItem>

        <FormItem label="추첨일" required>
          <input
            type="datetime-local"
            value={formData.drawDate}
            onChange={e => setFormData(prev => ({ ...prev, drawDate: e.target.value }))}
            className="form-input"
            required
          />
        </FormItem>
      </div>

      <div className={styles.numberGroup}>
        <FormItem label="최대 참여자 수" required>
          <input
            type="number"
            value={formData.maxParticipants}
            onChange={e => setFormData(prev => ({ ...prev, maxParticipants: Number(e.target.value) }))}
            className="form-input"
            min={1}
            required
          />
        </FormItem>

        <FormItem label="당첨자 수" required>
          <input
            type="number"
            value={formData.numberOfWinners}
            onChange={e => setFormData(prev => ({ ...prev, numberOfWinners: Number(e.target.value) }))}
            className="form-input"
            min={1}
            required
          />
        </FormItem>
      </div>

      <div className={styles.prizes}>
        <div className={styles.prizesHeader}>
          <h3>경품 정보</h3>
          <Button type="button" variant="outline" onClick={addPrize}>
            경품 추가
          </Button>
        </div>

        {formData.prizes.map((prize, index) => (
          <div key={index} className={styles.prizeItem}>
            <FormItem label={`${prize.rank}등 경품명`} required>
              <input
                type="text"
                value={prize.name}
                onChange={e => {
                  const newPrizes = [...formData.prizes]
                  newPrizes[index] = { ...prize, name: e.target.value }
                  setFormData(prev => ({ ...prev, prizes: newPrizes }))
                }}
                className="form-input"
                required
              />
            </FormItem>

            <FormItem label="설명">
              <input
                type="text"
                value={prize.description}
                onChange={e => {
                  const newPrizes = [...formData.prizes]
                  newPrizes[index] = { ...prize, description: e.target.value }
                  setFormData(prev => ({ ...prev, prizes: newPrizes }))
                }}
                className="form-input"
              />
            </FormItem>

            <FormItem label="수량" required>
              <input
                type="number"
                value={prize.quantity}
                onChange={e => {
                  const newPrizes = [...formData.prizes]
                  newPrizes[index] = { ...prize, quantity: Number(e.target.value) }
                  setFormData(prev => ({ ...prev, prizes: newPrizes }))
                }}
                className="form-input"
                min={1}
                required
              />
            </FormItem>

            {index > 0 && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => removePrize(index)}
                className={styles.removeButton}
              >
                삭제
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">저장</Button>
      </div>
    </Form>
  )
} 