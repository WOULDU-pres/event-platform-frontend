import { ReactNode } from 'react'
import styles from './Table.module.css'
import { Pagination } from './Pagination'
import { TableFilter } from './TableFilter'

interface TableProps<T> {
  columns: {
    key: keyof T
    header: string
    render?: (value: T[keyof T], row: T) => ReactNode
    filterable?: boolean
  }[]
  data: T[]
  onSort?: (key: keyof T) => void
  sortKey?: keyof T
  sortDirection?: 'asc' | 'desc'
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  showPagination?: boolean
  onFilter?: (filters: Partial<Record<keyof T, string>>) => void
  showFilter?: boolean
  selectable?: boolean
  selectedRows?: T[]
  onSelectRows?: (rows: T[]) => void
  getRowId?: (row: T) => string | number
  actions?: Array<{
    label: string
    icon?: ReactNode
    onClick: (row: T) => void
    disabled?: (row: T) => boolean
  }>
}

export function Table<T>({ 
  columns, 
  data, 
  onSort, 
  sortKey, 
  sortDirection,
  currentPage,
  totalPages,
  onPageChange,
  showPagination = true,
  onFilter,
  showFilter = true,
  selectable = false,
  selectedRows = [],
  onSelectRows,
  getRowId = (row: any) => row.id,
  actions = []
}: TableProps<T>) {
  const handleSelectAll = () => {
    if (!onSelectRows) return
    if (selectedRows.length === data.length) {
      onSelectRows([])
    } else {
      onSelectRows([...data])
    }
  }

  const handleSelectRow = (row: T) => {
    if (!onSelectRows) return
    const isSelected = selectedRows.some(r => getRowId(r) === getRowId(row))
    if (isSelected) {
      onSelectRows(selectedRows.filter(r => getRowId(r) !== getRowId(row)))
    } else {
      onSelectRows([...selectedRows, row])
    }
  }

  return (
    <div>
      {showFilter && onFilter && (
        <TableFilter columns={columns} onFilter={onFilter} />
      )}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {selectable && (
                <th className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedRows.length === data.length}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map(column => (
                <th 
                  key={String(column.key)}
                  onClick={() => onSort?.(column.key)}
                  className={sortKey === column.key ? styles.sorting : ''}
                >
                  {column.header}
                  {sortKey === column.key && (
                    <span className={styles.sortIcon}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
              {actions.length > 0 && (
                <th className={styles.actionsCell}>액션</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr 
                key={getRowId(row)}
                className={selectedRows.some(r => getRowId(r) === getRowId(row)) ? styles.selected : ''}
              >
                {selectable && (
                  <td className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      checked={selectedRows.some(r => getRowId(r) === getRowId(row))}
                      onChange={() => handleSelectRow(row)}
                    />
                  </td>
                )}
                {columns.map(column => (
                  <td key={String(column.key)}>
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key] as ReactNode}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className={styles.actionsCell}>
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => action.onClick(row)}
                        disabled={action.disabled?.(row)}
                        className={styles.actionButton}
                      >
                        {action.icon}
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPagination && currentPage && totalPages && onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
} 