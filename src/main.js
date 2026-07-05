import { CLASSES, CLASS_ORDER } from "./data/classes.js";
import { PROFESSIONS, PROFESSION_ORDER } from "./data/professions.js";

const app = document.getElementById("app");

// The in-progress character. `name` is trimmed on read; class/profession
// hold the id of the current selection (or null when nothing is chosen).
const draft = {
  name: "",
  classId: null,
  professionId: null,
};

const STAT_LABELS = {
  might: "Might",
  agility: "Agility",
  wits: "Wits",
  spirit: "Spirit",
  vigor: "Vigor",
};

const MAX_NAME_LENGTH = 24;

/** Render the character creation screen. */
function renderCharacterCreation() {
  app.innerHTML = `
    <main class="creation">
      <header class="creation__header">
        <p class="creation__eyebrow">The darkness is descending</p>
        <h1 class="creation__title">Forge Your Hero</h1>
        <p class="creation__subtitle">
          Name your champion, choose a calling, and take up a trade before you
          descend.
        </p>
      </header>

      <section class="panel">
        <label class="field">
          <span class="field__label">Name</span>
          <input
            id="name-input"
            class="field__input"
            type="text"
            maxlength="${MAX_NAME_LENGTH}"
            placeholder="Enter your name…"
            autocomplete="off"
            spellcheck="false"
            value="${escapeHtml(draft.name)}"
          />
        </label>
      </section>

      <section class="panel">
        <h2 class="panel__heading">Class</h2>
        <div class="card-grid" id="class-grid">
          ${CLASS_ORDER.map((id) => renderChoiceCard(CLASSES[id], "class", id))
            .join("")}
        </div>
        <div class="detail" id="class-detail">${renderClassDetail()}</div>
      </section>

      <section class="panel">
        <h2 class="panel__heading">Profession</h2>
        <div class="card-grid card-grid--two" id="profession-grid">
          ${PROFESSION_ORDER.map((id) =>
            renderChoiceCard(PROFESSIONS[id], "profession", id)
          ).join("")}
        </div>
        <div class="detail" id="profession-detail">
          ${renderProfessionDetail()}
        </div>
      </section>

      <footer class="creation__footer">
        <p class="creation__hint" id="begin-hint">${beginHint()}</p>
        <button class="btn btn--primary" id="begin-btn" ${
          isReady() ? "" : "disabled"
        }>
          Begin the Descent
        </button>
      </footer>
    </main>
  `;

  wireCharacterCreation();
}

/** A single selectable class/profession card. */
function renderChoiceCard(entry, group, id) {
  const selected =
    (group === "class" && draft.classId === id) ||
    (group === "profession" && draft.professionId === id);
  return `
    <button
      type="button"
      class="card${selected ? " card--selected" : ""}"
      data-group="${group}"
      data-id="${id}"
      aria-pressed="${selected}"
    >
      <span class="card__icon" aria-hidden="true">${entry.icon}</span>
      <span class="card__name">${entry.name}</span>
      <span class="card__tagline">${entry.tagline}</span>
    </button>
  `;
}

/** Detail block shown beneath the class cards. */
function renderClassDetail() {
  if (!draft.classId) {
    return `<p class="detail__empty">Choose a class to see its strengths.</p>`;
  }
  const cls = CLASSES[draft.classId];
  const stats = Object.entries(cls.stats)
    .map(
      ([key, value]) => `
        <li class="stat">
          <span class="stat__label">${STAT_LABELS[key]}</span>
          <span class="stat__bar">
            <span class="stat__fill" style="width: ${value * 10}%"></span>
          </span>
          <span class="stat__value">${value}</span>
        </li>`
    )
    .join("");
  return `
    <p class="detail__desc">${cls.description}</p>
    <ul class="stat-list">${stats}</ul>
  `;
}

/** Detail block shown beneath the profession cards. */
function renderProfessionDetail() {
  if (!draft.professionId) {
    return `<p class="detail__empty">Choose a profession to see its craft.</p>`;
  }
  const prof = PROFESSIONS[draft.professionId];
  const materials = prof.materials
    .map((m) => `<span class="tag">${m}</span>`)
    .join("");
  return `
    <p class="detail__desc">${prof.description}</p>
    <div class="detail__materials">
      <span class="detail__materials-label">Works:</span> ${materials}
    </div>
  `;
}

/** Whether all required choices are made. */
function isReady() {
  return Boolean(draft.name.trim() && draft.classId && draft.professionId);
}

function beginHint() {
  const missing = [];
  if (!draft.name.trim()) missing.push("a name");
  if (!draft.classId) missing.push("a class");
  if (!draft.professionId) missing.push("a profession");
  if (missing.length === 0) return "Your fate awaits.";
  return `Still needed: ${missing.join(", ")}.`;
}

/** Attach event handlers after (re)rendering. */
function wireCharacterCreation() {
  const nameInput = document.getElementById("name-input");
  nameInput.addEventListener("input", (e) => {
    draft.name = e.target.value;
    updateBeginState();
  });
  // Keep focus and caret position stable while typing (we don't re-render on
  // name input, so this is naturally preserved).

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const { group, id } = card.dataset;
      if (group === "class") {
        draft.classId = draft.classId === id ? null : id;
      } else {
        draft.professionId = draft.professionId === id ? null : id;
      }
      refreshSelections(group);
    });
  });

  document.getElementById("begin-btn").addEventListener("click", () => {
    if (isReady()) startGame();
  });
}

/**
 * Update just the affected card group + its detail block + the begin button,
 * so the name field keeps focus and caret while the player picks cards.
 */
function refreshSelections(group) {
  document.querySelectorAll(`.card[data-group="${group}"]`).forEach((card) => {
    const isSel =
      (group === "class" && draft.classId === card.dataset.id) ||
      (group === "profession" && draft.professionId === card.dataset.id);
    card.classList.toggle("card--selected", isSel);
    card.setAttribute("aria-pressed", String(isSel));
  });

  if (group === "class") {
    document.getElementById("class-detail").innerHTML = renderClassDetail();
  } else {
    document.getElementById("profession-detail").innerHTML =
      renderProfessionDetail();
  }
  updateBeginState();
}

function updateBeginState() {
  const btn = document.getElementById("begin-btn");
  const hint = document.getElementById("begin-hint");
  if (btn) btn.disabled = !isReady();
  if (hint) hint.textContent = beginHint();
}

/** Placeholder for the start of the actual run. */
function startGame() {
  const cls = CLASSES[draft.classId];
  const prof = PROFESSIONS[draft.professionId];
  const name = draft.name.trim();

  app.innerHTML = `
    <main class="start">
      <div class="start__inner">
        <p class="start__eyebrow">Darkness Descending</p>
        <h1 class="start__title">${escapeHtml(name)}</h1>
        <p class="start__role">
          <span class="start__icon">${cls.icon}</span>
          ${cls.name} &middot; ${prof.name}
          <span class="start__icon">${prof.icon}</span>
        </p>
        <p class="start__desc">
          ${escapeHtml(name)} the ${cls.name} descends into the dark, ${
            prof.name.toLowerCase()
          }'s tools in hand — ready to work ${prof.materials.join(" and ")}.
        </p>
        <p class="start__todo">The dungeon awaits. (Adventure coming soon.)</p>
        <button class="btn btn--ghost" id="back-btn">Forge Another Hero</button>
      </div>
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    renderCharacterCreation();
  });
}

/** Minimal HTML escaping for user-supplied text. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Boot.
renderCharacterCreation();
