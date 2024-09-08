import React from 'react'
import { WeatherIcon } from '@/components/WeatherIcon'

interface LongTermOutlookProps {
  data: any
  convertTemp: (temp: number) => number
  units: 'metric' | 'imperial'
}

const LongTermOutlook: React.FC<LongTermOutlookProps> = ({ data, convertTemp, units }) => {
  // Filter for one forecast per day (approximately every 8th entry)
  const longTermForecast = data.list.filter((_: any, index: number) => index % 8 === 0)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Long Term Outlook</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {longTermForecast.map((day: any, index: number) => (
          <div key={index} className="flex flex-col items-center text-center">
            <p className="text-sm mb-1">{new Date(day.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            {/* Extract and pass the iconCode */}
            <WeatherIcon iconCode={day.weather[0].icon} condition={day.weather[0].main} size={30} />
            <p className="text-sm font-medium mt-2">{Math.round(convertTemp(day.main.temp))}°{units === 'metric' ? 'C' : 'F'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LongTermOutlook
