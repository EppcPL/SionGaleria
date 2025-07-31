(async () => {
  // Pobiera <script> który ładuje ten skrypt
  const scriptTag = document.currentScript;
  const user = "EppcPL";        // Twój GitHub login
  const repo = "SionGaleria";   // Twoje repozytorium
  const branch = "main";        // gałąź repozytorium

  // Pobierz tytuł wpisu i zrób z niego slug (małe litery, myślniki zamiast spacji)
  const title = document.title || "brak-tytulu";
  const slug = title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]/g, "");

  const container = document.getElementById("galeria-z-githuba");
  if (!container) return;

  container.innerHTML = "<p>Ładowanie galerii...</p>";

  const baseUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/galerie/${slug}/`;
  const rozszerzenia = ['jpg', 'jpeg', 'png'];
  const maxImages = 30; // maksymalna liczba obrazków do sprawdzenia

  container.innerHTML = ""; // wyczyść komunikat

  for (let i = 1; i <= maxImages; i++) {
    let foundImage = false;
    for (const ext of rozszerzenia) {
      const url = `${baseUrl}${i}.${ext}`;
      try {
        const res = await fetch(url, { method: "HEAD" });
        if (res.ok) {
          // jeśli plik istnieje, dodaj go do galerii
          const img = document.createElement("img");
          img.src = url;
          img.alt = `${slug} - zdjęcie ${i}`;
          img.style.maxWidth = "150px";
          img.style.margin = "5px";
          img.style.borderRadius = "8px";
          container.appendChild(img);
          foundImage = true;
          break; // przerwij sprawdzanie rozszerzeń dla tego numeru
        }
      } catch (e) {
        // ignoruj błędy fetch
      }
    }
    if (!foundImage) {
      // jeśli nie znaleziono żadnego pliku dla tego numeru, zakończ pętlę
      break;
    }
  }

  if (container.children.length === 0) {
    container.innerHTML = "<p>Nie znaleziono żadnych zdjęć w galerii.</p>";
  }
})();
