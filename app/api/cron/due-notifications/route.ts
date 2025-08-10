import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { addDays, differenceInCalendarDays } from 'date-fns'
// Use the official Resend Node.js SDK published as the "resend" package
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    const today = new Date()
    const { data: items, error } = await supabase.from('items').select('id, user_id, title, category, expiry_date, reminder_days')
    if (error) throw error

    // Fetch user emails once
    const userIds = Array.from(new Set(items.map(i => i.user_id)))
    const { data: users } = await supabase.auth.admin.listUsers()
    const emailById = new Map<string,string>()
    users?.users.forEach(u => { emailById.set(u.id, u.email || '') })

    let sentCount = 0

    for (const it of items) {
      const exp = new Date(it.expiry_date)
      const daysToExpiry = differenceInCalendarDays(exp, today)

      const reminderDays: number[] = it.reminder_days || []
      if (!reminderDays.includes(daysToExpiry)) continue

      // avoid duplicate (check logs)
      const scheduledFor = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
      const { data: existing } = await supabase
        .from('reminder_logs')
        .select('id')
        .eq('item_id', it.id)
        .eq('scheduled_for', scheduledFor.toISOString().slice(0,10))

      if (existing && existing.length > 0) continue

      const email = emailById.get(it.user_id) || ''
      if (!email) continue

      // send email
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: email,
        subject: `Reminder: ${it.title} expires in ${daysToExpiry} day(s)`,
        html: `<p>Your <strong>${it.title}</strong> (${it.category}) expires on <strong>${exp.toDateString()}</strong>.</p>
               <p>Open TAJDEED to renew now.</p>`
      })

      // log
      await supabase.from('reminder_logs').insert({
        item_id: it.id,
        user_id: it.user_id,
        scheduled_for: scheduledFor.toISOString().slice(0,10),
        channel: 'email'
      })

      sentCount++
    }

    return NextResponse.json({ ok: true, sent: sentCount })
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e.message }, { status: 500 })
  }
}
