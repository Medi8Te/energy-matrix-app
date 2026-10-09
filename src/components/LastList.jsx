const STATUS_OPTIONS = ['aanwezig', 'in beweging', 'omarmd', 'losgelaten']

export default function LastList({ lasten, onStatusChange, onDelete }) {
  if (lasten.length === 0) return (
    <div className="list-section">
      <h2>Lasten</h2>
      <div className="empty-state">Nog geen lasten vastgelegd.</div>
    </div>
  )

  return (
    <div className="list-section">
      <h2>Lasten ({lasten.length})</h2>
      <div className="list-items">
        {lasten.map(l => (
          <div key={l.id} className="list-item" style={{ opacity: l.status === 'losgelaten' ? 0.45 : 1 }}>
            <div className="item-main">
              <div className="item-name">{l.omschrijving}</div>
              <div className="item-meta">
                <span className="badge badge-stress">Gewicht: {l.gewicht}</span>
                <span className="badge badge-status">{l.status}</span>
                {l.actieplan && <span className="badge badge-actieplan">Intentie ✓</span>}
              </div>
              {l.actieplan && <div className="item-actieplan">{l.actieplan}</div>}
            </div>
            <select className="status-select" value={l.status} onChange={e => onStatusChange(l.id, e.target.value)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="delete-btn" onClick={() => onDelete(l.id)} title="Verwijder">✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}
