export default function LichtList({ lichtbronnen, onDelete }) {
  if (lichtbronnen.length === 0) return (
    <div className="list-section">
      <h2>Lichtbronnen</h2>
      <div className="empty-state">Nog geen lichtbronnen vastgelegd.</div>
    </div>
  )

  return (
    <div className="list-section">
      <h2>Lichtbronnen ({lichtbronnen.length})</h2>
      <div className="list-items">
        {lichtbronnen.map(l => {
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
    </div>
  )
}
