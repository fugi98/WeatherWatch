"use client";

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  MapPinIcon,
  CalendarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { fetcher, kelvinToCelsius, kelvinToFahrenheit } from "../utils/helpers";
import SearchBar from "./SearchBar";
import Link from "next/link";
import { ForecastIcon } from "./CustomIcons";
import { WeatherIcon } from '@/components/WeatherIcon';

// Dynamically import MapComponent to prevent SSR issues
const DynamicMap = dynamic(() => import('@/components/MapComponent'), { ssr: false });

const LocationPage: React.FC = () => {
  const [location, setLocation] = useState("London");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [satelliteView, setSatelliteView] = useState(false);

  const router = useRouter();

  const { data: currentWeather, error: currentError, mutate } = useSWR(
    location ? `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}` : null,
    fetcher as (url: string) => Promise<any>
  );

  // Fetch weather data for each saved location
  const { data: savedLocationWeathers, error: savedLocationErrors } = useSWR(
    locations.length > 0 ? locations.map(loc => `https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`) : null,
    (urls: string[]) => Promise.all(urls.map(url => fetcher(url)))
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocations = localStorage.getItem("locations");
      if (savedLocations) {
        setLocations(JSON.parse(savedLocations));
      }
    }
  }, []);

  const saveLocation = (newLocation: string) => {
    if (!locations.includes(newLocation)) {
      const updatedLocations = [...locations, newLocation];
      setLocations(updatedLocations);
      if (typeof window !== "undefined") {
        localStorage.setItem("locations", JSON.stringify(updatedLocations));
      }
    }
  };

  const removeLocation = (locationToRemove: string) => {
    const updatedLocations = locations.filter(loc => loc !== locationToRemove);
    setLocations(updatedLocations);
    if (typeof window !== "undefined") {
      localStorage.setItem("locations", JSON.stringify(updatedLocations));
    }
  };

  const handleSearch = async (searchLocation: string) => {
    setLocation(searchLocation);
    await mutate();
    saveLocation(searchLocation);
  };

  const handleHomeClick = () => {
    if (typeof window !== "undefined") {
      router.push("/");
    }
  };

  const toggleUnits = () => {
    setUnits(units === "metric" ? "imperial" : "metric");
  };

  const toggleSatelliteView = () => {
    setSatelliteView(!satelliteView);
  };

  if (currentError) return <div className="text-white">Failed to load weather data</div>;
  if (!currentWeather) {
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

  return (
    <div className="flex min-h-screen bg-[#0e1837db]">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 ${sidebarOpen ? "h-screen bg-opacity-95" : "h-auto"
          } w-full transition-transform duration-300 bg-[#03011b] p-4 flex flex-col items-center z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* Search Bar and Unit Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center justify-between w-full sm:hidden">
            <button
              className="text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
          <SearchBar className="flex-1 w-full" onSearch={handleSearch} />
          <button onClick={toggleUnits} className="bg-sky-600 text-white px-4 py-2 rounded-full">
            Switch to {units === "metric" ? "Fahrenheit" : "Celsius"}
          </button>
          <button
            onClick={toggleSatelliteView}
            className="bg-sky-600 text-white px-4 py-2 rounded-full bg-green-400"
          >
            Switch to {satelliteView ? "Map View" : "Satellite View"}
          </button>
        </div>

        {/* Current Weather Card */}
        <div className="bg-[#1e3a8a] text-white rounded-lg p-6 shadow-md relative">
          <div className="absolute right-4 top-4 text-right">
            <p className="text-sm">{new Date().toLocaleDateString()}</p>
            <p className="text-sm">Current Time: {new Date().toLocaleTimeString()}</p>
          </div>
          <h2 className="text-lg font-semibold mb-4">Current Weather</h2>
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <p className="text-6xl font-bold">
                {units === "metric" ? kelvinToCelsius(currentWeather.main.temp).toFixed(1) : kelvinToFahrenheit(currentWeather.main.temp).toFixed(1)}°
                {units === "metric" ? "C" : "F"}
              </p>
              <p className="text-lg">{currentWeather.weather[0].description}</p>
            </div>
            <WeatherIcon iconCode={currentWeather.weather[0].icon} className="w-24 h-24" />
          </div>
          <div className="text-sm">
            <p className="font-bold">London, GB</p>
            <p>Humidity: {currentWeather.main.humidity}%</p>
            <p>Wind: {currentWeather.wind.speed} m/s</p>
          </div>
        </div>

        {/* Map Component */}
        <div className="mt-6" style={{ height: '500px' }}>
          <DynamicMap center={[51.5074, -0.1278]} zoom={10} location={location} />
        </div>

        {/* Saved Locations */}
        <div className="mt-6">
          <h2 className="text-lg text-white mb-4">Saved Locations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {locations.map((loc, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-colors relative"
              >
                <h2 className="text-lg font-bold">{loc}</h2>
                {savedLocationWeathers && savedLocationWeathers[index] ? (
                  <div className="mt-2">
                    <p className="text-lg font-bold">
                      {units === "metric" ? kelvinToCelsius(savedLocationWeathers[index].main.temp).toFixed(1) : kelvinToFahrenheit(savedLocationWeathers[index].main.temp).toFixed(1)}°
                      {units === "metric" ? "C" : "F"}
                    </p>
                    <p className="text-sm">{savedLocationWeathers[index].weather[0].description}</p>
                    <WeatherIcon iconCode={savedLocationWeathers[index].weather[0].icon} className="w-16 h-16" />
                  </div>
                ) : (
                  <p className="text-sm">Loading weather data...</p>
                )}
                <button
                  onClick={() => removeLocation(loc)}
                  className="absolute top-2 right-2 text-red-500"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
