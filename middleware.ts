import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const isProtected = url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/items') || url.pathname.startsWith('/settings')
  const hasSession = req.cookies.get('sb-access-token') || req.cookies.get('sb:token')

  if (isProtected && !hasSession) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}
