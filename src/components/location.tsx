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
        <button
          onClick={handleHomeClick}
          className="h-6 w-6 text-white mb-8"
        >
          <HomeIcon />
        </button>
        <div className="flex flex-col justify-between item-center space-y-8">
          <Link href="/detailed-forecast">
            <ForecastIcon className="h-8 w-8 text-white" />
          </Link>
          <a href="/location">
            <MapPinIcon className="h-6 w-6 text-white" />
          </a>
          <Link href="/calendar">
            <CalendarIcon className="h-6 w-6 text-white" />
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
            <div className="absolute right-4 top-4 text-right">
              <p className="text-sm">{new Date().toLocaleDateString()}</p>
              <p className="text-sm"> {new Date().toLocaleTimeString()}</p>
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
          </div>

          {/* Map Component */}
          <div className=" relative w-full z-1 lg:w-1/2 h-[400px] md:h-[300px]">
            {!currentWeather ? (
              <div className="relative inset-0 z-1 flex items-center justify-center text-black">
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
          <h2 className="text-lg text-white mb-4">Saved Locations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {locations.map((loc, index) => (
              <div
                key={index}
                className="bg-[#2d2c3c] text-white p-4 rounded-3xl shadow-md cursor-pointer hover:bg-gray-500 transition-colors relative"
                onClick={() => handleSavedLocationClick(index)}
              >
                <h2 className="text-lg font-bold">{loc}</h2>
                {savedLocationWeathers && savedLocationWeathers[index] ? (
                  <div className="mt-2">
                    <div className="flex flex-row item-center mt-2 p-2">
                      <WeatherIcon iconCode={savedLocationWeathers[index].weather[0].icon} className="w-10 h-10" />
                      <p className="text-lg item-center p-2 font-bold">
                        {units === "metric" ? kelvinToCelsius(savedLocationWeathers[index].main.temp).toFixed(1) : kelvinToFahrenheit(savedLocationWeathers[index].main.temp).toFixed(1)}°
                        {units === "metric" ? "C" : "F"}
                      </p>
                    </div>
                    <p className="text-lg font-bold">{savedLocationWeathers[index].weather[0].description}</p>
                  </div>
                ) : (
                  <p className="text-sm">Loading weather data...</p>
                )}
                <button
                  onClick={() => removeLocation(loc)}
                  className="absolute top-4 right-8 text-red-500"
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
