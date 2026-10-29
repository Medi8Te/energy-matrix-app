export default function StatsCards({ totaalLicht, totaalLasten, balans, aantalLasten, aantalLicht }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">Lichtbronnen</div>
        <div className="stat-value green">{totaalLicht}</div>
        <div className="stat-sub">{aantalLicht} bronnen</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Actieve zorgen</div>
        <div className="stat-value red">{totaalLasten}</div>
        <div className="stat-sub">{aantalLasten} zorgen</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Balans</div>
        <div className={`stat-value ${balans >= 0 ? 'green' : 'red'}`}>{balans > 0 ? '+' : ''}{balans}</div>
        <div className="stat-sub">{balans >= 0 ? 'Licht voedt' : 'Zorgen overheersen'}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Potentiaal</div>
        <div className={`stat-value ${balans >= 0 ? 'blue' : 'yellow'}`}>{balans > 0 ? '+' : ''}{balans}</div>
        <div className="stat-sub">licht − zorgen</div>
      </div>
    </div>
  )
}
