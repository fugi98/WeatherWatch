import React from 'react'
import { WeatherIcon } from '@/components/WeatherIcon'

interface WeatherForecastProps {
  data: any
  convertTemp: (temp: number) => number
  units: 'metric' | 'imperial'
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ data, convertTemp, units }) => {
  const threeDayForecast = data.list.filter((_: any, index: number) => index % 8 === 0).slice(0, 3)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">3 Day Outlook</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {threeDayForecast.map((day: any, index: number) => (
          <div key={index} className="flex flex-col items-center text-center">
            <p className="font-semibold">{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</p>
            <WeatherIcon condition={day.weather[0].main} size={30} iconCode={day.weather[0].icon} />
            <div className="mt-2">
              <p className="font-bold text-lg">
                {Math.round(convertTemp(day.main.temp_max))}°{units === 'metric' ? 'C' : 'F'}
              </p>
              <p className="text-sm text-gray-600">
                {Math.round(convertTemp(day.main.temp_min))}°{units === 'metric' ? 'C' : 'F'}
              </p>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <p>Rain: {day.rain ? day.rain['3h'] : 0}mm</p>
              <p>Precip: {Math.round(day.pop * 100)}%</p>
              <p>{day.weather[0].description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeatherForecast
