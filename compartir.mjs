#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'sprites_db.json');
const DB = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

function extractCode(t) {
  if (!t) return null;
  t = t.trim();
  let idx = t.indexOf('#');
  if (idx !== -1) {
    let params = new URLSearchParams(t.slice(idx + 1));
    return params.get('vs') || params.get('c') || t;
  }
  return t;
}

function b64UrlDecode(s) {
  let base64 = s.replace(/-/g, '+').replace(/_/g, '/');
  let pad = (4 - (base64.length % 4)) % 4;
  base64 += '='.repeat(pad);
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

function decodeCollection(urlOrCode) {
  let clean = extractCode(urlOrCode);
  if (!clean) throw new Error('Código vacío o inválido');

  let version = '4';
  let dataStr = clean;
  if (clean.includes('.')) {
    let parts = clean.split('.');
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
        if (getBit(bytes, offsetLevels + i * 3 + b)) lvl |= (1 << b);
      }
      if (lvl > 0) levels[key] = Math.min(5, Math.max(1, lvl + 1));
    }
  }

  let ownedCount = Object.keys(owned).length;
  let percentage = Math.round((ownedCount / numCells) * 1000) / 10;

  return { version, rawCode: clean, owned, mastered, lost, levels, ownedCount, percentage };
}

function getTransferable(donor, recipient) {
  let donorOwned = donor.data.owned;
  let donorLost = donor.data.lost;
  let recipientOwned = recipient.data.owned;

  let results = [];
  for (let cell of DB.cells) {
    if (cell.tradable === false) continue;
    let k = cell.key;
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

// Jugadores demo
const demoPlayers = [
  {
    name: 'Canito',
    url: 'https://spritelocker.com/compare#vs=4.772zvvTaGS2utF564UQhhvYCOMAJAgQAwHgAAAAAAAAwAgCAFAEAQgAkAwAAAAFhAECSIAAIAEgKABCQDAgMIIAAABEAAAABGACQCEgSAIAAAQAAAAAAAABgAAA'
  },
  {
    name: 'Roberto',
    url: 'https://spritelocker.com/#c=4.770WvlLaGKGsFFZawUQBAIACAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAwAJggJCAIAAMABBECAQMAAQAAoAIQAAAAAABADAAAEAQAAAAAAAAAgAAAAAAAAA'
  }
];

const players = demoPlayers.map(p => ({
  name: p.name,
  url: p.url,
  data: decodeCollection(p.url)
}));

// Ordenar de mayor a menor
players.sort((a, b) => b.data.ownedCount - a.data.ownedCount);

console.log('='.repeat(70));
console.log('  🎮 FORTNITE ESPÍRITUS - CADENA DE INTERCAMBIO (SPRITE LOCKER)');
console.log('='.repeat(70));
console.log('\n📊 CLASIFICACIÓN DE LA SALA:');
players.forEach((p, idx) => {
  console.log(`  ${idx + 1}. ${p.name.padEnd(12)}: ${p.data.ownedCount}/122 espíritus (${p.data.percentage}%)`);
});

console.log('\n' + '='.repeat(70));
console.log('🤝 FILA DE COMPARTIR EN CASCADA:');
console.log('='.repeat(70));

for (let i = 0; i < players.length - 1; i++) {
  let donor = players[i];
  let recipient = players[i + 1];
  let gives = getTransferable(donor, recipient);
  let returns = getTransferable(recipient, donor);

  let dustG = gives.reduce((s, c) => s + c.dust, 0);
  let dustR = returns.reduce((s, c) => s + c.dust, 0);

  console.log(`\n👑 PASO ${i + 1}: ${donor.name} (${donor.data.ownedCount}) ➜ ${recipient.name} (${recipient.data.ownedCount})`);
  console.log(`   ${donor.name} le entrega ${gives.length} espíritus (Polvo: ${dustG}):`);
  gives.forEach(c => {
    console.log(`    • ${c.spriteNameEs} (${c.variantNameEs}) [${c.rarityEs}] - 💨 ${c.dust}`);
  });

  if (returns.length > 0) {
    console.log(`\n   🔄 A cambio, ${recipient.name} le entrega ${returns.length} espíritus (Polvo: ${dustR}):`);
    returns.forEach(c => {
      console.log(`    • ${c.spriteNameEs} (${c.variantNameEs}) [${c.rarityEs}] - 💨 ${c.dust}`);
    });
  }
}

console.log('\n' + '='.repeat(70));
console.log('✅ Ejecución completada.');
