const ITUNES_API = "https://itunes.apple.com/search";

const form = document.querySelector("#musicForm");
const artistInput = document.querySelector("#artistName");
const decadeSelect = document.querySelector("#decade");
const limitSelect = document.querySelector("#resultLimit");
const results = document.querySelector("#results");
const statusMessage = document.querySelector("#searchStatus");
const clearButton = document.querySelector("#clearResults");
const menuToggle = document.querySelector("#menuToggle");
const siteNav = document.querySelector("#siteNav");
const currentYear = document.querySelector("#currentYear");

currentYear.textContent = new Date().getFullYear();

// Mobile navigation
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  siteNav.classList.toggle("is-open", !open);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  });
});

// Search real music records using Apple's public iTunes Search API.
// It requires no API key and returns track titles, artists, albums, artwork and release dates.
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    statusMessage.textContent = "Please enter a song, artist or band name.";
    artistInput.focus();
    return;
  }

  const query = artistInput.value.trim();
  const decade = decadeSelect.value;
  const limit = Number(limitSelect.value);

  setLoading(true);
  statusMessage.textContent = `Searching songs and artists for “${query}”…`;

  try {
    const url = new URL(ITUNES_API);
    url.search = new URLSearchParams({
      term: query,
      entity: "song",
      media: "music",
      limit: "200"
    }).toString();

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`The music service returned HTTP ${response.status}.`);
    }

    const data = await response.json();

    if (!Array.isArray(data.results)) {
      throw new Error("The music service returned an unexpected response.");
    }

    let tracks = data.results
      .filter((item) => item.kind === "song" && item.trackName && item.artistName)
      .map((item) => ({
        song: item.trackName,
        artist: item.artistName,
        album: item.collectionName || "Album not listed",
        year: item.releaseDate ? new Date(item.releaseDate).getFullYear() : "Unknown",
        artwork: item.artworkUrl100
          ? item.artworkUrl100.replace("100x100bb", "600x600bb")
          : "",
        composer: item.artistName || "Not listed",
        link: item.trackViewUrl || ""
      }));

    // Filter by the selected decade after the API returns real song records.
    if (decade !== "all") {
      const start = Number(decade);
      const end = start + 9;
      tracks = tracks.filter((track) => {
        const year = Number(track.year);
        return Number.isFinite(year) && year >= start && year <= end;
      });
    }

    // Remove duplicate tracks and keep the first matching results.
    const seen = new Set();
    tracks = tracks.filter((track) => {
      const key = `${track.song.toLowerCase()}|${track.artist.toLowerCase()}|${track.album.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, limit);

    if (!tracks.length) {
      renderEmpty(query, decade);
      statusMessage.textContent = `No matching songs found for “${query}”. Try a different spelling or select All decades.`;
      return;
    }

    renderResults(tracks);
    statusMessage.textContent =
      `Showing ${tracks.length} real track${tracks.length === 1 ? "" : "s"} matching “${query}”.`;
  } catch (error) {
    renderError(
      `${error.message} Check your internet connection and try again.`
    );
    statusMessage.textContent = "Search could not be completed.";
  } finally {
    setLoading(false);
  }
});

clearButton.addEventListener("click", () => {
  results.innerHTML = `
    <div class="empty-state">
      <span class="empty-icon" aria-hidden="true">◉</span>
      <h3>Nothing searched yet</h3>
      <p>Enter a song, artist or band above to begin exploring.</p>
    </div>
  `;
  clearButton.hidden = true;
  statusMessage.textContent = "";
  artistInput.focus();
});

function setLoading(isLoading) {
  results.setAttribute("aria-busy", String(isLoading));

  if (isLoading) {
    results.innerHTML = `
      <div class="loading-state">
        <h3>Searching the music database…</h3>
        <p>Looking for matching songs, artists and album artwork.</p>
      </div>
    `;
    clearButton.hidden = true;
  }
}

function renderResults(tracks) {
  results.innerHTML = "";

  tracks.forEach((track) => {
    const card = document.createElement("article");
    card.className = "music-card";

    const artwork = track.artwork
      ? `<img src="${escapeAttribute(track.artwork)}"
               alt="Album artwork for ${escapeAttribute(track.album)}"
               loading="lazy"
               onerror="this.parentElement.innerHTML='<div class=&quot;artwork-placeholder&quot; aria-hidden=&quot;true&quot;>♫</div>'">`
      : `<div class="artwork-placeholder" aria-hidden="true">♫</div>`;

    const listenLink = track.link
      ? `<p><a href="${escapeAttribute(track.link)}" target="_blank" rel="noopener noreferrer">Listen / view track ↗</a></p>`
      : "";

    card.innerHTML = `
      <div class="artwork">${artwork}</div>
      <div class="card-content">
        <h3 class="card-title">${escapeHtml(track.song)}</h3>
        <p class="card-artist">${escapeHtml(track.artist)}</p>
        <dl class="metadata">
          <div>
            <dt>Album</dt>
            <dd>${escapeHtml(track.album)}</dd>
          </div>
          <div>
            <dt>Release</dt>
            <dd>${escapeHtml(String(track.year))}</dd>
          </div>
          <div>
            <dt>Artist</dt>
            <dd>${escapeHtml(track.artist)}</dd>
          </div>
        </dl>
        ${listenLink}
      </div>
    `;

    results.appendChild(card);
  });

  clearButton.hidden = false;
}

function renderEmpty(query, decade) {
  const decadeText = decade === "all" ? "" : ` in the ${decade}s`;
  results.innerHTML = `
    <div class="empty-state">
      <span class="empty-icon" aria-hidden="true">♫</span>
      <h3>No songs found</h3>
      <p>No matching tracks were returned for “${escapeHtml(query)}”${decadeText}.
      Check the spelling, try a song title or artist name, or choose All decades.</p>
    </div>
  `;
  clearButton.hidden = false;
}

function renderError(message) {
  results.innerHTML = `
    <div class="error-state">
      <h3>Something went wrong</h3>
      <p>${escapeHtml(message)}</p>
      <p>Try again with a search such as Queen, Metallica, Nirvana or Bohemian Rhapsody.</p>
    </div>
  `;
  clearButton.hidden = false;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
