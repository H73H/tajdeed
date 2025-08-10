'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SettingsPage() {
  const [lang, setLang] = useState<'en'|'ar'>('en')

  useEffect(()=>{
    supabase.auth.getUser().then(async ({data})=>{
      const user = data.user
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile?.lang) setLang(profile.lang)
    })
  }, [])

  const save = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').upsert({ id: user.id, email: user.email, lang })
    alert('Saved')
  }

  return (
    <main className="max-w-xl space-y-4">
      <h2 className="text-2xl font-bold">Settings</h2>
      <div className="card space-y-3">
        <div>
          <label className="block mb-1">Language</label>
          <select value={lang} onChange={e=>setLang(e.target.value as any)}>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>
        <button className="btn" onClick={save}>Save</button>
      </div>
    </main>
  )
}
