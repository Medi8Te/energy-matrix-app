import { useState } from 'react'

export default function LichtList({ lichtbronnen, onDelete }) {
  const [filter, setFilter] = useState('alle')

  if (lichtbronnen.length === 0) return (
    <div className="list-section">
      <h2>Lichtbronnen</h2>
      <div className="empty-state">Nog geen lichtbronnen vastgelegd.</div>
    </div>
  )

  const categorieen = [...new Set(lichtbronnen.map(l => l.categorie))].sort()
  const zichtbaar = filter === 'alle' ? lichtbronnen : lichtbronnen.filter(l => l.categorie === filter)

  return (
    <div className="list-section">
      <h2>
        Lichtbronnen ({zichtbaar.length}{filter !== 'alle' ? ` van ${lichtbronnen.length}` : ''})
      </h2>

      <div className="form-group" style={{ maxWidth: 260 }}>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="alle">Alle categorieën</option>
          {categorieen.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {zichtbaar.length === 0 ? (
        <div className="empty-state">Geen lichtbronnen in deze categorie.</div>
      ) : (
        <div className="list-items">
          {zichtbaar.map(l => {
            const gap = l.frequentieIdeaal - l.frequentieActueel
            return (
              <div key={l.id} className="list-item">
                <div className="item-main">
                  <div className="item-name">{l.omschrijving}</div>
                  <div className="item-meta">
                    <span className="badge badge-energy">Licht: {l.lichtsterkte}</span>
                    <span className="badge badge-cat">{l.categorie}</span>
                    <span className="badge badge-status">
                      {l.frequentieActueel}×/{l.frequentieIdeaal}× p/w
                    </span>
                    {gap > 0 && (
                      <span className="badge badge-potentiaal">+{gap}× onbenut</span>
                    )}
                  </div>
                </div>
                <button className="delete-btn" onClick={() => onDelete(l.id)} title="Verwijder">✕</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
