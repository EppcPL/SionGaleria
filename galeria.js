(async () => {
  const scriptTag = document.currentScript;
  const user = "EppcPL";
  const repo = "SionGaleria";
  const branch = "main";

  const title = document.title || "brak-tytulu";
  const slug = title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]/g, "");

  const container = document.getElementById("galeria-z-githuba");
  if (!container) return;

  container.innerHTML = "<p>Sprawdzam dostępność galerii...</p>";

  // Sprawdzenie czy folder istnieje (sprawdzamy 1 plik jpg jako test)
  const baseUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/galerie/${slug}/`;
  async function exists(url) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      return res.ok;
    } catch {
      return false;
    }
  }

  const testFile = `${baseUrl}1.jpg`;
  const folderExists = await exists(testFile);

  if (!folderExists) {
    container.innerHTML = `<p style="color:red;">Galeria dla "<strong>${slug}</strong>" nie istnieje (nie znaleziono folderu lub plików).</p>`;
    return;
  }

  container.innerHTML = "<p>Folder galerii znaleziony, ładuję zdjęcia...</p>";

  const rozszerzenia = ['jpg', 'jpeg', 'png'];
  const maxImages = 30;
  container.innerHTML = "";

  let foundAny = false;

  for (let i = 1; i <= maxImages; i++) {
    let foundImage = false;
    for (const ext of rozszerzenia) {
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
  }
})();
