'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function NavBar({lang}:{lang:'en'|'ar'}) {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=> setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session)=>{
      setSession(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="w-full flex items-center justify-between py-4">
      <Link href="/" className="font-bold text-lg">TAJDEED</Link>
      <div className="flex gap-4 items-center">
        {session && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/guides">Guides</Link>
            <Link href="/settings">Settings</Link>
            <button onClick={logout} className="btn">Logout</button>
          </>
        )}
      </div>
    </nav>
  )
}
