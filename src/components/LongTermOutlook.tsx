// File: components/LongTermOutlook.tsx
import React from 'react'
import { WeatherIcon } from '@/components/WeatherIcon'

interface LongTermOutlookProps {
  data: any
  convertTemp: (temp: number) => number
  units: 'metric' | 'imperial'
}

const LongTermOutlook: React.FC<LongTermOutlookProps> = ({ data, convertTemp, units }) => {
  const longTermForecast = data.list.filter((_: any, index: number) => index % 8 === 0)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Long term outlook</h2>
      <div className="grid grid-cols-5 gap-4">
        {longTermForecast.map((day: any, index: number) => (
          <div key={index} className="text-center">
            <p>{new Date(day.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            <WeatherIcon condition={day.weather[0].main} size={32} />
            <p>{Math.round(convertTemp(day.main.temp))}°{units === 'metric' ? 'C' : 'F'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LongTermOutlook