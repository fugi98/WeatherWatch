"use client"

import React, { useState } from 'react'
import useSWR from 'swr'
import { HomeIcon, MapPinIcon, CalendarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import CurrentWeather from './CurrentWeather'
import WeatherForecast from './WeatherForecast'
import HourlyForecast from './HourlyForecast'
import LongTermOutlook from './LongTermOutlook'
import SearchBar from './SearchBar'
import { fetcher, kelvinToCelsius, kelvinToFahrenheit } from '../utils/helpers'
import { ForecastIcon } from './CustomIcons'

const WeatherDashboard: React.FC = () => {
  const [location, setLocation] = useState('London')
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')

  const { data: currentWeather, error: currentError } = useSWR(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`,
    fetcher
  )

  const { data: forecast, error: forecastError } = useSWR(
    `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`,
    fetcher
  )

  if (currentError || forecastError) return <div className="text-white">Failed to load weather data</div>
  if (!currentWeather || !forecast) return <div className="text-white">Loading...</div>

  const handleSearch = (searchLocation: string) => {
    setLocation(searchLocation)
  }

  const toggleUnits = () => {
    setUnits(units === 'metric' ? 'imperial' : 'metric')
  }

  const convertTemp = (temp: number) => {
    return units === 'metric' ? kelvinToCelsius(temp) : kelvinToFahrenheit(temp)
  }

  return (
    <div className="flex min-h-screen bg-[#0e1837db]"> 
      {/* Sidebar */}
      <div className="w-20 bg-sky-700 p-4 flex flex-col items-center"> {/* Darker sidebar background */}
        <HomeIcon className="h-6 w-6 text-white mb-8" />
        <div className="flex flex-col space-y-8">
          <ForecastIcon className='h-8 w-8 text-white' />
          <MapPinIcon className="h-6 w-6 text-white" />
          <CalendarIcon className="h-6 w-6 text-white" />
          <Cog6ToothIcon className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 flex flex-col bg-[#0e1837db] bg-opacity-80 rounded-lg"> {/* Darker background with opacity */}
        {/* Top section: SearchBar and Unit Toggle */}
        <div className="flex items-center justify-between mb-6 space-x-4">
          <SearchBar className="flex-1" onSearch={handleSearch} />
          <button
            onClick={toggleUnits}
            className="bg-sky-600 text-white px-4 py-2 rounded-full"
          >
            Switch to {units === 'metric' ? 'Fahrenheit' : 'Celsius'}
          </button>
        </div>

        {/* Current Location */}
        <div className="mb-6">
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-white">Current Location</h2>
            <h1 className="text-3xl font-bold text-white">{currentWeather.name}</h1>
          </div>
        </div>

        {/* Current Weather and Weather Forecast */}
        <div className="flex flex-col md:flex-row md:space-x-8 mb-6 space-y-8 md:space-y-0">
          <div className="flex-1 p-4 rounded-lg">
            <CurrentWeather data={currentWeather} convertTemp={convertTemp} units={units} />
          </div>
          <div className="flex-1 p-4 rounded-lg">
            <WeatherForecast data={forecast} convertTemp={convertTemp} units={units} />
          </div>
        </div>

        {/* Hourly Forecast and Long Term Outlook */}
        <div className="flex flex-col md:flex-row md:space-x-8 mb-6 space-y-8 md:space-y-0">
          <div className="flex-1 md:flex-3/4 p-4 rounded-lg"> {/* Takes 3/4 width on medium screens */}
            <HourlyForecast data={forecast} convertTemp={convertTemp} units={units} />
          </div>
          <div className="flex-1 md:flex-1/4 p-4 rounded-lg"> {/* Takes 1/4 width on medium screens */}
            <LongTermOutlook data={forecast} convertTemp={convertTemp} units={units} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherDashboard
