// =============================================================================
//  FORTNITE ESPÍRITUS - GESTOR DE INTERCAMBIOS DE SALA (SPRITE LOCKER)
// =============================================================================

(function () {
  const DB = window.SPRITES_DB;
  if (!DB) {
    console.error("No se encontró SPRITES_DB en window.");
    return;
  }

  // Clave para guardar en LocalStorage
  const STORAGE_KEY = "fortnite_sprites_players_v1";

  // Jugadores iniciales por defecto con los links proporcionados por el usuario
  const DEFAULT_PLAYERS = [
    {
      id: "p1",
      name: "Canito",
      url: "https://spritelocker.com/compare#vs=4.772zvvTaGS2utF564UQhhvYCOMAJAgQAwHgAAAAAAAAwAgCAFAEAQgAkAwAAAAFhAECSIAAIAEgKABCQDAgMIIAAABEAAAABGACQCEgSAIAAAQAAAAAAAABgAAA"
    },
    {
      id: "p2",
      name: "Roberto",
      url: "https://spritelocker.com/#c=4.770WvlLaGKGsFFZawUQBAIACAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAwAJggJCAIAAMABBECAQMAAQAAoAIQAAAAAABADAAAEAQAAAAAAAAAgAAAAAAAAA"
    }
  ];

  // Estado de la aplicación
  let state = {
    players: [],
    currentTab: "chain", // 'chain', 'matrix', 'versus', 'missing'
    filterRarity: "all",
    filterVariant: "all",
    versusA: null,
    versusB: null
  };

  // --- FUNCIONES DE DECODIFICACIÓN ---
  function extractCodeOrToken(urlOrCode) {
    if (!urlOrCode) return null;
    let t = urlOrCode.trim();

    // 1. Detectar token en vivo: ?p=TOKEN o /share/TOKEN
    if (t.includes("?")) {
      let queryPart = t.split("?")[1].split("#")[0];
      let params = new URLSearchParams(queryPart);
      if (params.has("p")) {
        return { type: "token", value: params.get("p") };
      }
    }
    let shareMatch = t.match(/\/share\/([A-Za-z0-9_-]+)/);
    if (shareMatch) {
      return { type: "token", value: shareMatch[1] };
    }

    // 2. Detectar código hash: #vs=... o #c=...
    let hashIdx = t.indexOf("#");
    if (hashIdx !== -1) {
      let fragment = t.slice(hashIdx + 1);
      let params = new URLSearchParams(fragment);
      let val = params.get("vs") || params.get("c");
      if (val) return { type: "code", value: val };
      return { type: "code", value: fragment };
    }

    // 3. Código directo
    return { type: "code", value: t };
  }

  function b64UrlDecode(s) {
    let base64 = s.replace(/-/g, "+").replace(/_/g, "/");
    let pad = (4 - (base64.length % 4)) % 4;
    base64 += "=".repeat(pad);
    let binary = atob(base64);
    let bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function getBit(bytes, idx) {
    let byteIdx = idx >> 3;
    if (byteIdx >= bytes.length) return false;
    return !!(bytes[byteIdx] & (1 << (idx & 7)));
  }

  function decodeCollection(codeStr) {
    if (!codeStr) throw new Error("Código vacío");

    let version = "4";
    let dataStr = codeStr;
    if (codeStr.includes(".")) {
      let parts = codeStr.split(".");
      version = parts[0];
      dataStr = parts[1];
    }

    let bytes = b64UrlDecode(dataStr);
    let cells = DB.cells;
    let numCells = cells.length;

    let owned = {};
    let mastered = {};
    let lost = {};
    let levels = {};

    let offsetMastered = numCells;
    let offsetLost = numCells * 2;
    let offsetLevels = numCells * 3;

    for (let i = 0; i < numCells; i++) {
      let key = cells[i].key;
      let isOwned = getBit(bytes, i);
      let isMastered = getBit(bytes, offsetMastered + i);
      let isLost = getBit(bytes, offsetLost + i);

      if (isOwned) owned[key] = true;
      if (isMastered) { mastered[key] = true; owned[key] = true; }
      if (isLost) { lost[key] = true; owned[key] = true; }

      if (isOwned) {
        let lvl = 0;
        for (let b = 0; b < 3; b++) {
          if (getBit(bytes, offsetLevels + i * 3 + b)) {
            lvl |= (1 << b);
          }
        }
        if (lvl > 0) levels[key] = Math.min(5, Math.max(1, lvl + 1));
      }
    }

    let ownedCount = Object.keys(owned).length;
    let percentage = Math.round((ownedCount / numCells) * 1000) / 10;

    return {
      version,
      rawCode: codeStr,
      owned,
      mastered,
      lost,
      levels,
      ownedCount,
      percentage
    };
  }

  // --- PROCESAMIENTO / ACTUALIZACIÓN DE JUGADOR ---
  async function updatePlayer(player, notify = false) {
    try {
      let prevCount = player.data ? player.data.ownedCount : null;
      let target = extractCodeOrToken(player.url);
      if (!target) throw new Error("Enlace o código vacío");

      let codeToDecode = null;
      if (target.type === "token") {
        player.isLive = true;
        let res = await fetch(`https://api.spritelocker.com/share/${encodeURIComponent(target.value)}`);
        if (!res.ok) throw new Error(`Error del servidor Sprite Locker (${res.status})`);
        let json = await res.json();
        if (!json.data) throw new Error("Colección en vivo no encontrada");
        codeToDecode = json.data;
        if (json.name && (!player.name || player.name.startsWith("Jugador") || player.name.startsWith("Amigo"))) {
          player.name = json.name;
        }
      } else {
        player.isLive = false;
        codeToDecode = target.value;
      }

      player.data = decodeCollection(codeToDecode);
      player.lastUpdated = new Date();
      player.error = null;

      if (notify && prevCount !== null) {
        let diff = player.data.ownedCount - prevCount;
        if (diff !== 0) {
          let sign = diff > 0 ? `+${diff}` : `${diff}`;
          player.changeBadge = sign;
          showToast(`✨ ¡${player.name} actualizado! ${sign} espíritus (${player.data.ownedCount}/122)`);
        } else {
          showToast(`✔️ ${player.name} recargado (${player.data.ownedCount}/122 espíritus sin cambios).`);
        }
      }
    } catch (err) {
      player.data = null;
      player.error = err.message || "Enlace no válido";
    }
  }

  // --- CÁLCULO DE INTERCAMBIO ENTRE PARES ---
  function getTransferable(donor, recipient) {
    if (!donor.data || !recipient.data) return [];
    let donorOwned = donor.data.owned;
    let donorLost = donor.data.lost;
    let recipientOwned = recipient.data.owned;

    let results = [];
    for (let cell of DB.cells) {
      if (cell.tradable === false) continue;
      let k = cell.key;
      // Donante lo tiene, no está perdido, y receptor lo necesita
      if (donorOwned[k] && !donorLost[k] && !recipientOwned[k]) {
        results.push(cell);
      }
    }

    const rarityOrder = { 'Mythic': 4, 'Legendary': 3, 'Epic': 2, 'Rare': 1 };
    results.sort((a, b) => {
      let diff = (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
      if (diff !== 0) return diff;
      return b.dust - a.dust || a.spriteNameEs.localeCompare(b.spriteNameEs);
    });

    return results;
  }

  // --- COMPARTIR SALA POR URL (HASH) ---
  function getShareableRoomUrl() {
    let simpleList = state.players.map(p => ({
      n: p.name,
      u: p.url
    }));
    try {
      let jsonStr = JSON.stringify(simpleList);
      let b64 = btoa(unescape(encodeURIComponent(jsonStr))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      let base = window.location.origin + window.location.pathname;
      return `${base}#room=${b64}`;
    } catch (e) {
      console.warn("Error generando enlace de sala:", e);
      return window.location.href;
    }
  }

  function loadRoomFromUrl() {
    try {
      let hash = window.location.hash;
      if (hash && hash.includes("room=")) {
        let b64 = hash.split("room=")[1].split("&")[0];
        let standardB64 = b64.replace(/-/g, '+').replace(/_/g, '/');
        let pad = (4 - (standardB64.length % 4)) % 4;
        standardB64 += '='.repeat(pad);
        let jsonStr = decodeURIComponent(escape(atob(standardB64)));
        let list = JSON.parse(jsonStr);
        if (Array.isArray(list) && list.length > 0) {
          // IMPORTANTE: Limpiar el hash de la barra para que recargar con F5 no revierta cambios del usuario
          try {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          } catch (_) {}

          return list.map(item => ({
            id: "p_" + Math.random().toString(36).substr(2, 9),
            name: item.n || "Jugador",
            url: item.u || ""
          }));
        }
      }
    } catch (e) {
      console.warn("No se pudo leer la sala desde la URL:", e);
    }
    return null;
  }

  // --- PERSISTENCIA LOCAL STORAGE ---
  function saveState() {
    let payload = state.players.map(p => ({
      id: p.id,
      name: p.name,
      url: p.url
    }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("No se pudo guardar en LocalStorage:", e);
    }
  }

  function loadSavedState() {
    let fromUrl = loadRoomFromUrl();
    if (fromUrl) {
      return fromUrl;
    }
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        let saved = JSON.parse(raw);
        if (Array.isArray(saved) && saved.length > 0) {
          return saved;
        }
      }
    } catch (e) {
      console.warn("Error leyendo LocalStorage:", e);
    }
    return DEFAULT_PLAYERS;
  }

  async function initPlayers() {
    let rawList = loadSavedState();
    state.players = rawList.map(p => ({
      id: p.id || "p_" + Math.random().toString(36).substr(2, 9),
      name: p.name || "Jugador",
      url: p.url || "",
      data: null,
      error: null,
      lastUpdated: new Date()
    }));

    for (let p of state.players) {
      await updatePlayer(p);
    }

    if (state.players.length >= 2) {
      state.versusA = state.players[0].id;
      state.versusB = state.players[1].id;
    }
  }

  // --- INTERFAZ / RENDERIZADO ---
  const elLobbyGrid = document.getElementById("lobbyGrid");
  const elMainContent = document.getElementById("mainContent");
  const elToast = document.getElementById("toast");

  function showToast(msg) {
    if (!elToast) return;
    elToast.querySelector(".toast-text").textContent = msg;
    elToast.classList.add("show");
    setTimeout(() => {
      elToast.classList.remove("show");
    }, 3200);
  }

  function formatTime(d) {
    if (!d) return "";
    let h = String(d.getHours()).padStart(2, "0");
    let m = String(d.getMinutes()).padStart(2, "0");
    let s = String(d.getSeconds()).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  function renderLobby() {
    elLobbyGrid.innerHTML = "";
    state.players.forEach((player) => {
      const card = document.createElement("div");
      card.className = "player-card" + (player.error ? " has-error" : "");
      card.id = `card_${player.id}`;

      const count = player.data ? player.data.ownedCount : 0;
      const pct = player.data ? player.data.percentage : 0;

      card.innerHTML = `
        <div class="player-card-header">
          <input type="text" class="player-name-input" value="${escapeHtml(player.name)}" placeholder="Nombre del jugador" data-id="${player.id}">
          <div class="player-header-badges">
            ${player.changeBadge ? `<span class="badge-change">${player.changeBadge}</span>` : ''}
            ${player.isLive ? `<span class="badge-live">🟢 LIVE</span>` : ''}
            <span class="player-stats-badge stats-badge-${player.id}">${player.error ? '⚠️ Error' : `${count}/122 (${pct}%)`}</span>
          </div>
        </div>
        <div class="progress-container">
          <div class="progress-labels">
            <span>Colección</span>
            <span class="progress-pct-${player.id}">${pct}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill progress-fill-${player.id}" style="width: ${pct}%;"></div>
          </div>
        </div>
        <input type="text" class="player-link-input" value="${escapeHtml(player.url)}" placeholder="Pega el enlace de Sprite Locker (#vs=, #c= o ?p=)" data-id="${player.id}">
        <div class="player-meta-row">
          <span class="player-updated-time">🕒 Act: <span class="time-label-${player.id}">${formatTime(player.lastUpdated)}</span></span>
          <span class="error-msg-${player.id}" style="color: #ff8585;">${player.error ? escapeHtml(player.error) : ''}</span>
        </div>
        <div class="player-actions">
          <button class="btn btn-primary btn-sm btn-paste" data-id="${player.id}" title="Lee el nuevo link de tu portapapeles y actualiza este jugador">📋 Pegar Nuevo Link</button>
          <button class="btn btn-secondary btn-sm btn-reload-one" data-id="${player.id}" title="Recargar inventario de este jugador">🔄 Recargar</button>
          <button class="btn btn-secondary btn-sm btn-clear" data-id="${player.id}" title="Limpiar enlace">Limpiar</button>
          <button class="btn btn-danger btn-sm btn-remove" data-id="${player.id}" title="Eliminar jugador">Eliminar</button>
        </div>
      `;

      // Evento: Nombre
      const nameInput = card.querySelector(".player-name-input");
      nameInput.addEventListener("change", (e) => {
        player.name = e.target.value.trim() || "Jugador";
        saveState();
        renderActiveTab();
      });

      // Evento: Input del Link
      const linkInput = card.querySelector(".player-link-input");
      const handleLinkChange = async (newVal) => {
        if (player.url === newVal && player.data) return;
        player.url = newVal;
        await updatePlayer(player, true);
        saveState();
        updatePlayerCardUI(player);
        renderActiveTab();
      };

      linkInput.addEventListener("change", (e) => handleLinkChange(e.target.value));
      linkInput.addEventListener("paste", () => {
        setTimeout(() => handleLinkChange(linkInput.value), 50);
      });

      // Botón: Pegar desde portapapeles
      card.querySelector(".btn-paste").addEventListener("click", async () => {
        try {
          const clipText = await navigator.clipboard.readText();
          if (clipText && (clipText.includes("spritelocker.com") || clipText.includes("#") || clipText.includes("4."))) {
            linkInput.value = clipText.trim();
            await handleLinkChange(clipText.trim());
            card.classList.add("is-updated");
            setTimeout(() => card.classList.remove("is-updated"), 1200);
          } else {
            let manual = prompt(`Pega el nuevo enlace de Sprite Locker para ${player.name}:`, player.url);
            if (manual !== null) {
              linkInput.value = manual.trim();
              await handleLinkChange(manual.trim());
            }
          }
        } catch (err) {
          let manual = prompt(`Pega el nuevo enlace de Sprite Locker para ${player.name}:`, player.url);
          if (manual !== null) {
            linkInput.value = manual.trim();
            await handleLinkChange(manual.trim());
          }
        }
      });

      // Botón: Recargar individual
      card.querySelector(".btn-reload-one").addEventListener("click", async () => {
        const btn = card.querySelector(".btn-reload-one");
        btn.textContent = "⏳...";
        await updatePlayer(player, true);
        saveState();
        updatePlayerCardUI(player);
        renderActiveTab();
        btn.textContent = "🔄 Recargar";
        card.classList.add("is-updated");
        setTimeout(() => card.classList.remove("is-updated"), 1200);
      });

      // Botón: Limpiar
      card.querySelector(".btn-clear").addEventListener("click", () => {
        player.url = "";
        linkInput.value = "";
        player.data = null;
        player.error = null;
        player.changeBadge = null;
        saveState();
        updatePlayerCardUI(player);
        renderActiveTab();
      });

      // Botón: Eliminar
      card.querySelector(".btn-remove").addEventListener("click", () => {
        if (state.players.length <= 1) {
          showToast("Debe haber al menos un jugador en la sala.");
          return;
        }
        state.players = state.players.filter(p => p.id !== player.id);
        saveState();
        renderLobby();
        renderActiveTab();
      });

      elLobbyGrid.appendChild(card);
    });
  }

  function updatePlayerCardUI(player) {
    const card = document.getElementById(`card_${player.id}`);
    if (!card) return;

    const count = player.data ? player.data.ownedCount : 0;
    const pct = player.data ? player.data.percentage : 0;

    const badge = card.querySelector(`.stats-badge-${player.id}`);
    if (badge) {
      badge.textContent = player.error ? "⚠️ Error" : `${count}/122 (${pct}%)`;
    }

    const pctLabel = card.querySelector(`.progress-pct-${player.id}`);
    if (pctLabel) pctLabel.textContent = `${pct}%`;

    const fill = card.querySelector(`.progress-fill-${player.id}`);
    if (fill) fill.style.width = `${pct}%`;

    const timeLabel = card.querySelector(`.time-label-${player.id}`);
    if (timeLabel) timeLabel.textContent = formatTime(player.lastUpdated);

    const errMsg = card.querySelector(`.error-msg-${player.id}`);
    if (errMsg) errMsg.textContent = player.error ? player.error : "";

    if (player.error) card.classList.add("has-error");
    else card.classList.remove("has-error");
  }

  function getSortedPlayers() {
    return [...state.players]
      .filter(p => p.data && !playerHasError(p))
      .sort((a, b) => b.data.ownedCount - a.data.ownedCount);
  }

  function playerHasError(p) {
    return !!p.error || !p.data;
  }

  // --- RENDERIZADO DE TABS ---
  function renderActiveTab() {
    const validPlayers = getSortedPlayers();
    if (validPlayers.length < 2) {
      elMainContent.innerHTML = `
        <div class="panel" style="text-align: center; padding: 2.5rem;">
          <h3 style="color: #ffd070; margin-bottom: 0.5rem;">⚠️ Se necesitan al menos 2 jugadores con enlaces válidos</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            Pega los enlaces de Sprite Locker en las tarjetas superiores para calcular la fila de intercambios.
          </p>
        </div>
      `;
      return;
    }

    if (state.currentTab === "chain") {
      renderChainTab(validPlayers);
    } else if (state.currentTab === "matrix") {
      renderMatrixTab(validPlayers);
    } else if (state.currentTab === "versus") {
      renderVersusTab(validPlayers);
    } else if (state.currentTab === "missing") {
      renderMissingTab(validPlayers);
    }
  }

  // --- TAB 1: FILA / CADENA DE COMPARTIR ---
  function renderChainTab(players) {
    let html = `
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">🤝 Fila Principal de Compartir (Cascada de Mayor a Menor)</div>
            <div class="panel-desc">Organiza a los jugadores de mayor a menor y calcula la fila de entregas paso a paso.</div>
          </div>
          <div>
            <button class="btn btn-secondary btn-sm" id="btnCopyChainDiscord">📋 Copiar para Discord</button>
            <button class="btn btn-secondary btn-sm" id="btnCopyChainWhatsapp">💬 Copiar para WhatsApp</button>
          </div>
        </div>

        <div style="margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.6rem; align-items: center;">
          <span style="font-size: 0.82rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase;">Orden de la sala:</span>
          ${players.map((p, idx) => `
            <div class="chain-player-tag" style="border-color: ${idx === 0 ? '#ffd070' : 'rgba(120, 170, 255, 0.4)'};">
              <span>${idx === 0 ? '👑' : `${idx + 1}º`}</span>
              <strong>${escapeHtml(p.name)}</strong>
              <span style="color: var(--accent-cyan); font-size: 0.75rem;">(${p.data.ownedCount}/122)</span>
            </div>
          `).join('<span style="color: var(--text-muted);">➜</span>')}
        </div>
    `;

    // Pasos de la cascada
    for (let i = 0; i < players.length - 1; i++) {
      let donor = players[i];
      let recipient = players[i + 1];

      let gives = getTransferable(donor, recipient);
      let returns = getTransferable(recipient, donor);

      let dustGives = gives.reduce((acc, c) => acc + c.dust, 0);
      let dustReturns = returns.reduce((acc, c) => acc + c.dust, 0);

      html += `
        <div class="chain-step-card">
          <div class="chain-step-header">
            <div class="chain-pair">
              <span class="chain-player-tag donor">👑 ${escapeHtml(donor.name)} (${donor.data.ownedCount})</span>
              <span class="chain-arrow">➜</span>
              <span class="chain-player-tag recipient">${escapeHtml(recipient.name)} (${recipient.data.ownedCount})</span>
            </div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">
              Paso ${i + 1} de ${players.length - 1}
            </div>
          </div>

          <div class="chain-step-body">
            <div class="substep-title">
              <span>🎁 <strong>${escapeHtml(donor.name)}</strong> le pasa a <strong>${escapeHtml(recipient.name)}</strong>:</span>
              <span class="substep-count">${gives.length} espíritus · 💨 ${dustGives} polvo total</span>
            </div>

            ${gives.length > 0 ? `
              <div class="spirits-grid">
                ${gives.map(c => renderSpiritItem(c)).join("")}
              </div>
            ` : `
              <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">
                ¡${escapeHtml(recipient.name)} ya tiene todos los espíritus que posee ${escapeHtml(donor.name)}!
              </div>
            `}

            ${returns.length > 0 ? `
              <div class="return-box">
                <div class="return-title">
                  <span>🔄 Intercambio de vuelta: <strong>${escapeHtml(recipient.name)}</strong> tiene ${returns.length} espíritus que le faltan a <strong>${escapeHtml(donor.name)}</strong></span>
                  <span style="font-size: 0.78rem; font-weight: normal; margin-left: auto;">(💨 ${dustReturns} polvo)</span>
                </div>
                <div class="spirits-grid" style="margin-bottom: 0;">
                  ${returns.map(c => renderSpiritItem(c)).join("")}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    html += `</div>`;
    elMainContent.innerHTML = html;

    // Listeners para copiar
    document.getElementById("btnCopyChainDiscord")?.addEventListener("click", () => {
      copyChainText(players, "discord");
    });
    document.getElementById("btnCopyChainWhatsapp")?.addEventListener("click", () => {
      copyChainText(players, "whatsapp");
    });
  }

  // --- TAB 2: MATRIZ DE SALA ---
  function renderMatrixTab(players) {
    let html = `
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">📋 Matriz Completa de Intercambios</div>
            <div class="panel-desc">Haz clic en cualquier celda para ver qué espíritus puede pasar un jugador a otro.</div>
          </div>
        </div>

        <div class="matrix-table-wrap">
          <table class="matrix-table">
            <thead>
              <tr>
                <th style="text-align: left;">Donante ╲ Receptor</th>
                ${players.map(p => `<th>${escapeHtml(p.name)}<br><small style="color: var(--accent-cyan);">${p.data.ownedCount}/122</small></th>`).join("")}
                <th>Total que puede donar</th>
              </tr>
            </thead>
            <tbody>
              ${players.map(donor => {
                let totalGivenByDonor = 0;
                let cellsHtml = players.map(recipient => {
                  if (donor.id === recipient.id) {
                    return `<td class="cell-self">—</td>`;
                  }
                  let count = getTransferable(donor, recipient).length;
                  totalGivenByDonor += count;
                  return `
                    <td class="cell-trade" onclick="window.viewTradeModal('${donor.id}', '${recipient.id}')">
                      ${count > 0 ? `<strong>${count}</strong>` : `<span style="color: var(--text-muted);">0</span>`}
                    </td>
                  `;
                }).join("");

                return `
                  <tr>
                    <td style="text-align: left; font-weight: 800;">👑 ${escapeHtml(donor.name)}</td>
                    ${cellsHtml}
                    <td style="font-weight: 800; color: #ffd070;">${totalGivenByDonor}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    elMainContent.innerHTML = html;
  }

  // --- TAB 3: 1 VS 1 DETALLADO ---
  function renderVersusTab(players) {
    if (!state.versusA || !players.find(p => p.id === state.versusA)) state.versusA = players[0].id;
    if (!state.versusB || !players.find(p => p.id === state.versusB)) state.versusB = players[1].id;

    const pA = players.find(p => p.id === state.versusA) || players[0];
    const pB = players.find(p => p.id === state.versusB) || players[1];

    const aGivesB = getTransferable(pA, pB);
    const bGivesA = getTransferable(pB, pA);

    const dustA = aGivesB.reduce((sum, c) => sum + c.dust, 0);
    const dustB = bGivesA.reduce((sum, c) => sum + c.dust, 0);

    let html = `
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">⚔️ Comparador 1 vs 1</div>
            <div class="panel-desc">Compara directamente dos jugadores para coordinar un intercambio bilateral.</div>
          </div>
        </div>

        <div class="versus-selectors">
          <select id="selVersusA" class="versus-select">
            ${players.map(p => `<option value="${p.id}" ${p.id === pA.id ? 'selected' : ''}>${escapeHtml(p.name)} (${p.data.ownedCount}/122)</option>`).join("")}
          </select>
          <div class="versus-badge">VS</div>
          <select id="selVersusB" class="versus-select">
            ${players.map(p => `<option value="${p.id}" ${p.id === pB.id ? 'selected' : ''}>${escapeHtml(p.name)} (${p.data.ownedCount}/122)</option>`).join("")}
          </select>
        </div>

        <div class="versus-columns">
          <div class="panel" style="background: rgba(6, 11, 32, 0.9);">
            <div class="substep-title" style="color: #ffd070;">
              <span>🎁 ${escapeHtml(pA.name)} tiene ➜ ${escapeHtml(pB.name)} necesita</span>
              <span class="substep-count">${aGivesB.length} espíritus · 💨 ${dustA} polvo</span>
            </div>
            ${aGivesB.length > 0 ? `
              <div class="spirits-grid">
                ${aGivesB.map(c => renderSpiritItem(c)).join("")}
              </div>
            ` : `<p style="color: var(--text-muted); font-size: 0.85rem;">Ninguno.</p>`}
          </div>

          <div class="panel" style="background: rgba(6, 11, 32, 0.9);">
            <div class="substep-title" style="color: var(--accent-cyan);">
              <span>🎁 ${escapeHtml(pB.name)} tiene ➜ ${escapeHtml(pA.name)} necesita</span>
              <span class="substep-count">${bGivesA.length} espíritus · 💨 ${dustB} polvo</span>
            </div>
            ${bGivesA.length > 0 ? `
              <div class="spirits-grid">
                ${bGivesA.map(c => renderSpiritItem(c)).join("")}
              </div>
            ` : `<p style="color: var(--text-muted); font-size: 0.85rem;">Ninguno.</p>`}
          </div>
        </div>
      </div>
    `;

    elMainContent.innerHTML = html;

    document.getElementById("selVersusA")?.addEventListener("change", (e) => {
      state.versusA = e.target.value;
      renderVersusTab(players);
    });
    document.getElementById("selVersusB")?.addEventListener("change", (e) => {
      state.versusB = e.target.value;
      renderVersusTab(players);
    });
  }

  // --- TAB 4: FALTANTES DEL ESCUADRÓN ---
  function renderMissingTab(players) {
    let missingList = [];
    for (let cell of DB.cells) {
      if (cell.tradable === false) continue;
      let k = cell.key;
      let isOwnedByAnyone = players.some(p => p.data.owned[k]);
      if (!isOwnedByAnyone) {
        missingList.push(cell);
      }
    }

    const rarityOrder = { 'Mythic': 4, 'Legendary': 3, 'Epic': 2, 'Rare': 1 };
    missingList.sort((a, b) => {
      let diff = (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
      if (diff !== 0) return diff;
      return b.dust - a.dust || a.spriteNameEs.localeCompare(b.spriteNameEs);
    });

    let html = `
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">🔍 Espíritus Faltantes del Escuadrón (${missingList.length} en total)</div>
            <div class="panel-desc">Ningún jugador de la sala tiene estos espíritus aún. ¡Búsquenlos juntos en cofres!</div>
          </div>
        </div>

        ${missingList.length > 0 ? `
          <div class="spirits-grid">
            ${missingList.map(c => renderSpiritItem(c)).join("")}
          </div>
        ` : `
          <div style="text-align: center; padding: 2rem; color: #3fe06b;">
            <h2>🎉 ¡Felicidades!</h2>
            <p>Entre todos los jugadores de la sala tienen el 100% de la colección cubierta.</p>
          </div>
        `}
      </div>
    `;

    elMainContent.innerHTML = html;
  }

  // --- RENDERIZADO DE ITEM ESPÍRITU ---
  function renderSpiritItem(cell) {
    const rarityColors = {
      Rare: '#3aa0ff',
      Epic: '#b34dff',
      Legendary: '#f5a623',
      Mythic: '#ff4d4d'
    };
    const rarityColor = rarityColors[cell.rarity] || '#fff';

    return `
      <div class="spirit-item" style="border-left: 3px solid ${rarityColor};">
        <div class="spirit-img-wrap">
          <img src="${cell.imageUrl}" alt="${escapeHtml(cell.spriteNameEs)}" class="spirit-img" loading="lazy" onerror="this.style.display='none'">
        </div>
        <div class="spirit-name" title="${escapeHtml(cell.spriteNameEs)}">${escapeHtml(cell.spriteNameEs)}</div>
        <div class="spirit-tags">
          <span class="variant-pill" style="border-color: ${rarityColor}; color: #eaf4ff;">${escapeHtml(cell.variantNameEs)}</span>
          <span class="rarity-pill" style="background: ${rarityColor}22; color: ${rarityColor}; border: 1px solid ${rarityColor}66;">${escapeHtml(cell.rarityEs)}</span>
        </div>
        <div class="spirit-dust">💨 ${cell.dust} polvo</div>
      </div>
    `;
  }

  // --- COPIAR TEXTO FORMATEADO ---
  function copyChainText(players, platform) {
    let lines = [];
    if (platform === "discord") {
      lines.push("**🎮 FORTNITE - FILA DE INTERCAMBIO DE ESPÍRITUS (C7S4)**");
      lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } else {
      lines.push("🎮 *FORTNITE - FILA DE INTERCAMBIO DE ESPÍRITUS (C7S4)*");
      lines.push("---------------------------------------------");
    }

    for (let i = 0; i < players.length - 1; i++) {
      let donor = players[i];
      let recipient = players[i + 1];
      let gives = getTransferable(donor, recipient);
      let returns = getTransferable(recipient, donor);

      let dustG = gives.reduce((s, c) => s + c.dust, 0);

      lines.push("");
      lines.push(`👑 **PASO ${i + 1}**: ${donor.name} (${donor.data.ownedCount}) ➜ ${recipient.name} (${recipient.data.ownedCount})`);
      lines.push(`🎁 ${donor.name} le entrega ${gives.length} espíritus (${dustG} polvo total):`);
      if (gives.length > 0) {
        gives.forEach(c => {
          lines.push(`  • ${c.spriteNameEs} (${c.variantNameEs}) [${c.rarityEs}] - 💨 ${c.dust}`);
        });
      } else {
        lines.push(`  (Ninguno, el receptor ya tiene todo lo que tiene el donante)`);
      }

      if (returns.length > 0) {
        let dustR = returns.reduce((s, c) => s + c.dust, 0);
        lines.push(`🔄 A cambio, ${recipient.name} le entrega ${returns.length} espíritus (${dustR} polvo):`);
        returns.forEach(c => {
          lines.push(`  • ${c.spriteNameEs} (${c.variantNameEs}) [${c.rarityEs}] - 💨 ${c.dust}`);
        });
      }
    }

    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("Generado con la herramienta de intercambio de espíritus.");

    let fullText = lines.join("\n");
    navigator.clipboard.writeText(fullText).then(() => {
      showToast(`¡Copiado para ${platform === "discord" ? "Discord" : "WhatsApp"}!`);
    }).catch(err => {
      console.error(err);
      showToast("Error al copiar al portapapeles.");
    });
  }

  // --- MODAL DETALLE DE INTERCAMBIO EN MATRIZ ---
  window.viewTradeModal = function (donorId, recipientId) {
    const donor = state.players.find(p => p.id === donorId);
    const recipient = state.players.find(p => p.id === recipientId);
    if (!donor || !recipient) return;

    const list = getTransferable(donor, recipient);
    const dust = list.reduce((s, c) => s + c.dust, 0);

    const modalBackdrop = document.getElementById("modalBackdrop");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");

    modalTitle.innerHTML = `🎁 <strong>${escapeHtml(donor.name)}</strong> ➜ <strong>${escapeHtml(recipient.name)}</strong> (${list.length} espíritus · 💨 ${dust} polvo)`;
    if (list.length > 0) {
      modalBody.innerHTML = `
        <div class="spirits-grid">
          ${list.map(c => renderSpiritItem(c)).join("")}
        </div>
      `;
    } else {
      modalBody.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No hay espíritus transferibles en esta combinación.</p>`;
    }

    modalBackdrop.classList.add("open");
  };

  function closeModal() {
    document.getElementById("modalBackdrop")?.classList.remove("open");
    document.getElementById("batchModalBackdrop")?.classList.remove("open");
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --- EVENT LISTENERS GENERALES ---
  function setupListeners() {
    // Pestañas
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        state.currentTab = btn.dataset.tab;
        renderActiveTab();
      });
    });

    // Añadir jugador
    document.getElementById("btnAddPlayer")?.addEventListener("click", () => {
      const newPlayer = {
        id: "p_" + Math.random().toString(36).substr(2, 9),
        name: "Amigo " + (state.players.length + 1),
        url: "",
        data: null,
        error: null,
        lastUpdated: new Date()
      };
      state.players.push(newPlayer);
      saveState();
      renderLobby();
      renderActiveTab();
    });

    // Recargar Todos los Inventarios
    document.getElementById("btnReloadAll")?.addEventListener("click", async () => {
      const btn = document.getElementById("btnReloadAll");
      const originalText = btn.textContent;
      btn.textContent = "⏳ Recargando...";
      btn.disabled = true;

      for (let player of state.players) {
        if (player.url) {
          await updatePlayer(player, false);
        }
      }

      saveState();
      renderLobby();
      renderActiveTab();

      btn.textContent = originalText;
      btn.disabled = false;
      showToast("🔄 ¡Todos los inventarios fueron recargados con éxito!");
    });

    // Modal de Pegado Rápido
    const batchBackdrop = document.getElementById("batchModalBackdrop");
    const batchTextarea = document.getElementById("batchTextarea");

    document.getElementById("btnBatchImport")?.addEventListener("click", () => {
      batchBackdrop.classList.add("open");
      batchTextarea.value = state.players.map(p => `${p.name}: ${p.url}`).join("\n");
      batchTextarea.focus();
    });

    document.getElementById("batchModalClose")?.addEventListener("click", closeModal);
    document.getElementById("btnBatchCancel")?.addEventListener("click", closeModal);
    batchBackdrop?.addEventListener("click", (e) => {
      if (e.target.id === "batchModalBackdrop") closeModal();
    });

    // Aplicar Pegado Rápido
    document.getElementById("btnApplyBatch")?.addEventListener("click", async () => {
      const lines = batchTextarea.value.split("\n").map(l => l.trim()).filter(Boolean);
      let countUpdated = 0;

      for (let line of lines) {
        let name = "";
        let url = "";

        if (line.includes(":") && (line.includes("http") || line.includes("#") || line.includes("4."))) {
          let parts = line.split(":");
          name = parts[0].trim();
          url = parts.slice(1).join(":").trim();
        } else if (line.includes("http") || line.includes("#") || line.includes("4.")) {
          // Extraer URL o código
          let urlMatch = line.match(/(https?:\/\/[^\s]+|4\.[A-Za-z0-9_-]+)/);
          if (urlMatch) {
            url = urlMatch[1];
            name = line.replace(url, "").trim().replace(/[-–—:]+$/, "").trim();
          }
        }

        if (url) {
          let existing = state.players.find(p => p.name.toLowerCase() === name.toLowerCase());
          if (existing) {
            existing.url = url;
            await updatePlayer(existing);
            countUpdated++;
          } else {
            let newP = {
              id: "p_" + Math.random().toString(36).substr(2, 9),
              name: name || `Amigo ${state.players.length + 1}`,
              url: url,
              data: null,
              error: null,
              lastUpdated: new Date()
            };
            await updatePlayer(newP);
            state.players.push(newP);
            countUpdated++;
          }
        }
      }

      saveState();
      renderLobby();
      renderActiveTab();
      closeModal();
      showToast(`⚡ ¡${countUpdated} jugadores actualizados correctamente!`);
    });

    // Compartir Sala por URL
    document.getElementById("btnShareRoom")?.addEventListener("click", () => {
      let shareUrl = getShareableRoomUrl();
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("¡Enlace de la sala copiado! Tus amigos verán la sala completa al abrirlo.");
      }).catch(() => {
        prompt("Copia este enlace para compartir la sala con tus amigos:", shareUrl);
      });
    });

    // Restablecer / Cargar Demo
    document.getElementById("btnResetDemo")?.addEventListener("click", () => {
      if (confirm("¿Quieres restablecer la sala a los datos originales de Canito y Roberto?")) {
        window.location.hash = "";
        localStorage.removeItem(STORAGE_KEY);
        initPlayers().then(() => {
          renderLobby();
          renderActiveTab();
          showToast("¡Colecciones de Canito y Roberto restablecidas!");
        });
      }
    });

    // Modal cerrar
    document.getElementById("modalClose")?.addEventListener("click", closeModal);
    document.getElementById("modalBackdrop")?.addEventListener("click", (e) => {
      if (e.target.id === "modalBackdrop") closeModal();
    });
  }

  // Inicialización asíncrona
  initPlayers().then(() => {
    renderLobby();
    setupListeners();
    renderActiveTab();
  });

})();
