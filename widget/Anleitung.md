# Lifeplanner-Widgets auf dem iPhone-Homescreen

Funktioniert mit der installierten App (https://ddj4nfnydz-star.github.io/lifeplanner/), nicht mit der Vorschau.
Das Skript gibt es auch direkt hier: https://ddj4nfnydz-star.github.io/lifeplanner/widget/Lifeplanner-Widget.js

## 1. GitHub-Token anlegen (einmalig, 2 Minuten)
1. github.com → Profilbild → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic).
2. Name: „Lifeplanner Widget“, Ablauf: nach Wunsch, Haken nur bei **gist**.
3. Token kopieren.

## 2. In der App verbinden
Lifeplanner öffnen → Profil (oben rechts) → **iPhone-Widget** → Token einfügen → **Verbinden**.
Danach erscheint eine Adresse. Auf **Adresse kopieren** tippen.
Die App aktualisiert die Widget-Daten ab jetzt automatisch bei jeder Änderung.

## 3. Scriptable einrichten
1. Gratis-App **Scriptable** aus dem App Store laden.
2. In Scriptable auf **+** tippen, den Inhalt von `Lifeplanner-Widget.js` einfügen, Skript „Lifeplanner-Widget“ nennen.
3. Auf dem Homescreen lange drücken → **+** → Scriptable → Größe wählen (klein, mittel oder groß) → hinzufügen.
4. Widget lange drücken → **Widget bearbeiten**:
   - Script: **Lifeplanner-Widget**
   - When Interacting: **Open URL** (öffnet dann den Lifeplanner)
   - Parameter: die kopierte Adresse

## Was die Widgets zeigen
- **Groß:** Kalorien, Protein, Kohlenhydrate und Fett, nächstes Training, Wecker, dein Tag, Einkauf
- **Mittel:** Kalorien und Protein und dein Tag
- **Klein:** standardmäßig Kalorien. Mit `|tag`, `|training` oder `|einkauf` am Ende des Parameters zeigt es stattdessen das.

iOS aktualisiert Widgets etwa alle 15 bis 30 Minuten. Ohne Internet zeigt das Widget den letzten Stand.

Unten im Widget steht deine Phase (z. B. „Aufbau · noch 182 Tage“) und ob heute Trainingstag ist.

# Mitteilungen bei geschlossener App

Web-Apps dürfen auf dem iPhone keine zeitgesteuerten Mitteilungen planen. Deshalb nutzt Lifeplanner den iPhone-Kalender: Die App legt einen Kalender „Lifeplanner“ in deinem Gist ab, und der iPhone-Kalender erinnert dich zuverlässig, auch wenn die App zu ist.

1. Erst Schritt 1 und 2 oben (Token, Verbinden) erledigen.
2. Lifeplanner → Profil → **iPhone-Widget und Mitteilungen** → **Kalender abonnieren**.
3. iOS fragt „Kalenderabo hinzufügen?“ → **Abonnieren**. Auf der nächsten Seite **Hinweise entfernen ausschalten** (wichtig, sonst kommen keine Mitteilungen) → **Hinzufügen**.
4. Einstellungen → Kalender → Accounts → **Datenabgleich** (Fetch New Data) auf **alle 15 Minuten** oder „Push“ stellen.

Was erinnert wird: Termine mit Erinnerung, Training (30 Min. vorher), Mahlzeiten und Aufgaben zur Uhrzeit, deine Wecker als Mitteilung und Phasenwechsel (eine Woche vorher und am Tag selbst, 9 Uhr).
Der Kalender wird aktualisiert, sobald du die App öffnest und etwas änderst. Er reicht 60 Tage in die Zukunft, also die App ab und zu öffnen.
Zum lauten Aufwachen weiterhin den normalen iPhone-Wecker nutzen; die Wecker-Mitteilung ist eher eine Erinnerung.
