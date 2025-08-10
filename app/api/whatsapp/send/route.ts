import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const token = process.env.META_WHATSAPP_TOKEN
  const phoneId = process.env.META_PHONE_NUMBER_ID
  if (!token || !phoneId) {
    return NextResponse.json({ ok:false, error: 'WhatsApp API not configured' }, { status: 400 })
  }
  const body = await req.json()
  const { to, template='tajdeed_reminder', params=[] } = body

  const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: template,
      language: { code: 'en_US' },
      components: params.length ? [{
        type: 'body',
        parameters: params.map((v:any)=> ({ type:'text', text:String(v) }))
      }] : []
    }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  })
  const data = await res.json()
  return NextResponse.json({ ok: res.ok, data })
}
