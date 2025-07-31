<div id="galeria-z-githuba">Ładowanie galerii...</div>

<script>
(async () => {
  const container = document.getElementById("galeria-z-githuba");

  function createSlug(title) {
    return title.toLowerCase()
      .replace(/[^\w\s-]/g, "")  // usuwa znaki inne niż litery, cyfry, spacje, myślniki
      .trim()
      .replace(/\s+/g, "-")      // spacje na myślniki
      .replace(/-+/g, "-");      // wielokrotne myślniki na jeden
  }

  // Pobierz tytuł wpisu lub strony
  let rawTitle = document.querySelector("h1.entry-title")?.textContent.trim() || 
                 document.querySelector("h1")?.textContent.trim() || 
                 document.title.trim();

  // Obcinamy wszystko po '--' razem z nimi
  rawTitle = rawTitle.split('--')[0].trim();

  const slug = createSlug(rawTitle);

  const baseUrl = "https://raw.githubusercontent.com/EppcPL/SionGaleria/main/galerie/";

  container.textContent = `Szukam galerii dla "${slug}"...`;

  // Funkcja sprawdzająca, czy plik istnieje (HEAD request)
  async function checkFileExists(url) {
    try {
      const resp = await fetch(url, { method: "HEAD" });
      return resp.ok;
    } catch {
      return false;
    }
  }

  // Szukamy zdjęć od 1 do 20 z rozszerzeniami jpg i png
  const images = [];
  for (let i = 1; i <= 20; i++) {
    for (const ext of ["jpg", "png"]) {
      const url = `${baseUrl}${slug}/${i}.${ext}`;
      // eslint-disable-next-line no-await-in-loop
      if (await checkFileExists(url)) {
        images.push(url);
        break; // jeśli znaleziono jpg lub png, nie szukamy innych rozszerzeń dla tego numeru
      }
    }
  }

  if (images.length === 0) {
    container.textContent = `Galeria dla "${slug}" nie istnieje (nie znaleziono folderu lub plików).`;
    return;
  }

  // Tworzymy galerię
  container.textContent = "";
  const galleryDiv = document.createElement("div");
  galleryDiv.style.display = "flex";
  galleryDiv.style.flexWrap = "wrap";
  galleryDiv.style.gap = "10px";

  images.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = slug;
    img.style.width = "150px";
    img.style.height = "auto";
    img.style.borderRadius = "8px";
    img.style.cursor = "pointer";
    img.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
    // Kliknięcie otwiera obraz w nowej karcie
    img.addEventListener("click", () => {
      window.open(src, "_blank");
    });
    galleryDiv.appendChild(img);
  });

  container.appendChild(galleryDiv);
})();
</script>
