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
      <h3 style={{ marginBottom: 16, fontSize: '0.72rem', color: 'rgba(180,160,220,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Inter, sans-serif' }}>
        Verloop — netto balans over tijd
      </h3>
      {data.length < 2 ? (
        <div className="empty-state">Er is minimaal een tweede dag met gegevens nodig voor een verloop.</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(180,160,220,0.07)" />
            <XAxis dataKey="dag" stroke="rgba(180,160,220,0.2)" tick={{ fill: 'rgba(180,160,220,0.3)', fontSize: 11 }} />
            <YAxis stroke="rgba(180,160,220,0.2)" tick={{ fill: 'rgba(180,160,220,0.3)', fontSize: 11 }} />
            <ReferenceLine y={0} stroke="rgba(180,160,220,0.2)" />
            <Tooltip contentStyle={{ background: '#1a1b26', border: '1px solid rgba(180,160,220,0.2)', borderRadius: 10, fontSize: 13 }} />
            <Line type="monotone" dataKey="netto" name="Netto" stroke="#b8a9d9" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
      <div style={{ fontSize: 11, color: 'rgba(180,160,220,0.35)', marginTop: 8 }}>
        Telt toegevoegde lichtbronnen en lasten per dag op. Wijzigingen van status worden niet teruggerekend.
      </div>
    </div>
  )
}
