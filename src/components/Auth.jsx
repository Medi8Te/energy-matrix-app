import { useState } from 'react'
import { supabase } from '../supabase'

const QUOTES = [
  'De reis naar binnen begint met één stap.',
  'In stilte vind je de antwoorden die lawaai verbergt.',
  'Elke zorg die je erkent, verliest een deel van haar gewicht.',
]

export default function Auth() {
  const [mode, setMode]       = useState('login') // 'login' | 'signup' | 'check-email' | 'reset'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [quote]               = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(vertaalFout(error.message))
    }

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(vertaalFout(error.message))
      else setMode('check-email')
    }

    if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })
      if (error) setError(vertaalFout(error.message))
      else setMode('check-email')
    }

    setLoading(false)
  }

  function vertaalFout(msg) {
    if (msg.includes('Invalid login')) return 'E-mail of wachtwoord klopt niet.'
    if (msg.includes('already registered')) return 'Dit e-mailadres is al geregistreerd.'
    if (msg.includes('Password should be')) return 'Wachtwoord moet minimaal 6 tekens zijn.'
    return msg
  }

  if (mode === 'check-email') return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-icon">✉️</div>
        <h2>Controleer je inbox</h2>
        <p className="auth-sub">
          We hebben een e-mail gestuurd naar <strong>{email}</strong>.<br />
          Klik op de link om {mode === 'reset' ? 'je wachtwoord te herstellen' : 'je account te bevestigen'}.
        </p>
        <button className="auth-link" onClick={() => setMode('login')}>← Terug naar inloggen</button>
      </div>
    </div>
  )

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">Innerlijke Balans</h1>
        <p className="auth-quote">"{quote}"</p>

        <h2 className="auth-heading">
          {mode === 'login' ? 'Welkom terug' : mode === 'reset' ? 'Wachtwoord herstellen' : 'Account aanmaken'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="auth-group">
            <label>E-mailadres</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jouw@email.nl"
              required
              autoFocus
            />
          </div>

          {mode !== 'reset' && (
            <div className="auth-group">
              <label>Wachtwoord</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Even geduld…' : mode === 'login' ? 'Inloggen' : mode === 'reset' ? 'Verstuur resetlink' : 'Account aanmaken'}
          </button>
        </form>

        <div className="auth-links">
          {mode === 'login' && <>
            <button className="auth-link" onClick={() => { setMode('signup'); setError('') }}>Nog geen account? Registreer</button>
            <button className="auth-link small" onClick={() => { setMode('reset'); setError('') }}>Wachtwoord vergeten?</button>
          </>}
          {mode === 'signup' && (
            <button className="auth-link" onClick={() => { setMode('login'); setError('') }}>Al een account? Inloggen</button>
          )}
          {mode === 'reset' && (
            <button className="auth-link" onClick={() => { setMode('login'); setError('') }}>← Terug</button>
          )}
        </div>
      </div>
    </div>
  )
}
