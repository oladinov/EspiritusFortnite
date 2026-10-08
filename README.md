# 🎮 Organizador de Espíritus de Fortnite (Sprite Locker)

Herramienta diseñada para escuadrones de Fortnite (Capítulo 7 Temporada 4) que permite comparar y organizar la cadena óptima de intercambio de espíritus (*sprites*) entre amigos.

---

## 🚀 Inicio Rápido

### Opción 1: Aplicación Web (Recomendado)
Simplemente haz **doble clic en [`abrir_app.bat`](file:///d:/Oscar/repos/EspiritusFortnite/abrir_app.bat)** o abre [`index.html`](file:///d:/Oscar/repos/EspiritusFortnite/index.html) en cualquier navegador (Chrome, Edge, Firefox, etc.).
- Funciona 100% offline y local.
- Viene precargada con los enlaces de **Canito** y **Roberto**.
- Puedes añadir a **Iván**, **Christian** o cualquier cantidad de amigos con el botón **➕ Añadir Jugador**.
- Guarda automáticamente la lista de jugadores en tu navegador para la próxima partida.

### Opción 2: Desde la Terminal con Python
Ejecuta el script interactivo o con argumentos:
```bash
# Modo demo con Canito y Roberto
python compartir.py --demo

# Modo interactivo
python compartir.py

# Añadir jugadores directamente
python compartir.py --add "Canito=https://spritelocker.com/compare#vs=..." --add "Roberto=https://..." --add "Ivan=https://..."
```

### Opción 3: Desde la Terminal con Node.js
```bash
node compartir.mjs
```

---

## ✨ Características Principales

1. **Decodificación instantánea de enlaces**:
   - Acepta tanto enlaces de colección (`https://spritelocker.com/#c=...`) como enlaces del comparador (`https://spritelocker.com/compare#vs=...`) o el código en texto crudo.
   - Lee el estado exacto de posesión, espíritus dominados (*mastered*) y espíritus marcados como perdidos (*lost*).

2. **🤝 Fila de Compartir en Cascada (De mayor a menor)**:
   - Ordena a los jugadores por cantidad de espíritus:
     - 👑 **1º (El que más tiene)** ➜ **2º**: Qué espíritus le entrega y coste de polvo.
     - 👑 **2º** ➜ **3º**: Qué espíritus le entrega al siguiente.
     - 👑 **3º** ➜ **4º**: ...
   - **🔄 Intercambios de retorno**: Muestra qué variantes raras tiene el jugador de menor colección que le faltan al de arriba.

3. **📋 Matriz Completa de Sala**:
   - Muestra en una tabla cruzada cuántos espíritus puede donar cualquier jugador a cualquier otro. Al hacer clic en cualquier celda, se abre el desglose detallado con imágenes y costos.

4. **⚔️ Comparador 1 vs 1**:
   - Comparación bilateral idéntica a la de Sprite Locker pero con nombres en español, filtros y cálculo automático de polvo.

5. **🔍 Espíritus Faltantes del Escuadrón**:
   - Muestra qué espíritus no tiene absolutamente nadie en la sala para que el escuadrón sepa qué buscar en cofres durante la partida.

6. **📋 Copiar para Discord y WhatsApp**:
   - Botón directo que formatea el plan con emojis y viñetas listo para pegar en el chat del grupo.

---

## 📁 Archivos del Proyecto

- [`index.html`](file:///d:/Oscar/repos/EspiritusFortnite/index.html): Interfaz web de la aplicación.
- [`style.css`](file:///d:/Oscar/repos/EspiritusFortnite/style.css): Estilos visuales con temática oscura de Fortnite.
- [`app.js`](file:///d:/Oscar/repos/EspiritusFortnite/app.js): Lógica de la aplicación web y decodificación.
- [`db.js`](file:///d:/Oscar/repos/EspiritusFortnite/db.js): Base de datos de espíritus para la web sin restricciones CORS.
- [`sprites_db.json`](file:///d:/Oscar/repos/EspiritusFortnite/sprites_db.json): Datos de los 122 espíritus/variantes en JSON.
- [`compartir.py`](file:///d:/Oscar/repos/EspiritusFortnite/compartir.py): Script CLI en Python.
- [`compartir.mjs`](file:///d:/Oscar/repos/EspiritusFortnite/compartir.mjs): Script CLI en Node.js.
- [`abrir_app.bat`](file:///d:/Oscar/repos/EspiritusFortnite/abrir_app.bat): Lanzador rápido para Windows.
