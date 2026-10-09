import { useState, useEffect } from 'react'
import { supabase, fetchLasten, insertLast, updateLastStatus, deleteLast, fetchLichtbronnen, insertLicht, deleteLicht } from './supabase'
import Auth from './components/Auth'
import Gauge from './components/Gauge'
import StatsCards from './components/StatsCards'
import LastForm from './components/LastForm'
import LichtForm from './components/LichtForm'
import LastList from './components/LastList'
import LichtList from './components/LichtList'
import ScatterMatrix from './components/ScatterMatrix'
import './App.css'

const QUOTES = [
  'Wat je aandacht geeft, groeit.',
  'In stilte vind je de antwoorden die lawaai verbergt.',
  'Elke last die je erkent, verliest een deel van zijn gewicht.',
  'Jij bent meer dan je zorgen.',
  'Licht en last bestaan samen — en beide zijn leraar.',
]

const TABS = ['🌙 Balans', '🌑 Last', '🙏 Dankbaarheid', '🪷 Overzicht']

export default function App() {
  const [session, setSession]           = useState(null)
  const [authLoading, setAuthLoading]   = useState(true)
  const [lasten, setLasten]             = useState([])
  const [lichtbronnen, setLichtbronnen] = useState([])
  const [dataLoading, setDataLoading]   = useState(false)
  const [tab, setTab]                   = useState(0)
  const [quote]                         = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)])

  // ── Auth ─────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // ── Data laden ───────────────────────────────────────────
  useEffect(() => {
    if (!session) { setLasten([]); setLichtbronnen([]); return }
    setDataLoading(true)
    Promise.all([
      fetchLasten(session.user.id),
      fetchLichtbronnen(session.user.id),
    ]).then(([l, lb]) => {
      setLasten(l)
      setLichtbronnen(lb)
    }).catch(console.error)
      .finally(() => setDataLoading(false))
  }, [session])

  // ── CRUD ─────────────────────────────────────────────────
  async function addLast(last) {
    const gewicht = Math.round((last.waarschijnlijkheid * last.impact * (10 - last.controleerbaarheid)) / 10)
    const row = await insertLast(session.user.id, { ...last, gewicht })
    setLasten(prev => [...prev, row])
    setTab(0)
  }

  async function addLicht(licht) {
    const row = await insertLicht(session.user.id, licht)
    setLichtbronnen(prev => [...prev, row])
    setTab(0)
  }

  async function handleUpdateStatus(id, status) {
    await updateLastStatus(id, status)
    setLasten(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  async function handleDeleteLast(id) {
    await deleteLast(id)
    setLasten(prev => prev.filter(l => l.id !== id))
  }

  async function handleDeleteLicht(id) {
    await deleteLicht(id)
    setLichtbronnen(prev => prev.filter(l => l.id !== id))
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  // ── Berekeningen ─────────────────────────────────────────
  const actieveLasten = lasten.filter(l => l.status !== 'losgelaten')
  const totaalLasten  = actieveLasten.reduce((s, l) => s + l.gewicht, 0)
  const totaalLicht   = lichtbronnen.reduce((s, l) => s + l.lichtsterkte, 0)
  const balans        = totaalLicht - totaalLasten

  // ── Render ───────────────────────────────────────────────
  if (authLoading) return (
    <div className="loading-screen">
      <div className="spinner" />
      Laden…
    </div>
  )

  if (!session) return <Auth />

  return (
    <div className="app">
      <div className="topbar">
        <span className="topbar-email">{session.user.email}</span>
        <button className="logout-btn" onClick={handleLogout}>Uitloggen</button>
      </div>

      <header className="app-header">
        <h1>Innerlijke Balans</h1>
        <p className="subtitle">Balans · Lasten · Dankbaarheid</p>
        <p className="header-quote">"{quote}"</p>
      </header>

      <nav className="tabs">
        {TABS.map((t, i) => (
          <button key={i} className={`tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>
            {t}
          </button>
        ))}
      </nav>

      <main className="content">
        {dataLoading ? (
          <div className="loading-screen" style={{ minHeight: 300 }}>
            <div className="spinner" />
            Jouw gegevens ophalen…
          </div>
        ) : (
          <>
            {tab === 0 && (
              <div className="dashboard">
                <div className="dashboard-top">
                  <Gauge value={balans} min={-40} max={40} />
                  <StatsCards
                    totaalLicht={totaalLicht}
                    totaalLasten={totaalLasten}
                    balans={balans}
                    aantalLasten={actieveLasten.length}
                    aantalLicht={lichtbronnen.length}
                  />
                </div>
                <ScatterMatrix lasten={lasten} />
              </div>
            )}
            {tab === 1 && <LastForm onSave={addLast} />}
            {tab === 2 && <LichtForm onSave={addLicht} />}
            {tab === 3 && (
              <div className="overzicht">
                <LastList lasten={lasten} onStatusChange={handleUpdateStatus} onDelete={handleDeleteLast} />
                <hr className="section-divider" />
                <LichtList lichtbronnen={lichtbronnen} onDelete={handleDeleteLicht} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
