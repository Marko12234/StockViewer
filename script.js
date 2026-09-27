const BACKEND_URL = "http://localhost:3000";

// Enter-Taste
document.getElementById("symbolInput").addEventListener("keydown", e => {
  if (e.key === "Enter") fetchStock();
});

// Schnellauswahl-Buttons
function fetchByName(name, symbol) {
  document.getElementById("symbolInput").value = name;
  fetchStock(symbol);
}

// Suche per Eingabefeld
async function fetchStock(overrideSymbol = null) {
  const input = document.getElementById("symbolInput").value.trim();

  if (!input) {
    showError("Bitte einen Firmennamen oder ein Kürzel eingeben.");
    return;
  }
  
  setLoading(true);
  hideError();
  hideCard();

  try {
    // Symbol auflösen: entweder direkt übergeben (Quick-Button)
    // oder per Suche herausfinden (Freitext-Eingabe)
    let symbol = overrideSymbol;
    let companyName = null;

    if (!symbol) {
      const searchRes = await fetch(`${BACKEND_URL}/api/search?q=${encodeURIComponent(input)}`);
      if (!searchRes.ok) throw new Error("Suche fehlgeschlagen. Läuft das Backend? (siehe README)");

      const searchData = await searchRes.json();
      const match = searchData.result?.find(r => r.type === "Common Stock");

      if (!match) {
        throw new Error(`"${input}" nicht gefunden. Bitte einen anderen Namen versuchen.`);
      }

      symbol      = match.symbol;
      companyName = match.description;
    }

    // Kurs + Firmenprofil vom eigenen Backend holen (das holt es intern von Finnhub)
    const dataRes = await fetch(`${BACKEND_URL}/api/stock/${symbol}`);

    if (!dataRes.ok) {
      throw new Error("Daten konnten nicht geladen werden. Läuft das Backend? (siehe README)");
    }

    const { quote, profile } = await dataRes.json();

    if (!quote.c || quote.c === 0) {
      throw new Error(`Keine Kursdaten für "${input}" gefunden.`);
    }
 
    // Name: Profil > Suche > Symbol als Fallback
    const displayName = profile.name || companyName || symbol;

    displayData(symbol, displayName, quote);

  } catch (err) {
    showError(err.message || "Unbekannter Fehler.");
  } finally {
    setLoading(false);
  }
}

function displayData(symbol, name, quote) {
  const price      = quote.c.toFixed(2);
  const change     = quote.d?.toFixed(2) ?? "—";
  const changePct  = quote.dp?.toFixed(2) ?? "—";
  const isUp       = (quote.d ?? 0) >= 0;

  document.getElementById("displayName").textContent   = name;
  document.getElementById("displayTicker").textContent = symbol;
  document.getElementById("displayPrice").textContent  = `$${price}`;

  const changeEl = document.getElementById("displayChange");
  changeEl.textContent = `${isUp ? "+" : ""}${change} (${isUp ? "+" : ""}${changePct}%)`;
  changeEl.className   = `price-change ${isUp ? "up" : "down"}`;

  document.getElementById("statOpen").textContent = `$${quote.o?.toFixed(2) ?? "—"}`;
  document.getElementById("statHigh").textContent = `$${quote.h?.toFixed(2) ?? "—"}`;
  document.getElementById("statLow").textContent  = `$${quote.l?.toFixed(2) ?? "—"}`;

  showCard();
}

function showError(msg) {
  const el = document.getElementById("errorBox");
  el.textContent = `⚠ ${msg}`;
  el.style.display = "block";
}
function hideError() { document.getElementById("errorBox").style.display = "none"; }
function setLoading(s) {
  document.getElementById("loader").style.display  = s ? "block" : "none";
  document.getElementById("searchBtn").disabled    = s;
}
function showCard() {
  document.getElementById("card").style.display    = "block";
  document.getElementById("noteBox").style.display = "block";
}
function hideCard() {
  document.getElementById("card").style.display    = "none";
  document.getElementById("noteBox").style.display = "none";
}
