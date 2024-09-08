import React from 'react'
import { WeatherIcon } from '@/components/WeatherIcon'

interface HourlyForecastProps {
  data: any
  convertTemp: (temp: number) => number
  units: 'metric' | 'imperial'
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, convertTemp, units }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Hourly Forecast</h2>
      <div className="flex space-x-4 overflow-x-auto">
        {data.list.slice(0, 12).map((hour: any, index: number) => (
          <div key={index} className="flex flex-col items-center min-w-[60px]">
            <p className="text-sm">{new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' })}</p>
            {/* Extract and pass the iconCode */}
            <WeatherIcon iconCode={hour.weather[0].icon} condition={hour.weather[0].main} size={32} />
            <p className="text-sm font-medium">{Math.round(convertTemp(hour.main.temp))}°{units === 'metric' ? 'C' : 'F'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HourlyForecast
