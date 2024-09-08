// app/api/weather/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Get dynamic input from the user for city or lat/lon
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  // Use city if provided, otherwise, use latitude and longitude
  let apiUrl = '';
  if (city) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  } else if (lat && lon) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else {
    return NextResponse.json({ error: 'Please provide city or coordinates' }, { status: 400 });
  }

  const res = await fetch(apiUrl);

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
