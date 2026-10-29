import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

// Netto per aanmaakdag: licht toegevoegd minus lastgewicht toegevoegd.
// Cumulatief over de tijd. Gebaseerd op aanmaakdatum, niet op een dagelijkse momentopname.
function buildTrend(lasten, lichtbronnen) {
  const perDag = {}
  const dag = iso => new Date(iso).toLocaleDateString('sv-SE')

  lichtbronnen.forEach(l => {
    const d = dag(l.created_at)
    perDag[d] = (perDag[d] || 0) + (l.lichtsterkte || 0)
  })
  lasten.forEach(l => {
    const d = dag(l.created_at)
    perDag[d] = (perDag[d] || 0) - (l.gewicht || 0)
  })

  let cumul = 0
  return Object.keys(perDag).sort().map(d => {
    cumul += perDag[d]
    return { dag: d.slice(5), netto: cumul }
  })
}

export default function Trend({ lasten, lichtbronnen }) {
  const data = buildTrend(lasten, lichtbronnen)

  return (
    <div className="card">
      <h3 style={{ marginBottom: 16, fontSize: '0.72rem', color: 'rgba(110,80,190,0.72)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif' }}>
        Verloop — netto balans over tijd
      </h3>
      {data.length < 2 ? (
        <div className="empty-state">Er is minimaal een tweede dag met gegevens nodig voor een verloop.</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(110,80,190,0.13)" />
            <XAxis dataKey="dag" stroke="rgba(110,80,190,0.36)" tick={{ fill: 'rgba(110,80,190,0.54)', fontSize: 11 }} />
            <YAxis stroke="rgba(110,80,190,0.36)" tick={{ fill: 'rgba(110,80,190,0.54)', fontSize: 11 }} />
            <ReferenceLine y={0} stroke="rgba(110,80,190,0.36)" />
            <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(110,80,190,0.36)', borderRadius: 10, fontSize: 13 }} />
            <Line type="monotone" dataKey="netto" name="Netto" stroke="#8b6fd6" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
      <div style={{ fontSize: 11, color: 'rgba(110,80,190,0.63)', marginTop: 8 }}>
        Telt toegevoegde lichtbronnen en zorgen per dag op. Wijzigingen van status worden niet teruggerekend.
      </div>
    </div>
  )
}
