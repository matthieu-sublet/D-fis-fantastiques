/* ══════════════════════════════════════════
   wizard.js — Création de personnage
   Gestion des étapes, jets de dés, résumé
══════════════════════════════════════════ */

const WIZ_TOTAL_STEPS = 7;

// État du wizard
let wiz = {
  step: 0,
  name: '', book: '', bookNum: null,
  theme: 'fantasy',
  skill: null,   skillRolled: false,
  stamina: null, staminaRolled: false,
  luck: null,    luckRolled: false,
  gold: 0,
  potion: 'stamina',
};

let wizExtraItems   = [];
let selectedBookIdx = -1;

// ── Thème courant ─────────────────────────
function currentTheme() {
  return THEMES[wiz.theme] || THEMES.fantasy;
}

// ── Appliquer le thème au wizard ──────────
function applyTheme(themeKey) {
  wiz.theme = themeKey || 'fantasy';
  const theme = currentTheme();

  // Couleur d'accent du wizard
  document.documentElement.style.setProperty('--wiz-accent', theme.color);

  // Mettre à jour la bannière de thème
  const banner = document.getElementById('wiz-theme-banner');
  if (banner) {
    banner.innerHTML = `<span style="font-size:20px">${theme.icon}</span> <span>${theme.label}</span>`;
    banner.style.display = 'flex';
    banner.style.borderColor = theme.color;
  }

  // Afficher l'alerte règles spéciales
  const special = document.getElementById('wiz-special-rules');
  if (special) {
    if (theme.special) {
      special.textContent = '⚠️ ' + theme.special;
      special.style.display = 'block';
    } else {
      special.style.display = 'none';
    }
  }

  // Pré-remplir l'équipement avec celui du thème
  wizExtraItems = [];
  renderWizExtraList();
  const hint = document.getElementById('wiz-equip-hint');
  if (hint) hint.textContent = theme.hint;
}

// ── Sélection du livre (step 1) ──────────
function onBookSelected(bookNum, bookTitle) {
  wiz.bookNum = bookNum;
  wiz.book    = bookTitle;
  document.getElementById('wiz-book').value = bookTitle;

  const themeKey = BOOK_THEMES[bookNum] || 'fantasy';
  applyTheme(themeKey);
}


// ── Navigation ───────────────────────────
function wizGo(step) {
  wiz.step = step;
  document.querySelectorAll('.wiz-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('wiz-' + step).classList.add('active');

  // Progress dots
  for (let i = 0; i < WIZ_TOTAL_STEPS; i++) {
    const d = document.getElementById('dot-' + i);
    d.classList.remove('active', 'done');
    if      (i < step)  d.classList.add('done');
    else if (i === step) d.classList.add('active');
  }

  // Boutons
  const btnBack   = document.getElementById('btn-back');
  const btnRoll   = document.getElementById('btn-roll');
  const btnNext   = document.getElementById('btn-next');
  const btnFinish = document.getElementById('btn-finish');
  [btnBack, btnRoll, btnNext, btnFinish].forEach(b => b.style.display = 'none');

  if (step > 0) btnBack.style.display = 'block';

  if      (step === 0) { btnNext.style.display = 'block'; btnNext.textContent = 'Créer mon héros →'; }
  else if (step === 1) { btnNext.style.display = 'block'; btnNext.textContent = 'Suivant →'; }
  else if (step === 2) _wizStatButtons('skill',   'skill',   '1d6+6');
  else if (step === 3) _wizStatButtons('stamina', 'stamina', '2d6+12');
  else if (step === 4) _wizStatButtons('luck',    'luck',    '1d6+6');
  else if (step === 5) { btnNext.style.display = 'block'; btnNext.textContent = 'Voir le résumé →'; }
  else if (step === 6) { buildSummary(); btnFinish.style.display = 'block'; }
}

function _wizStatButtons(stat, rerollKey, label) {
  const btnRoll   = document.getElementById('btn-roll');
  const btnNext   = document.getElementById('btn-next');
  const rolled    = wiz[rerollKey] !== null;
  const rerolled  = wiz[stat + 'Rolled'];

  if (!rerolled) {
    btnRoll.style.display = 'block';
    btnRoll.textContent   = `🎲 Lancer (${label})`;
  } else if (!rolled) {
    btnRoll.style.display = 'block';
    btnRoll.textContent   = '🎲 Relancer une fois';
  }
  if (wiz[stat] !== null) {
    btnNext.style.display = 'block';
    btnNext.textContent   = 'Garder ' + wiz[stat] + ' →';
    if (rerolled) btnRoll.style.display = 'none';
  }
}

function wizNext() {
  const step = wiz.step;
  if (step === 1) {
    const nm = document.getElementById('wiz-name').value.trim();
    if (!nm) { toast('⚠ Entrez un nom pour votre héros !'); return; }
    wiz.name = nm;
    wiz.book = document.getElementById('wiz-book').value.trim() || 'Livre sans titre';
  }
  if (step === 2 && wiz.skill   === null) { toast('🎲 Lancez les dés d\'abord !'); return; }
  if (step === 3 && wiz.stamina === null) { toast('🎲 Lancez les dés d\'abord !'); return; }
  if (step === 4 && wiz.luck    === null) { toast('🎲 Lancez les dés d\'abord !'); return; }
  wizGo(step + 1);
}

function wizBack() { wizGo(Math.max(0, wiz.step - 1)); }

function wizRoll() {
  const step = wiz.step;
  if      (step === 2) _rollStat('skill',   ['wiz-d-skill'],                 1, 6);
  else if (step === 3) _rollStat('stamina', ['wiz-d-stamina1','wiz-d-stamina2'], 2, 12);
  else if (step === 4) _rollStat('luck',    ['wiz-d-luck'],                  1, 6);
}

// Générique : lance n dés + bonus, anime les éléments, met à jour wiz
function _rollStat(stat, dieIds, numDice, bonus) {
  const rolls = Array.from({ length: numDice }, d6);
  const total = rolls.reduce((a, b) => a + b, 0) + bonus;

  // Animation en chaîne
  let done = 0;
  rolls.forEach((r, i) => {
    animDie(dieIds[i], r, () => {
      done++;
      if (done === rolls.length) {
        document.getElementById('wiz-' + stat + '-roll').textContent = total;
        wiz[stat] = total;
        const firstRoll = !wiz[stat + 'Rolled'];
        wiz[stat + 'Rolled'] = true;
        const hint = document.getElementById('wiz-' + stat + '-reroll-hint');
        if (hint) hint.style.display = firstRoll ? 'block' : 'none';
        wizGo(wiz.step); // rafraîchit les boutons
      }
    });
  });
}

// Animation d'un dé
function animDie(elId, finalVal, cb) {
  const el = document.getElementById(elId);
  if (!el) { if (cb) cb(); return; }
  el.classList.add('rolling');
  let t = 0;
  const iv = setInterval(() => {
    el.textContent = Math.floor(Math.random() * 6) + 1;
    t += 60;
    if (t > 400) { clearInterval(iv); el.textContent = finalVal; el.classList.remove('rolling'); if (cb) cb(); }
  }, 60);
}

// ── Or manuel ────────────────────────────
function changeWizGold(delta) {
  wiz.gold = Math.max(0, (wiz.gold || 0) + delta);
  document.getElementById('wiz-gold-display').textContent = wiz.gold;
}

// ── Équipement extra ─────────────────────
function addWizItem() {
  const input = document.getElementById('wiz-extra-item');
  const name  = input.value.trim();
  if (!name) return;
  wizExtraItems.push(name);
  input.value = '';
  renderWizExtraList();
}

function removeWizItem(i) {
  wizExtraItems.splice(i, 1);
  renderWizExtraList();
}

function renderWizExtraList() {
  const list = document.getElementById('wiz-extra-list');
  if (!list) return;
  list.innerHTML = wizExtraItems.length === 0
    ? '<li style="color:var(--ink-light);font-size:13px;font-style:italic;padding:4px 0;">Aucun objet supplémentaire</li>'
    : '';
  wizExtraItems.forEach((name, i) => {
    const li = document.createElement('li');
    li.className = 'item-entry';
    li.innerHTML = `<span class="item-icon">${itemIcon(name)}</span><span class="item-name">${esc(name)}</span><button class="item-del" onclick="removeWizItem(${i})">✕</button>`;
    list.appendChild(li);
  });
}

// ── Potion ───────────────────────────────
function selectPotion(el) {
  document.querySelectorAll('#potion-choices .equip-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  wiz.potion = el.dataset.potion;
}

// ── Résumé ───────────────────────────────
function buildSummary() {
  const pt        = POTION_TYPES[wiz.potion || 'stamina'];
  const theme     = currentTheme();
  const baseItems = theme.equipment || ['Épée', 'Armure de cuir', 'Lanterne'];
  const allItems  = [...baseItems, ...wizExtraItems];
  const sumTheme  = document.getElementById('sum-theme');

  document.getElementById('sum-skill').textContent   = wiz.skill;
  document.getElementById('sum-stamina').textContent = wiz.stamina;
  document.getElementById('sum-luck').textContent    = wiz.luck;
  document.getElementById('sum-name').textContent    = wiz.name;
  document.getElementById('sum-book').textContent    = wiz.book;
  document.getElementById('sum-equip').textContent   = allItems.join(', ');
  document.getElementById('sum-gold').textContent    = (wiz.gold || 0) + ' PO';
  document.getElementById('sum-potion').textContent  = pt.icon + ' ' + pt.label + ' (2 mesures)';
  if (sumTheme) sumTheme.textContent = theme.icon + ' ' + theme.label;
}

// ── Finalisation ─────────────────────────
function wizFinish() {
  const pt        = POTION_TYPES[wiz.potion || 'stamina'];
  const theme     = currentTheme();
  const baseItems = (theme.equipment || ['Épée', 'Armure de cuir', 'Lanterne'])
    .map(name => ({ name, qty: 1 }));
  baseItems.push({ name: pt.label + ' (2 mesures)', qty: 1 });
  wizExtraItems.forEach(n => baseItems.push({ name: n, qty: 1 }));

  state = {
    name: wiz.name, book: wiz.book,
    theme: wiz.theme,
    skill:   wiz.skill,   skillMax:   wiz.skill,
    stamina: wiz.stamina, staminaMax: wiz.stamina,
    luck:    wiz.luck,    luckMax:    wiz.luck,
    gold: wiz.gold || 0,
    meals: 0,
    potions: 2, potionsTotal: 2,
    potionType: wiz.potion || 'stamina',
    items: baseItems,
    notes: '', paras: '',
    diceHistory: [],
  };

  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  document.getElementById('wizard').style.display = 'none';
  render();
  const themeIcon = theme.icon || '⚔️';
  toast(themeIcon + ' Que l\'aventure commence, ' + state.name + ' !');
}

// ── Réinitialisation du wizard ───────────
function reopenWizard() {
  if (!confirm('Créer un nouveau personnage ? La partie actuelle sera effacée.')) return;

  localStorage.removeItem(SAVE_KEY);

  // Reset état wizard
  wiz = {
    step: 0, name: '', book: '', bookNum: null,
    theme: 'fantasy',
    skill: null,   skillRolled: false,
    stamina: null, staminaRolled: false,
    luck: null,    luckRolled: false,
    gold: 0, potion: 'stamina',
  };
  wizExtraItems   = [];
  selectedBookIdx = -1;

  // Reset champs de dés
  const safeText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const safeVal  = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  const safeHide = (id)      => { const el = document.getElementById(id); if (el) el.style.display = 'none'; };

  safeText('wiz-skill-roll',   '–');
  safeText('wiz-stamina-roll', '–');
  safeText('wiz-luck-roll',    '–');
  safeText('wiz-d-skill',      '?');
  safeText('wiz-d-stamina1',   '?');
  safeText('wiz-d-stamina2',   '?');
  safeText('wiz-d-luck',       '?');
  safeText('wiz-gold-display',  '0');

  safeHide('wiz-skill-reroll-hint');
  safeHide('wiz-stamina-reroll-hint');
  safeHide('wiz-luck-reroll-hint');

  safeVal('wiz-name',    '');
  safeVal('wiz-book',    '');
  safeVal('book-search', '');

  const nameSug = document.getElementById('name-suggestions');
  if (nameSug) nameSug.innerHTML = '';

  // Reset sélection potion (premier choix par défaut)
  document.querySelectorAll('#potion-choices .equip-opt')
    .forEach((o, i) => o.classList.toggle('selected', i === 0));

  renderWizExtraList();

  // Afficher le wizard et aller à l'étape 0
  document.getElementById('wizard').style.display = 'flex';
  wizGo(0);
  initWizardUI();
}

// ── Générateur de noms (adapté au thème) ─
function generateName() {
  const theme  = currentTheme();
  const style  = NAMES_BY_STYLE[theme.nameStyle] || NAMES_BY_STYLE.fantasy;
  const rnd    = arr => arr[Math.floor(Math.random() * arr.length)];
  const suggestions = [];

  if (theme.nameStyle === 'fantasy') {
    for (let i = 0; i < 3; i++)
      suggestions.push(rnd(style.prefix) + rnd(style.suffix));
    suggestions.push(rnd(style.female) + ' ' + rnd(style.titles));
    suggestions.push(rnd(style.male)   + ' ' + rnd(style.titles));
    suggestions.push(rnd(style.prefix) + rnd(style.mid));
  } else if (theme.nameStyle === 'superhero') {
    for (let i = 0; i < 3; i++)
      suggestions.push(rnd(style.heroNames));
    suggestions.push(rnd(style.male)   + ' ' + rnd(style.titles));
    suggestions.push(rnd(style.female) + ' ' + rnd(style.titles));
    suggestions.push(rnd(style.heroNames));
  } else {
    // modern, japanese, ancient
    for (let i = 0; i < 3; i++)
      suggestions.push(rnd(style.male)   + ' ' + rnd(style.titles));
    for (let i = 0; i < 3; i++)
      suggestions.push(rnd(style.female) + ' ' + rnd(style.titles));
  }

  const container = document.getElementById('name-suggestions');
  if (!container) return;
  container.innerHTML = '';
  const labelEl = document.getElementById('wiz-name-style-label');
  if (labelEl) labelEl.textContent = `Style : ${theme.label} ${theme.icon}`;

  suggestions.slice(0, 6).forEach(name => {
    const chip = document.createElement('div');
    chip.className   = 'name-chip';
    chip.textContent = name;
    chip.onclick     = () => {
      document.getElementById('wiz-name').value = name;
      container.querySelectorAll('.name-chip').forEach(c => c.style.fontWeight = 'normal');
      chip.style.fontWeight = 'bold';
    };
    container.appendChild(chip);
  });
}

// ── Liste des livres (avec icône de thème) ─
function renderBookList(filter = '') {
  const list = document.getElementById('book-list');
  if (!list) return;
  const q        = filter.toLowerCase();
  const filtered = BOOKS.filter(b => b.t.toLowerCase().includes(q) || String(b.n).includes(q));

  if (filtered.length === 0) {
    list.innerHTML = '<div style="padding:12px;text-align:center;font-size:13px;color:var(--ink-light);font-style:italic;">Aucun résultat</div>';
    return;
  }
  list.innerHTML = '';
  filtered.forEach(b => {
    const themeKey = BOOK_THEMES[b.n] || 'fantasy';
    const theme    = THEMES[themeKey];
    const div      = document.createElement('div');
    div.className  = 'book-item' + (selectedBookIdx === b.n ? ' selected' : '');
    div.innerHTML  = `
      <span class="book-num">${b.n}</span>
      <span style="font-size:14px;flex-shrink:0;" title="${theme.label}">${theme.icon}</span>
      <span class="book-title">${b.t}</span>`;
    div.onclick = () => {
      selectedBookIdx = b.n;
      const fullTitle = `#${b.n} — ${b.t}`;
      onBookSelected(b.n, fullTitle);
      renderBookList(document.getElementById('book-search').value);
    };
    list.appendChild(div);
  });
}

function filterBooks(q) { renderBookList(q); }

// ── Init UI du wizard ────────────────────
function initWizardUI() {
  applyTheme(wiz.theme || 'fantasy');
  renderBookList();
  generateName();
}
