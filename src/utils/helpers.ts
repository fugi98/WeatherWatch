// File: utils/helpers.ts
export const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const kelvinToCelsius = (kelvin: number) => kelvin - 273.15

export const kelvinToFahrenheit = (kelvin: number) => (kelvin - 273.15) * 9/5 + 32