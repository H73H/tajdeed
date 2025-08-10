'use client'
import Auth from '@/components/Auth'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const router = useRouter()

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      if (data.session) {
        setSession(data.session)
        router.push('/dashboard')
      }
    })
  }, [router])

  return (
    <main>
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold">TAJDEED</h1>
        <p className="text-lg text-[var(--muted)] mt-2">Never miss a renewal again.</p>
      </header>
      <Auth />
    </main>
  )
}
