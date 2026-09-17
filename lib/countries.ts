import countries from "world-countries"

export type CountryInfo = {
  name: string
  capital: string
  lat: number
  lng: number
}

export function normalizeId(ccn3: string): string {
  return String(Number(ccn3))
}

export const countryById: Record<string, CountryInfo> = {}

for (const c of countries) {
  if (c.ccn3 && c.latlng && c.latlng.length === 2) {
    countryById[normalizeId(c.ccn3)] = {
      name: c.name.common,
      capital: c.capital?.[0] ?? "-",
      lat: c.latlng[0],
      lng: c.latlng[1],
    }
  }
}
