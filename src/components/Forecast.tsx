"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { fetcher, kelvinToCelsius } from "../utils/helpers";
import SearchBar from "./SearchBar";
import {
  HomeIcon,
  MapPinIcon,
  CalendarIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ForecastIcon } from "./CustomIcons";
import Link from "next/link"; // Import Link component
import { useRouter } from "next/navigation";

// Define types for forecast data
interface Weather {
  description: string;
  icon: string;
}

interface Main {
  temp: number;
  humidity: number;
  temp_min: number;
  temp_max: number;
}

interface Wind {
  speed: number;
}

interface ForecastListItem {
  dt: number;
  main: Main;
  weather: Weather[];
  wind: Wind;
  rain?: {
    '3h': number;
  };
  pop: number;
}

interface ForecastCity {
  name: string;
}

interface ForecastResponse {
  city: ForecastCity;
  list: ForecastListItem[];
}

const Forecast: React.FC = () => {
  const [location, setLocation] = useState("London");
  const [units, setUnits] = useState<"metric" | "imperial">("metric"); // Default to Celsius
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();

  const { data: forecast, error: forecastError } = useSWR<ForecastResponse>(
    `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`,
    fetcher
  );

  if (forecastError) return <div className="text-white">Failed to load weather data</div>;

  if (!forecast) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="flex flex-col items-center text-center">
          <div className="spinner mb-4"></div>
          <p className="mt-4 text-xl font-bold">Loading Weather Data...</p>
        </div>
      </div>
    );
  }

  const handleSearch = (searchLocation: string) => {
    setLocation(searchLocation);
  };

  const toggleUnits = () => {
    setUnits(units === "metric" ? "imperial" : "metric");
  };

  const convertTemp = (temp: number) => {
    // No decimal points
    return units === "metric"
      ? Math.round(kelvinToCelsius(temp))
      : Math.round(temp); // No decimals
  };

  const handleHomeClick = () => {
    if (typeof window !== "undefined") {
      router.push("/");
    }
  };

  // Helper function to get unique dates from forecast data
  const getUniqueDates = (forecastList: ForecastListItem[]) => {
    const uniqueDates = Array.from(new Set(forecastList.map(item =>
      new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    )));
    return uniqueDates.slice(0, 3); // Get only the first 3 unique dates
  };

  // Helper function to get forecast for a specific date
  const getForecastForDate = (date: string) => {
    return forecast.list.find(item =>
      new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) === date
    );
  };

  const uniqueDates = getUniqueDates(forecast.list);

  return (
    <div className="flex min-h-screen bg-gradient-custom overflow-x-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 ${sidebarOpen ? "h-screen bg-opacity-95" : "h-auto"
          } w-full transition-transform duration-300 bg-[#2d2c3c] pt-[7rem] flex flex-col items-center z-[999] ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:w-20 md:translate-x-0 md:relative md:h-auto md:bg-opacity-100`}
      >
        <button
          className="md:hidden text-white mb-8"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
        <div className={`flex flex-col items-center ${sidebarOpen ? "block" : "hidden"} md:block`}>
          <button
            onClick={handleHomeClick}
            className="flex items-center space-x-2 text-white mb-8"
          >
            <HomeIcon className="h-6 w-6" />
            {sidebarOpen && <span className="ml-2">Home</span>}
          </button>
          <Link href="/detailed-forecast" className="flex items-center space-x-2 text-white mb-8">
            <ForecastIcon className="h-8 w-8" />
            {sidebarOpen && <span className="ml-2">Forecast</span>}
          </Link>
          <a href="/location" className="flex items-center space-x-2 text-white mb-8">
            <MapPinIcon className="h-6 w-6" />
            {sidebarOpen && <span className="ml-2">Location</span>}
          </a>
          <Link href="/calendar" className="flex items-center space-x-2 text-white">
            <CalendarIcon className="h-6 w-6" />
            {sidebarOpen && <span className="ml-2">Calendar</span>}
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-custom w-full flex flex-col overflow-hidden">
        {/* Top section: SearchBar and Unit Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Hamburger for mobile */}
          <div className="flex items-center justify-between w-full sm:hidden">
            <button
              className="text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
          <SearchBar className="flex-1 w-full" onSearch={handleSearch} />
          <button
            onClick={toggleUnits}
            className="bg-[#cae8ea] text-black px-4 py-2 rounded-full"
          >
            Switch to {units === "metric" ? "Fahrenheit" : "Celsius"}
          </button>
        </div>

        {/* Current Location */}
        <div className="mb-6">
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-white">Current Location</h2>
            <h1 className="text-3xl font-bold text-white">
              {forecast.city.name}
            </h1>
          </div>
        </div>

        {/* 3 Day Outlook */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">3 Day Outlook</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {uniqueDates.map((date, index) => {
              const dayForecast = getForecastForDate(date);
              if (!dayForecast) return null;
              return (
                <div key={index} className="bg-[#2d2c3c] p-4 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">{date}</h3>
                  <div className="flex items-center justify-between">
                    <img
                      src={`http://openweathermap.org/img/wn/${dayForecast.weather[0].icon}@2x.png`}
                      alt={dayForecast.weather[0].description}
                      className="w-16 h-16"
                    />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {Math.round(convertTemp(dayForecast.main.temp))}°{units === "metric" ? "C" : "F"}
                      </p>
                      <p className="text-sm text-gray-300">
                        {Math.round(convertTemp(dayForecast.main.temp_min))}° / {Math.round(convertTemp(dayForecast.main.temp_max))}°
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">
                    {dayForecast.weather[0].description}
                  </p>
                  <p className="text-sm text-gray-300">
                    Rain: {dayForecast.rain ? `${dayForecast.rain['3h']}mm` : '0mm'}
                  </p>
                  <p className="text-sm text-gray-300">
                    Precip: {Math.round(dayForecast.pop * 100)}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="mb-8 bg-[#2d2c3c] rounded-lg p-4 ">
          <h2 className="text-2xl font-bold text-white mb-4">Hourly Forecast</h2>
          <div className="overflow-x-auto">
            <div className="flex flex-nowrap space-x-4">
              {forecast.list.slice(0, 16).map((item, index) => (
                <div key={index} className="flex flex-col items-center min-w-[80px]">
                  <p className="text-sm text-white">
                    {new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                  </p>
                  <img
                    src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                    alt={item.weather[0].description}
                    className="w-8 h-8"
                  />
                  <p className="text-sm font-bold text-white">
                    {Math.round(convertTemp(item.main.temp))}°
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Long Term Outlook */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Long Term Outlook</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {forecast.list.filter((_, index) => index % 8 === 0).map((item, index) => (
              <div key={index} className="bg-[#2d2c3c] p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </h3>
                <div className="flex items-center justify-between">
                  <img
                    src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                    alt={item.weather[0].description}
                    className="w-12 h-12"
                  />
                  <p className="text-xl font-bold text-white">
                    {Math.round(convertTemp(item.main.temp))}°
                  </p>
                </div>
                <p className="text-sm text-gray-300 mt-2">
                  {item.weather[0].description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
