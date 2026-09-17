'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    async function updateCount() {
      const { data } = await supabase.from('visitors').select('count').eq('id', 1).single()
      const newCount = (data?.count ?? 0) + 1
      await supabase.from('visitors').update({ count: newCount }).eq('id', 1)
      setCount(newCount)
    }
    updateCount()
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '2rem' }}>
      {count === null ? '로딩중...' : `방문자 수: ${count}`}
    </div>
  )
}
