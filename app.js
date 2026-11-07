// =============================================================================
//  FORTNITE ESPÍRITUS - GESTOR DE INTERCAMBIOS DE SALA
// =============================================================================

(function () {
  const DB = window.SPRITES_DB;
  if (!DB) {
    console.error("No se encontró SPRITES_DB en window.");
    return;
  }

  function getOwnBaseUrl() {
    if (window.location.origin && window.location.origin !== "null") {
      return window.location.origin + window.location.pathname;
    }
    return window.location.href.split("#")[0].split("?")[0];
  }

  // --- CATÁLOGO DE AVATARES DISPONIBLES (Capítulo 7: Minitemporada + Bóveda C7S4 + Bóveda C7S3) ---
  const C7S3_AVATARS = [
    { key: "C7S3_WATER", name: "Agua (Water)", img: "https://spritelocker.com/sprites/c7s3/water_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_EARTH", name: "Tierra (Earth)", img: "https://spritelocker.com/sprites/c7s3/earth_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_FIRE", name: "Fuego (Fire)", img: "https://spritelocker.com/sprites/c7s3/fire_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_FISHY", name: "Pescadito (Fishy)", img: "https://spritelocker.com/sprites/c7s3/fishy_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_AIR", name: "Aire (Air)", img: "https://spritelocker.com/sprites/c7s3/air_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_DUCK", name: "Pato (Duck)", img: "https://spritelocker.com/sprites/c7s3/duck_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_GHOST", name: "Fantasma (Ghost)", img: "https://spritelocker.com/sprites/c7s3/ghost_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_DEMON", name: "Demonio (Demon)", img: "https://spritelocker.com/sprites/c7s3/demon_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_KING", name: "Rey (King)", img: "https://spritelocker.com/sprites/c7s3/king_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_AURA", name: "Aura (Drifter)", img: "https://spritelocker.com/sprites/c7s3/drifter_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_STRIKER", name: "Delantero (Striker)", img: "https://spritelocker.com/sprites/c7s3/soccer_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_DREAM", name: "Sueño (Dream)", img: "https://spritelocker.com/sprites/c7s3/dream_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_PUNK", name: "Punk", img: "https://spritelocker.com/sprites/c7s3/punk_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_BOSS", name: "Jefe (Boss)", img: "https://spritelocker.com/sprites/c7s3/boss_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_SEVEN", name: "Los Siete (Seven)", img: "https://spritelocker.com/sprites/c7s3/seven_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_PEELY", name: "Bananín Espía (Peeky Peely)", img: "https://spritelocker.com/sprites/c7s3/peely_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_LLAMA", name: "Llama de Botín (Lootin' Llama)", img: "https://spritelocker.com/sprites/c7s3/llama_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_BATMAN", name: "Batman", img: "https://spritelocker.com/sprites/c7s3/fossilmeal_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_GRIMREAPER", name: "Parca (Grim Reaper)", img: "https://spritelocker.com/sprites/c7s3/grimreaper_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_ZEROPOINT", name: "Punto Cero (Zero Point)", img: "https://spritelocker.com/sprites/c7s3/zeropoint_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_BURNTPEANUT", name: "Cacahuate Quemado (Burnt Peanut)", img: "https://spritelocker.com/sprites/c7s3/theburntpeanut_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_VINIJR", name: "Vini Jr.", img: "https://spritelocker.com/sprites/c7s3/cokeparmesan_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_POLLO", name: "Pollo", img: "https://spritelocker.com/sprites/c7s3/companystargazer_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_JOHNWICK", name: "John Wick", img: "https://spritelocker.com/sprites/c7s3/fillergrunt_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" },
    { key: "C7S3_IRONMOUSE", name: "Ironmouse", img: "https://spritelocker.com/sprites/c7s3/pedicureantacid_basic.webp", season: "Cap. 7 Temp. 3", seasonKey: "c7s3" }
  ];

  function getAvatarCatalog() {
    const list = [];
    const seen = new Set();

    // 1. Minitemporada actual
    (DB.sprites || []).forEach(s => {
      const normCell = (DB.cells || []).find(c => c.spriteKey === s.key && c.variantKey === 'NORMAL')
        || (DB.cells || []).find(c => c.spriteKey === s.key);
      const img = normCell?.imageUrl || (normCell?.image ? `https://spritelocker.com${normCell.image}` : '');
      list.push({
        key: s.key,
        name: s.name_es || s.name_en || s.key,
        img,
        season: "Minitemporada actual",
        seasonKey: "c7ms"
      });
      seen.add(s.key);
    });

    // 2. Bóveda Cap. 7 Temp. 4
    const vaultC7S4 = DB.vault && DB.vault.c7s4 ? DB.vault.c7s4 : null;
    if (vaultC7S4 && Array.isArray(vaultC7S4.sprites)) {
      vaultC7S4.sprites.forEach(s => {
        if (seen.has(s.key)) return;
        const normCell = (vaultC7S4.cells || []).find(c => c.spriteKey === s.key && c.variantKey === 'NORMAL')
          || (vaultC7S4.cells || []).find(c => c.spriteKey === s.key);
        const img = normCell?.imageUrl || (normCell?.image ? `https://spritelocker.com${normCell.image}` : '');
        list.push({
          key: s.key,
          name: s.name_es || s.name_en || s.key,
          img,
          season: "Bóveda Cap. 7 (T4)",
          seasonKey: "c7s4"
        });
        seen.add(s.key);
      });
    }

    // 3. Bóveda Cap. 7 Temp. 3
    C7S3_AVATARS.forEach(s => {
      if (seen.has(s.key)) return;
      list.push(s);
      seen.add(s.key);
    });

    return list;
  }

  function getAvatarInfo(avatarKey) {
    const catalog = getAvatarCatalog();
    if (!avatarKey) return catalog[0] || null;
    return catalog.find(a => a.key === avatarKey) || catalog[0] || null;
  }

  const STORAGE_KEY = "fortnite_sprites_players_c7ms_v1";
  const LOCKER_CACHE_STORAGE_KEY = "fortnite_sprites_lockers_cache_v1";

  function isValidLockerId(id) {
    return typeof id === "string" && /^[a-zA-Z0-9_-]{4,40}$/.test(id);
  }

  function generateLockerId() {
    return "k-" + Math.random().toString(36).substring(2, 10);
  }

  function getPersonalLockerUrl(lockerId) {
    if (!lockerId || !isValidLockerId(lockerId)) {
      return `${getOwnBaseUrl()}#c=5.AAAAAAAAAAAAAAAAAAAA`;
    }
    return `${getOwnBaseUrl()}#casillero=${lockerId}`;
  }

  function getLocalLockersMap() {
    try {
      const raw = localStorage.getItem(LOCKER_CACHE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") return parsed;
      }
    } catch (_) {}
    return {};
  }

  function getLocalLocker(lockerId) {
    if (!isValidLockerId(lockerId)) return null;
    const map = getLocalLockersMap();
    return map[lockerId] || null;
  }

  function saveLocalLocker(lockerId, data) {
    if (!isValidLockerId(lockerId) || !data) return;
    try {
      const map = getLocalLockersMap();
      map[lockerId] = {
        id: lockerId,
        name: String(data.name || "Jugador").slice(0, 60),
        avatar: String(data.avatar || "HALFPEELD").slice(0, 40),
        url: String(data.url || ""),
        code: String(data.code || ""),
        seasonKey: String(data.seasonKey || (DB.season?.key || DB.season || "c7ms")).slice(0, 20),
        updatedAt: Number(data.updatedAt) || Date.now()
      };
      localStorage.setItem(LOCKER_CACHE_STORAGE_KEY, JSON.stringify(map));
    } catch (_) {}
  }

  // Jugadores iniciales por defecto: Sala inicial limpia con un solo jugador editable
  const DEFAULT_PLAYERS = [
    {
      id: "p1",
      lockerId: "k-p1default",
      name: "Jugador 1",
      avatar: "HALFPEELD",
      url: `${getOwnBaseUrl()}#c=5.AAAAAAAAAAAAAAAAAAAA`
    }
  ];

  // Estado de la aplicación
  let state = {
    mode: "room", // 'room' | 'locker'
    players: [],
    currentTab: "chain", // 'chain', 'matrix', 'versus', 'missing', 'vault'
    filterRarity: "all",
    filterVariant: "all",
    versusA: null,
    versusB: null
  };

  // --- FUNCIONES DE DECODIFICACIÓN ---
  function extractCodeOrToken(urlOrCode) {
    if (!urlOrCode) return null;
    let t = urlOrCode.trim();

    // 0. Detectar link personal de casillero: #casillero=ID o ?casillero=ID
    let lockerMatch = t.match(/(?:^|[#?&])(?:casillero|locker)=([a-zA-Z0-9_-]{4,40})/);
    if (lockerMatch && isValidLockerId(lockerMatch[1])) {
      let fallbackCode = null;
      let hashIdx = t.indexOf("#");
      if (hashIdx !== -1) {
        let params = new URLSearchParams(t.slice(hashIdx + 1));
        fallbackCode = params.get("c") || params.get("vs") || null;
      }
      return { type: "locker", lockerId: lockerMatch[1], value: fallbackCode };
    }

    // 1. Detectar token en vivo de SpriteLocker: ?p=TOKEN o /share/TOKEN
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

    // 3. Si escribieron directamente un lockerId k-xxxx
    if (/^k-[a-zA-Z0-9_-]{2,38}$/.test(t)) {
      return { type: "locker", lockerId: t, value: null };
    }

    // 4. Código directo
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

  function setBit(bytes, idx) {
    let byteIdx = idx >> 3;
    if (byteIdx >= bytes.length) return;
    bytes[byteIdx] |= (1 << (idx & 7));
  }

  function b64UrlEncode(bytes) {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function encodeCollection(col) {
    let cells = DB.cells_v5_24 || DB.cells;
    let numCells = cells.length;
    let totalBits = numCells * 6;
    let bytes = new Uint8Array(Math.ceil(totalBits / 8));

    let owned = (col && col.owned) || {};
    let mastered = (col && col.mastered) || {};
    let lost = (col && col.lost) || {};
    let levels = (col && col.levels) || {};

    let offsetMastered = numCells;
    let offsetLost = numCells * 2;
    let offsetLevels = numCells * 3;

    for (let i = 0; i < numCells; i++) {
      let key = cells[i].key;
      let isOwned = !!(owned[key] || mastered[key] || lost[key]);
      if (isOwned) setBit(bytes, i);
      if (mastered[key]) setBit(bytes, offsetMastered + i);
      if (lost[key]) setBit(bytes, offsetLost + i);

      if (isOwned && levels[key] && levels[key] > 1) {
        let lvlBits = Math.min(4, Math.max(0, levels[key] - 1));
        for (let b = 0; b < 3; b++) {
          if (lvlBits & (1 << b)) {
            setBit(bytes, offsetLevels + i * 3 + b);
          }
        }
      }
    }

    let ver = DB.shareVersion || "5";
    return `${getOwnBaseUrl()}#c=${ver}.` + b64UrlEncode(bytes);
  }

  function decodeCollection(codeStr) {
    if (!codeStr) throw new Error("Código vacío");

    let activeKeySet = new Set((DB.cells || []).map(c => c.key));
    let totalTarget = DB.totalCells || (DB.cells ? DB.cells.length : 24);

    // Soporte para formato 3. (JSON en base64url usado por perfiles en vivo de Sprite Locker)
    if (codeStr.startsWith("3.")) {
      let bytes = b64UrlDecode(codeStr.slice(2));
      let jsonStr = new TextDecoder().decode(bytes);
      let parsed = JSON.parse(jsonStr);
      let owned = {};
      let mastered = {};
      let lost = {};
      let levels = {};
      let vaultedOwned = {};

      for (let k of (parsed.o || [])) {
        if (activeKeySet.has(k)) owned[k] = true;
        else vaultedOwned[k] = true;
      }
      for (let k of (parsed.m || [])) {
        if (activeKeySet.has(k)) { mastered[k] = true; owned[k] = true; }
        else vaultedOwned[k] = true;
      }
      for (let k of (parsed.l || [])) {
        if (activeKeySet.has(k)) { lost[k] = true; owned[k] = true; }
        else vaultedOwned[k] = true;
      }
      if (parsed.v && typeof parsed.v === "object") {
        for (let [k, v] of Object.entries(parsed.v)) {
          if (owned[k] && typeof v === "number") {
            levels[k] = Math.min(5, Math.max(1, Math.round(v)));
          }
        }
      }

      let ownedCount = Object.keys(owned).length;
      let percentage = Math.round((ownedCount / totalTarget) * 1000) / 10;
      return {
        version: "3",
        rawCode: codeStr,
        owned,
        mastered,
        lost,
        levels,
        vaultedOwned,
        ownedCount,
        percentage,
        totalCells: totalTarget,
        layoutCells: totalTarget,
        layoutName: "json_v3"
      };
    }

    let version = DB.shareVersion || "5";
    let dataStr = codeStr;
    if (codeStr.includes(".")) {
      let parts = codeStr.split(".");
      version = parts[0];
      dataStr = parts[1];
    }

    let bytes = b64UrlDecode(dataStr);

    // Si es un código v4 (Cap. 7 Temp. 4 - En la Bóveda)
    if (version === "4" || (version !== "5" && bytes.length >= 80)) {
      let v4Cells = DB.cells_v4_162 || (DB.vault && DB.vault.c7s4 ? DB.vault.c7s4.cells : []);
      if (bytes.length < 100 && DB.cells_v4_122) {
        v4Cells = DB.cells_v4_122;
      } else if (bytes.length < 116 && DB.cells_v4_145) {
        v4Cells = DB.cells_v4_145;
      }
      let vaultedOwned = {};
      for (let i = 0; i < v4Cells.length; i++) {
        let key = v4Cells[i].key;
        if (getBit(bytes, i) || getBit(bytes, v4Cells.length + i) || getBit(bytes, v4Cells.length * 2 + i)) {
          vaultedOwned[key] = true;
        }
      }
      return {
        version: "4",
        rawCode: codeStr,
        owned: {},
        mastered: {},
        lost: {},
        levels: {},
        vaultedOwned,
        isVaultedLink: true,
        vaultedCount: Object.keys(vaultedOwned).length,
        vaultedTotal: 162,
        ownedCount: 0,
        percentage: 0,
        totalCells: totalTarget,
        layoutCells: v4Cells.length,
        layoutName: "v4_vaulted"
      };
    }

    // Diseño de celdas de la temporada actual (v5 - Cap. 7 Minitemporada):
    // - 24 celdas activas (Normal + Fortuna): 18 bytes
    // - 34 celdas (con variante Maldito): 26 bytes
    // - 35 celdas (con Chester Maldito): 27 bytes
    let cells = DB.cells_v5_24 || DB.cells;
    let layoutName = "24";
    if (bytes.length === 26 && DB.cells_v5_34) {
      cells = DB.cells_v5_34;
      layoutName = "34";
    } else if (bytes.length >= 27 && DB.cells_v5_35) {
      cells = DB.cells_v5_35;
      layoutName = "35";
    }
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

    let ownedCount = Object.keys(owned).filter(k => activeKeySet.has(k)).length;
    let percentage = Math.round((ownedCount / totalTarget) * 1000) / 10;

    return {
      version,
      rawCode: codeStr,
      owned,
      mastered,
      lost,
      levels,
      ownedCount,
      percentage,
      totalCells: totalTarget,
      layoutCells: numCells,
      layoutName
    };
  }

  function ensurePlayerLockerId(player, roomIdHint = null) {
    if (player.lockerId && isValidLockerId(player.lockerId)) {
      return player.lockerId;
    }
    const baseRoom = (roomIdHint || activeRoomId || "local").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
    const basePid = String(player.id || "p1").replace(/[^a-zA-Z0-9]/g, "").slice(0, 16);
    const derived = `k-${baseRoom}-${basePid}`.slice(0, 38);
    player.lockerId = isValidLockerId(derived) ? derived : generateLockerId();
    return player.lockerId;
  }

  // --- PROCESAMIENTO / ACTUALIZACIÓN DE JUGADOR ---
  async function updatePlayer(player, notify = false) {
    try {
      ensurePlayerLockerId(player);
      let prevCount = player.data ? player.data.ownedCount : null;
      let target = extractCodeOrToken(player.url);
      if (!target) throw new Error("Enlace o código vacío");

      let codeToDecode = null;
      if (target.type === "locker") {
        player.lockerId = target.lockerId;
        const cached = getLocalLocker(target.lockerId);
        if (cached && cached.url) {
          player.name = cached.name || player.name;
          player.avatar = cached.avatar || player.avatar;
          player.updatedAt = cached.updatedAt || player.updatedAt;
          const inner = extractCodeOrToken(cached.url);
          codeToDecode = (inner && inner.value) ? inner.value : (cached.code || "5.AAAAAAAAAAAAAAAAAAAA");
        } else if (target.value) {
          codeToDecode = target.value;
        } else {
          codeToDecode = "5.AAAAAAAAAAAAAAAAAAAA";
        }
      } else if (target.type === "token") {
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
      if (!player.data.isVaultedLink) {
        player.url = encodeCollection(player.data);
      } else {
        player.url = `${getOwnBaseUrl()}#c=${player.data.rawCode}`;
      }
      player.lastUpdated = new Date();
      player.error = null;

      saveLocalLocker(player.lockerId, {
        id: player.lockerId,
        name: player.name,
        avatar: player.avatar || "HALFPEELD",
        url: player.url,
        code: player.data.rawCode || "",
        seasonKey: CURRENT_SEASON_KEY,
        updatedAt: player.updatedAt || Date.now()
      });

      if (notify && prevCount !== null) {
        let total = player.data.totalCells || DB.totalCells || 24;
        let diff = player.data.ownedCount - prevCount;
        if (diff !== 0) {
          let sign = diff > 0 ? `+${diff}` : `${diff}`;
          player.changeBadge = sign;
          showToast(`✨ ¡${player.name} actualizado! ${sign} espíritus (${player.data.ownedCount}/${total})`);
        } else {
          showToast(`✔️ ${player.name} recargado (${player.data.ownedCount}/${total} espíritus sin cambios).`);
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

  // --- CONFIGURACIÓN FIREBASE Y SALAS / CASILLEROS EN VIVO ---
  const ROOM_ID_STORAGE_KEY = "fortnite_sprites_room_id_v1";
  const CURRENT_SEASON_KEY = (typeof DB.season === "string" ? DB.season : DB.season?.key) || "c7ms";
  const FIREBASE_CONFIG = {
    projectId: "espiritus-fortnite-sync",
    appId: "1:814145649301:web:27600e5dd60df959ae399c",
    storageBucket: "espiritus-fortnite-sync.firebasestorage.app",
    apiKey: "AIzaSyBU7O_aFOw-ZwQGkop3dleHIDNJDD_9q9M",
    authDomain: "espiritus-fortnite-sync.firebaseapp.com",
    messagingSenderId: "814145649301"
  };

  let fb = null; // { db, doc, getDoc, setDoc, updateDoc, onSnapshot, deleteField }
  let fbInitPromise = null;
  let activeRoomId = null;
  let unsubscribeRoom = null;
  let cloudRoomReady = false;
  const roomLockerUnsubscribes = new Map(); // lockerId -> unsubscribeFn

  async function ensureFirebase() {
    if (fb) return fb;
    if (fbInitPromise) return fbInitPromise;
    fbInitPromise = (async () => {
      try {
        const [appMod, fsMod] = await Promise.all([
          import("https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js"),
          import("https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js")
        ]);
        const app = appMod.initializeApp(FIREBASE_CONFIG);
        const db = fsMod.getFirestore(app);
        fb = {
          db,
          doc: fsMod.doc,
          getDoc: fsMod.getDoc,
          setDoc: fsMod.setDoc,
          updateDoc: fsMod.updateDoc,
          onSnapshot: fsMod.onSnapshot,
          deleteField: fsMod.deleteField
        };
        return fb;
      } catch (err) {
        console.warn("No se pudo cargar Firebase SDK, operando en modo local:", err);
        fbInitPromise = null;
        return null;
      }
    })();
    return fbInitPromise;
  }

  function isValidRoomId(id) {
    return typeof id === "string" && /^[a-zA-Z0-9_-]{4,40}$/.test(id);
  }

  function generateRoomId() {
    return "s-" + Math.random().toString(36).substring(2, 8);
  }

  function extractRoomIdFromHash() {
    const hash = window.location.hash || "";
    const match = hash.match(/(?:^|[#&])(?:sala|roomId)=([a-zA-Z0-9_-]{4,40})/);
    return match ? match[1] : null;
  }

  function extractPersonalLockerRouteFromHash() {
    const hash = window.location.hash || "";
    if (!hash) return null;
    const lockerMatch = hash.match(/(?:^|[#&])(?:casillero|locker)=([a-zA-Z0-9_-]{4,40})/);
    if (lockerMatch && isValidLockerId(lockerMatch[1])) {
      let params = new URLSearchParams(hash.slice(1));
      return { lockerId: lockerMatch[1], fallbackCode: params.get("c") || params.get("vs") || null };
    }
    // Si pegaron un enlace directo #c=5... en la barra del navegador (y no es #sala= ni #room=)
    if (!hash.includes("sala=") && !hash.includes("room=")) {
      let params = new URLSearchParams(hash.slice(1));
      let codeVal = params.get("c") || params.get("vs");
      if (codeVal) {
        // Buscar si algún jugador local ya tiene este código o usar un lockerId derivado
        const existingPlayer = state.players.find(p => p.data && p.data.rawCode === codeVal);
        const cleanSuffix = codeVal.replace(/[^a-zA-Z0-9]/g, "").slice(-10) || "custom";
        const derivedId = existingPlayer?.lockerId || `k-c-${cleanSuffix}`;
        return { lockerId: derivedId, fallbackCode: codeVal };
      }
    }
    return null;
  }

  function getOrInitRoomId() {
    let fromHash = extractRoomIdFromHash();
    if (fromHash && isValidRoomId(fromHash)) {
      try {
        localStorage.setItem(ROOM_ID_STORAGE_KEY, fromHash);
      } catch (_) {}
      return fromHash;
    }

    try {
      let savedId = localStorage.getItem(ROOM_ID_STORAGE_KEY);
      if (savedId && isValidRoomId(savedId)) {
        return savedId;
      }
    } catch (_) {}

    let newId = generateRoomId();
    try {
      localStorage.setItem(ROOM_ID_STORAGE_KEY, newId);
    } catch (_) {}
    return newId;
  }

  function setRoomHashInUrl(roomId) {
    if (!roomId || state.mode !== "room") return;
    try {
      const targetHash = `#sala=${roomId}`;
      if (window.location.hash !== targetHash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search + targetHash);
      }
    } catch (_) {}
  }

  function updateSyncStatusUI(status, roomId = activeRoomId) {
    const dot = document.getElementById("roomSyncDot");
    const label = document.getElementById("roomSyncLabel");
    if (!dot || !label) return;

    dot.classList.remove("is-connecting", "is-offline");
    const shortCode = roomId ? `#${roomId}` : "";

    if (status === "live") {
      label.textContent = `Sala en vivo ${shortCode}`;
    } else if (status === "connecting") {
      dot.classList.add("is-connecting");
      label.textContent = `Conectando ${shortCode}...`;
    } else {
      dot.classList.add("is-offline");
      label.textContent = `Modo local ${shortCode}`;
    }
  }

  function getShareableRoomUrl() {
    const base = getOwnBaseUrl();
    if (activeRoomId && isValidRoomId(activeRoomId)) {
      return `${base}#sala=${activeRoomId}`;
    }
    let simpleList = state.players.map(p => ({
      n: p.name,
      u: p.url,
      l: p.lockerId,
      a: p.avatar || "HALFPEELD",
      m: p.isManual ? 1 : 0
    }));
    try {
      let jsonStr = JSON.stringify(simpleList);
      let b64 = btoa(unescape(encodeURIComponent(jsonStr))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return `${base}#room=${b64}`;
    } catch (e) {
      console.warn("Error generando enlace de sala:", e);
      return window.location.href;
    }
  }

  function loadLegacyRoomFromUrl() {
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
          return list.map(item => ({
            id: "p_" + Math.random().toString(36).substr(2, 9),
            lockerId: item.l && isValidLockerId(item.l) ? item.l : generateLockerId(),
            name: item.n || "Jugador",
            avatar: item.a || "HALFPEELD",
            url: item.u || "",
            isManual: !!item.m
          }));
        }
      }
    } catch (e) {
      console.warn("No se pudo leer la sala desde la URL:", e);
    }
    return null;
  }

  // --- SINCRONIZACIÓN DE CASILLEROS PERSONALES (lockers/{lockerId}) ---
  async function syncPersonalLockerToCloud(lockerData) {
    if (!lockerData || !isValidLockerId(lockerData.lockerId)) return false;
    const now = Number(lockerData.updatedAt) || Date.now();
    const payload = {
      id: String(lockerData.lockerId).slice(0, 40),
      name: String(lockerData.name || "Jugador").trim().slice(0, 60) || "Jugador",
      avatar: String(lockerData.avatar || "HALFPEELD").slice(0, 40),
      url: String(lockerData.url || encodeCollection({ owned: {} })).slice(0, 500),
      code: String(lockerData.code || "").slice(0, 300),
      seasonKey: String(CURRENT_SEASON_KEY).slice(0, 20),
      updatedAt: now
    };
    saveLocalLocker(lockerData.lockerId, payload);

    const client = await ensureFirebase();
    if (!client) return false;
    try {
      const lockerRef = client.doc(client.db, "lockers", lockerData.lockerId);
      await client.setDoc(lockerRef, payload, { merge: true });
      return true;
    } catch (err) {
      console.warn("Error sincronizando casillero personal en Firestore:", err);
      return false;
    }
  }

  async function syncPlayerPersonalLocker(player) {
    if (!player) return;
    ensurePlayerLockerId(player);
    player.updatedAt = Date.now();
    await syncPersonalLockerToCloud({
      lockerId: player.lockerId,
      name: player.name,
      avatar: player.avatar || "HALFPEELD",
      url: player.url || encodeCollection(player.data || { owned: {} }),
      code: player.data?.rawCode || "",
      updatedAt: player.updatedAt
    });
  }

  async function reloadPlayerLocker(player, notify = true) {
    if (!player) return;
    ensurePlayerLockerId(player);

    // Si es un link en vivo de SpriteLocker, recargarlo directo
    if (player.isLive) {
      await updatePlayer(player, notify);
      saveState({ player });
      updatePlayerCardUI(player);
      renderActiveTab();
      return;
    }

    const prevCount = player.data ? player.data.ownedCount : 0;
    const prevName = player.name;
    const prevAvatar = player.avatar;

    const client = await ensureFirebase();
    let remoteData = null;
    if (client) {
      try {
        const snap = await client.getDoc(client.doc(client.db, "lockers", player.lockerId));
        if (snap.exists()) {
          remoteData = snap.data();
        }
      } catch (err) {
        console.warn("Error consultando casillero personal:", err);
      }
    }

    if (!remoteData) {
      remoteData = getLocalLocker(player.lockerId);
    }

    if (remoteData && remoteData.url) {
      player.name = remoteData.name || player.name;
      player.avatar = remoteData.avatar || player.avatar || "HALFPEELD";
      player.url = remoteData.url;
      player.updatedAt = remoteData.updatedAt || Date.now();
      await updatePlayer(player, false);

      const newCount = player.data ? player.data.ownedCount : 0;
      const total = player.data?.totalCells || DB.totalCells || 24;
      const diff = newCount - prevCount;

      if (notify) {
        if (diff !== 0) {
          const sign = diff > 0 ? `+${diff}` : `${diff}`;
          player.changeBadge = sign;
          showToast(`✨ ¡${player.name} actualizado! ${sign} espíritus (${newCount}/${total})`);
        } else if (player.name !== prevName || player.avatar !== prevAvatar) {
          showToast(`✨ ¡Perfil de ${player.name} actualizado (${newCount}/${total})!`);
        } else {
          showToast(`✔️ ${player.name} está al día (${newCount}/${total} espíritus).`);
        }
      }

      saveState({ player, skipLockerCloud: true });
      updatePlayerCardUI(player);
      const card = document.getElementById(`card_${player.id}`);
      const nameInput = card?.querySelector(".player-name-input");
      if (nameInput && document.activeElement !== nameInput) {
        nameInput.value = player.name;
      }
      if (card) {
        card.classList.add("is-updated");
        setTimeout(() => card.classList.remove("is-updated"), 1200);
      }
      renderActiveTab();
    } else {
      // Si aún no existía en la nube, lo subimos ahora
      await syncPlayerPersonalLocker(player);
      if (notify) {
        const count = player.data ? player.data.ownedCount : 0;
        const total = player.data?.totalCells || DB.totalCells || 24;
        showToast(`☁️ Casillero de ${player.name} sincronizado (${count}/${total}).`);
      }
    }
  }

  function clearRoomLockerSubscriptions() {
    for (const unsub of roomLockerUnsubscribes.values()) {
      try { unsub(); } catch (_) {}
    }
    roomLockerUnsubscribes.clear();
  }

  async function syncRoomLockerSubscriptions() {
    if (state.mode !== "room") {
      clearRoomLockerSubscriptions();
      return;
    }
    const client = await ensureFirebase();
    if (!client) return;

    const neededLockerIds = new Set(
      state.players
        .map(p => ensurePlayerLockerId(p))
        .filter(id => isValidLockerId(id))
    );

    // Eliminar suscripciones de jugadores que ya no están en la sala
    for (const [lockerId, unsub] of roomLockerUnsubscribes.entries()) {
      if (!neededLockerIds.has(lockerId)) {
        try { unsub(); } catch (_) {}
        roomLockerUnsubscribes.delete(lockerId);
      }
    }

    // Suscribirse en tiempo real a cada casillero personal presente en la sala abierta
    for (const lockerId of neededLockerIds) {
      if (roomLockerUnsubscribes.has(lockerId)) continue;

      const lockerRef = client.doc(client.db, "lockers", lockerId);
      let isInitialLockerSnap = true;

      const unsub = client.onSnapshot(
        lockerRef,
        async (snap) => {
          const matchingPlayers = state.players.filter(p => p.lockerId === lockerId);
          if (matchingPlayers.length === 0) return;

          if (!snap.exists()) {
            // Inicializar el casillero en la nube con los datos actuales del jugador
            await syncPlayerPersonalLocker(matchingPlayers[0]);
            isInitialLockerSnap = false;
            return;
          }

          const remote = snap.data();
          if (!remote || !remote.url) {
            isInitialLockerSnap = false;
            return;
          }

          saveLocalLocker(lockerId, remote);
          let anyChanged = false;

          for (const player of matchingPlayers) {
            // Si el jugador local tiene un cambio más reciente aún no propagado, empujarlo al casillero
            if (player.updatedAt && remote.updatedAt && remote.updatedAt < player.updatedAt) {
              await syncPlayerPersonalLocker(player);
              continue;
            }

            const urlChanged = player.url !== remote.url;
            const nameChanged = player.name !== (remote.name || player.name);
            const avatarChanged = (player.avatar || "HALFPEELD") !== (remote.avatar || "HALFPEELD");

            if (!urlChanged && !nameChanged && !avatarChanged) {
              player.updatedAt = remote.updatedAt || player.updatedAt;
              continue;
            }

            const prevCount = player.data ? player.data.ownedCount : null;
            player.name = remote.name || player.name;
            player.avatar = remote.avatar || player.avatar || "HALFPEELD";
            player.url = remote.url;
            player.updatedAt = remote.updatedAt || Date.now();

            if (urlChanged || !player.data) {
              await updatePlayer(player, false);
            }

            if (!isInitialLockerSnap && prevCount !== null && player.data) {
              const diff = player.data.ownedCount - prevCount;
              const total = player.data.totalCells || DB.totalCells || 24;
              if (diff !== 0) {
                const sign = diff > 0 ? `+${diff}` : `${diff}`;
                player.changeBadge = sign;
                showToast(`✨ ¡Casillero de ${player.name} actualizado en vivo! ${sign} espíritus (${player.data.ownedCount}/${total})`);
              }
            }

            updatePlayerCardUI(player);
            const card = document.getElementById(`card_${player.id}`);
            const nameInput = card?.querySelector(".player-name-input");
            if (nameInput && document.activeElement !== nameInput) {
              nameInput.value = player.name;
            }
            if (card && !isInitialLockerSnap) {
              card.classList.add("is-updated");
              setTimeout(() => card.classList.remove("is-updated"), 1200);
            }
            anyChanged = true;
          }

          if (anyChanged) {
            saveLocalOnly();
            renderActiveTab();
            // Reflejar también la última foto dentro del documento de la sala activa
            if (cloudRoomReady && activeRoomId) {
              syncFullRoomToCloud();
            }
          }
          isInitialLockerSnap = false;
        },
        (err) => {
          console.warn(`Error en suscripción del casillero ${lockerId}:`, err);
        }
      );

      roomLockerUnsubscribes.set(lockerId, unsub);
    }
  }

  // --- PERSISTENCIA LOCAL Y NUBE (FIRESTORE) ---
  function saveLocalOnly() {
    let payload = state.players.map(p => ({
      id: p.id,
      lockerId: ensurePlayerLockerId(p),
      name: p.name,
      avatar: p.avatar || "HALFPEELD",
      url: p.url,
      isManual: !!p.isManual,
      updatedAt: p.updatedAt || Date.now()
    }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("No se pudo guardar en LocalStorage:", e);
    }
  }

  function buildPlayersMapFromState() {
    const map = {};
    state.players.slice(0, 30).forEach((p, idx) => {
      const safeId = String(p.id || ("p_" + idx)).replace(/[^a-zA-Z0-9_-]/g, "_");
      map[safeId] = {
        id: safeId,
        lockerId: String(ensurePlayerLockerId(p)).slice(0, 40),
        name: String(p.name || "Jugador").slice(0, 60),
        avatar: String(p.avatar || "HALFPEELD").slice(0, 40),
        url: String(p.url || ""),
        isManual: Boolean(p.isManual),
        order: idx,
        updatedAt: Number(p.updatedAt) || Date.now()
      };
    });
    return map;
  }

  async function syncFullRoomToCloud() {
    if (!fb || !activeRoomId || !cloudRoomReady) return;
    try {
      const roomRef = fb.doc(fb.db, "rooms", activeRoomId);
      await fb.setDoc(roomRef, {
        seasonKey: CURRENT_SEASON_KEY,
        players: buildPlayersMapFromState(),
        updatedAt: Date.now()
      });
      updateSyncStatusUI("live", activeRoomId);
    } catch (err) {
      console.warn("Error sincronizando sala completa en Firestore:", err);
      updateSyncStatusUI("offline", activeRoomId);
    }
  }

  async function syncPlayerToCloud(player) {
    if (!fb || !activeRoomId || !cloudRoomReady || !player) return;
    try {
      const idx = state.players.findIndex(p => p.id === player.id);
      const safeId = String(player.id).replace(/[^a-zA-Z0-9_-]/g, "_");
      const roomRef = fb.doc(fb.db, "rooms", activeRoomId);
      await fb.setDoc(roomRef, {
        seasonKey: CURRENT_SEASON_KEY,
        updatedAt: Date.now(),
        players: {
          [safeId]: {
            id: safeId,
            lockerId: String(ensurePlayerLockerId(player)).slice(0, 40),
            name: String(player.name || "Jugador").slice(0, 60),
            avatar: String(player.avatar || "HALFPEELD").slice(0, 40),
            url: String(player.url || ""),
            isManual: Boolean(player.isManual),
            order: idx >= 0 ? idx : state.players.length,
            updatedAt: Number(player.updatedAt) || Date.now()
          }
        }
      }, { merge: true });
      updateSyncStatusUI("live", activeRoomId);
    } catch (err) {
      console.warn("Error sincronizando jugador en Firestore:", err);
      await syncFullRoomToCloud();
    }
  }

  function saveState(options = {}) {
    if (options.player && !options.skipLockerCloud) {
      options.player.updatedAt = Date.now();
      syncPlayerPersonalLocker(options.player);
    }
    saveLocalOnly();
    if (options.skipCloud) return;
    if (options.player) {
      syncPlayerToCloud(options.player);
    } else {
      syncFullRoomToCloud();
    }
  }

  function loadSavedState() {
    let fromUrl = loadLegacyRoomFromUrl();
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

  async function applyRemotePlayersSnapshot(playersMap) {
    const entries = Object.values(playersMap || {})
      .filter(item => item && typeof item === "object" && item.id)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    if (entries.length === 0) return;

    const sameStructure =
      entries.length === state.players.length &&
      entries.every((item, i) => state.players[i] && state.players[i].id === item.id);

    const hasAnyDiff = !sameStructure || entries.some((item, i) => {
      const cur = state.players[i];
      return !cur ||
        cur.name !== item.name ||
        cur.url !== item.url ||
        (cur.lockerId || "") !== (item.lockerId || cur.lockerId || "") ||
        (cur.avatar || "HALFPEELD") !== (item.avatar || "HALFPEELD") ||
        Boolean(cur.isManual) !== Boolean(item.isManual);
    });

    if (!hasAnyDiff) {
      syncRoomLockerSubscriptions();
      return;
    }

    if (sameStructure) {
      // Actualización suave en sitio sin destruir inputs activos
      for (let i = 0; i < entries.length; i++) {
        const remote = entries[i];
        const local = state.players[i];
        const urlChanged = local.url !== (remote.url || "");
        const nameChanged = local.name !== (remote.name || "Jugador");
        const avatarChanged = (local.avatar || "HALFPEELD") !== (remote.avatar || "HALFPEELD");
        const lockerIdChanged = remote.lockerId && isValidLockerId(remote.lockerId) && local.lockerId !== remote.lockerId;

        local.name = remote.name || "Jugador";
        local.avatar = remote.avatar || "HALFPEELD";
        local.url = remote.url || "";
        local.isManual = Boolean(remote.isManual);
        local.updatedAt = Number(remote.updatedAt) || local.updatedAt || Date.now();
        if (lockerIdChanged) {
          local.lockerId = remote.lockerId;
        } else {
          ensurePlayerLockerId(local);
        }

        if (urlChanged) {
          await updatePlayer(local, true);
        }
        if (urlChanged || nameChanged || avatarChanged || lockerIdChanged) {
          updatePlayerCardUI(local);
          const card = document.getElementById(`card_${local.id}`);
          const nameInput = card?.querySelector(".player-name-input");
          if (nameInput && document.activeElement !== nameInput) {
            nameInput.value = local.name;
          }
        }
      }
      saveLocalOnly();
      syncRoomLockerSubscriptions();
      renderActiveTab();
      return;
    }

    // Si se agregaron o eliminaron jugadores en la sala remota
    const prevById = {};
    state.players.forEach(p => { prevById[p.id] = p; });

    state.players = entries.map(item => {
      const pObj = {
        id: item.id,
        lockerId: item.lockerId && isValidLockerId(item.lockerId) ? item.lockerId : prevById[item.id]?.lockerId || null,
        name: item.name || "Jugador",
        avatar: item.avatar || "HALFPEELD",
        url: item.url || "",
        isManual: Boolean(item.isManual),
        updatedAt: Number(item.updatedAt) || Date.now(),
        data: prevById[item.id]?.data || null,
        error: null,
        lastUpdated: new Date()
      };
      ensurePlayerLockerId(pObj);
      return pObj;
    });

    for (let p of state.players) {
      const prev = prevById[p.id];
      const showDiff = Boolean(prev && prev.url !== p.url);
      await updatePlayer(p, showDiff);
    }

    if (state.players.length >= 2) {
      if (!state.versusA || !state.players.some(p => p.id === state.versusA)) {
        state.versusA = state.players[0].id;
      }
      if (!state.versusB || !state.players.some(p => p.id === state.versusB)) {
        state.versusB = state.players[1].id;
      }
    }

    saveLocalOnly();
    renderLobby();
    renderActiveTab();
    syncRoomLockerSubscriptions();
  }

  async function connectToRoom(roomId, forceUploadLocal = false) {
    if (!isValidRoomId(roomId)) return;
    activeRoomId = roomId;
    cloudRoomReady = false;
    try {
      localStorage.setItem(ROOM_ID_STORAGE_KEY, roomId);
    } catch (_) {}
    setRoomHashInUrl(roomId);
    updateSyncStatusUI("connecting", roomId);

    if (unsubscribeRoom) {
      try { unsubscribeRoom(); } catch (_) {}
      unsubscribeRoom = null;
    }

    const client = await ensureFirebase();
    if (!client) {
      updateSyncStatusUI("offline", roomId);
      return;
    }

    const roomRef = client.doc(client.db, "rooms", roomId);
    let isFirstSnapshot = true;

    unsubscribeRoom = client.onSnapshot(
      roomRef,
      async (snapshot) => {
        updateSyncStatusUI("live", roomId);
        if (!snapshot.exists() || forceUploadLocal) {
          forceUploadLocal = false;
          cloudRoomReady = true;
          await syncFullRoomToCloud();
          for (const p of state.players) {
            await syncPlayerPersonalLocker(p);
          }
          syncRoomLockerSubscriptions();
          isFirstSnapshot = false;
          return;
        }

        const data = snapshot.data();
        cloudRoomReady = true;
        if (data && data.players && Object.keys(data.players).length > 0) {
          await applyRemotePlayersSnapshot(data.players);
        } else if (isFirstSnapshot) {
          await syncFullRoomToCloud();
        }
        syncRoomLockerSubscriptions();
        isFirstSnapshot = false;
      },
      (err) => {
        console.warn("Error en suscripción de sala Firestore:", err);
        updateSyncStatusUI("offline", roomId);
      }
    );
  }

  // --- ESTADO Y LÓGICA DE LA VISTA EXCLUSIVA DE CASILLERO PERSONAL (#casillero=...) ---
  let personalViewState = {
    lockerId: null,
    name: "Jugador",
    avatar: "HALFPEELD",
    owned: {},
    mastered: {},
    lost: {},
    levels: {},
    updatedAt: 0,
    unsubscribe: null,
    debounceTimer: null,
    dirty: false
  };

  function updatePersonalSyncBadgeUI(status, lockerId = personalViewState.lockerId) {
    const dot = document.getElementById("personalSyncDot");
    const label = document.getElementById("personalSyncLabel");
    if (!dot || !label) return;

    dot.classList.remove("is-connecting", "is-offline");
    const shortId = lockerId ? `#${lockerId}` : "";

    if (status === "live") {
      label.textContent = `Casillero en vivo ${shortId}`;
    } else if (status === "saving") {
      dot.classList.add("is-connecting");
      label.textContent = `Guardando ${shortId}...`;
    } else if (status === "connecting") {
      dot.classList.add("is-connecting");
      label.textContent = `Sincronizando ${shortId}...`;
    } else {
      dot.classList.add("is-offline");
      label.textContent = `Modo local ${shortId}`;
    }
  }

  function setPersonalAutoSaveNote(text, color = "#8ee8dc") {
    const noteEl = document.getElementById("personalAutoSaveNote");
    if (!noteEl) return;
    noteEl.textContent = text;
    noteEl.style.color = color;
  }

  function getPersonalEncodedUrl() {
    return encodeCollection({
      owned: personalViewState.owned,
      mastered: personalViewState.mastered,
      lost: personalViewState.lost,
      levels: personalViewState.levels
    });
  }

  async function flushPersonalLockerSave() {
    if (personalViewState.debounceTimer) {
      clearTimeout(personalViewState.debounceTimer);
      personalViewState.debounceTimer = null;
    }
    if (!personalViewState.lockerId) return;

    personalViewState.dirty = false;
    personalViewState.updatedAt = Date.now();
    const encodedUrl = getPersonalEncodedUrl();
    let decoded = null;
    try {
      const t = extractCodeOrToken(encodedUrl);
      decoded = decodeCollection(t ? t.value : "");
    } catch (_) {}

    updatePersonalSyncBadgeUI("saving", personalViewState.lockerId);
    setPersonalAutoSaveNote("⏳ Guardando cambios en la nube...", "#ffd070");

    // Si este casillero pertenece a algún jugador guardado localmente en la sala de este navegador, actualizarlo también
    let matchedLocalPlayer = false;
    for (const p of state.players) {
      if (p.lockerId === personalViewState.lockerId) {
        p.name = personalViewState.name || "Jugador";
        p.avatar = personalViewState.avatar || "HALFPEELD";
        p.url = encodedUrl;
        p.updatedAt = personalViewState.updatedAt;
        p.data = decoded || p.data;
        matchedLocalPlayer = true;
      }
    }
    if (matchedLocalPlayer) {
      saveLocalOnly();
    }

    const ok = await syncPersonalLockerToCloud({
      lockerId: personalViewState.lockerId,
      name: personalViewState.name,
      avatar: personalViewState.avatar,
      url: encodedUrl,
      code: decoded?.rawCode || "",
      updatedAt: personalViewState.updatedAt
    });

    if (ok) {
      updatePersonalSyncBadgeUI("live", personalViewState.lockerId);
      setPersonalAutoSaveNote("✅ Guardado en la nube · Todas tus salas abiertas han sido actualizadas.", "#3fe06b");
    } else {
      updatePersonalSyncBadgeUI("offline", personalViewState.lockerId);
      setPersonalAutoSaveNote("💾 Guardado localmente en este navegador.", "#ffd070");
    }
  }

  function schedulePersonalLockerSave() {
    if (!personalViewState.lockerId) return;
    personalViewState.dirty = true;
    personalViewState.updatedAt = Date.now();

    const encodedUrl = getPersonalEncodedUrl();
    saveLocalLocker(personalViewState.lockerId, {
      id: personalViewState.lockerId,
      name: personalViewState.name,
      avatar: personalViewState.avatar,
      url: encodedUrl,
      code: "",
      seasonKey: CURRENT_SEASON_KEY,
      updatedAt: personalViewState.updatedAt
    });

    setPersonalAutoSaveNote("⏳ Agrupando cambios para guardar...", "#ffd070");
    if (personalViewState.debounceTimer) {
      clearTimeout(personalViewState.debounceTimer);
    }
    personalViewState.debounceTimer = setTimeout(() => {
      flushPersonalLockerSave();
    }, 550);
  }

  function getFilteredPersonalCells() {
    const searchVal = (document.getElementById("personalSearchInput")?.value || "").trim().toLowerCase();
    const variantVal = document.getElementById("personalVariantFilter")?.value || "all";
    const statusVal = document.getElementById("personalStatusFilter")?.value || "all";

    return DB.cells.filter(cell => {
      if (variantVal !== "all" && cell.variantKey !== variantVal) return false;
      const isOwned = !!personalViewState.owned[cell.key];
      if (statusVal === "owned" && !isOwned) return false;
      if (statusVal === "missing" && isOwned) return false;
      if (searchVal) {
        const haystack = `${cell.spriteNameEs} ${cell.spriteNameEn} ${cell.variantNameEs} ${cell.variantNameEn} ${cell.rarityEs}`.toLowerCase();
        if (!haystack.includes(searchVal)) return false;
      }
      return true;
    });
  }

  function renderPersonalLockerView() {
    const nameInput = document.getElementById("personalPlayerNameInput");
    if (nameInput && document.activeElement !== nameInput) {
      nameInput.value = personalViewState.name || "Jugador";
    }

    const linkInput = document.getElementById("personalLinkInput");
    if (linkInput) {
      linkInput.value = getPersonalLockerUrl(personalViewState.lockerId);
    }

    const avatarBtn = document.getElementById("btnPersonalAvatar");
    const avatarInfo = getAvatarInfo(personalViewState.avatar);
    if (avatarBtn) {
      avatarBtn.innerHTML = `
        ${avatarInfo?.img ? `<img src="${escapeHtml(avatarInfo.img)}" alt="${escapeHtml(avatarInfo.name)}" class="player-avatar-img" referrerpolicy="no-referrer">` : `<span class="player-avatar-fallback">👻</span>`}
        <span class="player-avatar-edit-badge" aria-hidden="true">✏️</span>
      `;
    }

    const totalCells = DB.totalCells || DB.cells.length || 24;
    const ownedCount = Object.keys(personalViewState.owned).filter(k => personalViewState.owned[k]).length;
    const pct = Math.round((ownedCount / totalCells) * 1000) / 10;

    const badgeEl = document.getElementById("personalCountBadge");
    if (badgeEl) {
      badgeEl.textContent = `${ownedCount}/${totalCells} (${pct}%)`;
    }

    const fillEl = document.getElementById("personalProgressFill");
    if (fillEl) {
      fillEl.style.width = `${pct}%`;
    }

    const gridEl = document.getElementById("personalSpritesGrid");
    if (!gridEl) return;

    const rarityColors = {
      Rare: '#3aa0ff',
      Epic: '#b34dff',
      Legendary: '#f5a623',
      Mythic: '#ff4d4d'
    };

    const filtered = getFilteredPersonalCells();
    if (filtered.length === 0) {
      gridEl.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">No se encontraron espíritus con ese filtro.</div>`;
      return;
    }

    gridEl.innerHTML = filtered.map(cell => {
      const isOwned = !!personalViewState.owned[cell.key];
      const rarityColor = rarityColors[cell.rarity] || '#fff';
      const imgSrc = cell.imageUrl || (cell.image ? `https://spritelocker.com${cell.image}` : '');

      return `
        <div class="locker-cell-card ${isOwned ? 'is-owned' : ''}" data-key="${escapeHtml(cell.key)}" style="border-bottom: 3px solid ${rarityColor};" role="button" tabindex="0" aria-pressed="${isOwned ? 'true' : 'false'}">
          <span class="locker-cell-status">${isOwned ? '✅ TIENE' : '❌ FALTA'}</span>
          <div class="spirit-img-wrap" style="width: 58px; height: 58px; margin-top: 0.5rem;">
            <img src="${imgSrc}" alt="${escapeHtml(cell.spriteNameEs)}" class="spirit-img" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'">
          </div>
          <div class="spirit-name" title="${escapeHtml(cell.spriteNameEs)}">${escapeHtml(cell.spriteNameEs)}</div>
          <div class="spirit-tags" style="margin-bottom: 0;">
            <span class="variant-pill" style="border-color: ${rarityColor}; color: #eaf4ff;">${escapeHtml(cell.variantNameEs)}</span>
          </div>
        </div>
      `;
    }).join("");

    const togglePersonalCell = (key) => {
      if (!key) return;
      if (personalViewState.owned[key]) {
        delete personalViewState.owned[key];
        delete personalViewState.mastered[key];
        delete personalViewState.lost[key];
      } else {
        personalViewState.owned[key] = true;
      }
      renderPersonalLockerView();
      schedulePersonalLockerSave();
    };

    gridEl.querySelectorAll(".locker-cell-card").forEach(cardEl => {
      cardEl.addEventListener("click", () => {
        togglePersonalCell(cardEl.getAttribute("data-key"));
      });
      cardEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          togglePersonalCell(cardEl.getAttribute("data-key"));
        } else if (e.key === " ") {
          e.preventDefault();
        }
      });
      cardEl.addEventListener("keyup", (e) => {
        if (e.key === " ") {
          togglePersonalCell(cardEl.getAttribute("data-key"));
        }
      });
    });
  }

  function applyDecodedToPersonalView(name, avatar, urlOrCode, updatedAt = Date.now()) {
    personalViewState.name = name || personalViewState.name || "Jugador";
    personalViewState.avatar = avatar || personalViewState.avatar || "HALFPEELD";
    personalViewState.updatedAt = updatedAt;

    try {
      const target = extractCodeOrToken(urlOrCode);
      const codeStr = target && target.value ? target.value : "5.AAAAAAAAAAAAAAAAAAAA";
      const decoded = decodeCollection(codeStr);
      personalViewState.owned = { ...decoded.owned };
      personalViewState.mastered = { ...decoded.mastered };
      personalViewState.lost = { ...decoded.lost };
      personalViewState.levels = { ...decoded.levels };
    } catch (_) {
      personalViewState.owned = {};
      personalViewState.mastered = {};
      personalViewState.lost = {};
      personalViewState.levels = {};
    }
    document.title = `Casillero de ${personalViewState.name} — Espíritus Fortnite`;
    renderPersonalLockerView();
  }

  async function enterPersonalLockerMode(lockerId, fallbackCode = null) {
    if (!isValidLockerId(lockerId)) {
      lockerId = generateLockerId();
    }

    // Limpiar suscripciones de sala para no gastar lecturas mientras editamos en modo exclusivo
    if (unsubscribeRoom) {
      try { unsubscribeRoom(); } catch (_) {}
      unsubscribeRoom = null;
    }
    clearRoomLockerSubscriptions();

    if (personalViewState.unsubscribe) {
      try { personalViewState.unsubscribe(); } catch (_) {}
      personalViewState.unsubscribe = null;
    }

    state.mode = "locker";
    personalViewState.lockerId = lockerId;

    // Mostrar interfaz exclusiva de Casillero Personal y ocultar Sala
    document.getElementById("roomModeContainer")?.setAttribute("hidden", "");
    document.getElementById("roomHeaderActions")?.setAttribute("hidden", "");
    document.getElementById("personalLockerView")?.removeAttribute("hidden");
    document.getElementById("personalHeaderActions")?.removeAttribute("hidden");

    const subtitleEl = document.getElementById("appSubtitle");
    if (subtitleEl) {
      subtitleEl.textContent = `Editor Exclusivo de Casillero Personal · #${lockerId}`;
    }

    // Asegurar que la barra del navegador muestre el link personal canónico #casillero=<id>
    try {
      const targetHash = `#casillero=${lockerId}`;
      if (window.location.hash !== targetHash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search + targetHash);
      }
    } catch (_) {}

    // Cargar estado inicial desde caché local o jugador local
    const localPlayer = state.players.find(p => p.lockerId === lockerId);
    const cached = getLocalLocker(lockerId);
    if (cached && cached.url) {
      applyDecodedToPersonalView(cached.name, cached.avatar, cached.url, cached.updatedAt);
    } else if (localPlayer) {
      applyDecodedToPersonalView(localPlayer.name, localPlayer.avatar, localPlayer.url, localPlayer.updatedAt);
    } else if (fallbackCode) {
      applyDecodedToPersonalView("Jugador 1", "HALFPEELD", `#c=${fallbackCode}`, Date.now());
    } else {
      applyDecodedToPersonalView("Jugador 1", "HALFPEELD", encodeCollection({ owned: {} }), 0);
    }

    updatePersonalSyncBadgeUI("connecting", lockerId);

    const client = await ensureFirebase();
    if (!client) {
      updatePersonalSyncBadgeUI("offline", lockerId);
      return;
    }

    const lockerRef = client.doc(client.db, "lockers", lockerId);
    let isFirstSnap = true;

    personalViewState.unsubscribe = client.onSnapshot(
      lockerRef,
      async (snap) => {
        if (state.mode !== "locker" || personalViewState.lockerId !== lockerId) return;
        updatePersonalSyncBadgeUI("live", lockerId);

        if (!snap.exists()) {
          if (isFirstSnap) {
            await flushPersonalLockerSave();
          }
          isFirstSnap = false;
          return;
        }

        const remote = snap.data();
        if (!remote || !remote.url) {
          isFirstSnap = false;
          return;
        }

        saveLocalLocker(lockerId, remote);

        // Si el usuario no tiene cambios locales pendientes más recientes, aplicar datos remotos
        if (!personalViewState.dirty && (!personalViewState.updatedAt || (remote.updatedAt && remote.updatedAt >= personalViewState.updatedAt))) {
          applyDecodedToPersonalView(remote.name, remote.avatar, remote.url, remote.updatedAt);
          if (!isFirstSnap) {
            setPersonalAutoSaveNote("🔄 Casillero actualizado en tiempo real desde otra pestaña/sala.", "#3fd0ff");
          }
        }
        isFirstSnap = false;
      },
      (err) => {
        console.warn("Error en suscripción de casillero personal:", err);
        updatePersonalSyncBadgeUI("offline", lockerId);
      }
    );
  }

  async function enterRoomMode(roomId, forceUploadLocal = false) {
    if (personalViewState.dirty) {
      await flushPersonalLockerSave();
    }
    if (personalViewState.unsubscribe) {
      try { personalViewState.unsubscribe(); } catch (_) {}
      personalViewState.unsubscribe = null;
    }

    state.mode = "room";

    document.getElementById("personalLockerView")?.setAttribute("hidden", "");
    document.getElementById("personalHeaderActions")?.setAttribute("hidden", "");
    document.getElementById("roomModeContainer")?.removeAttribute("hidden");
    document.getElementById("roomHeaderActions")?.removeAttribute("hidden");

    const subtitleEl = document.getElementById("appSubtitle");
    if (subtitleEl) {
      subtitleEl.textContent = "Organizador de Intercambios en Cadena · Cap. 7 Minitemporada";
    }
    document.title = `Sala #${roomId} — Organizador de Espíritus Fortnite`;

    renderLobby();
    renderActiveTab();
    await connectToRoom(roomId, forceUploadLocal);
  }

  async function initPlayers() {
    const hadLegacyRoomUrl = Boolean(window.location.hash && window.location.hash.includes("room="));
    let rawList = loadSavedState();
    state.players = rawList.map(p => {
      const obj = {
        id: p.id || "p_" + Math.random().toString(36).substr(2, 9),
        lockerId: p.lockerId && isValidLockerId(p.lockerId) ? p.lockerId : null,
        name: p.name || "Jugador",
        avatar: p.avatar || "HALFPEELD",
        url: p.url || "",
        isManual: !!p.isManual,
        updatedAt: Number(p.updatedAt) || Date.now(),
        data: null,
        error: null,
        lastUpdated: new Date()
      };
      ensurePlayerLockerId(obj);
      return obj;
    });

    for (let p of state.players) {
      await updatePlayer(p);
    }
    saveLocalOnly();

    if (state.players.length >= 2) {
      state.versusA = state.players[0].id;
      state.versusB = state.players[1].id;
    }

    const lockerRoute = extractPersonalLockerRouteFromHash();
    if (lockerRoute) {
      await enterPersonalLockerMode(lockerRoute.lockerId, lockerRoute.fallbackCode);
    } else {
      const initialRoomId = getOrInitRoomId();
      await enterRoomMode(initialRoomId, hadLegacyRoomUrl);
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

  async function applyPersonalLinkToPlayerCard(player, newVal) {
    const trimmed = (newVal || "").trim();
    if (!trimmed) return;

    const target = extractCodeOrToken(trimmed);
    if (!target) return;

    if (target.type === "locker") {
      const newLockerId = target.lockerId;
      const sameLocker = player.lockerId === newLockerId;
      player.lockerId = newLockerId;

      if (target.value && !getLocalLocker(newLockerId)) {
        player.url = `${getOwnBaseUrl()}#c=${target.value}`;
        await updatePlayer(player, false);
      }

      await reloadPlayerLocker(player, sameLocker);
      syncRoomLockerSubscriptions();
      saveState({ player, skipLockerCloud: true });
      renderLobby();
      renderActiveTab();

      if (!sameLocker) {
        const count = player.data ? player.data.ownedCount : 0;
        const total = player.data?.totalCells || DB.totalCells || 24;
        showToast(`🔗 ¡Casillero personal de ${player.name} (${count}/${total}) vinculado a la sala!`);
      }
      return;
    }

    // Si pegaron un código #c=5... o link de SpriteLocker ?p=TOKEN
    if (player.url === trimmed && player.data) return;
    player.url = trimmed;
    player.isManual = false;
    await updatePlayer(player, true);
    saveState({ player });
    updatePlayerCardUI(player);
    renderActiveTab();
  }

  function renderLobby() {
    if (!elLobbyGrid) return;
    elLobbyGrid.innerHTML = "";
    state.players.forEach((player) => {
      ensurePlayerLockerId(player);
      const personalLink = getPersonalLockerUrl(player.lockerId);

      const card = document.createElement("div");
      card.className = "player-card" + (player.error ? " has-error" : "");
      card.id = `card_${player.id}`;

      const count = player.data ? player.data.ownedCount : 0;
      const pct = player.data ? player.data.percentage : 0;
      const totalC = player.data?.totalCells || DB.totalCells || 24;
      const vaultedNote = player.data?.isVaultedLink
        ? `⚠️ Enlace de Cap. 7 Temp. 4 (Bóveda: ${player.data.vaultedCount}/162). Actualiza el link para la Minitemporada.`
        : "";

      const isDefaultPlaceholderName = /^Jugador\s*\d*$/i.test(player.name.trim());
      const avatarInfo = getAvatarInfo(player.avatar);

      card.innerHTML = `
        <div class="player-card-header">
          <div class="player-identity-group">
            <button type="button" class="player-avatar-btn btn-change-avatar" data-id="${player.id}" title="Cambiar avatar de ${escapeHtml(player.name)}">
              ${avatarInfo?.img ? `<img src="${escapeHtml(avatarInfo.img)}" alt="${escapeHtml(avatarInfo.name)}" class="player-avatar-img" referrerpolicy="no-referrer">` : `<span class="player-avatar-fallback">👻</span>`}
              <span class="player-avatar-edit-badge" aria-hidden="true">✏️</span>
            </button>
            <div class="player-name-wrapper">
              <label for="name_input_${player.id}" class="visually-hidden">Nombre del jugador</label>
              <input type="text" id="name_input_${player.id}" class="player-name-input" value="${escapeHtml(player.name)}" placeholder="Escribe tu nombre" data-id="${player.id}" autocorrect="off" autocapitalize="off" spellcheck="false">
              ${isDefaultPlaceholderName ? `<div class="player-name-hint-ribbon">✍️ Haz clic para poner tu nombre</div>` : ''}
            </div>
          </div>
          <div class="player-header-badges">
            ${player.changeBadge ? `<span class="badge-change">${player.changeBadge}</span>` : ''}
            <span class="player-stats-badge stats-badge-${player.id}">${player.error ? '⚠️ Sin Link' : `${count}/${totalC} (${pct}%)`}</span>
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
        <button type="button" class="btn btn-edit-locker btn-open-locker" data-id="${player.id}" title="Abrir y editar el casillero de espíritus">
          <span>✏️ Editar Casillero</span>
        </button>
        <div class="player-link-group">
          <div class="player-link-label-row">
            <label for="link_input_${player.id}">🔗 Link Personal (úsalo en otra sala o navegador):</label>
            <a href="#casillero=${escapeHtml(player.lockerId)}" class="player-personal-id-pill pill-id-${player.id}" title="Abrir página exclusiva para editar solo este casillero">
              #${escapeHtml(player.lockerId)} ↗️
            </a>
          </div>
          <input type="text" id="link_input_${player.id}" class="player-link-input" value="${escapeHtml(personalLink)}" placeholder="Pega aquí tu link personal (#casillero=...)" data-id="${player.id}" autocorrect="off" autocapitalize="off" spellcheck="false">
        </div>
        <div class="player-meta-row">
          <span class="error-msg-${player.id}" style="color: ${player.error ? '#ff8585' : '#ffd070'};">${player.error ? escapeHtml(player.error) : escapeHtml(vaultedNote)}</span>
        </div>
        <div class="player-actions">
          <button type="button" class="btn btn-secondary btn-sm btn-copy" data-id="${player.id}" title="Copiar el link personal de este casillero">📋 Copiar Link</button>
          <button type="button" class="btn btn-primary btn-sm btn-paste" data-id="${player.id}" title="Pegar un link personal de casillero en esta tarjeta">📥 Pegar Link</button>
          <button type="button" class="btn btn-secondary btn-sm btn-reload" data-id="${player.id}" title="Recargar este casillero desde la nube">🔄 Recargar</button>
          <button type="button" class="btn btn-danger btn-sm btn-remove" data-id="${player.id}" title="Quitar jugador de esta sala">Eliminar</button>
        </div>
      `;

      // Evento: Nombre
      const nameInput = card.querySelector(".player-name-input");
      nameInput.addEventListener("change", (e) => {
        player.name = e.target.value.trim() || "Jugador";
        saveState({ player });
        renderLobby();
        renderActiveTab();
      });

      // Evento: Abrir Selector de Avatar
      card.querySelector(".btn-change-avatar")?.addEventListener("click", () => {
        openAvatarModal(player.id);
      });

      // Evento: Editar Casillero
      card.querySelector(".btn-open-locker").addEventListener("click", () => {
        openLockerModal(player.id);
      });

      // Evento: Input del Link Personal
      const linkInput = card.querySelector(".player-link-input");
      linkInput.addEventListener("focus", () => linkInput.select());
      linkInput.addEventListener("change", (e) => applyPersonalLinkToPlayerCard(player, e.target.value));
      linkInput.addEventListener("paste", () => {
        setTimeout(() => applyPersonalLinkToPlayerCard(player, linkInput.value), 50);
      });

      // Botón: Copiar Link Personal
      card.querySelector(".btn-copy").addEventListener("click", async () => {
        ensurePlayerLockerId(player);
        const ownPersonalLink = getPersonalLockerUrl(player.lockerId);
        linkInput.value = ownPersonalLink;
        saveState({ player });
        try {
          await navigator.clipboard.writeText(ownPersonalLink);
          showToast(`📋 ¡Link personal de ${player.name} copiado! Pégalo en otra sala o en tu navegador.`);
        } catch (_) {
          prompt(`Copia el link personal de ${player.name}:`, ownPersonalLink);
        }
      });

      // Botón: Pegar Link Personal
      card.querySelector(".btn-paste").addEventListener("click", async () => {
        let pasted = "";
        if (navigator.clipboard && typeof navigator.clipboard.readText === "function") {
          try {
            pasted = (await navigator.clipboard.readText()) || "";
          } catch (_) {
            pasted = "";
          }
        }
        if (!pasted.trim()) {
          let manual = prompt(`Pega el Link Personal de Casillero para ${player.name}:`, "");
          if (manual !== null) pasted = manual;
        }
        if (pasted && pasted.trim() !== "") {
          await applyPersonalLinkToPlayerCard(player, pasted.trim());
          const updatedCard = document.getElementById(`card_${player.id}`);
          if (updatedCard) {
            updatedCard.classList.add("is-updated");
            setTimeout(() => updatedCard.classList.remove("is-updated"), 1200);
          }
        }
      });

      // Botón: Recargar Casillero
      card.querySelector(".btn-reload").addEventListener("click", async () => {
        await reloadPlayerLocker(player, true);
      });

      // Botón: Eliminar Jugador
      card.querySelector(".btn-remove").addEventListener("click", () => {
        if (state.players.length <= 1) {
          showToast("Debe haber al menos un jugador en la sala.");
          return;
        }
        state.players = state.players.filter(p => p.id !== player.id);
        syncRoomLockerSubscriptions();
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

    ensurePlayerLockerId(player);
    const personalLink = getPersonalLockerUrl(player.lockerId);
    const count = player.data ? player.data.ownedCount : 0;
    const pct = player.data ? player.data.percentage : 0;

    const avatarBtn = card.querySelector(".player-avatar-btn");
    const avatarInfo = getAvatarInfo(player.avatar);
    if (avatarBtn) {
      avatarBtn.innerHTML = `
        ${avatarInfo?.img ? `<img src="${escapeHtml(avatarInfo.img)}" alt="${escapeHtml(avatarInfo.name)}" class="player-avatar-img" referrerpolicy="no-referrer">` : `<span class="player-avatar-fallback">👻</span>`}
        <span class="player-avatar-edit-badge" aria-hidden="true">✏️</span>
      `;
    }

    const badge = card.querySelector(`.stats-badge-${player.id}`);
    if (badge) {
      badge.textContent = player.error ? "⚠️ Sin Link" : `${count}/${player.data?.totalCells || DB.totalCells || 24} (${pct}%)`;
    }

    const pillId = card.querySelector(`.pill-id-${player.id}`);
    if (pillId) {
      pillId.href = `#casillero=${player.lockerId}`;
      pillId.textContent = `#${player.lockerId} ↗️`;
    }

    const linkInput = card.querySelector(".player-link-input");
    if (linkInput && document.activeElement !== linkInput && linkInput.value !== personalLink) {
      linkInput.value = personalLink;
    }

    const pctLabel = card.querySelector(`.progress-pct-${player.id}`);
    if (pctLabel) pctLabel.textContent = `${pct}%`;

    const fill = card.querySelector(`.progress-fill-${player.id}`);
    if (fill) fill.style.width = `${pct}%`;

    const errMsg = card.querySelector(`.error-msg-${player.id}`);
    if (errMsg) {
      const vaultedNote = player.data?.isVaultedLink
        ? `⚠️ Enlace de Cap. 7 Temp. 4 (Bóveda: ${player.data.vaultedCount}/162). Actualiza el link para la Minitemporada.`
        : "";
      errMsg.style.color = player.error ? "#ff8585" : "#ffd070";
      errMsg.textContent = player.error ? player.error : vaultedNote;
    }

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
    if (state.mode !== "room" || !elMainContent) return;
    if (state.currentTab === "vault") {
      renderVaultTab();
      return;
    }

    const validPlayers = getSortedPlayers();
    if (validPlayers.length < 2) {
      elMainContent.innerHTML = `
        <div class="panel" style="text-align: center; padding: 2.5rem;">
          <h3 style="color: #ffd070; margin-bottom: 0.5rem;">⚠️ Se necesitan al menos 2 jugadores con enlaces válidos</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            Añade a otro jugador o usa el botón <strong>📥 Entrar con Link Personal</strong> para calcular la fila de intercambios.
          </p>
        </div>
      `;
      return;
    }

    if (state.currentTab === "chain") {
      renderChainTab(validPlayers);
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
              <span style="color: var(--accent-cyan); font-size: 0.75rem;">(${p.data.ownedCount}/${p.data.totalCells || DB.totalCells || 24})</span>
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
                ${gives.map(c => renderSpiritItem(c, { donor, recipient })).join("")}
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
                  ${returns.map(c => renderSpiritItem(c, { donor: recipient, recipient: donor })).join("")}
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
            ${players.map(p => `<option value="${p.id}" ${p.id === pA.id ? 'selected' : ''}>${escapeHtml(p.name)} (${p.data.ownedCount}/${p.data.totalCells || DB.totalCells || 24})</option>`).join("")}
          </select>
          <div class="versus-badge">VS</div>
          <select id="selVersusB" class="versus-select">
            ${players.map(p => `<option value="${p.id}" ${p.id === pB.id ? 'selected' : ''}>${escapeHtml(p.name)} (${p.data.ownedCount}/${p.data.totalCells || DB.totalCells || 24})</option>`).join("")}
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
                ${aGivesB.map(c => renderSpiritItem(c, { donor: pA, recipient: pB })).join("")}
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
                ${bGivesA.map(c => renderSpiritItem(c, { donor: pB, recipient: pA })).join("")}
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
            ${missingList.map(c => renderSpiritItem(c, { missingPlayers: players })).join("")}
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

  // --- TAB 5: BÓVEDA (ROSTER ANTERIOR C7S4) ---
  function renderVaultTab() {
    const vaultC7S4 = DB.vault && DB.vault.c7s4 ? DB.vault.c7s4 : null;
    const vaultCells = vaultC7S4 ? vaultC7S4.cells : (DB.cells_v4_162 || []);
    const vaultSprites = vaultC7S4 ? vaultC7S4.sprites : [];

    let html = `
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">🗄️ Bóveda de Espíritus — Capítulo 7 Temporada 4 (${vaultSprites.length} espíritus · ${vaultCells.length} variantes)</div>
            <div class="panel-desc">Roster completo de la temporada anterior enviado a la bóveda con la llegada de la Minitemporada del Capítulo 7.</div>
          </div>
        </div>

        <div class="locker-filters-row" style="margin-bottom: 1.2rem;">
          <input type="search" id="vaultSearchInput" class="locker-filter-input" placeholder="🔎 Buscar en la bóveda (ej. Arbusto, Klombo, Corona, Sonic, Miel)...">
          <select id="vaultVariantFilter" class="locker-filter-select">
            <option value="all">🎨 Todas las variantes (${vaultCells.length})</option>
            <option value="NORMAL">Normal (27)</option>
            <option value="GOLD">Oro (26)</option>
            <option value="CHEATMASTER">Cheat Master (26)</option>
            <option value="LOOTHACKER">Loot Hacker (26)</option>
            <option value="BOUNTYHUNTER">Bounty Hunter (26)</option>
            <option value="TRICKTREAT">Dulce o truco (26)</option>
            <option value="QUACK">Quack / Patito (5)</option>
          </select>
        </div>

        <div id="vaultSpritesGrid" class="spirits-grid"></div>
      </div>
    `;

    elMainContent.innerHTML = html;

    const updateVaultGrid = () => {
      const q = (document.getElementById("vaultSearchInput")?.value || "").trim().toLowerCase();
      const vFilter = document.getElementById("vaultVariantFilter")?.value || "all";
      const grid = document.getElementById("vaultSpritesGrid");
      if (!grid) return;

      const filtered = vaultCells.filter(c => {
        if (vFilter !== "all" && c.variantKey !== vFilter) return false;
        if (q) {
          const hay = `${c.spriteNameEs} ${c.spriteNameEn} ${c.variantNameEs} ${c.rarityEs}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });

      grid.innerHTML = filtered.map(c => renderSpiritItem(c, null)).join("");
    };

    document.getElementById("vaultSearchInput")?.addEventListener("input", updateVaultGrid);
    document.getElementById("vaultVariantFilter")?.addEventListener("change", updateVaultGrid);
    updateVaultGrid();
  }

  // --- RENDERIZADO DE ITEM ESPÍRITU (CON CHECKLIST EN VIVO - SOLUCIÓN 4) ---
  function renderSpiritItem(cell, context = null) {
    const rarityColors = {
      Rare: '#3aa0ff',
      Epic: '#b34dff',
      Legendary: '#f5a623',
      Mythic: '#ff4d4d'
    };
    const rarityColor = rarityColors[cell.rarity] || '#fff';
    const imgSrc = cell.imageUrl || (cell.image ? `https://spritelocker.com${cell.image}` : '');

    let actionsHtml = "";
    if (context && context.recipient) {
      const recId = escapeHtml(context.recipient.id);
      const recName = escapeHtml(context.recipient.name);
      const donorId = context.donor ? escapeHtml(context.donor.id) : "";
      const isModal = context.inModal ? "true" : "false";
      const safeKey = escapeHtml(cell.key);
      actionsHtml = `
        <div class="spirit-quick-actions">
          <button type="button" class="btn-spirit-action" onclick="window.markSpiritDelivered('${recId}', '${safeKey}', '${donorId}', ${isModal})" title="Marca que ${recName} ya recibió o ya tenía este espíritu">
            ✅ Ya lo tiene ${recName}
          </button>
        </div>
      `;
    } else if (context && Array.isArray(context.missingPlayers) && context.missingPlayers.length > 0) {
      const firstPlayer = context.missingPlayers[0];
      const safeKey = escapeHtml(cell.key);
      actionsHtml = `
        <div class="spirit-quick-actions">
          <button type="button" class="btn-spirit-action secondary" onclick="window.markSpiritDelivered('${escapeHtml(firstPlayer.id)}', '${safeKey}', '', false)" title="Añadir este espíritu a ${escapeHtml(firstPlayer.name)}">
            ➕ Lo consiguió ${escapeHtml(firstPlayer.name)}
          </button>
        </div>
      `;
    }

    return `
      <div class="spirit-item" style="border-left: 3px solid ${rarityColor};">
        <div class="spirit-img-wrap">
          <img src="${imgSrc}" alt="${escapeHtml(cell.spriteNameEs)}" class="spirit-img" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'">
        </div>
        <div class="spirit-name" title="${escapeHtml(cell.spriteNameEs)}">${escapeHtml(cell.spriteNameEs)}</div>
        <div class="spirit-tags">
          <span class="variant-pill" style="border-color: ${rarityColor}; color: #eaf4ff;">${escapeHtml(cell.variantNameEs)}</span>
          <span class="rarity-pill" style="background: ${rarityColor}22; color: ${rarityColor}; border: 1px solid ${rarityColor}66;">${escapeHtml(cell.rarityEs)}</span>
        </div>
        <div class="spirit-dust">💨 ${cell.dust} polvo</div>
        ${actionsHtml}
      </div>
    `;
  }

  // --- SOLUCIÓN 4: MARCAR ESPÍRITU ENTREGADO / EN POSESIÓN EN TIEMPO REAL ---
  window.markSpiritDelivered = async function (recipientId, cellKey) {
    const player = state.players.find(p => p.id === recipientId);
    if (!player) return;

    const currentOwned = player.data ? { ...player.data.owned } : {};
    const currentMastered = player.data ? { ...player.data.mastered } : {};
    const currentLost = player.data ? { ...player.data.lost } : {};
    const currentLevels = player.data ? { ...player.data.levels } : {};

    currentOwned[cellKey] = true;
    player.url = encodeCollection({
      owned: currentOwned,
      mastered: currentMastered,
      lost: currentLost,
      levels: currentLevels
    });
    player.isManual = true;
    player.isLive = false;

    await updatePlayer(player, false);
    saveState({ player });
    renderLobby();
    renderActiveTab();

    const cellInfo = DB.cells.find(c => c.key === cellKey);
    const label = cellInfo ? `${cellInfo.spriteNameEs} (${cellInfo.variantNameEs})` : cellKey;
    showToast(`✅ ¡${label} marcado en el casillero de ${player.name}!`);
  };

  // --- SOLUCIÓN 1: EDITOR VISUAL DE CASILLERO (<dialog closedby="any">) ---
  let lockerEditorState = {
    playerId: null,
    owned: {},
    mastered: {},
    lost: {},
    levels: {}
  };

  function getFilteredLockerCells() {
    const searchVal = (document.getElementById("lockerSearchInput")?.value || "").trim().toLowerCase();
    const variantVal = document.getElementById("lockerVariantFilter")?.value || "all";
    const statusVal = document.getElementById("lockerStatusFilter")?.value || "all";

    return DB.cells.filter(cell => {
      if (variantVal !== "all" && cell.variantKey !== variantVal) return false;
      const isOwned = !!lockerEditorState.owned[cell.key];
      if (statusVal === "owned" && !isOwned) return false;
      if (statusVal === "missing" && isOwned) return false;
      if (searchVal) {
        const haystack = `${cell.spriteNameEs} ${cell.spriteNameEn} ${cell.variantNameEs} ${cell.variantNameEn} ${cell.rarityEs}`.toLowerCase();
        if (!haystack.includes(searchVal)) return false;
      }
      return true;
    });
  }

  function renderLockerGrid() {
    const gridEl = document.getElementById("lockerSpritesGrid");
    const badgeEl = document.getElementById("lockerCountBadge");
    if (!gridEl) return;

    const totalCells = DB.totalCells || DB.cells.length || 24;
    const ownedCount = Object.keys(lockerEditorState.owned).filter(k => lockerEditorState.owned[k]).length;
    const pct = Math.round((ownedCount / totalCells) * 1000) / 10;

    if (badgeEl) {
      badgeEl.textContent = `${ownedCount}/${totalCells} (${pct}%)`;
    }

    const rarityColors = {
      Rare: '#3aa0ff',
      Epic: '#b34dff',
      Legendary: '#f5a623',
      Mythic: '#ff4d4d'
    };

    const filtered = getFilteredLockerCells();
    if (filtered.length === 0) {
      gridEl.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">No se encontraron espíritus con ese filtro.</div>`;
      return;
    }

    gridEl.innerHTML = filtered.map(cell => {
      const isOwned = !!lockerEditorState.owned[cell.key];
      const rarityColor = rarityColors[cell.rarity] || '#fff';
      const imgSrc = cell.imageUrl || (cell.image ? `https://spritelocker.com${cell.image}` : '');

      return `
        <div class="locker-cell-card ${isOwned ? 'is-owned' : ''}" data-key="${escapeHtml(cell.key)}" style="border-bottom: 3px solid ${rarityColor};">
          <span class="locker-cell-status">${isOwned ? '✅ TIENE' : '❌ FALTA'}</span>
          <div class="spirit-img-wrap" style="width: 54px; height: 54px; margin-top: 0.5rem;">
            <img src="${imgSrc}" alt="${escapeHtml(cell.spriteNameEs)}" class="spirit-img" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'">
          </div>
          <div class="spirit-name" title="${escapeHtml(cell.spriteNameEs)}">${escapeHtml(cell.spriteNameEs)}</div>
          <div class="spirit-tags" style="margin-bottom: 0;">
            <span class="variant-pill" style="border-color: ${rarityColor}; color: #eaf4ff;">${escapeHtml(cell.variantNameEs)}</span>
          </div>
        </div>
      `;
    }).join("");

    gridEl.querySelectorAll(".locker-cell-card").forEach(cardEl => {
      cardEl.addEventListener("click", () => {
        const key = cardEl.getAttribute("data-key");
        if (!key) return;
        if (lockerEditorState.owned[key]) {
          delete lockerEditorState.owned[key];
          delete lockerEditorState.mastered[key];
          delete lockerEditorState.lost[key];
        } else {
          lockerEditorState.owned[key] = true;
        }
        renderLockerGrid();
      });
    });
  }

  function openLockerModal(playerId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    lockerEditorState = {
      playerId: player.id,
      owned: player.data ? { ...player.data.owned } : {},
      mastered: player.data ? { ...player.data.mastered } : {},
      lost: player.data ? { ...player.data.lost } : {},
      levels: player.data ? { ...player.data.levels } : {}
    };

    const nameInput = document.getElementById("lockerPlayerNameInput");
    if (nameInput) nameInput.value = player.name || "Jugador";

    const searchInput = document.getElementById("lockerSearchInput");
    if (searchInput) searchInput.value = "";
    const variantFilter = document.getElementById("lockerVariantFilter");
    if (variantFilter) variantFilter.value = "all";
    const statusFilter = document.getElementById("lockerStatusFilter");
    if (statusFilter) statusFilter.value = "all";

    renderLockerGrid();

    const dialog = document.getElementById("lockerDialog");
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  }

  async function saveLockerModalToPlayer(copyForGroup = false) {
    const player = state.players.find(p => p.id === lockerEditorState.playerId);
    if (!player) return;

    const nameInput = document.getElementById("lockerPlayerNameInput");
    if (nameInput && nameInput.value.trim()) {
      player.name = nameInput.value.trim();
    }

    const encodedUrl = encodeCollection({
      owned: lockerEditorState.owned,
      mastered: lockerEditorState.mastered,
      lost: lockerEditorState.lost,
      levels: lockerEditorState.levels
    });

    player.url = encodedUrl;
    player.isManual = true;
    player.isLive = false;

    await updatePlayer(player, false);
    saveState({ player });
    renderLobby();
    renderActiveTab();

    if (copyForGroup) {
      const ownPersonalLink = getPersonalLockerUrl(player.lockerId);
      try {
        await navigator.clipboard.writeText(ownPersonalLink);
        showToast(`📋 ¡Link personal de ${player.name} copiado!`);
      } catch (_) {
        prompt(`Copia el link personal de ${player.name}:`, ownPersonalLink);
      }
    } else {
      const dialog = document.getElementById("lockerDialog");
      dialog?.close();
      showToast(`💾 ¡Casillero de ${player.name} guardado y sincronizado (${player.data?.ownedCount || 0}/${DB.totalCells || 24})!`);
    }
  }

  // --- COPIAR TEXTO FORMATEADO ---
  function copyChainText(players, platform) {
    let lines = [];
    if (platform === "discord") {
      lines.push("**🎮 FORTNITE - FILA DE INTERCAMBIO DE ESPÍRITUS (CAP. 7 MINITEMPORADA)**");
      lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } else {
      lines.push("🎮 *FORTNITE - FILA DE INTERCAMBIO DE ESPÍRITUS (CAP. 7 MINITEMPORADA)*");
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

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --- MODAL SELECTOR DE AVATAR (SOPORTA MODO SALA Y MODO CASILLERO PERSONAL) ---
  let avatarPickerPlayerId = null; // id de jugador o '__PERSONAL__'

  function renderAvatarGrid() {
    const gridEl = document.getElementById("avatarGrid");
    if (!gridEl) return;

    const isPersonalTarget = avatarPickerPlayerId === "__PERSONAL__";
    const player = isPersonalTarget ? null : state.players.find(p => p.id === avatarPickerPlayerId);
    const currentAvatarKey = isPersonalTarget
      ? (personalViewState.avatar || "HALFPEELD")
      : (player?.avatar || "HALFPEELD");

    const q = (document.getElementById("avatarSearchInput")?.value || "").trim().toLowerCase();
    const seasonFilter = document.getElementById("avatarSeasonFilter")?.value || "all";

    const catalog = getAvatarCatalog();
    const filtered = catalog.filter(item => {
      if (seasonFilter !== "all" && item.seasonKey !== seasonFilter) return false;
      if (q && !item.name.toLowerCase().includes(q)) return false;
      return true;
    });

    if (filtered.length === 0) {
      gridEl.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">No se encontraron avatares con ese nombre.</div>`;
      return;
    }

    gridEl.innerHTML = filtered.map(item => {
      const isSelected = item.key === currentAvatarKey;
      return `
        <div class="avatar-option-card ${isSelected ? 'is-selected' : ''}" data-key="${escapeHtml(item.key)}">
          ${isSelected ? `<span class="avatar-option-badge-selected">✓ Actual</span>` : ''}
          <div class="avatar-option-frame">
            <img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.name)}" class="avatar-option-img" loading="lazy" referrerpolicy="no-referrer">
          </div>
          <div class="avatar-option-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
          <div class="avatar-option-season">${escapeHtml(item.season)}</div>
        </div>
      `;
    }).join("");

    gridEl.querySelectorAll(".avatar-option-card").forEach(cardEl => {
      cardEl.addEventListener("click", () => {
        const key = cardEl.getAttribute("data-key");
        if (!key) return;
        const avatarInfo = getAvatarInfo(key);

        if (isPersonalTarget) {
          personalViewState.avatar = key;
          renderPersonalLockerView();
          schedulePersonalLockerSave();
          document.getElementById("avatarDialog")?.close();
          showToast(`🎭 ¡Avatar de tu casillero cambiado a "${avatarInfo?.name || key}"!`);
          return;
        }

        if (!player) return;
        player.avatar = key;
        saveState({ player });
        updatePlayerCardUI(player);
        document.getElementById("avatarDialog")?.close();
        showToast(`🎭 ¡Avatar cambiado a "${avatarInfo?.name || key}"!`);
      });
    });
  }

  function openAvatarModal(playerId) {
    const isPersonalTarget = playerId === "__PERSONAL__";
    const player = isPersonalTarget ? null : state.players.find(p => p.id === playerId);
    if (!isPersonalTarget && !player) return;
    avatarPickerPlayerId = playerId;

    const targetName = isPersonalTarget ? (personalViewState.name || "Mi Casillero") : player.name;
    const titleEl = document.getElementById("avatarDialogTitle");
    if (titleEl) {
      titleEl.innerHTML = `<span>🎭</span> Elige tu Avatar para <strong>${escapeHtml(targetName)}</strong>`;
    }

    const searchInput = document.getElementById("avatarSearchInput");
    if (searchInput) searchInput.value = "";
    const seasonFilter = document.getElementById("avatarSeasonFilter");
    if (seasonFilter) seasonFilter.value = "all";

    renderAvatarGrid();

    const dialog = document.getElementById("avatarDialog");
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  }

  // Crear nuevo jugador (con casillero personal nuevo)
  async function createNewPlayer(openVisualLocker = false) {
    const defaultAvatars = ["HALFPEELD", "RE-PETE", "BARRY OFISH", "WAYFINDER", "CHESTER", "KELPER", "EXMARKS", "TRANSPONDER SNAIL", "LIL FLACKO", "PLUNDARRGH"];
    const avatarChoice = defaultAvatars[state.players.length % defaultAvatars.length] || "HALFPEELD";

    const newPlayer = {
      id: "p_" + Math.random().toString(36).substr(2, 9),
      lockerId: generateLockerId(),
      name: "Jugador " + (state.players.length + 1),
      avatar: avatarChoice,
      url: encodeCollection({ owned: {} }),
      isManual: true,
      updatedAt: Date.now(),
      data: null,
      error: null,
      lastUpdated: new Date()
    };
    await updatePlayer(newPlayer, false);
    state.players.push(newPlayer);
    syncRoomLockerSubscriptions();
    saveState({ player: newPlayer });
    renderLobby();
    renderActiveTab();

    if (openVisualLocker) {
      openLockerModal(newPlayer.id);
    } else {
      showToast(`➕ ¡${newPlayer.name} añadido con link personal #${newPlayer.lockerId}!`);
    }
  }

  async function joinRoomWithPersonalLink() {
    let pasted = "";
    if (navigator.clipboard && typeof navigator.clipboard.readText === "function") {
      try {
        pasted = (await navigator.clipboard.readText()) || "";
      } catch (_) {
        pasted = "";
      }
    }
    const checkClip = extractCodeOrToken(pasted);
    if (!pasted.trim() || !checkClip || (checkClip.type !== "locker" && !pasted.includes("#c="))) {
      const manual = prompt(
        "📥 Entrar a esta sala con tu Link Personal de Casillero:\n\n" +
        "Pega aquí tu link personal (ej. https://.../#casillero=k-xxxx):",
        pasted.trim()
      );
      if (manual === null || !manual.trim()) return;
      pasted = manual.trim();
    }

    const target = extractCodeOrToken(pasted);
    if (!target) {
      showToast("⚠️ El enlace pegado no es válido.");
      return;
    }

    if (target.type === "locker") {
      const existing = state.players.find(p => p.lockerId === target.lockerId);
      if (existing) {
        await reloadPlayerLocker(existing, true);
        const card = document.getElementById(`card_${existing.id}`);
        card?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // Si solo hay un jugador por defecto vacío (Jugador 1 con 0 espíritus), usar esa tarjeta
      if (
        state.players.length === 1 &&
        (state.players[0].data?.ownedCount || 0) === 0 &&
        /^Jugador\s*1$/i.test(state.players[0].name.trim())
      ) {
        await applyPersonalLinkToPlayerCard(state.players[0], pasted);
        return;
      }
    }

    const newPlayer = {
      id: "p_" + Math.random().toString(36).substr(2, 9),
      lockerId: target.type === "locker" ? target.lockerId : generateLockerId(),
      name: "Jugador " + (state.players.length + 1),
      avatar: "HALFPEELD",
      url: encodeCollection({ owned: {} }),
      isManual: true,
      updatedAt: Date.now(),
      data: null,
      error: null,
      lastUpdated: new Date()
    };
    state.players.push(newPlayer);
    await applyPersonalLinkToPlayerCard(newPlayer, pasted);
  }

  // --- EVENT LISTENERS GENERALES ---
  function setupListeners() {
    // Pestañas de Sala
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        state.currentTab = btn.dataset.tab;
        renderActiveTab();
      });
    });

    // Botones del Panel de Sala
    document.getElementById("btnAddPlayer")?.addEventListener("click", () => {
      createNewPlayer(false);
    });
    document.getElementById("btnJoinWithPersonalLink")?.addEventListener("click", () => {
      joinRoomWithPersonalLink();
    });
    document.getElementById("btnReloadAllLockers")?.addEventListener("click", async () => {
      for (const p of state.players) {
        await reloadPlayerLocker(p, false);
      }
      renderLobby();
      renderActiveTab();
      showToast("🔄 ¡Todos los casilleros de la sala han sido recargados!");
    });

    // Controles de la Vista Exclusiva de Casillero Personal (#casillero=...)
    document.getElementById("btnPersonalAvatar")?.addEventListener("click", () => {
      openAvatarModal("__PERSONAL__");
    });
    const personalNameInput = document.getElementById("personalPlayerNameInput");
    personalNameInput?.addEventListener("input", (e) => {
      personalViewState.name = e.target.value.trim() || "Jugador";
      document.title = `Casillero de ${personalViewState.name} — Espíritus Fortnite`;
      schedulePersonalLockerSave();
    });
    personalNameInput?.addEventListener("change", () => {
      flushPersonalLockerSave();
    });

    const copyActivePersonalLink = async () => {
      await flushPersonalLockerSave();
      const link = getPersonalLockerUrl(personalViewState.lockerId);
      try {
        await navigator.clipboard.writeText(link);
        showToast("📋 ¡Tu Link Personal ha sido copiado! Pégalo en cualquier sala para entrar.");
      } catch (_) {
        prompt("Copia tu Link Personal de Casillero:", link);
      }
    };

    document.getElementById("btnPersonalCopyLink")?.addEventListener("click", copyActivePersonalLink);
    document.getElementById("btnHeaderCopyPersonalLink")?.addEventListener("click", copyActivePersonalLink);
    document.getElementById("personalLinkInput")?.addEventListener("click", (e) => e.target.select());

    document.getElementById("btnPersonalReload")?.addEventListener("click", async () => {
      if (!personalViewState.lockerId) return;
      const client = await ensureFirebase();
      if (client) {
        try {
          const snap = await client.getDoc(client.doc(client.db, "lockers", personalViewState.lockerId));
          if (snap.exists()) {
            const remote = snap.data();
            saveLocalLocker(personalViewState.lockerId, remote);
            applyDecodedToPersonalView(remote.name, remote.avatar, remote.url, remote.updatedAt);
            showToast(`🔄 ¡Casillero #${personalViewState.lockerId} recargado desde la nube!`);
            return;
          }
        } catch (_) {}
      }
      showToast("✔️ Tu casillero ya muestra la versión más reciente.");
    });

    document.getElementById("btnBackToRoom")?.addEventListener("click", async () => {
      await flushPersonalLockerSave();
      const targetRoomId = getOrInitRoomId();
      window.location.hash = `#sala=${targetRoomId}`;
    });

    document.getElementById("personalSearchInput")?.addEventListener("input", renderPersonalLockerView);
    document.getElementById("personalVariantFilter")?.addEventListener("change", renderPersonalLockerView);
    document.getElementById("personalStatusFilter")?.addEventListener("change", renderPersonalLockerView);

    document.getElementById("btnPersonalMarkFiltered")?.addEventListener("click", () => {
      for (const cell of getFilteredPersonalCells()) {
        personalViewState.owned[cell.key] = true;
      }
      renderPersonalLockerView();
      schedulePersonalLockerSave();
    });
    document.getElementById("btnPersonalUnmarkFiltered")?.addEventListener("click", () => {
      for (const cell of getFilteredPersonalCells()) {
        delete personalViewState.owned[cell.key];
      }
      renderPersonalLockerView();
      schedulePersonalLockerSave();
    });
    document.getElementById("btnPersonalClearAll")?.addEventListener("click", () => {
      personalViewState.owned = {};
      personalViewState.mastered = {};
      personalViewState.lost = {};
      personalViewState.levels = {};
      renderPersonalLockerView();
      schedulePersonalLockerSave();
      showToast("🧹 Casillero limpiado (0/24).");
    });

    window.addEventListener("beforeunload", () => {
      if (personalViewState.dirty) {
        flushPersonalLockerSave();
      }
    });

    // Controles del Dialog Selector de Avatar
    const avatarDialog = document.getElementById("avatarDialog");
    if (avatarDialog && !("closedBy" in HTMLDialogElement.prototype)) {
      avatarDialog.addEventListener("click", (event) => {
        if (event.target !== avatarDialog) return;
        const rect = avatarDialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (isDialogContent) return;
        avatarDialog.close();
      });
    }

    document.getElementById("avatarDialogClose")?.addEventListener("click", () => {
      avatarDialog?.close();
    });
    document.getElementById("btnAvatarCancel")?.addEventListener("click", () => {
      avatarDialog?.close();
    });
    document.getElementById("avatarSearchInput")?.addEventListener("input", renderAvatarGrid);
    document.getElementById("avatarSeasonFilter")?.addEventListener("change", renderAvatarGrid);

    // Controles del Dialog Editor Visual de Casillero (en Sala)
    const lockerDialog = document.getElementById("lockerDialog");
    if (lockerDialog && !("closedBy" in HTMLDialogElement.prototype)) {
      lockerDialog.addEventListener("click", (event) => {
        if (event.target !== lockerDialog) return;
        const rect = lockerDialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (isDialogContent) return;
        lockerDialog.close();
      });
    }

    document.getElementById("lockerDialogClose")?.addEventListener("click", () => {
      lockerDialog?.close();
    });
    document.getElementById("lockerSearchInput")?.addEventListener("input", renderLockerGrid);
    document.getElementById("lockerVariantFilter")?.addEventListener("change", renderLockerGrid);
    document.getElementById("lockerStatusFilter")?.addEventListener("change", renderLockerGrid);

    document.getElementById("btnMarkFiltered")?.addEventListener("click", () => {
      for (let cell of getFilteredLockerCells()) {
        lockerEditorState.owned[cell.key] = true;
      }
      renderLockerGrid();
    });
    document.getElementById("btnUnmarkFiltered")?.addEventListener("click", () => {
      for (let cell of getFilteredLockerCells()) {
        delete lockerEditorState.owned[cell.key];
      }
      renderLockerGrid();
    });
    document.getElementById("btnLockerClear")?.addEventListener("click", () => {
      lockerEditorState.owned = {};
      lockerEditorState.mastered = {};
      lockerEditorState.lost = {};
      lockerEditorState.levels = {};
      renderLockerGrid();
      showToast("🧹 Casillero limpiado (0/24).");
    });
    document.getElementById("btnLockerCopyShare")?.addEventListener("click", () => {
      saveLockerModalToPlayer(true);
    });
    document.getElementById("btnLockerSave")?.addEventListener("click", () => {
      saveLockerModalToPlayer(false);
    });

    // Cambiar o crear Sala en Vivo
    document.getElementById("btnRoomSyncStatus")?.addEventListener("click", () => {
      const currentCode = activeRoomId || "";
      const input = prompt(
        `Estás en la sala en vivo #${currentCode}.\n\n` +
        `• Escribe otro código de sala (ej. escuadron-1) para unirte a ella.\n` +
        `• Escribe NUEVA para crear una sala nueva con tus jugadores actuales.`,
        currentCode
      );
      if (input === null) return;
      const trimmed = input.trim();
      if (!trimmed || trimmed === currentCode) return;

      if (trimmed.toUpperCase() === "NUEVA") {
        const newId = generateRoomId();
        enterRoomMode(newId, true);
        showToast(`🟢 ¡Nueva sala #${newId} creada! Compártela con el botón Compartir Sala.`);
        return;
      }

      const normalized = trimmed.replace(/^#?(?:sala=)?/i, "").replace(/[^a-zA-Z0-9_-]/g, "-");
      if (!isValidRoomId(normalized)) {
        showToast("⚠️ El código de sala debe tener entre 4 y 40 letras, números o guiones.");
        return;
      }
      enterRoomMode(normalized, false);
      showToast(`🔄 Conectando a la sala #${normalized}...`);
    });

    // Detectar cambios en el hash de la URL (#casillero=... vs #sala=...)
    window.addEventListener("hashchange", () => {
      const lockerRoute = extractPersonalLockerRouteFromHash();
      if (lockerRoute) {
        if (state.mode !== "locker" || personalViewState.lockerId !== lockerRoute.lockerId) {
          enterPersonalLockerMode(lockerRoute.lockerId, lockerRoute.fallbackCode);
        }
        return;
      }

      const hashRoomId = extractRoomIdFromHash() || getOrInitRoomId();
      if (state.mode !== "room" || hashRoomId !== activeRoomId) {
        enterRoomMode(hashRoomId, false);
      }
    });

    // Compartir Sala por URL (en vivo con Firebase)
    document.getElementById("btnShareRoom")?.addEventListener("click", () => {
      if (cloudRoomReady) {
        syncFullRoomToCloud();
      }
      let shareUrl = getShareableRoomUrl();
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("🟢 ¡Link de Sala en Vivo copiado! Lo que edite cualquiera se reflejará al instante.");
      }).catch(() => {
        prompt("Copia este enlace para compartir la sala en vivo con tus amigos:", shareUrl);
      });
    });
  }

  // Inicialización asíncrona
  setupListeners();
  initPlayers();

})();
