"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { HomeIcon, MapPinIcon, CalendarIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetcher, kelvinToCelsius } from "../utils/helpers";
import SearchBar from "./SearchBar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ForecastIcon } from "./CustomIcons";

// Use ComponentProps to infer the correct types for the Calendar component
import { ComponentProps } from "react";

type CalendarProps = ComponentProps<typeof Calendar>;
type CalendarValue = CalendarProps['value'];
type CalendarOnChange = CalendarProps['onChange'];

interface Weather {
  description: string;
  icon: string;
}

interface Main {
  temp: number;
}

interface ForecastListItem {
  dt: number;
  main: Main;
  weather: Weather[];
}

interface ForecastCity {
  name: string;
}

interface ForecastResponse {
  city: ForecastCity;
  list: ForecastListItem[];
}

const CalendarPage: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useState("London");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: forecast, error: forecastError } = useSWR<ForecastResponse>(
    `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`,
    fetcher
  );

  useEffect(() => {
    const handleRouteChange = () => setLoading(true);
    const handleRouteComplete = () => setLoading(false);
    const handleRouteError = () => setLoading(false);

    return () => {
      // Cleanup event listeners if they were used
    };
  }, [router]);

  if (forecastError) return <div className="text-white">Failed to load weather data</div>;

  if (!forecast) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="flex flex-col items-center text-center">
          <div className="spinner mb-4"></div>
          <p className="mt-4 text-xl font-bold">Loading Weather Calendar...</p>
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
    return units === "metric"
      ? Math.round(kelvinToCelsius(temp))
      : Math.round(temp);
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  const handleDateChange: CalendarOnChange = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value) && value.length > 0 && value[0] instanceof Date) {
      setSelectedDate(value[0]);
    } else {
      setSelectedDate(null);
    }
  };

  const filteredForecast = forecast.list.filter(
    (item) =>
      new Date(item.dt * 1000).toLocaleDateString() ===
      selectedDate?.toLocaleDateString()
  );

  return (
    <div className="flex min-h-screen bg-gradient-custom  overflow-x-hidden">
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

      <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-custom  w-full flex flex-col overflow-hidden">
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
            <h1 className="text-3xl font-bold text-white">{forecast.city.name}</h1>
          </div>
        </div>

        {/* Custom Styled Calendar */}
        <div className="p-6 w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Weather Calendar</h2>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="custom-calendar rounded-3xl w-full"
            tileClassName={({ date, view }) =>
              view === "month"
                ? date.getMonth() !== new Date().getMonth()
                  ? "text-gray-500"
                  : "text-black"
                : undefined
            }
              
          />
        </div>

        {/* Selected Date's Weather Details */}
        {selectedDate && (
          <div className="mt-6 p-4 w-full">
            <h2 className="text-2xl font-bold text-white mb-4">
              Weather for {selectedDate.toLocaleDateString()}
            </h2>
            {filteredForecast.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {filteredForecast.slice(0, 12).map((item) => (
                  <div
                    key={item.dt}
                    className="bg-[#2d2c3c] p-4 rounded-lg flex flex-col justify-between shadow-md text-white"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-bold">
                        {new Date(item.dt * 1000).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <img
                        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                        alt={item.weather[0].description}
                        className="h-10 w-10"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-semibold">
                        {convertTemp(item.main.temp)}°{units === "metric" ? "C" : "F"}
                      </p>
                      <p className="text-sm">{item.weather[0].description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white">No weather data available for this date.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;