import React from 'react';

interface IconProps {
  className?: string
}

export const CloudRainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    {/* Cloud */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4a4 4 0 00-4 4H7a5 5 0 00-5 5v1h20v-1a5 5 0 00-5-5h-1a4 4 0 00-4-4z"
      fill="#E0F7FA" // Lightest blue-white fill
      stroke="#B3E5FC" // Light blue border
    />
    {/* Droplets */}
    <path
      fill="#00B0FF" // Blue color for droplets
      d="M8 19c0 1.105-1.345 2-3 2s-3-.895-3-2 1.345-2 3-2 3 .895 3 2zM13 19c0 1.105-1.345 2-3 2s-3-.895-3-2 1.345-2 3-2 3 .895 3 2zM18 19c0 1.105-1.345 2-3 2s-3-.895-3-2 1.345-2 3-2 3 .895 3 2zM10 21l-1.5 3m3-3l-1.5 3m4-3l-1.5 3m2-3l-1.5 3m4-3l-1.5 3" // Additional droplets
    />
  </svg>
);


export const SnowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    {/* Snowflake Arms */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 2v20m10-10H2m15.5-7.5L8.5 16.5m0-9L18.5 16.5"
      stroke="#B3E5FC" // Light blue for snowflake arms
    />
    {/* Snowflake Circles */}
    <circle cx="12" cy="4" r="1" fill="#E0F7FA" />
    <circle cx="12" cy="20" r="1" fill="#E0F7FA" />
    <circle cx="4" cy="12" r="1" fill="#E0F7FA" />
    <circle cx="20" cy="12" r="1" fill="#E0F7FA" />
    <circle cx="7.5" cy="7.5" r="1" fill="#E0F7FA" />
    <circle cx="16.5" cy="16.5" r="1" fill="#E0F7FA" />
    <circle cx="7.5" cy="16.5" r="1" fill="#E0F7FA" />
    <circle cx="16.5" cy="7.5" r="1" fill="#E0F7FA" />
  </svg>
);

export const ForecastIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <circle cx="32" cy="20" r="10" fill="#FFD700" /> {/* Sun */}
    <path
      d="M48 40c-2 0-4-1-6-2-2 1-4 2-6 2-6 0-10-4-10-10 0-4 3-8 8-9 2 0 4 1 6 2 2-1 4-2 6-2 6 0 10 4 10 10 0 5-4 9-8 9z"
      fill="#B0C4DE"
    /> {/* Cloud */}
    <line x1="30" y1="50" x2="30" y2="60" stroke="#00BFFF" strokeWidth="2" strokeLinecap="round" /> {/* Rain Drop 1 */}
    <line x1="40" y1="50" x2="40" y2="60" stroke="#00BFFF" strokeWidth="2" strokeLinecap="round" /> {/* Rain Drop 2 */}
  </svg>
);

export const WindIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4h16M4 10h12M4 16h8"
    />
  </svg>
);

export const ThunderstormIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {/* Cloud */}
    <path
      d="M19.35 10.04a6 6 0 00-11.58 0A4.5 4.5 0 002 14.5 4.5 4.5 0 006.5 19h12a4.5 4.5 0 004.5-4.5 4.5 4.5 0 00-3.65-4.96z"
      fill="#B3E5FC" // Light blue for cloud
      stroke="#90CAF9" // Slightly darker blue for border
      strokeWidth="2"
    />
    {/* Lightning Bolts */}
    <path
      d="M13 12l-2 6h5l-2 6 2-6h-5l2-6z"
      fill="#FFC107" // Yellow color for lightning
      stroke="#FFA000" // Darker yellow for border
      strokeWidth="2"
    />
    <path
      d="M10 8l-2 6h5l-2 6 2-6h-5l2-6z"
      fill="#FFC107" // Yellow color for lightning
      stroke="#FFA000" // Darker yellow for border
      strokeWidth="2"
    />
    <path
      d="M15 6l-2 6h5l-2 6 2-6h-5l2-6z"
      fill="#FFC107" // Yellow color for lightning
      stroke="#FFA000" // Darker yellow for border
      strokeWidth="2"
    />
    <path
      d="M12 10l-2 6h5l-2 6 2-6h-5l2-6z"
      fill="#FFC107" // Yellow color for lightning
      stroke="#FFA000" // Darker yellow for border
      strokeWidth="2"
    />
    {/* Water Droplets */}
    <path
      d="M7 21l-1.5 3m3-3l-1.5 3m4-3l-1.5 3m2-3l-1.5 3m4-3l-1.5 3"
      stroke="#00B0FF" // Blue color for water droplets
      strokeWidth="2"
    />
  </svg>
);

export const MoonCloudIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24" // Increased size for better visibility
    height="24"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 16 16"
  >
    {/* Cloud and Moon SVG Path with Colors */}
    <path
      d="M7 8a3.5 3.5 0 0 1 3.5 3.555.5.5 0 0 0 .625.492A1.503 1.503 0 0 1 13 13.5a1.5 1.5 0 0 1-1.5 1.5H3a2 2 0 1 1 .1-3.998.5.5 0 0 0 .509-.375A3.5 3.5 0 0 1 7 8m4.473 3a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 16h8.5a2.5 2.5 0 0 0 0-5z"
      fill="#B3E5FC" // Light blue for cloud
      stroke="#90CAF9" // Slightly darker blue for cloud border
      strokeWidth="1"
    />
    <path
      d="M11.286 1.778a.5.5 0 0 0-.565-.755 4.595 4.595 0 0 0-3.18 5.003 5.5 5.5 0 0 1 1.055.209A3.6 3.6 0 0 1 9.83 2.617a4.593 4.593 0 0 0 4.31 5.744 3.58 3.58 0 0 1-2.241.634q.244.477.394 1a4.59 4.59 0 0 0 3.624-2.04.5.5 0 0 0-.565-.755 3.593 3.593 0 0 1-4.065-5.422z"
      fill="#FFEB3B" // Light yellow for crescent moon
      stroke="#FDD835" // Slightly darker yellow for moon border
      strokeWidth="1"
    />
  </svg>
);


export const RainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    stroke="currentColor"
    width="24" // Increased size for better visibility
    height="24"
  >
    {/* Cloud */}
    <path
      d="M4.176 11.032a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 0 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293m3 0a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 0 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293m3 0a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 0 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293m3 0a.5.5 0 0 1 .292.643l-1.5 4a.5.5 0 0 1-.936-.35l1.5-4a.5.5 0 0 1 .644-.293m.229-7.005a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973"
      fill="#90CAF9" // Cloud fill color
      stroke="lightblue" // Light blue border color
      strokeWidth="1" // Border thickness
    />
    {/* Droplets */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 12l-1 2m2-2l-1 2m4-2l-1 2m2-2l-1 2m4-2l-1 2"
      stroke="lightblue" // Updated color for the droplets
    />
  </svg>
);

export const StormIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M14 4a6 6 0 0 0-6 6v4a6 6 0 0 0 6 6h4l2 4m0-16l-2 4m-2-4l2 4m-6 0l-2-4m0 4l2 4m-6 0l2-4"
    />
  </svg>
)