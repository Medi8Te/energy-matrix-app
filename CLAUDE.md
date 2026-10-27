# Innerlijke Balans / Energy Matrix — projectcontext

## Doel
Persoonlijke app die lichtbronnen (dingen die energie geven) en lasten (zorgen) in balans brengt.
Tabs: Balans (gauge, statistieken, lastenkaart, lichtkaart, verloop), Last, Dankbaarheid (lichtbronnen), Overzicht.

## Stack
- React 19 + Vite, Recharts 3
- Supabase: auth (e-mail/wachtwoord) en data (tabellen `lasten`, `lichtbronnen`), client in `src/supabase.js`
- Deployment: Vercel-project `energy-matrix-app` (team johns-projects-7c24460c), productie `energy-matrix-app.vercel.app`
- Repo: github.com/Medi8Te/energy-matrix-app, branch `main`. Vercel deployt bij push.

## Datamodel
- `lasten`: omschrijving, waarschijnlijkheid (1–10), impact (1–10), controleerbaarheid (1–10), actieplan, status (aanwezig | in beweging | omarmd | losgelaten), gewicht, user_id, created_at
- `lichtbronnen`: omschrijving, lichtsterkte (1–10), frequentie_ideaal, frequentie_actueel (× per week), categorie, user_id, created_at
- Gewicht = round(waarschijnlijkheid × impact × (10 − controleerbaarheid) / 10)
- Balans = Σ lichtsterkte − Σ gewicht (alleen lasten met status ≠ losgelaten)

## Conventies
- UI-teksten en commentaar in het Nederlands.
- Commit-berichten in het Nederlands, met de Co-Authored-By-regel uit de werkafspraak.
- Snake_case in de database, camelCase in JS; vertaling zit in `supabase.js` (`lichtToDB` / `dbToLicht`).

## Openstaand
- Inloggen geeft "Failed to fetch". Waarschijnlijk is het Supabase-project gepauzeerd of niet bereikbaar. Controleer eerst in het Supabase-dashboard en in de browser-Network-tab.
- Lichtkaart, verloop en categoriefilter staan in commit `820388b` en zijn nog niet op de live-versie getest.
- Verloop telt op aanmaakdatum en rekent statuswijzigingen niet terug. Een dagelijkse snapshot-tabel is een mogelijke verbetering.
- Supabase publishable key staat in de broncode. Controleer dat Row Level Security aanstaat op `lasten` en `lichtbronnen`.
