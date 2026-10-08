#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
  FORTNITE ESPÍRITUS (SPRITES) - ORGANIZADOR DE INTERCAMBIOS DE SALA
=============================================================================
Herramienta para organizar y optimizar intercambios de espíritus entre amigos
usando enlaces de colección de spritelocker.com.

Modo de uso:
  1. Interactivo:
     python compartir.py
  2. Con argumentos:
     python compartir.py --add "Canito=https://spritelocker.com/compare#vs=..." --add "Roberto=https://..."
  3. Probar con enlaces de ejemplo:
     python compartir.py --demo
"""

import sys
import os
import json
import base64
import re
import argparse
from typing import List, Dict, Any, Optional, Tuple

# Reconfigurar codificación para evitar errores en Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Intentar cargar base de datos de sprites
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(SCRIPT_DIR, "sprites_db.json")

def load_db() -> Dict[str, Any]:
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    raise FileNotFoundError(f"No se encontró {DB_FILE}. Por favor genera la base de datos primero.")

def extract_code(url_or_code: str) -> Optional[str]:
    """Extrae el hash #vs= o #c= de cualquier enlace de spritelocker."""
    t = url_or_code.strip()
    if not t:
        return None
    if '#' in t:
        frag = t.split('#', 1)[1]
        params = dict(re.findall(r'([^&=]+)=([^&=]*)', frag))
        if 'vs' in params:
            return params['vs']
        if 'c' in params:
            return params['c']
    return t

def b64_url_decode(s: str) -> bytes:
    """Decodifica base64 seguro para URL."""
    s = s.replace('-', '+').replace('_', '/')
    pad = (4 - len(s) % 4) % 4
    s += '=' * pad
    return base64.b64decode(s)

def get_bit(data: bytes, idx: int) -> bool:
    """Verifica el bit idx dentro del array de bytes."""
    byte_idx = idx >> 3
    if byte_idx >= len(data):
        return False
    return bool(data[byte_idx] & (1 << (idx & 7)))

def decode_collection(code_or_url: str, db: Dict[str, Any]) -> Dict[str, Any]:
    """Decodifica un código de colección a formato estructurado."""
    clean = extract_code(code_or_url)
    if not clean:
        raise ValueError("Código vacío o no encontrado en el enlace")

    version = "4"
    data_str = clean
    if '.' in clean:
        parts = clean.split('.', 1)
        version = parts[0]
        data_str = parts[1]

    raw_bytes = b64_url_decode(data_str)
    cells = db['cells']
    num_cells = len(cells)

    owned = {}
    mastered = {}
    lost = {}
    levels = {}

    offset_mastered = num_cells
    offset_lost = num_cells * 2
    offset_levels = num_cells * 3

    for idx, cell in enumerate(cells):
        key = cell['key']
        is_owned = get_bit(raw_bytes, idx)
        is_mastered = get_bit(raw_bytes, offset_mastered + idx)
        is_lost = get_bit(raw_bytes, offset_lost + idx)

        if is_owned:
            owned[key] = True
        if is_mastered:
            mastered[key] = True
            owned[key] = True
        if is_lost:
            lost[key] = True
            owned[key] = True

        if is_owned:
            lvl = 0
            for b in range(3):
                if get_bit(raw_bytes, offset_levels + idx * 3 + b):
                    lvl |= (1 << b)
            if lvl > 0:
                levels[key] = min(5, max(1, lvl + 1))

    return {
        'version': version,
        'raw_code': clean,
        'owned': owned,
        'mastered': mastered,
        'lost': lost,
        'levels': levels,
        'owned_count': len(owned),
        'total_cells': num_cells,
        'percentage': round((len(owned) / num_cells) * 100, 1)
    }

class Player:
    def __init__(self, name: str, url_or_code: str, db: Dict[str, Any]):
        self.name = name.strip()
        self.url_or_code = url_or_code.strip()
        self.data = decode_collection(self.url_or_code, db)

    @property
    def owned_count(self) -> int:
        return self.data['owned_count']

    @property
    def percentage(self) -> float:
        return self.data['percentage']

    def owns(self, cell_key: str) -> bool:
        return bool(self.data['owned'].get(cell_key, False))

    def has_lost(self, cell_key: str) -> bool:
        return bool(self.data['lost'].get(cell_key, False))

    def can_give(self, cell_key: str) -> bool:
        """Puede darlo si lo tiene y no está marcado como perdido."""
        return self.owns(cell_key) and not self.has_lost(cell_key)

    def needs(self, cell_key: str) -> bool:
        """Lo necesita si aún no lo tiene en su colección."""
        return not self.owns(cell_key)

def compare_pair(donor: Player, recipient: Player, db: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Devuelve los espíritus que el donante puede transferir al receptor."""
    transferable = []
    for cell in db['cells']:
        key = cell['key']
        # Tradable check
        if not cell.get('tradable', True):
            continue
        if donor.can_give(key) and recipient.needs(key):
            transferable.append(cell)

    # Ordenar por rareza (Mítico > Legendario > Épico > Raro) y polvo
    rarity_order = {'Mythic': 4, 'Legendary': 3, 'Epic': 2, 'Rare': 1}
    transferable.sort(key=lambda c: (-rarity_order.get(c['rarity'], 0), -c['dust'], c['spriteNameEs']))
    return transferable

def print_separator(char="=", length=75):
    print(char * length)

def format_cell_line(cell: Dict[str, Any]) -> str:
    rarity_badges = {
        'Mythic': '🔴 MÍTICO',
        'Legendary': '🟡 LEGENDARIO',
        'Epic': '🟣 ÉPICO',
        'Rare': '🔵 RARO'
    }
    badge = rarity_badges.get(cell['rarity'], cell['rarity'])
    return f"  • {cell['spriteNameEs']} ({cell['variantNameEs']}) [{badge}] - 💨 {cell['dust']} polvo"

def run_analysis(players: List[Player], db: Dict[str, Any]):
    if not players:
        print("❌ No hay jugadores registrados.")
        return

    print_separator("=")
    print("      🎮 FORTNITE ESPÍRITUS - ORGANIZADOR DE INTERCAMBIOS DE SALA")
    print("              Temporada 4 / Capítulo 7 (122 Espíritus)")
    print_separator("=")

    # 1. ORDENAR DE MAYOR A MENOR COLECCIÓN
    players_sorted = sorted(players, key=lambda p: p.owned_count, reverse=True)

    print("\n📊 CLASIFICACIÓN DE LA SALA (De más a menos espíritus):")
    for i, p in enumerate(players_sorted, 1):
        bar_len = int(p.percentage / 5)
        bar = "█" * bar_len + "░" * (20 - bar_len)
        print(f"  {i}. {p.name.ljust(15)} : {str(p.owned_count).rjust(3)}/122 espíritus ({p.percentage}%) [{bar}]")

    # 2. FILA / CADENA DE COMPARTIR (CASCADA)
    print("\n" + "="*75)
    print("🤝 FILA PRINCIPAL DE COMPARTIR (Cascada: el que tiene más ayuda al siguiente)")
    print("="*75)

    if len(players_sorted) < 2:
        print("ℹ️ Añade al menos 2 jugadores para calcular los intercambios.")
        return

    for i in range(len(players_sorted) - 1):
        p1 = players_sorted[i]
        p2 = players_sorted[i + 1]

        gives = compare_pair(p1, p2, db)
        returns = compare_pair(p2, p1, db)

        total_dust_give = sum(c['dust'] for c in gives)
        total_dust_return = sum(c['dust'] for c in returns)

        print(f"\n───────────────────────────────────────────────────────────────────────────")
        print(f"👑 PASO {i+1}: {p1.name} ({p1.owned_count})  ➜  {p2.name} ({p2.owned_count})")
        print(f"   {p1.name} puede pasarle {len(gives)} espíritus a {p2.name} (Polvo total: {total_dust_give}):")
        if gives:
            for cell in gives:
                print(format_cell_line(cell))
        else:
            print("   (Ninguno. ¡El receptor ya tiene todo lo que posee el donante!)")

        # Intercambio inverso (lo que el de abajo le puede dar al de arriba)
        if returns:
            print(f"\n   🔄 A cambio, {p2.name} puede pasarle {len(returns)} espíritus a {p1.name} (Polvo: {total_dust_return}):")
            for cell in returns:
                print(format_cell_line(cell))

    # 3. INTERCAMBIOS DIRECTOS ENTRE TODOS (MATRIZ)
    print("\n" + "="*75)
    print("📋 MATRIZ RESUMEN DE INTERCAMBIOS ENTRE TODOS LOS JUGADORES")
    print("="*75)
    for p1 in players_sorted:
        for p2 in players_sorted:
            if p1 == p2:
                continue
            can_give = compare_pair(p1, p2, db)
            print(f"  • {p1.name} puede dar a {p2.name}: {len(can_give)} espíritus")

    # 4. ESPÍRITUS FALTANTES QUE NADIE EN LA SALA TIENE
    missing_all = []
    for cell in db['cells']:
        key = cell['key']
        if not cell.get('tradable', True):
            continue
        if all(not p.owns(key) for p in players_sorted):
            missing_all.append(cell)

    print("\n" + "="*75)
    print(f"🔍 ESPÍRITUS FALTANTES DEL ESCUADRÓN ({len(missing_all)} en total)")
    print("   (Ningún jugador de la sala los tiene aún. ¡Búsquenlos en cofres en partida!)")
    print("="*75)
    if missing_all:
        for cell in missing_all:
            print(format_cell_line(cell))
    else:
        print("  🎉 ¡Entre todos en la sala tienen la colección 100% cubierta!")

    print("\n" + "="*75)
    print("✅ Análisis finalizado con éxito.")
    print("="*75)

def get_demo_players(db: Dict[str, Any]) -> List[Player]:
    return [
        Player("Canito", "https://spritelocker.com/compare#vs=4.772zvvTaGS2utF564UQhhvYCOMAJAgQAwHgAAAAAAAAwAgCAFAEAQgAkAwAAAAFhAECSIAAIAEgKABCQDAgMIIAAABEAAAABGACQCEgSAIAAAQAAAAAAAABgAAA", db),
        Player("Roberto", "https://spritelocker.com/#c=4.770WvlLaGKGsFFZawUQBAIACAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAwAJggJCAIAAMABBECAQMAAQAAoAIQAAAAAABADAAAEAQAAAAAAAAAgAAAAAAAAA", db),
    ]

def main():
    parser = argparse.ArgumentParser(description="Organizador de Intercambio de Espíritus de Fortnite")
    parser.add_argument("--demo", action="store_true", help="Ejecutar con los enlaces de demostración de Canito y Roberto")
    parser.add_argument("--add", action="append", help="Añadir jugador con formato 'Nombre=Enlace'")
    args = parser.parse_args()

    db = load_db()

    if args.demo:
        players = get_demo_players(db)
        run_analysis(players, db)
        return

    if args.add:
        players = []
        for item in args.add:
            if '=' in item:
                name, link = item.split('=', 1)
            else:
                name, link = item, item
            try:
                p = Player(name, link, db)
                players.append(p)
            except Exception as e:
                print(f"⚠️ Error cargando jugador '{name}': {e}")
        run_analysis(players, db)
        return

    # Modo interactivo
    print("🎮 BIENVENIDO AL ORGANIZADOR DE ESPÍRITUS DE FORTNITE")
    print("Ingresa los jugadores de tu sala (escribe 'listo' cuando termines):\n")

    players = []
    # Preguntar si desea cargar la demo primero
    demo_opt = input("¿Deseas cargar a Canito y Roberto como base? (s/n, por defecto 's'): ").strip().lower()
    if demo_opt in ('', 's', 'si', 'y', 'yes'):
        players.extend(get_demo_players(db))
        print(f"✔️ Cargados {len(players)} jugadores de prueba (Canito y Roberto).")

    while True:
        print(f"\nJugadores actuales en la sala: {[p.name for p in players]}")
        name = input("Nombre del jugador (o escribe 'listo' para calcular): ").strip()
        if name.lower() in ('listo', 'done', 'fin', 'exit', 'q', ''):
            if len(players) >= 2:
                break
            elif len(players) == 0:
                print("Debes ingresar al menos 2 jugadores.")
                continue
            else:
                print("Se recomienda ingresar al menos 2 jugadores para comparar. Continuando...")
                break

        url = input(f"Pega el enlace de Sprite Locker de {name}: ").strip()
        try:
            p = Player(name, url, db)
            players.append(p)
            print(f"✔️ {name} agregado con éxito ({p.owned_count}/122 espíritus, {p.percentage}%).")
        except Exception as e:
            print(f"❌ Error al procesar el enlace de {name}: {e}")

    run_analysis(players, db)

if __name__ == "__main__":
    main()
