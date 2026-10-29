import { useState } from 'react'

const INIT = {
  omschrijving: '',
  waarschijnlijkheid: 5,
  impact: 5,
  controleerbaarheid: 5,
  actieplan: '',
  status: 'aanwezig',
}

export default function LastForm({ onSave }) {
  const [form, setForm] = useState(INIT)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function submit(e) {
    e.preventDefault()
    if (!form.omschrijving.trim()) return
    onSave({ ...form, waarschijnlijkheid: +form.waarschijnlijkheid, impact: +form.impact, controleerbaarheid: +form.controleerbaarheid })
    setForm(INIT)
  }

  const gewicht = Math.round((form.waarschijnlijkheid * form.impact * (10 - form.controleerbaarheid)) / 10)
  const gewichtColor = gewicht > 50 ? '#f0567a' : gewicht > 25 ? '#f2a516' : '#2fb67c'

  return (
    <form className="form-card" onSubmit={submit}>
      <h2>☁️ Een zorg vastleggen</h2>
      <p className="form-intro">Wat draag je op dit moment met je mee? Erkenning is de eerste stap naar verlichting.</p>

      <div className="form-group">
        <label>Wat precies?</label>
        <textarea value={form.omschrijving} onChange={e => set('omschrijving', e.target.value)} placeholder="Beschrijf de zorg in je eigen woorden..." required />
      </div>

      <div className="form-group">
        <label>Waarschijnlijkheid (1–10) — Hoe waarschijnlijk is dit echt?</label>
        <div className="slider-row">
          <input type="range" min="1" max="10" value={form.waarschijnlijkheid} onChange={e => set('waarschijnlijkheid', e.target.value)} />
          <span className="slider-value">{form.waarschijnlijkheid}</span>
        </div>
      </div>

      <div className="form-group">
        <label>Impact (1–10) — Hoe zwaar voelt dit als het werkelijkheid wordt?</label>
        <div className="slider-row">
          <input type="range" min="1" max="10" value={form.impact} onChange={e => set('impact', e.target.value)} />
          <span className="slider-value">{form.impact}</span>
        </div>
      </div>

      <div className="form-group">
        <label>Invloed (1–10) — Hoeveel ruimte heb jij hier zelf in?</label>
        <div className="slider-row">
          <input type="range" min="1" max="10" value={form.controleerbaarheid} onChange={e => set('controleerbaarheid', e.target.value)} />
          <span className="slider-value">{form.controleerbaarheid}</span>
        </div>
      </div>

      <div className="form-group">
        <label>Intentie of actie — Wat wil je hiermee doen?</label>
        <textarea value={form.actieplan} onChange={e => set('actieplan', e.target.value)} placeholder="Een kleine stap, een gebed, een grens, een loslating..." />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select value={form.status} onChange={e => set('status', e.target.value)}>
          <option value="aanwezig">Aanwezig</option>
          <option value="in beweging">In beweging</option>
          <option value="omarmd">Omarmd</option>
          <option value="losgelaten">Losgelaten</option>
        </select>
      </div>

      <div className="score-preview">
        <span style={{ color: 'rgba(110,80,190,0.9)' }}>Gewicht: </span>
        <strong style={{ color: gewichtColor }}>{gewicht}</strong>
        <span style={{ color: 'rgba(110,80,190,0.54)', fontSize: 11, marginLeft: 10 }}>kans × impact × (10 − invloed) / 10</span>
      </div>

      <button type="submit" className="btn-primary">Vastleggen</button>
    </form>
  )
}
