import styles from './SearchBar.module.css'
import { useState } from 'react'

interface SearchBarProps {
  onSearch: (value: string) => void
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [value, setValue] = useState('')

  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="이벤트 검색..."
      />
      <button 
        className={styles.button}
        onClick={() => onSearch(value)}
      >
        검색
      </button>
    </div>
  )
}

export default SearchBar
