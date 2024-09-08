"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Link from "next/link"; // Updated import for Link
import {
  HomeIcon,
  MapPinIcon,
  CalendarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import CurrentWeather from "./CurrentWeather";
import WeatherForecast from "./WeatherForecast";
import HourlyForecast from "./HourlyForecast";
import LongTermOutlook from "./LongTermOutlook";
import SearchBar from "./SearchBar";
import { fetcher, kelvinToCelsius, kelvinToFahrenheit } from "../utils/helpers";
import { ForecastIcon } from "./CustomIcons";

const WeatherDashboard: React.FC = () => {
  const [location, setLocation] = useState("London");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();

  const { data: currentWeather, error: currentError } = useSWR(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`,
    fetcher
  );

  const { data: forecast, error: forecastError } = useSWR(
    `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`,
    fetcher
  );

  if (currentError || forecastError)
    return <div className="text-white">Failed to load weather data</div>;

  if (!currentWeather || !forecast) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        {/* Spinner Loader */}
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
    return units === "metric" ? kelvinToCelsius(temp) : kelvinToFahrenheit(temp);
  };

  const handleHomeClick = () => {
    if (typeof window !== "undefined") {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0e1837db]">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 ${sidebarOpen ? "h-screen bg-opacity-95" : "h-auto"
          } w-full transition-transform duration-300 bg-[#03011b] p-4 flex flex-col items-center z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:w-20 md:translate-x-0 md:relative md:h-auto md:bg-opacity-100`}
      >
        {/* Hamburger Toggle Button */}
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
        <button
          onClick={handleHomeClick}
          className="h-6 w-6 text-white mb-8"
        >
          <HomeIcon />
        </button>
        <div className="flex flex-col space-y-8">
          <Link href="/detailed-forecast">
            <ForecastIcon className="h-8 w-8 text-white" />
          </Link>
          <a href="/location">
            <MapPinIcon className="h-6 w-6 text-white" />
          </a>
          <Link href="/calendar">
            <CalendarIcon className="h-6 w-6 text-white" />
          </Link>
          <a href="#">
            <Cog6ToothIcon className="h-6 w-6 text-white" />
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 bg-[#0e1837db] bg-opacity-80 rounded-lg w-full flex flex-col">
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
            className="bg-sky-600 text-white px-4 py-2 rounded-full"
          >
            Switch to {units === "metric" ? "Fahrenheit" : "Celsius"}
          </button>
        </div>

        {/* Current Location */}
        <div className="mb-6">
          <div className="mb-2">
            <h2 className="text-xl font-semibold text-white">Current Location</h2>
            <h1 className="text-3xl font-bold text-white">
              {currentWeather.name}
            </h1>
          </div>
        </div>

        {/* Current Weather and Weather Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded-lg ">
            <CurrentWeather
              data={currentWeather}
              convertTemp={convertTemp}
              units={units}
            />
          </div>
          <div className="p-4 rounded-lg ">
            <WeatherForecast
              data={forecast}
              convertTemp={convertTemp}
              units={units}
            />
          </div>
        </div>

        {/* Hourly Forecast and Long Term Outlook */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 p-4 rounded-lg ">
            <HourlyForecast
              data={forecast}
              convertTemp={convertTemp}
              units={units}
            />
          </div>
          <div className="lg:col-span-1 p-4 rounded-lg ">
            <LongTermOutlook
              data={forecast}
              convertTemp={convertTemp}
              units={units}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
