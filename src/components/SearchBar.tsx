"use client"

import React, { useState, useEffect } from 'react'
import debounce from 'lodash/debounce'

interface SearchBarProps {
  onSearch: (location: string) => void;
  className?: string;
}

interface Suggestion {
  name: string;
  country: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  const fetchSuggestions = debounce(async (query: string) => {
    if (query.trim()) {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      )
      const data = await response.json()
      setSuggestions(data.map((place: any) => ({ name: place.name, country: place.country })))
    } else {
      setSuggestions([])
    }
  }, 300)

  useEffect(() => {
    fetchSuggestions(searchTerm)
  }, [searchTerm])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim())
      setSearchTerm('')
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    setSuggestions([])
    onSearch(suggestion)
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search location..."
        className="p-2 rounded-full bg-black border border-gray-500 text-white shadow w-full"
      />
      {suggestions.length > 0 && (
        <ul className="bg-black text-white border border-gray-500 shadow-lg rounded-lg mt-2 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSuggestionClick(`${suggestion.name}, ${suggestion.country}`)}
            >
              {suggestion.name}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}

export default SearchBar
