'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams, useRouter } from 'next/navigation'

export default function ItemPage() {
  const params = useParams<{id:string}>()
  const router = useRouter()
  const [item, setItem] = useState<any>(null)

  useEffect(()=>{
    const fetchItem = async () => {
      const { data } = await supabase.from('items').select('*').eq('id', params.id).single()
      setItem(data)
    }
    fetchItem()
  }, [params.id])

  const del = async () => {
    await supabase.from('items').delete().eq('id', params.id)
    router.push('/dashboard')
  }

  const save = async (e:any) => {
    e.preventDefault()
    const { error } = await supabase.from('items').update({
      title: item.title,
      id_number: item.id_number,
      issue_date: item.issue_date,
      expiry_date: item.expiry_date,
      reminder_days: item.reminder_days
    }).eq('id', item.id)
    if (!error) alert('Saved')
  }

  if (!item) return <div>Loading...</div>

  return (
    <main className="max-w-xl space-y-4">
      <h2 className="text-2xl font-bold">Edit Item</h2>
      <form onSubmit={save} className="card space-y-3">
        <div>
          <label className="block mb-1">Title</label>
          <input value={item.title || ''} onChange={e=>setItem({...item, title:e.target.value})} />
        </div>
        <div>
          <label className="block mb-1">ID Number</label>
          <input value={item.id_number || ''} onChange={e=>setItem({...item, id_number:e.target.value})} />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Issue Date</label>
            <input type="date" value={item.issue_date || ''} onChange={e=>setItem({...item, issue_date:e.target.value})} />
          </div>
          <div>
            <label className="block mb-1">Expiry Date</label>
            <input type="date" value={item.expiry_date || ''} onChange={e=>setItem({...item, expiry_date:e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block mb-1">Reminder Days</label>
          <input value={(item.reminder_days || []).join(',')} onChange={e=>setItem({...item, reminder_days: e.target.value.split(',').map((d)=>parseInt(d.trim(),10)).filter(Boolean)})} />
        </div>
        <div className="flex gap-2">
          <button className="btn" type="submit">Save</button>
          <button className="btn" type="button" onClick={del}>Delete</button>
        </div>
      </form>
    </main>
  )
}
