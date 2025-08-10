'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signIn = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="card max-w-md w-full">
      <h2 className="text-xl font-semibold mb-2">Sign in</h2>
      <p className="text-sm mb-4">Enter your email to receive a magic link.</p>
      {sent ? (
        <p className="text-green-400">Check your email for the sign-in link.</p>
      ) : (
        <div className="space-y-3">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" />
          <button onClick={signIn} className="btn w-full">Send Magic Link</button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      )}
    </div>
  )
}
