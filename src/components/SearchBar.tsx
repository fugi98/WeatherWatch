import React, { useState } from 'react'

interface SearchBarProps {
  onSearch: (location: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim())
      setSearchTerm('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search location..."
        className="p-2 rounded-full bg-white shadow w-full"
      />
    </form>
  )
}

export default SearchBar
