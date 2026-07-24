import { CLASSES, CLASS_ORDER } from "./data/classes.js";
import { PROFESSIONS, PROFESSION_ORDER } from "./data/professions.js";
import {
  STATS,
  STAT_ORDER,
  BASE_STAT,
  CLASS_BONUS,
  FREE_POINTS,
  baseStatsFor,
  carryCapacity,
} from "./data/stats.js";

const app = document.getElementById("app");

// The in-progress character. `name` is trimmed on read; class/profession
// hold the id of the current selection (or null when nothing is chosen).
const draft = {
  name: "",
  classId: null,
  professionId: null,
};

// Free points assigned per stat on the allocation screen.
let allocation = emptyAllocation();

const MAX_NAME_LENGTH = 24;

// Stat bars are drawn against the highest reachable value at creation:
// base + class bonus + all free points in one stat.
const STAT_BAR_MAX = BASE_STAT + CLASS_BONUS + FREE_POINTS;

function emptyAllocation() {
  const alloc = {};
  for (const id of STAT_ORDER) alloc[id] = 0;
  return alloc;
}

function pointsSpent() {
  return STAT_ORDER.reduce((sum, id) => sum + allocation[id], 0);
}

function pointsLeft() {
  return FREE_POINTS - pointsSpent();
}

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
          Continue
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
  const stats = baseStatsFor(draft.classId);
  const rows = STAT_ORDER.map((id) => {
    const bonus = id === cls.bonusStat;
    return `
      <li class="stat${bonus ? " stat--bonus" : ""}" title="${escapeHtml(
        STATS[id].description
      )}">
        <span class="stat__label">${STATS[id].name}</span>
        <span class="stat__bar">
          <span
            class="stat__fill"
            style="width: ${(stats[id] / STAT_BAR_MAX) * 100}%"
          ></span>
        </span>
        <span class="stat__value">${stats[id]}${
          bonus ? `<span class="stat__bonus-note">+${CLASS_BONUS}</span>` : ""
        }</span>
      </li>`;
  }).join("");
  return `
    <p class="detail__desc">${cls.description}</p>
    <p class="detail__desc detail__desc--sub">
      Every hero starts with ${BASE_STAT} in each stat. As a
      ${cls.name}, <strong>${STATS[cls.bonusStat].name}</strong> gets a
      +${CLASS_BONUS} bonus — ${lowerFirst(STATS[cls.bonusStat].description)}
    </p>
    <ul class="stat-list">${rows}</ul>
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
  if (missing.length === 0) return "Next: assign your stat points.";
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
    if (!isReady()) return;
    allocation = emptyAllocation();
    renderStatAllocation();
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

/* ---------- Stat allocation ---------- */

/** Render the stat allocation screen (after creation, before the run). */
function renderStatAllocation() {
  const cls = CLASSES[draft.classId];

  app.innerHTML = `
    <main class="creation">
      <header class="creation__header">
        <p class="creation__eyebrow">The darkness is descending</p>
        <h1 class="creation__title">Shape Your Strengths</h1>
        <p class="creation__subtitle">
          ${escapeHtml(draft.name.trim())} the ${cls.name} begins with
          ${BASE_STAT} in every stat, +${CLASS_BONUS}
          ${STATS[cls.bonusStat].name} from their class. Spend
          ${FREE_POINTS} free points however you like.
        </p>
      </header>

      <section class="panel">
        <div class="alloc-remaining" id="alloc-remaining">
          ${renderPointsLeft()}
        </div>
        <ul class="alloc-list" id="alloc-list">
          ${STAT_ORDER.map((id) => renderAllocRow(id)).join("")}
        </ul>
      </section>

      <footer class="creation__footer">
        <p class="creation__hint" id="alloc-hint">${allocHint()}</p>
        <div class="creation__actions">
          <button class="btn btn--ghost" id="alloc-back-btn">Back</button>
          <button class="btn btn--primary" id="alloc-confirm-btn" ${
            pointsLeft() === 0 ? "" : "disabled"
          }>
            Begin the Descent
          </button>
        </div>
      </footer>
    </main>
  `;

  wireStatAllocation();
}

/** One stat row on the allocation screen. */
function renderAllocRow(id) {
  const stat = STATS[id];
  const cls = CLASSES[draft.classId];
  const base = baseStatsFor(draft.classId)[id];
  const total = base + allocation[id];
  const isBonus = cls.bonusStat === id;

  return `
    <li class="alloc${isBonus ? " alloc--bonus" : ""}" data-stat="${id}">
      <div class="alloc__info">
        <span class="alloc__name">
          ${stat.name}
          <span class="alloc__abbr">${stat.abbr}</span>
          ${isBonus ? `<span class="alloc__class-tag">${cls.name} +${CLASS_BONUS}</span>` : ""}
        </span>
        <span class="alloc__desc">${stat.description}${
          id === "dexterity"
            ? ` <em class="alloc__derived">(carry ${carryCapacity(
                total
              )} items now)</em>`
            : ""
        }</span>
      </div>
      <div class="alloc__controls">
        <button
          type="button"
          class="alloc__btn"
          data-stat="${id}"
          data-delta="-1"
          aria-label="Remove a point from ${stat.name}"
          ${allocation[id] === 0 ? "disabled" : ""}
        >−</button>
        <span class="alloc__value" aria-live="polite">
          ${total}${
            allocation[id] > 0
              ? `<span class="alloc__added">+${allocation[id]}</span>`
              : ""
          }
        </span>
        <button
          type="button"
          class="alloc__btn"
          data-stat="${id}"
          data-delta="1"
          aria-label="Add a point to ${stat.name}"
          ${pointsLeft() === 0 ? "disabled" : ""}
        >+</button>
      </div>
    </li>
  `;
}

function renderPointsLeft() {
  const left = pointsLeft();
  return `
    <span class="alloc-remaining__label">Free points remaining</span>
    <span class="alloc-remaining__pips">
      ${Array.from({ length: FREE_POINTS }, (_, i) =>
        `<span class="pip${i < left ? " pip--full" : ""}"></span>`
      ).join("")}
    </span>
    <span class="alloc-remaining__count">${left}</span>
  `;
}

function allocHint() {
  const left = pointsLeft();
  if (left === 0) return "All points assigned. Your fate awaits.";
  return `Assign ${left} more point${left === 1 ? "" : "s"} to continue.`;
}

function wireStatAllocation() {
  // Delegate +/- clicks to the list so rows can be re-rendered freely.
  document.getElementById("alloc-list").addEventListener("click", (e) => {
    const btn = e.target.closest(".alloc__btn");
    if (!btn || btn.disabled) return;
    const { stat, delta } = btn.dataset;
    const change = Number(delta);
    if (change > 0 && pointsLeft() === 0) return;
    if (change < 0 && allocation[stat] === 0) return;
    allocation[stat] += change;
    refreshAllocation();
  });

  document.getElementById("alloc-back-btn").addEventListener("click", () => {
    renderCharacterCreation();
  });

  document.getElementById("alloc-confirm-btn").addEventListener("click", () => {
    if (pointsLeft() === 0) startGame();
  });
}

/** Re-render the allocation rows + counters in place after a point change. */
function refreshAllocation() {
  document.getElementById("alloc-remaining").innerHTML = renderPointsLeft();
  document.getElementById("alloc-hint").textContent = allocHint();
  document.getElementById("alloc-confirm-btn").disabled = pointsLeft() !== 0;
  document.querySelectorAll("li.alloc").forEach((row) => {
    row.outerHTML = renderAllocRow(row.dataset.stat);
  });
}

/* ---------- Run start ---------- */

/** The character's final stats: base + class bonus + allocated points. */
function finalStats() {
  const stats = baseStatsFor(draft.classId);
  for (const id of STAT_ORDER) stats[id] += allocation[id];
  return stats;
}

/** Placeholder for the start of the actual run. */
function startGame() {
  const cls = CLASSES[draft.classId];
  const prof = PROFESSIONS[draft.professionId];
  const name = draft.name.trim();
  const stats = finalStats();

  const statRows = STAT_ORDER.map(
    (id) => `
      <li class="stat" title="${escapeHtml(STATS[id].description)}">
        <span class="stat__label">${STATS[id].name}</span>
        <span class="stat__bar">
          <span
            class="stat__fill"
            style="width: ${(stats[id] / STAT_BAR_MAX) * 100}%"
          ></span>
        </span>
        <span class="stat__value">${stats[id]}</span>
      </li>`
  ).join("");

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
        <ul class="stat-list start__stats">${statRows}</ul>
        <p class="start__desc start__desc--small">
          Pack space: ${carryCapacity(stats.dexterity)} items
          (half of ${stats.dexterity} Dexterity).
        </p>
        <p class="start__todo">The dungeon awaits. (Adventure coming soon.)</p>
        <button class="btn btn--ghost" id="back-btn">Forge Another Hero</button>
      </div>
    </main>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    allocation = emptyAllocation();
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

/** Lower-case the first letter (for splicing descriptions mid-sentence). */
function lowerFirst(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

// Boot.
renderCharacterCreation();
