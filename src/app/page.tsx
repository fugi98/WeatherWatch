import type { NextPage } from 'next'
import Head from 'next/head'
import WeatherDashboard from '@/components/WeatherDashboard'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Weather Dashboard</title>
        <meta name="description" content="Weather Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <WeatherDashboard />
      </main>
    </div>
  )
}

export default Home