import { useState } from 'react'
import styles from './TableFilter.module.css'

interface TableFilterProps<T> {
  columns: {
    key: keyof T
    header: string
    filterable?: boolean
  }[]
  onFilter: (filters: Partial<Record<keyof T, string>>) => void
}

export function TableFilter<T>({ columns, onFilter }: TableFilterProps<T>) {
  const [filters, setFilters] = useState<Partial<Record<keyof T, string>>>({})

  const handleFilterChange = (key: keyof T, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  return (
    <div className={styles.filterContainer}>
      {columns
        .filter(column => column.filterable)
        .map(column => (
          <div key={String(column.key)} className={styles.filterItem}>
            <label htmlFor={String(column.key)}>{column.header}</label>
            <input
              id={String(column.key)}
              type="text"
              value={filters[column.key] || ''}
              onChange={e => handleFilterChange(column.key, e.target.value)}
              placeholder={`${column.header} 검색...`}
              className={styles.filterInput}
            />
          </div>
        ))}
    </div>
  )
} 