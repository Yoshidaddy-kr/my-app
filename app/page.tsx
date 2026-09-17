"use client"

import { useEffect, useState } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { supabase } from "@/lib/supabase"
import { countryById, normalizeId, CountryInfo } from "@/lib/countries"
import { weatherEmoji } from "@/lib/weather"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

type WeatherResult = {
  temperature: number
  time: string
  code: number
}

export default function Home() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null)
  const [country, setCountry] = useState<CountryInfo | null>(null)
  const [weather, setWeather] = useState<WeatherResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  useEffect(() => {
    async function updateVisitorCount() {
      const { data } = await supabase.from("visitors").select("count").eq("id", 1).single()
      const newCount = (data?.count ?? 0) + 1
      await supabase.from("visitors").update({ count: newCount }).eq("id", 1)
      setVisitorCount(newCount)
    }
    updateVisitorCount()
  }, [])

  async function handleClick(id: string, rsmKey: string) {
    setSelectedKey(rsmKey)
    const info = countryById[normalizeId(id)]
    if (!info) {
      setCountry(null)
      setWeather(null)
      return
    }
    setCountry(info)
    setWeather(null)
    setLoading(true)
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${info.lat}&longitude=${info.lng}&current_weather=true&timezone=auto`
      )
      const data = await res.json()
      setWeather({
        temperature: data.current_weather.temperature,
        time: data.current_weather.time,
        code: data.current_weather.weathercode,
      })
    } catch {
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 flex flex-col items-center p-6 gap-4">
      <div className="fixed top-4 right-4 rounded-lg bg-slate-100 px-4 py-2 text-lg font-semibold shadow">
        {visitorCount === null ? "로딩중..." : `방문자 수: ${visitorCount}`}
      </div>

      <h1 className="text-3xl font-bold mt-2">나라를 클릭해보세요</h1>

      <div className="w-full max-w-[1400px]">
        <ComposableMap
          projectionConfig={{ scale: 180 }}
          width={1000}
          height={520}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isSelected = selectedKey === geo.rsmKey
                const isHovered = hoveredKey === geo.rsmKey
                const fillColor = isSelected ? "#EF4444" : isHovered ? "#FACC15" : "#3B82F6"
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#1E293B"
                    strokeWidth={0.5}
                    tabIndex={-1}
                    onMouseEnter={() => setHoveredKey(geo.rsmKey)}
                    onMouseLeave={() => setHoveredKey(null)}
                    onClick={() => handleClick(geo.id as string, geo.rsmKey)}
                    style={{
                      default: { outline: "none", cursor: "pointer" },
                      hover: { outline: "none", cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {country && (
        <div className="flex flex-col items-center gap-2 text-center rounded-2xl bg-slate-100 px-10 py-6">
          <div className="text-4xl font-bold">{country.name}</div>
          <div className="text-xl text-slate-500">수도: {country.capital}</div>

          {loading && <div className="text-2xl">불러오는 중...</div>}

          {weather && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="text-6xl font-bold">{weather.temperature}°C</div>
              <div className="text-3xl">{weatherEmoji(weather.code)}</div>
              <div className="text-2xl text-slate-600">
                현지 시간: {weather.time.replace("T", " ")}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}