import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handle = async () => {
    setError('')
    setMessage('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    if (mode === 'login') {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) setError(err.message)
      else onAuth(data.user)
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) setError(err.message)
      else setMessage('Check your email to confirm your account, then log in.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0c0c0f', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif"
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
      <div style={{
        background: '#13131a', border: '1px solid #1e1e26', borderRadius: 20,
        padding: '44px 40px', width: '100%', maxWidth: 420
      }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: '#f0ede8', marginBottom: 6 }}>
          Biz<span style={{ color: '#f5a623' }}>Kit</span>
        </div>
        <div style={{ color: '#6b6b78', fontSize: 14, marginBottom: 32 }}>
          {mode === 'login' ? 'Welcome back. Sign in to continue.' : 'Create your free account.'}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#6b6b78', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" onKeyDown={e => e.key === 'Enter' && handle()}
            style={{ width: '100%', background: '#0c0c0f', border: '1px solid #1e1e26', borderRadius: 10, padding: '12px 14px', color: '#f0ede8', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#6b6b78', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handle()}
            style={{ width: '100%', background: '#0c0c0f', border: '1px solid #1e1e26', borderRadius: 10, padding: '12px 14px', color: '#f0ede8', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {error && <div style={{ background: '#e05c5c1a', border: '1px solid #e05c5c44', borderRadius: 10, padding: '10px 14px', color: '#e05c5c', fontSize: 13, marginBottom: 16 }}>{error}</div>}
        {message && <div style={{ background: '#4caf7d1a', border: '1px solid #4caf7d44', borderRadius: 10, padding: '10px 14px', color: '#4caf7d', fontSize: 13, marginBottom: 16 }}>{message}</div>}

        <button
          onClick={handle} disabled={loading}
          style={{ width: '100%', background: '#f5a623', color: '#0c0c0f', border: 'none', borderRadius: 10, padding: '13px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6b6b78' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage('') }}
            style={{ color: '#f5a623', cursor: 'pointer', fontWeight: 500 }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  )
}
