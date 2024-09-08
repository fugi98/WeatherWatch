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

  // Extract the iconCode from the data
  const iconCode = data.weather[0].icon

  return (
    <div className="flex flex-col bg-[#2d2c3c] rounded-3xl shadow-lg p-6 mb-6 relative">
      {/* Time, date, and day - for small screens only */}
      <div className="absolute top-4 right-4 text-blue-100 text-right hidden sm:block">
        <p className="text-lg">{dayName}, {monthName} {date}, {year}</p>
        <p className="text-lg">Current Time: {time}</p>
      </div>
      {/* Time, date, and day - for small screens only */}
      <div className="block sm:hidden mb-6 text-blue-100">
        <p className="text-lg">{dayName}, {monthName} {date}, {year}</p>
        <p className="text-lg">Current Time: {time}</p>
      </div>
      <h2 className="text-2xl text-blue-100 font-bold mb-4">Current Weather</h2>
      <div className="flex flex-col md:flex-row md:items-center mb-4">
        {/* Pass the extracted iconCode to WeatherIcon */}
        <WeatherIcon iconCode={iconCode} condition={data.weather[0].main} size={64} className="md:mr-4 mb-4 md:mb-0" />
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:mr-4 md:text-left">
            <p className="text-4xl text-white font-bold">{Math.round(convertTemp(data.main.temp))}°{units === 'metric' ? 'C' : 'F'}</p>
            <p className="text-xl text-white capitalize">{data.weather[0].description}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between text-blue-100 mt-4">
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
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
