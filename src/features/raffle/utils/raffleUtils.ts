// Utility function to format dates
export const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(date).toLocaleDateString(undefined, options)
}

// Utility function to calculate participation rate
export const calculateParticipationRate = (current: number, max: number) => {
  return (current / max) * 100
} 