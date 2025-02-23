import styles from './EventList.module.css'

interface EventListProps {
  events: Array<{
    id: string
    title: string
    description: string
  }>
}

const EventList = ({ events }: EventListProps) => {
  return (
    <div className={styles.grid}>
      {events.map(event => (
        <div key={event.id} className={styles.card}>
          <h3 className={styles.title}>{event.title}</h3>
          <p className={styles.description}>{event.description}</p>
        </div>
      ))}
    </div>
  )
}

export default EventList
