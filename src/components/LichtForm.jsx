import { useState } from 'react'

const CATEGORIEEN = ['Verbinding', 'Familie en Gezin', 'Vriendschap', 'Creativiteit', 'Werk', 'Beweging', 'Natuur', 'Rust', 'Spiritualiteit', 'Spel', 'Anders']

const INIT = {
  omschrijving: '',
  lichtsterkte: 5,
  frequentieIdeaal: 3,
  frequentieActueel: 1,
  categorie: 'Verbinding',
}

export default function LichtForm({ onSave }) {
  const [form, setForm] = useState(INIT)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function submit(e) {
    e.preventDefault()
    if (!form.omschrijving.trim()) return
    onSave({ ...form, lichtsterkte: +form.lichtsterkte, frequentieIdeaal: +form.frequentieIdeaal, frequentieActueel: +form.frequentieActueel })
    setForm(INIT)
  }

  const gap = form.frequentieIdeaal - form.frequentieActueel

  return (
    <form className="form-card" onSubmit={submit}>
      <h2>🙏 Dankbaarheid vastleggen</h2>
      <p className="form-intro">Waar ben je dankbaar voor? Wat geeft je energie, vreugde of kracht? Benoem wat je voedt — zodat je het bewust kunt koesteren.</p>

      <div className="form-group">
        <label>Waar ben je dankbaar voor?</label>
        <textarea value={form.omschrijving} onChange={e => set('omschrijving', e.target.value)} placeholder="Beschrijf wat je voedt..." required />
      </div>

      <div className="form-group">
        <label>Lichtsterkte (1–10) — Hoeveel energie geeft dit jou?</label>
        <div className="slider-row">
          <input type="range" min="1" max="10" value={form.lichtsterkte} onChange={e => set('lichtsterkte', e.target.value)} />
          <span className="slider-value">{form.lichtsterkte}</span>
        </div>
      </div>

      <div className="form-group">
        <label>Frequentie ideaal (× per week) — Hoe vaak wil je dit voeden?</label>
        <div className="slider-row">
          <input type="range" min="0" max="14" value={form.frequentieIdeaal} onChange={e => set('frequentieIdeaal', e.target.value)} />
          <span className="slider-value">{form.frequentieIdeaal}×</span>
        </div>
      </div>

      <div className="form-group">
        <label>Frequentie actueel (× per week) — Hoe vaak doe je dit nu?</label>
        <div className="slider-row">
          <input type="range" min="0" max="14" value={form.frequentieActueel} onChange={e => set('frequentieActueel', e.target.value)} />
          <span className="slider-value">{form.frequentieActueel}×</span>
        </div>
      </div>

      <div className="form-group">
        <label>Categorie</label>
        <select value={form.categorie} onChange={e => set('categorie', e.target.value)}>
          {CATEGORIEEN.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {gap > 0 && (
        <div className="gap-warning">
          Je wil dit {gap}× meer per week — hier ligt onbenut licht.
        </div>
      )}

      <button type="submit" className="btn-primary">Vastleggen</button>
    </form>
  )
}
