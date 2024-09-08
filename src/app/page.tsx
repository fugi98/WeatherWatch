import type { NextPage } from 'next'
import 'leaflet/dist/leaflet.css'
import WeatherDashboard from '@/components/WeatherDashboard'

const Home: NextPage = () => {
  return (
    <div>
      <main>
        <WeatherDashboard />
      </main>
    </div>
  )
}

export default Home