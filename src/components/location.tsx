"use client";

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  MapPinIcon,
  CalendarIcon,
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
  const [selectedLocationWeather, setSelectedLocationWeather] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.5074, -0.1278]);

  // Get the current date and time
  const now = new Date()
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const dayName = dayNames[now.getDay()]
  const date = now.getDate()
  const monthName = monthNames[now.getMonth()]
  const year = now.getFullYear()
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const router = useRouter();

  const { data: currentWeather, error: currentError, mutate } = useSWR(
    location ? `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}` : null,
    fetcher as (url: string) => Promise<any>
  );

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

  useEffect(() => {
    if (currentWeather && currentWeather.coord) {
      setMapCenter([currentWeather.coord.lat, currentWeather.coord.lon]);
    }
  }, [currentWeather]);

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

  const handleSavedLocationClick = (index: number) => {
    const weather = savedLocationWeathers && savedLocationWeathers[index];
    if (weather) {
      setSelectedLocationWeather(weather);
      setLocation(locations[index]);
      setMapCenter([weather.coord.lat, weather.coord.lon]);
    }
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

  const displayedWeather = selectedLocationWeather || currentWeather;

  return (
    <div className="flex min-h-screen bg-gradient-custom">
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
          <button onClick={toggleUnits} className="bg-[#cae8ea] text-black px-4 py-2 rounded-full">
            Switch to {units === "metric" ? "Fahrenheit" : "Celsius"}
          </button>
          <button
            onClick={toggleSatelliteView}
            className="text-black px-4 py-2 rounded-full bg-[#7dff9d]"
          >
            Switch to {satelliteView ? "Map View" : "Satellite View"}
          </button>
        </div>

        {/* Current Weather Card and Map Component Container */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Current Weather Card */}
          <div className="bg-[#2d2c3c] lg:w-1/2 text-white rounded-3xl p-6 shadow-md relative flex-1 md:h-[300px]">
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
            <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
            <p className="text-2xl font-bold">{location}</p>
            <div className="flex flex-col justify-between mb-6">
              <div className="flex flex-row items-center mb-6">
                {/* Increased WeatherIcon Size */}
                <WeatherIcon iconCode={displayedWeather.weather[0].icon} className="w-10 h-10" />
                <p className="text-4xl font-bold">
                  {units === "metric" ? kelvinToCelsius(displayedWeather.main.temp).toFixed(1) : kelvinToFahrenheit(displayedWeather.main.temp).toFixed(1)}°
                  {units === "metric" ? "C" : "F"}
                </p>
              </div>
              <p className="text-lg">{displayedWeather.weather[0].description}</p>
            </div>
            <div className="text-sm">
              <p>Humidity: {displayedWeather.main.humidity}%</p>
              <p>Wind: {displayedWeather.wind.speed} m/s</p>
            </div>
            <button
              onClick={() => setMapCenter([displayedWeather.coord.lat, displayedWeather.coord.lon])}
              className="absolute bottom-4 right-4 px-4 py-2 bg-[#7dff9d] text-black rounded-full"
            >
              Center Map
            </button>
          </div>

          {/* Map Component */}
          <div className=" relative w-full z-1 lg:w-1/2 h-[400px] md:h-[300px]">
            {!currentWeather ? (
              <div className="relative inset-0 z-1 flex items-center justify-center text-white">
                <p>Loading map...</p>
              </div>
            ) : (
              <DynamicMap
                className="relative z-1"
                center={mapCenter}
                zoom={10}
                location={location}
                satelliteView={satelliteView}
                savedLocations={savedLocationWeathers?.map((weather) => [weather.coord.lat, weather.coord.lon]) || []}
              />
            )}
          </div>
        </div>

        {/* Saved Locations */}
        <div className="mt-6">
          <h3 className="text-xl text-white font-semibold mb-4">Saved Locations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {locations.length > 0 ? (
              savedLocationWeathers?.map((weather, index) => (
                <div
                  key={index}
                  className="bg-[#2d2c3c] text-white p-4 rounded-3xl shadow-md cursor-pointer hover:bg-opacity-100 hover:bg-[#cae8ea] hover:text-black hover:scale-105 transition-all duration-300 ease-in-out relative"
                  onClick={() => handleSavedLocationClick(index)}
                >

                  <div>
                    <p className="text-xl font-bold">{locations[index]}</p>
                    <p>{weather.weather[0].description}</p>
                  </div>
                  <div className="flex flex-row item-center mt-2 p-2">
                    <WeatherIcon iconCode={weather.weather[0].icon} className="w-10 h-10" />
                    <p className="text-lg item-center p-2 font-bold">
                      {units === "metric" ? kelvinToCelsius(weather.main.temp).toFixed(1) : kelvinToFahrenheit(weather.main.temp).toFixed(1)}°
                      {units === "metric" ? "C" : "F"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLocation(locations[index]);
                    }}
                    className="absolute top-4 right-8 text-red-500 hover:text-red-700"
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p className="text-white">No saved locations</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
