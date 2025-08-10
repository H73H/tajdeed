'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { format } from 'date-fns'

type Item = {
  id: string
  category: string
  title: string
  expiry_date: string
}

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([])
  const [email, setEmail] = useState<string>('')

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{
      setEmail(data.user?.email || '')
    })
    supabase.auth.getSession().then(async ({data})=>{
      if (!data.session) return
      const { data: rows } = await supabase.from('items').select('*').order('expiry_date', { ascending: true })
      setItems(rows || [])
    })
  }, [])

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Items</h2>
          <p className="text-sm text-[var(--muted)]">Signed in as {email}</p>
        </div>
        <Link href="/items/new" className="btn">Add Item</Link>
      </div>

      {items.length === 0 ? (
        <div className="card">No items yet. Add your first one.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(it => (
            <Link key={it.id} href={`/items/${it.id}`} className="card hover:opacity-90">
              <div className="text-sm uppercase opacity-70">{it.category.replace('_',' ')}</div>
              <div className="text-xl font-semibold">{it.title}</div>
              <div className="text-sm mt-2">Expires: {format(new Date(it.expiry_date), 'yyyy-MM-dd')}</div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
