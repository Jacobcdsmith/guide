// App state and UI for The Generative Tarot

let mainSketch = null;
let currentSpread = "single";
let drawnCards = [];
let activeInterpIdx = 0;
let gallerySeed = 0;
let galleryFilter = "major";

document.addEventListener("DOMContentLoaded", () => {
  new p5(p => {
    mainSketch = p;
    p.setup = () => { p.noCanvas(); };
    p.draw  = () => {};
  }, document.getElementById("app"));
  setupNav();
  setupControls();
  setupGallery();
  setupModal();
});

// ── Navigation ────────────────────────────────────────────────────
function setupNav() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
      btn.classList.add("active");
      const sec = document.getElementById(btn.dataset.section);
      if (sec) sec.classList.remove("hidden");
      if (btn.dataset.section === "gallery") renderGallery();
    });
  });
}

// ── Reading controls ──────────────────────────────────────────────
function setupControls() {
  document.querySelectorAll(".spread-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".spread-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSpread = btn.dataset.spread;
    });
  });
  document.getElementById("draw-btn").addEventListener("click", drawSpread);
}

function drawSpread() {
  if (!mainSketch) return;
  const seedInput = document.getElementById("seed-input");
  const readingSeed = seedInput.value ? parseInt(seedInput.value) : Math.floor(Math.random() * 999999);
  seedInput.placeholder = readingSeed;

  const spreadDef = SPREADS[currentSpread];
  const shuffled = shuffleDeck(ALL_CARDS, readingSeed);
  drawnCards = shuffled.slice(0, spreadDef.positions.length).map((card, i) => ({
    card,
    position: spreadDef.positions[i],
    reversed: seededRandom(readingSeed + i * 777) > 0.75
  }));

  renderSpread(readingSeed);
  renderInterpretation();
}

function shuffleDeck(cards, seed) {
  const arr = [...cards];
  let s = seed | 0;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function seededRandom(seed) {
  const s = Math.sin(seed) * 43758.5453;
  return s - Math.floor(s);
}

// ── Spread rendering ──────────────────────────────────────────────
function renderSpread(readingSeed) {
  const cardsEl  = document.getElementById("spread-cards");
  const labelsEl = document.getElementById("spread-label-row");
  const panel    = document.getElementById("interpretation-panel");

  // Clean up old p5.Graphics to free memory
  cardsEl.querySelectorAll("canvas").forEach(c => c.remove());
  cardsEl.innerHTML = "";
  labelsEl.innerHTML = "";
  panel.classList.add("hidden");
  cardsEl.className = "";

  if (currentSpread === "celtic") {
    cardsEl.classList.add("celtic-layout");
    labelsEl.style.display = "none";
  } else {
    labelsEl.style.display = "flex";
  }

  drawnCards.forEach(({ card, position, reversed }, i) => {
    if (currentSpread !== "celtic") {
      const lbl = document.createElement("div");
      lbl.className = "spread-label";
      lbl.textContent = position;
      labelsEl.appendChild(lbl);
    }

    const slot = document.createElement("div");
    slot.className = "card-slot" + (reversed ? " reversed" : "");
    slot.style.animationDelay = `${i * 0.08}s`;

    const g = renderCard(mainSketch, card, readingSeed);
    const canvas = g.elt;
    canvas.style.width  = "var(--card-w)";
    canvas.style.height = "var(--card-h)";
    slot.appendChild(canvas);
    slot.title = card.name + (reversed ? " (Reversed)" : "");

    slot.addEventListener("click", () => {
      activeInterpIdx = i;
      updateInterpretationDisplay();
      openModal(card, readingSeed);
    });

    cardsEl.appendChild(slot);
  });
}

// ── Interpretation ────────────────────────────────────────────────
function renderInterpretation() {
  document.getElementById("interpretation-panel").classList.remove("hidden");
  activeInterpIdx = 0;
  updateInterpretationDisplay();
}

function updateInterpretationDisplay() {
  const content = document.getElementById("interpretation-content");
  if (!drawnCards.length) return;

  let navHtml = '<div class="spread-interp-nav">';
  drawnCards.forEach(({ position }, i) => {
    navHtml += `<button class="interp-nav-btn${i===activeInterpIdx?" active":""}" data-idx="${i}">${position}</button>`;
  });
  navHtml += "</div>";

  const { card, position, reversed } = drawnCards[activeInterpIdx];
  const keyTags = (card.keywords||[]).map(k=>`<span class="keyword-tag">${k}</span>`).join("");
  const interpText = reversed
    ? `<p class="interp-text interp-reversed"><strong>Reversed:</strong> ${card.reversed}</p>`
    : `<p class="interp-text">${card.upright}</p>`;

  content.innerHTML = `
    ${navHtml}
    <div class="interp-position">${position}${reversed?" — Reversed":""}</div>
    <div class="interp-card-name">${card.name}</div>
    <div class="interp-keywords">${keyTags}</div>
    <hr class="interp-divider">
    ${interpText}
  `;

  content.querySelectorAll(".interp-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeInterpIdx = parseInt(btn.dataset.idx);
      updateInterpretationDisplay();
    });
  });
}

// ── Gallery ───────────────────────────────────────────────────────
function setupGallery() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      galleryFilter = btn.dataset.filter;
      renderGallery();
    });
  });

  document.getElementById("gallery-seed-btn").addEventListener("click", () => {
    const v = document.getElementById("gallery-seed").value;
    gallerySeed = v ? parseInt(v) : Math.floor(Math.random() * 999999);
    document.getElementById("gallery-seed").value = gallerySeed;
    renderGallery();
  });
}

function renderGallery() {
  if (!mainSketch) return;
  const grid = document.getElementById("gallery-grid");
  grid.querySelectorAll("canvas").forEach(c => c.remove());
  grid.innerHTML = "";

  const cards = galleryFilter === "major"
    ? MAJOR_ARCANA
    : MINOR_ARCANA.filter(c => c.suit === galleryFilter);

  const scale = 0.62;
  cards.forEach(card => {
    const wrap = document.createElement("div");
    wrap.className = "gallery-card";

    const g = renderCard(mainSketch, card, gallerySeed);
    const canvas = g.elt;
    canvas.style.width  = `${CARD_W * scale}px`;
    canvas.style.height = `${CARD_H * scale}px`;
    wrap.appendChild(canvas);

    const nameEl = document.createElement("div");
    nameEl.className = "gallery-card-name";
    nameEl.textContent = card.name;
    wrap.appendChild(nameEl);

    wrap.addEventListener("click", () => openModal(card, gallerySeed));
    grid.appendChild(wrap);
  });
}

// ── Modal ─────────────────────────────────────────────────────────
function setupModal() {
  document.querySelector(".modal-backdrop").addEventListener("click", closeModal);
  document.querySelector(".modal-close").addEventListener("click", closeModal);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
}

function openModal(card, seed) {
  if (!mainSketch) return;
  const modal    = document.getElementById("card-modal");
  const canvasEl = document.getElementById("modal-card-canvas");
  const infoEl   = document.getElementById("modal-card-info");

  canvasEl.querySelectorAll("canvas").forEach(c => c.remove());
  canvasEl.innerHTML = "";

  const g = renderCard(mainSketch, card, seed);
  const canvas = g.elt;
  const scale = 1.4;
  canvas.style.width  = `${CARD_W * scale}px`;
  canvas.style.height = `${CARD_H * scale}px`;
  canvas.style.borderRadius = "8px";
  canvasEl.appendChild(canvas);

  const meta = [card.element, card.planet, card.type==="major"?"Major Arcana":card.suit].filter(Boolean).join("  ·  ");
  const keyTags = (card.keywords||[]).map(k=>`<span class="keyword-tag">${k}</span>`).join("");

  infoEl.innerHTML = `
    <h2>${card.name}</h2>
    <div class="modal-meta">${card.numeral}  ·  ${meta}</div>
    <div class="interp-keywords" style="margin-bottom:1rem">${keyTags}</div>
    <h3>Upright</h3>
    <p>${card.upright}</p>
    <h3>Reversed</h3>
    <p class="reversed-text">${card.reversed}</p>
  `;

  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("card-modal").classList.add("hidden");
}
