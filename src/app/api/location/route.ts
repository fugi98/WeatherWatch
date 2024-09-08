// app/api/location/route.ts
import { NextResponse } from 'next/server';

let locations = [
  { id: 1, city: 'London', country: 'UK' },
  { id: 2, city: 'New York', country: 'USA' }
];

// Handle GET, POST, PUT, and DELETE requests
export async function GET() {
  return NextResponse.json(locations);
}

export async function POST(request: Request) {
  const { city, country } = await request.json();
  const newLocation = {
    id: locations.length + 1,
    city,
    country,
  };

  locations.push(newLocation);
  return NextResponse.json(newLocation, { status: 201 });
}

export async function PUT(request: Request) {
  const { id, city, country } = await request.json();
  const locationIndex = locations.findIndex(loc => loc.id === id);

  if (locationIndex === -1) {
    return NextResponse.json({ error: 'Location not found' }, { status: 404 });
  }

  locations[locationIndex] = { id, city, country };
  return NextResponse.json(locations[locationIndex], { status: 200 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const locationIndex = locations.findIndex(loc => loc.id === id);

  if (locationIndex === -1) {
    return NextResponse.json({ error: 'Location not found' }, { status: 404 });
  }

  locations = locations.filter(loc => loc.id !== id);
  return NextResponse.json({ message: 'Location deleted' }, { status: 200 });
}
