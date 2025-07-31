(async () => {
  const MAX_OBRAZKOW = 30;

  // Wyczytaj login, repo i branch z <script src="...">
  const scriptTag = document.currentScript || document.querySelector('script[src*="githubusercontent.com"]');
  const match = scriptTag?.src.match(/https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/.+/);

  if (!match) {
    console.error("Nie można odczytać danych z URL skryptu.");
    return;
  }

  const [_, user, repo, branch] = match;

  // Pobierz tytuł wpisu
  const h1 = document.querySelector("h1.entry-title");
  if (!h1) return;

  const tytul = h1.textContent.trim();
  const slug = tytul
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

  const urlBaza = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/galerie/${slug}/`;
  const kontener = document.getElementById("galeria-z-githuba");
  kontener.innerHTML = `<p>Ładowanie galerii dla: <strong>${tytul}</strong>...</p>`;

  let znaleziono = false;

  for (let i = 1; i <= MAX_OBRAZKOW; i++) {
    const url = `${urlBaza}${i}.jpg`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) {
        if (!znaleziono) {
          kontener.innerHTML = "<div class='galeria'></div>";
          znaleziono = true;
        }
        const img = document.createElement("img");
        img.src = url;
        img.alt = `Obraz ${i}`;
        kontener.querySelector(".galeria").appendChild(img);
      } else {
        break;
      }
    } catch (err) {
      console.error("Błąd ładowania:", url);
    }
  }

  if (!znaleziono) {
    kontener.innerHTML = "<p>Brak galerii dla tego wpisu.</p>";
  }
})();
