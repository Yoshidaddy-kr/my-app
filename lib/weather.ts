export function weatherEmoji(code: number): string {
  if (code === 0) return "☀️ 맑음"
  if ([1, 2, 3].includes(code)) return "⛅ 약간 흐림"
  if ([45, 48].includes(code)) return "🌫️ 안개"
  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️ 약한 비"
  if ([61, 63, 65, 66, 67].includes(code)) return "🌧️ 비"
  if ([71, 73, 75, 77].includes(code)) return "❄️ 눈"
  if ([80, 81, 82].includes(code)) return "🌧️ 소나기"
  if ([95, 96, 99].includes(code)) return "⛈️ 뇌우"
  return "🌡️"
}
