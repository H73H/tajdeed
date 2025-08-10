'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { defaultReminderDaysByCategory } from '@/lib/reminderRules'

const categories = [
  'emirates_id','car_registration','drivers_license','visa','insurance','tenancy','trade_license','passport','other'
]

export default function NewItem() {
  const [form, setForm] = useState<any>({
    category: 'emirates_id',
    title: '',
    id_number: '',
    issue_date: '',
    expiry_date: '',
    reminder_days: ''
  })
  const router = useRouter()

  const onSubmit = async (e:any) => {
    e.preventDefault()
    const days = form.reminder_days
      ? form.reminder_days.split(',').map((d:string)=> parseInt(d.trim(),10)).filter(Boolean)
      : defaultReminderDaysByCategory[form.category] || [60,30,7,1]

    const { error } = await supabase.from('items').insert({
      category: form.category,
      title: form.title,
      id_number: form.id_number || null,
      issue_date: form.issue_date || null,
      expiry_date: form.expiry_date,
      reminder_days: days
    })
    if (!error) router.push('/dashboard')
  }

  return (
    <main className="max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Add Item</h2>
      <form onSubmit={onSubmit} className="space-y-4 card">
        <div>
          <label className="block mb-1">Category</label>
          <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1">Title</label>
          <input required value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="My Emirates ID" />
        </div>
        <div>
          <label className="block mb-1">ID Number (optional)</label>
          <input value={form.id_number} onChange={e=>setForm({...form, id_number:e.target.value})} />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Issue Date</label>
            <input type="date" value={form.issue_date} onChange={e=>setForm({...form, issue_date:e.target.value})} />
          </div>
          <div>
            <label className="block mb-1">Expiry Date</label>
            <input type="date" required value={form.expiry_date} onChange={e=>setForm({...form, expiry_date:e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block mb-1">Reminder Days (optional)</label>
          <input placeholder="60,30,7,1" value={form.reminder_days} onChange={e=>setForm({...form, reminder_days:e.target.value})} />
          <p className="text-xs opacity-70 mt-1">Default: {JSON.stringify(defaultReminderDaysByCategory[form.category])}</p>
        </div>
        <button className="btn">Save</button>
      </form>
    </main>
  )
}
