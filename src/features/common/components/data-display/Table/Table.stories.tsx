import type { Meta, StoryObj } from '@storybook/react'
import { Table } from './Table'
import { useState } from 'react'

const meta: Meta<typeof Table> = {
  title: 'Components/DataDisplay/Table',
  component: Table,
  tags: ['autodocs'],
}

export default meta

interface ExampleData {
  id: number
  name: string
  age: number
  email: string
}

const mockData: ExampleData[] = [
  { id: 1, name: '김철수', age: 25, email: 'gogohyunwoo@google.com' },
  { id: 2, name: '이영희', age: 30, email: 'hwjoochoigo@google.com' },
]

export const Default: StoryObj<typeof Table> = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [sortKey, setSortKey] = useState<keyof ExampleData | undefined>()
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [filters, setFilters] = useState<Partial<Record<keyof ExampleData, string>>>({})
    const [selectedRows, setSelectedRows] = useState<ExampleData[]>([])

    const columns: Array<{
      key: keyof ExampleData
      header: string
      filterable?: boolean
    }> = [
      { key: 'id' as keyof ExampleData, header: 'ID' },
      { key: 'name' as keyof ExampleData, header: '이름' },
      { key: 'age' as keyof ExampleData, header: '나이' },
      { key: 'email' as keyof ExampleData, header: '이메일' },
    ]

    const handleSort = (key: keyof ExampleData) => {
      if (sortKey === key) {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
      } else {
        setSortKey(key)
        setSortDirection('asc')
      }
    }

    const handleFilter = (filters: Partial<Record<keyof ExampleData, string>>) => {
      setFilters(filters)
    }

    const filteredData = mockData.filter(data => {
      return Object.entries(filters).every(([key, value]) => {
        return data[key as keyof ExampleData] === value
      })
    })

    const handleEdit = (row: ExampleData) => {
      alert(`${row.name} 수정`)
    }

    const handleDelete = (row: ExampleData) => {
      alert(`${row.name} 삭제`)
    }

    return (
      <div>
        <div className="mb-4">
          선택된 항목: {selectedRows.length}개
        </div>
        <Table<ExampleData>
          columns={columns}
          data={filteredData}
          currentPage={currentPage}
          totalPages={Math.ceil(filteredData.length / 10)}
          onPageChange={setCurrentPage}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onFilter={handleFilter}
          selectable={true}
          selectedRows={selectedRows}
          onSelectRows={setSelectedRows}
          actions={[
            {
              label: '수정',
              onClick: handleEdit,
            },
            {
              label: '삭제',
              onClick: handleDelete,
              disabled: (row) => row.id === 1, // ID가 1인 행은 삭제 불가능
            },
          ]}
        />
      </div>
    )
  }
} 