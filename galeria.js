(async () => {
  const container = document.getElementById("galeria-z-githuba");
  if (!container) return;

  // Pobierz tytuł wpisu z h1.entry-title lub z pierwszego h1
  const titleElement = document.querySelector('h1.entry-title') || document.querySelector('h1');
  const title = titleElement ? titleElement.textContent.trim() : "brak-tytulu";

  const slug = title.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "");

  const user = "EppcPL";
  const repo = "SionGaleria";
  const branch = "main";

  container.innerHTML = "<p>Sprawdzam dostępność galerii...</p>";

  async function exists(url) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      return res.ok;
    } catch {
      return false;
    }
  }

  const baseUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/galerie/${slug}/`;
  const testFile = `${baseUrl}1.jpg`;
  const folderExists = await exists(testFile);

  if (!folderExists) {
    container.innerHTML = `<p style="color:red;">Galeria dla "<strong>${slug}</strong>" nie istnieje (nie znaleziono folderu lub plików).</p>`;
    return;
  }

  container.innerHTML = "<p>Folder galerii znaleziony, ładuję zdjęcia...</p>";

  const extensions = ['jpg', 'jpeg', 'png'];
  const maxImages = 30;
  container.innerHTML = "";

  let foundAny = false;

  for (let i = 1; i <= maxImages; i++) {
    let foundImage = false;
    for (const ext of extensions) {
      const url = `${baseUrl}${i}.${ext}`;
      if (await exists(url)) {
        const img = document.createElement("img");
        img.src = url;
        img.alt = `${slug} - zdjęcie ${i}`;
        img.style.maxWidth = "150px";
        img.style.margin = "5px";
        img.style.borderRadius = "8px";
        container.appendChild(img);
        foundImage = true;
        foundAny = true;
        break;
      }
    }
    if (!foundImage) break;
  }

  if (!foundAny) {
    container.innerHTML = `<p style="color:orange;">Folder galerii "<strong>${slug}</strong>" istnieje, ale nie znaleziono żadnych zdjęć.</p>`;
  } else {
    const info = document.createElement("p");
    info.style.color = "green";
    info.style.marginTop = "10px";
    info.textContent = "Galeria została załadowana pomyślnie.";
    container.appendChild(info);
  }
})();
