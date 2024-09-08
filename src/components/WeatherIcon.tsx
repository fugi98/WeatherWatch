import React from 'react';
import { CloudIcon, SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { CloudRainIcon, SnowIcon, ThunderstormIcon, MoonCloudIcon, RainIcon, StormIcon } from './CustomIcons'; // Assuming the SVG components are in CustomIcons.tsx

interface WeatherIconProps {
  condition?: string; // Make this optional
  size?: number;
  iconCode: string; // Ensure this prop is included
  className?: string; // Make this optional as well
}

export function WeatherIcon({ condition = '', size = 24, className = '' }: WeatherIconProps) {
  if (!condition) {
    condition = 'clouds'; // Fallback condition if none provided
  }
  
  switch (condition.toLowerCase()) {
    case 'clear':
      return <SunIcon className={`text-yellow-500 ${className}`} style={{ width: size, height: size }} />;
    case 'clouds':
      return <CloudIcon className={`text-blue-500 ${className}`} style={{ width: size, height: size }} />;
    case 'rain':
      return <RainIcon className={`text-blue-500 ${className}`} style={{ width: size, height: size }} />;
    case 'snow':
      return <SnowIcon className={`text-blue-200 ${className}`} style={{ width: size, height: size }} />;
    case 'thunderstorm':
      return <ThunderstormIcon className={`text-gray-700 ${className}`} style={{ width: size, height: size }} />;
    case 'moon':
      return <MoonIcon className={`text-gray-400 ${className}`} style={{ width: size, height: size }} />;
    case 'mooncloud':
      return <MoonCloudIcon className={`text-gray-600 ${className}`} style={{ width: size, height: size }} />;
    case 'storm':
      return <StormIcon className={`text-gray-800 ${className}`} style={{ width: size, height: size }} />;
    default:
      return <CloudIcon className={`text-gray-500 ${className}`} style={{ width: size, height: size }} />;
  }
}
