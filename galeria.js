<div id="galeria-z-githuba">Ładowanie galerii...</div>

<script>
(async () => {
  const container = document.getElementById("galeria-z-githuba");

  function createSlug(title) {
    return title.toLowerCase()
      .replace(/[^\w\s-]/g, "")   // usuwa znaki inne niż litery, cyfry, spacje, myślniki
      .trim()
      .replace(/\s+/g, "-")       // spacje na myślniki
      .replace(/-+/g, "-");       // wielokrotne myślniki na jeden
  }

  // Pobieramy tylko tekst z pierwszego <h1> na stronie
  const title = document.querySelector("h1")?.textContent.trim() || "";

  if (!title) {
    container.textContent = "Nie znaleziono tytułu wpisu (element <h1>).";
    return;
  }

  const slug = createSlug(title);

  const baseUrl = "https://raw.githubusercontent.com/EppcPL/SionGaleria/main/galerie/";

  container.textContent = `Szukam galerii dla "${slug}"...`;

  // Sprawdza, czy plik istnieje (HEAD)
  async function checkFileExists(url) {
    try {
      const resp = await fetch(url, { method: "HEAD" });
      return resp.ok;
    } catch {
      return false;
    }
  }

  const images = [];
  for (let i = 1; i <= 20; i++) {
    for (const ext of ["jpg", "png"]) {
      const url = `${baseUrl}${slug}/${i}.${ext}`;
      // eslint-disable-next-line no-await-in-loop
      if (await checkFileExists(url)) {
        images.push(url);
        break; // jeśli znaleziono jpg, nie szukamy png dla tego numeru
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
    img.addEventListener("click", () => {
      window.open(src, "_blank");
    });
    galleryDiv.appendChild(img);
  });

  container.appendChild(galleryDiv);
})();
</script>
