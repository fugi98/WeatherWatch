import React from 'react'
import { WeatherIcon } from '@/components/WeatherIcon'
import { CloudIcon } from '@heroicons/react/24/outline'
import { WindIcon } from './CustomIcons'

interface CurrentWeatherProps {
  data: any
  convertTemp: (temp: number) => number
  units: 'metric' | 'imperial'
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, convertTemp, units }) => {
  // Get the current date and time
  const now = new Date()
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const dayName = dayNames[now.getDay()]
  const date = now.getDate()
  const monthName = monthNames[now.getMonth()]
  const year = now.getFullYear()
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="bg-[#002F6C] bg-opacity-60 rounded-lg shadow-lg p-6 mb-6 relative">
      <div className="absolute top-4 right-4 text-blue-100">
        <p className="text-lg">{dayName}, {monthName} {date}, {year}</p>
        <p className="text-lg">Current Time: {time}</p>
      </div>
      <h2 className="text-2xl text-blue-100 font-bold mb-4">Current Weather</h2>
      <div className="flex items-center mb-4">
        <WeatherIcon condition={data.weather[0].main} size={64} />
        <div className="ml-4">
          <p className="text-4xl text-white font-bold">{Math.round(convertTemp(data.main.temp))}°{units === 'metric' ? 'C' : 'F'}</p>
          <p className="text-xl text-white">{data.weather[0].description}</p>
        </div>
      </div>
      <div className="flex flex-col justify-between text-blue-100">
        <div className="flex items-center space-x-2">
          <CloudIcon className="h-5 w-5 text-blue-100" />
          <p className="text-lg">Humidity: {data.main.humidity}%</p>
        </div>
        <div className="flex items-center space-x-2">
          <WindIcon className="h-5 w-5 text-blue-100" />
          <p className="text-lg">Wind: {data.wind.speed} {units === 'metric' ? 'm/s' : 'mph'}</p>
        </div>
      </div>
    </div>
  )
}

export default CurrentWeather
