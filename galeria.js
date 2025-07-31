(async () => {
  const container = document.getElementById("galeria-z-githuba");

  function createSlug(title) {
    return title
      .split("--")[0]               // utnie wszystko po dwóch minusach
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")     // usuwa znaki inne niż litery, cyfry, spacje, myślniki
      .trim()
      .replace(/\s+/g, "-")         // spacje na myślniki
      .replace(/-+/g, "-");         // wielokrotne myślniki na jeden
  }

  // Pobierz tytuł wpisu lub strony
  const title = document.querySelector("h1.entry-title")?.textContent.trim()
    || document.querySelector("h1")?.textContent.trim()
    || document.title.trim();

  const slug = createSlug(title);
  const baseUrl = "https://raw.githubusercontent.com/EppcPL/SionGaleria/main/galerie/";

  container.textContent = `🔍 Szukam galerii dla folderu "${slug}"...`;

  // Sprawdź, czy plik istnieje (HEAD)
  async function checkFileExists(url) {
    try {
      const resp = await fetch(url, { method: "HEAD" });
      return resp.ok;
    } catch {
      return false;
    }
  }

  // Szukaj plików graficznych (1.jpg/png do 20.jpg/png)
  const images = [];
  for (let i = 1; i <= 20; i++) {
    for (const ext of ["jpg", "png"]) {
      const url = `${baseUrl}${slug}/${i}.${ext}`;
      if (await checkFileExists(url)) {
        images.push(url);
        break;
      }
    }
  }

  if (images.length === 0) {
    container.textContent = `❌ Galeria dla folderu "${slug}" nie istnieje (brak folderu lub zdjęć).`;
    return;
  }

  // Galeria znaleziona – pokaż zdjęcia
  container.textContent = `✅ Znaleziono ${images.length} zdjęć w galerii "${slug}":`;
  const galleryDiv = document.createElement("div");
  galleryDiv.style.display = "flex";
  galleryDiv.style.flexWrap = "wrap";
  galleryDiv.style.gap = "10px";
  galleryDiv.style.marginTop = "10px";

  images.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = slug;
    img.style.width = "150px";
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
