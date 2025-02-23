import styles from './ParticipantList.module.css'
import { RaffleParticipant } from '../../types/raffle'

interface ParticipantListProps {
  participants: RaffleParticipant[]
}

export function ParticipantList({ participants }: ParticipantListProps) {
  return (
    <div className={styles.container}>
      <h2>참여자 목록</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>참여일</th>
            <th>당첨 여부</th>
          </tr>
        </thead>
        <tbody>
          {participants.map(participant => (
            <tr key={participant.id}>
              <td>{participant.userName}</td>
              <td>{participant.email}</td>
              <td>{participant.phoneNumber}</td>
              <td>{new Date(participant.participatedAt).toLocaleDateString()}</td>
              <td>{participant.isWinner ? '당첨' : '미당첨'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 