# EduLink - Vollständige Seiten- & Design-Dokumentation

> Umfassende Beschreibung aller Seiten, Funktionen, UI-Elemente und Design-Details der EduLink-Plattform.

---

## Inhaltsverzeichnis

1. [Design System](#1-design-system)
2. [Mobile App (Nativ)](#2-mobile-app-nativ)
3. [Öffentliche Seiten (Web)](#3-öffentliche-seiten-web)
4. [Layouts & Navigation](#4-layouts--navigation)
5. [Erzieher-Bereich](#5-erzieher-bereich)
6. [Einrichtungs-Bereich](#6-einrichtungs-bereich)
7. [Admin/Koordinator-Bereich](#7-adminkoordinator-bereich)
8. [Gemeinsame Seiten](#8-gemeinsame-seiten)

---

## 1. Design System

### 1.1 Farbpalette

#### Light Mode

| Farbe | HSL-Wert | Verwendung |
|-------|----------|------------|
| **Primary (Teal)** | `172 66% 30%` | Hauptmarkenfarbe, Buttons, Links, aktive Elemente |
| **Accent (Coral)** | `15 82% 58%` | Hervorhebungen, CTAs auf der Landing Page |
| **Background** | `155 15% 98%` | Warmes Off-White als Seitenhintergrund |
| **Foreground** | `172 50% 7%` | Dunkles Teal-Schwarz für Text |
| **Card** | `0 0% 100%` | Reines Weiß für Karten/Container |
| **Success (Grün)** | `160 84% 39%` | Bestätigungen, aktive Status |
| **Warning (Orange)** | `38 92% 50%` | Warnungen, ausstehende Status |
| **Info (Blau)** | `217 91% 60%` | Informationshinweise |
| **Destructive (Rot)** | `0 84% 60%` | Fehler, Löschen, Gefahrenaktionen |
| **Border** | `162 15% 90%` | Dezente Rahmenfarbe mit Teal-Ton |
| **Muted** | `155 12% 96%` | Leichter Neutralton für Hintergründe |

#### Dark Mode
- Alle Farben passen sich automatisch an (CSS-Variablen mit `.dark`-Klasse)
- Primary wird heller (`172 66% 40%`), Hintergründe werden dunkel-teal (`172 30% 8%`)
- Status-Farben werden aufgehellt für bessere Lesbarkeit

### 1.2 Typografie

| Font | Typ | Verwendung |
|------|-----|------------|
| **Inter** | Sans-Serif (400, 500, 600, 700) | Gesamter Body-Text, Navigation, Formulare |
| **Instrument Serif** | Serif (Italic) | Display-Überschriften auf der Landing Page |
| **JetBrains Mono** | Monospace (400, 500) | Session-Timer, Code-Blöcke, technische Werte |

### 1.3 Abstände & Rundungen

- **Border Radius**: `0.625rem` (10px) als Basis, `md: 8px`, `sm: 6px`
- **Padding**: `px-4` (mobile), `sm:px-6` (tablet+), `py-8` (vertikal)
- **Page Container Breiten**: narrow (1024px), default (1280px), wide (1400px), full

### 1.4 Schatten

| Name | Wert | Verwendung |
|------|------|------------|
| **soft** | `0 2px 8px (4% Opacity)` | Leichte Erhebung (Cards) |
| **elevated** | `0 4px 12px (6% Opacity)` | Stärkere Erhebung (Hover-States) |
| **inset** | `inset 0 2px 4px (5% Opacity)` | Innerer Schatten (Inputs) |

### 1.5 Animationen

| Name | Dauer | Effekt |
|------|-------|--------|
| **fade-in** | 200ms | Einblenden (Opacity 0→1) |
| **fade-in-up** | 300ms | Einblenden + nach oben gleiten (16px) |
| **slide-in-right** | 300ms | Einblenden + von rechts (24px) |
| **scale-in** | 300ms | Einblenden + Skalierung (0.95→1, mit Bounce) |

### 1.6 Komponentenbibliothek

Basiert auf **shadcn/ui** mit **Radix UI** Primitiven. Hauptkomponenten:

- **Button** - Varianten: default, outline, ghost, destructive, link; Größen: sm, default, lg, icon
- **Card** - Container mit Header, Title, Description, Content, Footer
- **Badge** - Status-Indikatoren: default, secondary, outline, destructive, accent
- **Input/Textarea** - Formulareingaben mit Inset-Schatten und Focus-Ring
- **Dialog** - Modale Fenster mit Overlay, Blur-Effekt und Animationen
- **Select** - Dropdown-Auswahl mit Scroll-Unterstützung
- **Tabs** - Tab-Navigation für gruppierte Inhalte
- **DataTable** - Sortierbare, durchsuchbare Tabellen (TanStack Table)
- **Switch** - Toggle-Schalter
- **Checkbox** - Auswahlboxen
- **Form** - React Hook Form Integration mit Zod-Validierung
- **Pagination** - Seitennavigation mit Größenauswahl
- **EmptyState** - Platzhalter für leere Listen
- **StarDisplay** - Sternebewertungs-Anzeige
- **Skeleton** - Lade-Platzhalter (Puls-Animation)
- **Alert** - Hinweisboxen (default, destructive)
- **Tooltip/Popover** - Schwebende Info-Elemente

**Icons**: lucide-react (400+ Icons)

---

## 2. Mobile App (Nativ)

Die mobile App ist eine **Hybrid-App**: Nativer Login + WebView-Dashboard (Expo + React Native).

### 2.1 LoginScreen

**Zweck**: Native Authentifizierung für den Ersteinstieg

**Layout**: Zentriert, volle Bildschirmhöhe

**UI-Elemente**:
- EduLink-Logo in Teal-Box (#1A8F83), zentriert oben
- **E-Mail-Eingabefeld** (vorausgefüllt im Dev-Modus: `admin@edulink.de`)
- **Passwort-Eingabefeld** (vorausgefüllt im Dev-Modus: `password123`)
- **"Passwort vergessen?"**-Link (zeigt Alert, verweist auf Web-App)
- **Login-Button** mit Lade-Spinner bei Verarbeitung
- **Fehlermeldung** in rotem Container (bei ungültigen Credentials, nicht verifizierter E-Mail, gesperrtem Konto)
- **Footer**: "Noch kein Account?"-Text mit Registrierungslink zur Web-App

**Funktionen**:
- Better Auth `signIn.email()` für Authentifizierung
- Extrahiert Session-Token aus Response-Header (`set-auth-token`)
- Erstellt 30-Tage-Refresh-Token über `/api/auth/mobile/create-refresh-token`
- Speichert Refresh-Token in SecureStore (verschlüsselt)
- Bei Erfolg: Übergang zum BiometricScreen oder WebView

### 2.2 BiometricScreen

**Zweck**: Biometrische Authentifizierung für wiederkehrende Nutzer

**Layout**: Zentriert, volle Bildschirmhöhe

**UI-Elemente**:
- EduLink-Logo
- **Begrüßungstext**: "Willkommen zurück, {Vorname}!"
- **Biometrie-Icon**: Face ID (iOS), Fingerabdruck (Android) oder generisches Schloss
- **Status-Nachricht**: "Authentifiziere..." oder Fehlermeldung
- **Primär-Button**: "Mit [Face ID/Touch ID/Fingerabdruck] entsperren"
- **Sekundär-Button**: "Mit Passwort anmelden" (Fallback)

**Funktionen**:
- Automatischer Biometrie-Auslösung beim Laden
- Erkennung des Biometrie-Typs (Gesicht, Fingerabdruck, Iris)
- 30-Sekunden-Timeout
- Passwort-Fallback setzt Auth-State zurück und kehrt zum LoginScreen zurück

### 2.3 LoadingScreen

**Zweck**: Splash/Lade-Screen während Initialisierung

**UI-Elemente**:
- Großes EduLink-Logo in Teal
- Animierter Spinner
- Anpassbarer Ladetext (Standard: "Laden...")

**Wird angezeigt bei**: App-Start, Session-Wiederherstellung, WebView-Laden, Zustandsübergängen

### 2.4 ErrorScreen

**Zweck**: Fehlerbehandlung für Offline, Wartung, Auth-Fehler

**UI-Elemente**:
- Offline-Cloud-Icon
- **Titel** (Standard: "Verbindungsfehler")
- **Fehlerbeschreibung**
- **"Erneut versuchen"-Button** (kontextabhängig)
- **"Abmelden"-Button** (wenn authentifiziert)

**Fehlerarten**:
- `auth` - Session-Refresh fehlgeschlagen
- `webview` - WebView-Ladefehler oder Server nicht erreichbar
- `maintenance` - Server im Wartungsmodus (60-Sek. Fail-Open-Fenster, Health-Polling alle 10 Sek.)

### 2.5 WebView Dashboard

**Zweck**: Hauptinterface - lädt die Web-App im WebView

**Initialisierungsfluss**:
1. Bridge-Seite lädt `/establish-session`
2. Cookie wird gesetzt via `document.cookie`
3. Weiterleitung zur rollenbasierten URL:
   - Admin/Koordinator → `/admin`
   - Einrichtung → `/kita`
   - Erzieher → `/dashboard`

**WebView-Features**:
- JavaScript + LocalStorage aktiviert
- Pull-to-Refresh
- Geolocation
- Inline-Medienwiedergabe
- Back/Forward-Gesten (iOS)
- Geteilte Cookies
- Native Bridge API (`window.NativeBridge`)

**Native Bridge Funktionen** (WebView ↔ Nativ):
- `GET_AUTH_TOKEN` / `SAVE_AUTH_TOKEN` / `CLEAR_AUTH` - Token-Verwaltung
- `REFRESH_SESSION` - Stille Session-Erneuerung
- `GET_LOCATION` / `CHECK_IN_AT_FACILITY` - GPS-Ortung & Check-in
- `OPEN_CAMERA` / `PICK_IMAGE` - Kamera & Galerie
- `GET_PUSH_TOKEN` - Push-Benachrichtigungen
- `AUTHENTICATE_BIOMETRIC` / `IS_BIOMETRIC_AVAILABLE` - Biometrie

---

## 3. Öffentliche Seiten (Web)

### 3.1 Landing Page (`/`)

**Zweck**: Marketing-Seite, erster Eindruck für neue Besucher

**Layout**: Volle Breite, mehrere Sektionen übereinander

**Sektionen**:

#### Hero-Bereich
- **Badge**: "Erzieher-Plattform" (sekundäre Variante, Primary-Farbe)
- **Hauptüberschrift**: "Personalvermittlung für Kitas & Kindergärten" (Serif-Font, 4xl-7xl, responsiv)
- **Untertitel**: Beschreibungstext zur Plattform
- **CTA-Buttons**:
  - "Kostenlos starten" (Primary-Button mit ArrowRight-Icon)
  - "Anmelden" (Outline-Button)
- **Animation**: fade-in + slide-in-from-bottom

#### Statistik-Grid (2 Spalten mobil, 4 Spalten Desktop)
| Statistik | Icon | Wert |
|-----------|------|------|
| Erzieher | Users | 500+ |
| Einrichtungen | Briefcase | 120+ |
| Schichten/Monat | Calendar | 10.000+ |
| Zufriedenheit | TrendingUp | 98% |

Jede Karte: Icon in farbigem Hintergrund-Kreis + großer Wert + Bezeichnung

#### Features-Bereich (Bento Grid: 1 Spalte mobil, 6 Spalten Desktop)
- **Große Karte (4x2)**: "Intelligente Schichtplanung" - Calendar-Icon, Beschreibung, Badges: "Auto-Matching", "Konflikt-Check"
- **Mittlere Karte (2x2)**: "Qualität garantiert" - CheckCircle2-Icon, 3 Checklisten-Items (Urkunden-Check, Identitätsprüfung, Impfschutz-Nachweis)
- **Kleine Karte**: "DSGVO-Konform & Sicher" - ShieldCheck-Icon
- **Kleine Karte**: "Echtzeit-Zeiterfassung" - Clock-Icon

#### So funktioniert's (Grauer Hintergrund)
3 Schritte mit nummerierten Kreisen (1, 2, 3):
1. "Registrieren" (neutraler Hintergrund)
2. "Profil anlegen" (Primary-Hintergrund)
3. "Loslegen" (Success-Hintergrund)

Verbindungslinie zwischen den Schritten (nur Desktop)

#### CTA-Bereich
- Große Überschrift mit kursivem "Personalplanung" in Primary-Farbe
- Beschreibungstext
- Button: "Jetzt kostenlos starten" mit ArrowRight

#### Footer
- Copyright-Hinweis
- Links: Impressum, Datenschutz, AGB

---

### 3.2 Login (`/login`)

**Zweck**: Benutzeranmeldung mit zwei Authentifizierungsmethoden

**Layout**: Zentrierte Karte, max-width-md

**Header**:
- Logo: Runder Badge mit "T" (Serif, Primary-Hintergrund)
- Titel: "Willkommen zurück"
- Untertitel: "Melden Sie sich an, um auf Ihr Konto zuzugreifen"

**Tabs**:

#### Tab 1: Passwort (Lock-Icon)
- **E-Mail-Feld** mit Mail-Icon (links eingebettet, pl-10)
- **Passwort-Feld** mit Lock-Icon + "Vergessen?"-Link
- **Login-Button**: "Anmelden" mit ArrowRight (Ladezustand: "Wird geladen..." mit Loader2)

#### Tab 2: Magic Link (Sparkles-Icon)
- **E-Mail-Feld** mit Mail-Icon
- **Hilfetext**: "Wir senden Ihnen einen Link zum Login per E-Mail. Der Link ist 5 Minuten gültig."
- **Senden-Button**: "Magic Link senden" mit Sparkles-Icon
- **Erfolgszustand**: Success-Alert + (nur Dev) Debug-Box mit kopierbarem Magic-Link

**Footer**:
- "Noch kein Account?" mit Registrierungslink
- Sicherheits-Badge: Lock-Icon + "Sicherer Login mit Enterprise-Standard"

---

### 3.3 Registrierung (`/auth/register`)

**Zweck**: Neuen Account erstellen (Erzieher oder Einrichtung)

**Layout**: Zentrierte Karte, max-width-md

**Formularfelder**:
1. **Rollenauswahl** (2-Spalten-Grid):
   - "Erzieher/in" mit GraduationCap-Icon
   - "Einrichtung" mit Building2-Icon
   - Ausgewählt: Primary-Rahmen/Hintergrund
2. **Name** (Label ändert sich je nach Rolle: "Name der Einrichtung" oder "Name")
3. **E-Mail** (Placeholder: "du@example.com")
4. **Passwort** (Placeholder: "Mindestens 8 Zeichen")
5. **Submit-Button**: "Account erstellen" mit ArrowRight

**Erfolgszustand**: Success-Alert mit Hinweis zur E-Mail-Verifizierung

**Footer**: Login-Link + Shield-Icon mit AGBs-Hinweis

---

### 3.4 Passwort vergessen (`/auth/forgot-password`)

**Zweck**: Reset-Link per E-Mail anfordern

**Layout**: Zentrierte Karte, max-width-md

**UI-Elemente**:
- Mail-Icon in rundem Badge (Primary/10-Hintergrund)
- Titel: "Passwort vergessen?"
- E-Mail-Eingabefeld
- Button: "Reset-Link senden" mit ArrowRight
- Erfolgs-Alert: "Falls deine E-Mail registriert ist, erhältst du einen Reset-Link."
- "Zurück zum Login"-Link mit ArrowLeft

---

### 3.5 Passwort zurücksetzen (`/auth/reset-password`)

**Zweck**: Neues Passwort setzen mit Token aus E-Mail

**UI-Elemente**:
- Lock-Icon in rundem Badge
- Titel: "Neues Passwort setzen"
- Neues-Passwort-Feld (Placeholder: "Mindestens 8 Zeichen")
- Button: "Passwort zurücksetzen" mit ArrowRight
- Erfolgs-Alert mit automatischer Weiterleitung
- Fehler-Alert bei fehlendem/ungültigem Token

---

### 3.6 E-Mail-Verifizierung (`/auth/verify`)

**Zweck**: E-Mail-Adresse bestätigen nach Registrierung

**Layout**: Zentriert, max-width-sm

**Zustände**:
- **Laden**: Großer Spinner mit "Verifiziere..."
- **Erfolg**: CheckCircle2 (Success) + "E-Mail erfolgreich verifiziert! Du wirst weitergeleitet..."
- **Fehler**: XCircle (Destructive) + Fehlermeldung + "Zurück zum Login"-Button

---

## 4. Layouts & Navigation

### 4.1 Öffentliches Layout

**Header** (fixiert, 57px mobil / 73px Desktop):
- Glasmorphischer Effekt (backdrop-blur, semi-transparent)
- Logo: "EL"-Badge (8x8px) + "EduLink"-Text
- **Desktop-Navigation** (lg:+): Home, Login, Registrieren
- **Rechts** (lg:+): "public"-Badge + "Anmelden"-Button (Ghost) + "Jetzt registrieren"-Button (Primary)
- **Mobil**: Hamburger-Menü mit Items + CTA "Jetzt kostenlos starten"

**Auth-Check**: Bereits angemeldete Nutzer werden automatisch zum Dashboard weitergeleitet.

---

### 4.2 Geschütztes Layout

**Header** (fixiert, 73px, z-50):
- Glasmorphischer Effekt (backdrop-blur, semi-transparent)
- Logo: "EL"-Badge (9x9px) + "EduLink"-Text (Link zum rollenbasierten Home)

#### Desktop-Navigation (md:+, rollenbasiert)

**Erzieher sehen**:
| Link | Route |
|------|-------|
| Schichtplan | /schichtplan |
| Bedarfe | /bedarfe |
| Zeiterfassung | /zeiterfassung |
| Verfügbarkeit | /verfuegbarkeit |
| Dokumente | /dokumente |
| *"Mehr"-Dropdown (md):* | |
| - Stundenzettel | /stundenzettel |
| - Urlaub | /urlaub |
| - Bewertungen | /bewertungen |
| *Inline (lg:+):* | |
| - Stunden | /stundenzettel |
| - Urlaub | /urlaub |
| - Bewertungen | /bewertungen |

**Einrichtungen sehen**:
| Link | Route |
|------|-------|
| Dashboard | /kita |
| Profil | /kita/profil |
| Bedarfe | /kita/bedarfe |
| Einsätze | /kita/einsaetze |
| Zeiterfassung | /zeiterfassung |
| Bewertungen | /bewertungen |

**Admin/Koordinator**: Keine Header-Navigation (nutzt Sidebar statt dessen)

#### Rechte Header-Seite (Desktop)

1. **Rollen-Badge**:
   - Admin/Koordinator: `bg-primary/10 text-primary border-primary/20`
   - Einrichtung: `bg-success/10 text-success border-success/20`
2. **Ausstehende Zuweisungen** (nur Erzieher): Indikator-Komponente
3. **Theme-Dropdown**: Light (Sun), Dark (Moon), System (Monitor)
4. **Benachrichtigungs-Glocke**: Link zu /benachrichtigungen + roter Punkt bei ungelesenen
5. **Profil-Link**: Avatar-Kreis (8x8px, Initialen) + Vorname
6. **Session-Timer**: MM:SS-Anzeige (Monospace, Tabular-Nums)
   - Normal: Standard-Rahmen
   - Warnung (<120 Sek.): `border-destructive/50 text-destructive bg-destructive/5`
7. **Logout-Button**: Icon-only, hover: text-destructive

#### Mobiles Menü (md:-)

Vollbild-Drawer mit Backdrop-Blur:

1. **Benutzerinfo-Karte**: Avatar (10x10px) + Name + E-Mail + Rollen-Badge
2. **Rollenspezifische Links** (wie oben beschrieben)
3. **Gemeinsame Links**: Benachrichtigungen, Profil
4. **Admin-Links** (falls Admin): 11 Menüpunkte unter "Admin"-Label
5. **Theme-Toggle**: 3 Buttons (Light/Dark/System)
6. **Logout-Button** (destructive-Farbe)

---

### 4.3 Admin-Sidebar

**Nur für Admin/Koordinator-Rollen** (ausgeblendet auf Mobilgeräten)

**Position**: Fixiert, links, von Header (73px) bis unten
**Breite**: 64px (eingeklappt) oder 256px (ausgeklappt)
**Übergang**: 300ms Animation
**Zustand wird in localStorage gespeichert**: `sidebarCollapsed`

**Navigationseinträge** (13 Stück):

| Icon | Label | Route |
|------|-------|-------|
| LayoutDashboard | Dashboard | /admin |
| Calendar | Schichtplaner | /admin/planer |
| Briefcase | Schichten | /admin/schichten |
| Users | Mitarbeiter | /admin/mitarbeiter |
| UserPlus | Onboarding | /admin/onboarding |
| Building2 | Einrichtungen | /admin/einrichtungen |
| Palmtree | Urlaubsanträge | /admin/urlaubsantraege |
| ClipboardList | Bewerbungen | /admin/bewerbungen |
| Briefcase | Bedarfe | /admin/bedarfe |
| FileText | Dokumente | /admin/dokumente |
| ClipboardCheck | Stundenzettel | /admin/stundenzettel |
| ArrowUpDown | ERP-Sync | /admin/erp-sync |
| Shield | Audit-Log | /admin/audit |

**Styling**:
- Aktiv: `bg-primary/10 text-primary border-primary/10`
- Inaktiv: `text-muted-foreground hover:text-foreground hover:bg-muted`
- Eingeklappt: Nur Icons, zentriert
- Badges: Nur im ausgeklappten Zustand sichtbar

---

### 4.4 Admin-Breadcrumb

- Automatisch generiert aus Route-Hierarchie
- Versteckt auf Dashboard (≤1 Element)
- Dynamische Labels via Context (z.B. Einrichtungsnamen für ID-Routen)
- Vordefinierte deutsche Bezeichnungen für alle Admin-Routen

---

## 5. Erzieher-Bereich

### 5.1 Dashboard (`/dashboard`)

**Zweck**: Zentrale Übersichtsseite mit allen wichtigen Informationen für den Erzieher auf einen Blick.

**Layout**: 3-Spalten-Grid (lg:col-span-2 links, 1 rechts), responsiv auf 1 Spalte

#### Begrüßung
- Tageszeitabhängig: "Guten Morgen/Tag/Abend, **{Vorname}**"
- Untertitel: "Hier ist deine Übersicht für die kommenden Tage."

#### Statistik-Karten (4 Spalten, responsiv 1→2→4)

| Icon | Titel | Wert | Beschreibung |
|------|-------|------|-------------|
| Clock | Stunden diese Woche | API-Daten | "Erfasst" |
| Calendar | Geplante Schichten | API-Daten | "Bestätigt" |
| Briefcase | Verfügbare Schichten | API-Daten | "Zum Bewerben" |
| Palmtree | Urlaubstage | API-Daten | "Verbleibend" |

#### Hauptbereich (links, 2/3 Breite)

**Deine nächsten Schichten** (max. 3):
- Header mit "Alle ansehen"-Link (ArrowRight)
- Pro Schicht:
  - Einrichtungs-Icon (farbiger Kreis mit Initialen)
  - Einrichtungsname (groß)
  - Datum-Badge (Calendar-Icon + kompaktes Datum)
  - Zeit-Badge (Clock-Icon + Start-Ende)
  - Arbeitszeit: "Xh" (rechts)
  - Verdienst: "€X" in Primary-Farbe (rechts)
  - Status-Badge: CheckCircle2 + "Bestätigt"
- Empty State: CalendarDays-Icon, "Keine anstehenden Schichten"

**Verfügbare Schichten** (max. 3):
- Header mit "Alle ansehen"-Link
- Grid von Karten, pro Schicht:
  - Einrichtungs-Icon mit erstem Buchstaben
  - Einrichtungsname (hover → Primary)
  - Datum (Calendar-Icon)
  - Zeit (Clock-Icon)
  - Entfernungs-Badge (MapPin + km, falls verfügbar)
  - Stundenlohn-Badge (Euro-Icon + €/h, Primary-Farben)
  - Stunden + geschätzter Verdienst: "Xh · ~€X"
  - "Bewerben"-Button mit Arrow-Icon
- Empty State: Briefcase-Icon, "Keine offenen Schichten"

#### Seitenleiste (rechts, 1/3 Breite)

**Wochenübersicht**:
- 3 Zeilen in Karte:
  1. "Gearbeitet" | Gesamtstunden
  2. "Geplant" | Geplante Stunden oder "—"
  3. "Verdienst (est.)" | €X oder "—"

**Offene Anträge**:
- Liste offener Urlaubsanträge:
  - Typ-Badge (z.B. "Urlaub")
  - Status-Badge: "Ausstehend"
  - Calendar-Icon + Datumsbereich
  - Tage-Anzahl
- Empty State: "Keine offenen Anträge."

**Schnellzugriff** (2x2 Grid von Outline-Buttons):
| Icon | Label | Route |
|------|-------|-------|
| Clock | Zeiten | /verfuegbarkeit |
| Palmtree | Urlaub | /urlaub |
| FileText | Dokumente | /dokumente |
| ClipboardCheck | Stunden | /stundenzettel |

---

### 5.2 Schichtplan (`/schichtplan`)

**Zweck**: Persönlicher Dienstplan mit Kalender- und Listenansicht aller zugewiesenen Schichten.

**Layout**: Max-Width-Container mit Header

**Header**:
- Titel: "Schichtplan"
- Untertitel: "Dein persönlicher Dienstplan und Übersicht aller Schichten."

**Tabs**: "Kalender" | "Liste"

#### Tab: Kalender
- Monatsnavigation: ← **{Monat} {Jahr}** →
- Wochentage-Grid (7 Spalten): Mo, Di, Mi, Do, Fr, Sa, So
- Kalender-Grid (7x6):
  - Leere Zellen (grauer Hintergrund)
  - Tages-Zellen (weißer Hintergrund, Primary-Rahmen wenn heute):
    - Tagesnummer (Primary wenn heute)
    - Schicht-Buttons (Primary-Hintergrund, weißer Text):
      - Startzeit (klein)
      - Erster Wort des Einrichtungsnamens
      - Bei Klick: Schichtdetail-Modal öffnen

#### Tab: Liste
- Geteilte Liste (divide-y):
  - Pro Schicht:
    - Calendar-Icon-Kreis (Primary/10)
    - Einrichtungsname (fett)
    - Datum (lang formatiert, muted)
    - Zeitbereich "Start - Ende Uhr"
    - Stundenlohn + "/h" (fett, rechts)
    - Stunden-Berechnung
    - Status-Badge
    - Bei Klick: Schichtdetail-Modal
- Empty State: CalendarDays-Icon, "Keine Schichten"

#### Schichtdetail-Modal

**Inhalt**:
- **Einrichtungs-Box** (grauer Hintergrund):
  - Label: "Einrichtung" mit MapPin-Icon
  - Einrichtungsname (fett, groß)
  - Adresse (klein, muted)
- **2-Spalten-Grid**:
  1. Datum (Calendar-Icon + langes Datum)
  2. Zeit (Clock-Icon + "Start - Ende Uhr")
  3. Stundenlohn (Euro-Icon + "€X/h")
  4. Status (Icon + Badge)

**Aktions-Buttons** (nur bei Status "assigned"):
- "Navigation starten" (Outline, MapPin-Icon → öffnet Google Maps)
- "Schicht absagen" (Destructive, Ladezustand: "Wird abgesagt...")

---

### 5.3 Bedarfe (`/bedarfe`)

**Zweck**: Übersicht offener Personalbedarfe von Einrichtungen mit Bewerbungsmöglichkeit.

**Layout**: Max-Width-Container

**Header**:
- Briefcase-Icon + Titel: "Offene Bedarfe"
- Untertitel: "Durchsuchen Sie offene Personalbedarfe und bewerben Sie sich."

**Bedarfskarten** (Grid):
- Pro Bedarf:
  - **Titel** (fett)
  - **Einrichtungsname** (Primary, fett) + **Stadt** (muted)
  - **Beschreibung** (klein, muted, max. 2 Zeilen)
  - **Details-Zeile** (flex, wrap):
    - Calendar-Icon + "Start - Ende"
    - Clock-Icon + "X h/Tag" (falls verfügbar)
    - Clock-Icon + "Startzeit - Endzeit" (falls verfügbar)
  - **Qualifikations-Badges** (Outline, text-xs, flex wrap)
  - **"Bewerben"-Button** (Send-Icon)

**Bewerbungs-Dialog**:
- Titel: "Auf Bedarf bewerben"
- Beschreibung: "Bewerben Sie sich auf: {Bedarfstitel}"
- **Nachricht-Feld** (optional): Textarea, Placeholder: "Warum sind Sie für diesen Bedarf geeignet?", max. 500 Zeichen mit Zähler
- Buttons: "Abbrechen" (Outline) | "Bewerben" (Primary, Send-Icon)

**Zustände**:
- Laden: Briefcase-Icon + Loader2 (drehend)
- Leer: "Keine offenen Bedarfe" + Hinweistext

---

### 5.4 Zeiterfassung (`/zeiterfassung`)

**Zweck**: Ein-/Ausstempeln und Verwaltung aller Arbeitszeiteinträge mit Wochenübersicht.

**Layout**: Max-Width 4xl

**Header** (rollenbasiert):
- Erzieher: "Stempel dich ein und aus, um deine Arbeitszeiten zu erfassen."
- Einrichtung/Admin: "Zeiteinträge der Erzieher prüfen und bestätigen."

#### Clock In/Out Karte (nur Erzieher)
- Horizontales Layout (responsiv vertikal auf Mobil):
  - **Eingestempelt**: Success/10-Hintergrund, Success-Rahmen, pulsierende Timer-Icon, Elapsed-Time (Mono)
  - **Nicht eingestempelt**: Muted/50-Hintergrund, graues Icon, "Bereit zum Starten"
  - Button: "Einstempeln" (Success, Play-Icon) oder "Ausstempeln" (Destructive, Square-Icon)

#### Wochen-Navigator
- ← **KW {Nr.} · {Kompaktdatum}** → + "Heute"-Button (wenn nicht aktuelle Woche)

#### Zusammenfassungs-Karten (4 Spalten)

| Icon | Titel | Wert | Farbe |
|------|-------|------|-------|
| Clock | Gesamt | Gesamtstunden | Standard |
| CalendarDays | Einträge | Anzahl | Standard |
| CheckCircle2 | Bestätigt | Bestätigte | Success |
| AlertTriangle | Offen | Offene | Warning |

#### Zeiteintrags-Liste

Pro Eintrag:
- **Links**:
  - Datum (fett) + Status-Badge + "Aktiv"-Badge (wenn ohne Clock-Out)
  - Clock-Icon + "Eingestempelt - Ausgestempelt (oder ...)"
  - Pausenminuten (falls > 0)
  - Benutzername (falls verfügbar, fett)
  - Notizen (kursiv, muted)
- **Rechts**:
  - Gesamtzeit MM:SS (fett, groß)
  - Stunden-Format (sehr klein, muted)
- **Aktions-Buttons**:
  - Erzieher (abgeschlossene Schicht): Edit-Icon-Button
  - Einrichtung/Admin (offen + abgeschlossen): "Bestätigen" (Outline, CheckCircle2) + "Einspruch" (Ghost, AlertTriangle)

**Empty State**: Timer-Icon, "Keine Einträge", "In dieser Woche wurden noch keine Zeiten erfasst."

#### Modale Dialoge

**Ausstempeln-Dialog**:
- Pausenzeit (Minuten): Number-Input (min: 0, max: 480)
- Notizen (optional): Textarea (Placeholder: "z.B. Besonderheiten...")
- Buttons: "Abbrechen" | "Ausstempeln" (Destructive, Square-Icon)

**Korrektur-Dialog**:
- Warnbox (bei bereits bestätigten/angefochtenen Einträgen): AlertTriangle + Statusmeldung
- Beginn: datetime-local Input
- Ende: datetime-local Input
- Pause (Minuten): Number-Input
- Begründung (Pflichtfeld): Textarea, Placeholder: "Warum wird der Eintrag korrigiert?"
- Buttons: "Abbrechen" | "Korrektur speichern" (deaktiviert ohne Begründung)

**Einspruch-Dialog**:
- Begründung (Pflichtfeld): Textarea, Placeholder: "Warum wird Einspruch erhoben?"
- Buttons: "Abbrechen" | "Einspruch einreichen" (Destructive)

---

### 5.5 Verfügbarkeit (`/verfuegbarkeit`)

**Zweck**: Wochenzeitplan und individuelle Verfügbarkeiten für Einsätze verwalten.

**Layout**: Max-Width 4xl

#### Globale Verfügbarkeit

- Power-Icon (Success/10 wenn verfügbar, Destructive/10 wenn nicht)
- Titel: "Globale Verfügbarkeit"
- Statustext:
  - Verfügbar: "Du bist aktuell für Einsätze verfügbar."
  - Nicht verfügbar: "Du bist aktuell nicht für Einsätze verfügbar."
- **Switch-Toggle** (rechts)

#### Zusammenfassung (2 Spalten)
- CalendarDays-Icon + "Verfügbare Tage" → "{X} / 7"
- Clock-Icon + "Wochenstunden (Max)" → "{X.X}h"

#### Wochenplan-Karte

- Header: "Wochenplan" + "Zurücksetzen"-Button (RotateCcw, deaktiviert ohne Änderungen) + "Speichern"-Button (Save, deaktiviert ohne Änderungen)
- **7 Tageszeilen** (Montag bis Sonntag):
  - Switch-Toggle + Tagesname (fett)
  - Wenn verfügbar:
    - "Von"-Zeiteingabe + "Bis"-Zeiteingabe (2-Spalten auf Mobil)
    - Berechnete Stunden (Clock-Icon, nur Desktop)
    - Styling: `border-primary/30, bg-primary/5, shadow-sm`
  - Wenn nicht verfügbar:
    - "An diesem Tag bist du nicht verfügbar." (kursiv, muted, nur Desktop)
    - Styling: `border-border, bg-muted/20, opacity-80`

#### Einzelne Tage-Karte

- Header: "Einzelne Tage" + Untertitel + "Hinzufügen"-Button (Plus)
- Liste der Datums-Einträge:
  - Badge: "Verfügbar" (Success) oder "Nicht verfügbar" (Destructive)
  - Datum (fett)
  - Zeitbereich (klein, muted)
  - Notizen (kursiv, muted)
  - Löschen-Button (Trash2)
- Empty State: Clock-Icon, "Keine Verfügbarkeit", "Tragen Sie Ihre Verfügbarkeit ein"

**Hinzufügen-Dialog**:
- Modus-Toggle: "Einzelner Tag" (CalendarDays) | "Zeitraum" (CalendarRange)
- Datum: Ein Date-Input oder zwei Date-Inputs (Von/Bis)
- Uhrzeit: Von/Bis (2-Spalten, Time-Inputs)
- Verfügbar-Toggle: Switch + "Verfügbar"/"Nicht verfügbar"
- Notizen (optional): Input, max. 500 Zeichen
- Buttons: "Abbrechen" | "Speichern"

---

### 5.6 Urlaub & Abwesenheiten (`/urlaub`)

**Zweck**: Urlaubskonto einsehen, Abwesenheitsanträge stellen und verwalten.

**Layout**: Max-Width 4xl

**Header**: Titel + "Neuer Antrag"-Button (Plus, volle Breite auf Mobil)

#### Urlaubskonto-Karte
- Header-Bar (Primary/5-Hintergrund): Palmtree-Icon + "Urlaubskonto"
- **4-Spalten-Grid** (responsiv 2x2):
  | Wert | Bezeichnung |
  |------|-------------|
  | {Jahresurlaub} | Tage (Jahresurlaub) |
  | {Genommen} | Tage (Genommen) |
  | {Beantragt} (Warning) | Tage (Beantragt) |
  | {Verbleibend} (Primary) | Tage (Verbleibend) |
- **Fortschrittsbalken**: Zwei Segmente (Genommen: foreground/30, Beantragt: warning)
- Beschriftung: "0 Tage" | "{Gesamt} Tage Gesamt"

#### Offene Anträge (falls vorhanden)
- Header: AlertCircle (Warning) + "Offene Anträge"
- Pro Antrag:
  - Typname (fett, groß) + Status-Badge "Ausstehend"
  - Calendar-Icon + Datumsbereich | Clock-Icon + Tage-Anzahl
  - Grund (falls vorhanden, muted/30-Hintergrund)
  - "Stornieren"-Button (Ghost, Destructive-Text)

#### Vergangene Anträge
- Titel: "Vergangene Anträge"
- Geteilte Liste:
  - Typname + Status-Badge
  - Datumsbereich + Tage-Anzahl
  - Grund (kursiv, muted, versteckt auf Mobil)
- Empty State: TreePalm-Icon, "Kein Urlaub"

**Neuer-Antrag-Dialog**:
- **Art der Abwesenheit** (Select): Urlaub, Krankheit, Persönlich, Sonstiges
- **Datumsbereich** (2-Spalten): Von (Date) + Bis (Date)
- **Dauer-Anzeige** (wenn beide Daten gewählt): Clock-Icon + "Dauer: {X} Tage" (muted Hintergrund)
- **Grund** (optional): Textarea
- Buttons: "Abbrechen" | "Antrag einreichen" (deaktiviert ohne Daten)

---

### 5.7 Bewertungen (`/bewertungen`)

**Zweck**: Erhaltene Bewertungen und Durchschnittswerte einsehen.

**Layout**: Max-Width 4xl

#### Durchschnitts-Übersicht (3-Spalten-Grid)
1. **Gesamtbewertung**: Wert (fett, groß) + StarDisplay (md) + "{X} Bewertung(en)"
2-4. **Kategorie-Durchschnitte**:
   - Einarbeitung
   - Arbeitsatmosphäre
   - Pädagogische Arbeit
   - Zuverlässigkeit
   - Jeweils mit StarDisplay (md)

#### Einzelne Bewertungen
- Geteilte Liste, pro Bewertung:
  - **Header**: User-Icon + Name (fett) | Badge "Erzieher"/"Einrichtung" | Datum (sehr klein)
  - **Kategorien** (2-Spalten-Grid): Kategoriename + StarDisplay (sm)
  - **Kommentar** (falls vorhanden): MessageSquare-Icon + Text (grauer Hintergrund)
- Empty State: Star-Icon, "Noch keine Bewertungen"

---

### 5.8 Stundenzettel (`/stundenzettel`)

**Zweck**: Monatliche Übersicht der Arbeitszeiten und Vergütung mit PDF-Export.

**Layout**: Max-Width 4xl

#### Monatswähler
- Button-Gruppe: ← **{Monat} {Jahr}** →
- "PDF Export"-Button (Download-Icon, Outline)

#### Zusammenfassungs-Karten (4 Spalten)

| Icon | Titel | Wert |
|------|-------|------|
| Clock | Gesamt | Gesamtstunden |
| Euro | Verdienst | €{Gesamtverdienst} |
| CheckCircle2 (Success) | Bestätigt | Bestätigte Stunden |
| AlertCircle (Primary) | Ausstehend | Ausstehende Stunden |

#### Eintrags-Liste
- Pro Eintrag:
  - **Links**: Calendar-Icon + Datum (fett) | Status-Badge | Einrichtungsname (fett) | Clock-Icon + Zeitbereich | Pausenminuten
  - **Rechts** (border-top auf Mobil): Stunden (fett, groß) + "Stunden"-Label | Verdienst (fett, groß, Primary) + "Verdienst"-Label
- Empty State: FileText-Icon, "Keine Stundenzettel"

**Hinweis-Box**: AlertCircle-Icon + "Hinweis: Die Auszahlung erfolgt automatisch zum Monatsende..."

---

### 5.9 Dokumente (`/dokumente`)

**Zweck**: Upload und Verwaltung von Zertifikaten, Qualifikationsnachweisen und Ausweisen.

**Layout**: Max-Width 4xl

**Header**: Titel + "Dokument hochladen"-Button (Upload-Icon)

#### Statistik-Karten (4 Spalten)
| Titel | Wert | Farbe |
|-------|------|-------|
| Gesamt | Gesamtanzahl | Standard |
| Verifiziert | Verifizierte | Success |
| Ausstehend | Ausstehende | Primary |
| Problemfälle | Ablaufend/Abgelaufen | Destructive |

#### Ablauf-Warnung (falls vorhanden)
- Karte mit Destructive-Rahmen/-Hintergrund
- AlertTriangle-Icon + "Handlungsbedarf"
- Liste: "• {Name} {Status}"

#### Warten auf Verifizierung (falls vorhanden)
- Header: Clock-Icon (Primary) + "Warten auf Verifizierung"
- Grid von Karten:
  - FileText-Icon (Primary/10)
  - Name (fett, abgeschnitten)
  - Typ (klein, muted)
  - Upload-Datum (sehr klein, muted)
  - "Ausstehend"-Badge

#### Verifizierte Dokumente
- Header: CheckCircle2 (Success) + "Verifizierte Dokumente"
- Grid von Karten:
  - FileText-Icon (Success/10)
  - Name (fett, abgeschnitten)
  - Typ (klein, muted)
  - Ablaufdatum (Destructive wenn bald ablaufend, sonst muted)
  - "OK"-Badge (Success)
- Empty State: FileText-Icon, "Keine Dokumente"

**Upload-Dialog**:
- **Dokumentname**: Input (Placeholder: "z.B. Erste-Hilfe-Zertifikat")
- **Art des Dokuments** (Select): Zertifikat, Qualifikation, Ausweis, Sonstiges
- **Gültig bis** (optional): Date-Input
- **Datei**: Drag-Drop-Zone (gestrichelter Rahmen):
  - Upload-Icon
  - Gewählt: File-Icon + Dateiname (Primary)
  - Leer: "Klicken zum Auswählen oder Datei hierher ziehen" + "PDF, JPG oder PNG (max. 10MB)"
- Buttons: "Abbrechen" | "Hochladen" (deaktiviert ohne Datei)

**Dokumentdetail-Dialog**:
- Titel: Dokname + CheckCircle2 (wenn verifiziert)
- 2-Spalten-Grid: Typ, Status (Badge), Upload-Datum, Ablaufdatum
- Dateivorschau: FileText-Icon
- Buttons: "Löschen" (Destructive, Trash2) | "Herunterladen" (Outline, Download) | "Schließen"

---

### 5.10 Benachrichtigungen (`/benachrichtigungen`)

**Zweck**: Alle wichtigen Updates zu Schichten, Anträgen und Dokumenten.

**Layout**: Max-Width 4xl

**Header**: Titel + "Alle als gelesen markieren"-Button (CheckCircle2, nur wenn Ungelesene vorhanden)

#### Filter-Leiste
- 2 Buttons: "Alle" | "Ungelesen" (mit Zähler-Badge)

#### Benachrichtigungs-Liste
Pro Benachrichtigung:
- **Linker Rahmen**: Primary wenn ungelesen, transparent wenn gelesen
- **Hintergrund**: Primary/5 wenn ungelesen, muted/30 bei Hover wenn gelesen
- **Icon-Kreis** (links):
  - Typ-abhängig: Briefcase (Schicht), Calendar (Urlaub), FileText (Dokument), Bell (Allgemein)
  - Farblich: Primary, Warning, Info, Muted
- **Inhalt**:
  - Titel (fett wenn ungelesen, muted wenn gelesen)
  - Ungelesen-Puls-Punkt (rechts, blau)
  - Nachricht (klein, muted)
  - Zeitstempel (sehr klein, Clock-Icon)
- **Klick**: Markiert als gelesen

**Empty State**: Bell-Icon, "Keine Benachrichtigungen"

---

## 6. Einrichtungs-Bereich

### 6.1 Einrichtungs-Dashboard (`/kita`)

**Zweck**: Zentrale Übersicht für Einrichtungspersonal mit Schnellzugriff auf alle wichtigen Funktionen.

**Layout**: Max-Width 6xl

#### Begrüßung
- Tageszeitabhängig: "Guten Morgen/Tag/Abend, **{Name}**"
- Untertitel: "Willkommen im Einrichtungsportal von {Einrichtungsname}."

#### Einrichtungsinfo-Karte (falls Daten vorhanden)
- Building2-Icon (Success/10, groß)
- Einrichtungsname (fett, xl) + Status-Badge (aktiv/inaktiv)
- Adresse (MapPin-Icon + Straße, PLZ Stadt)
- Beschreibung (falls vorhanden)
- "Profil bearbeiten"-Button (Outline, → /kita/profil)

#### Statistik-Karten (4 Spalten)

| Icon | Titel | Wert |
|------|-------|------|
| Briefcase | Offene Bedarfe | Anzahl |
| Users | Aktive Einsätze | Schichten diesen Monat |
| ClipboardCheck | Stunden bestätigt | Anzahl |
| Building2 | Bewertungen | Durchschnitt |

#### 2-Spalten-Grid

**Schnellzugriff** (2x2 Button-Grid):
| Icon | Label | Route |
|------|-------|-------|
| Briefcase | Bedarf melden | /kita/bedarfe |
| Users | Einsätze | /kita/einsaetze |
| Building2 | Profil | /kita/profil |
| ClipboardCheck | Stunden bestätigen | /benachrichtigungen |

**Letzte Aktivitäten**:
- Aktivitäten-Timeline
- Empty State: History-Icon, "Keine Aktivitäten"

---

### 6.2 Einrichtungsprofil (`/kita/profil`)

**Zweck**: Stammdaten der Einrichtung verwalten und aktualisieren.

**Layout**: Max-Width 3xl

**Header**: Building2-Icon + "Einrichtungsprofil" (Serif, 3xl)

**Formular-Karte** (Grid 1-2 Spalten):
| Feld | Typ | Placeholder |
|------|-----|-------------|
| Name der Einrichtung | Text | "z.B. Kita Sonnenschein" |
| Typ | Select | Kindergarten / Schule / Kindertagesstätte / Sonstige |
| Adresse | Text | "Straße und Hausnummer" |
| PLZ | Text (maxLength: 5) | "12345" |
| Stadt | Text | "Berlin" |
| Telefon | Text | "+49 30 12345678" |
| E-Mail | Email | "info@kita.de" |
| Ansprechpartner | Text | - |
| Beschreibung | Textarea (4 Zeilen) | - |

- **Speichern-Button**: "Profil speichern" (Save-Icon, Ladezustand mit Loader2)

---

### 6.3 Bedarfsmeldungen (`/kita/bedarfe`)

**Zweck**: Personalbedarfe erstellen und verwalten, um passende Erzieher zu finden.

**Layout**: Max-Width 6xl

**Header**: Briefcase-Icon + "Bedarfsmeldungen" + "Neuer Bedarf"-Button (Plus)

#### Bedarfskarten (Grid)
Pro Bedarf:
- Titel + Status-Badge (open/assigned/cancelled/completed)
- Beschreibung (2 Zeilen, abgeschnitten)
- Meta-Info: Calendar + Datum | Clock + h/Tag | Users + zugewiesener Erzieher
- Qualifikations-Badges (Outline)
- **Aktions-Buttons** (nur bei "open"):
  - "Bewerbungen" (Eye-Icon)
  - Abbrechen-Button (X-Icon)

**Empty State**: Briefcase-Icon, "Keine Bedarfe vorhanden", "Erstellen Sie Ihren ersten Personalbedarf"

**Bedarf-Erstellen-Dialog**:
| Feld | Typ | Details |
|------|-----|---------|
| Titel | Text | Pflichtfeld |
| Beschreibung | Textarea (3 Zeilen) | Optional |
| Startdatum | Date | Pflichtfeld |
| Enddatum | Date | Pflichtfeld |
| Stunden/Tag | Number (1-24, 0.5-Schritte) | Optional |
| Von | Time | Optional |
| Bis | Time | Optional |
| Qualifikationen | Checkboxen (9 Optionen, scrollbar) | Optional |

**Bewerbungen-Dialog**:
- Titel + "{Anzahl} Bewerbung(en)"
- Pro Bewerbung: Name, E-Mail, Notizen (kursiv), Status-Badge
- Bei "pending": Annehmen (CheckCircle2) + Ablehnen (XCircle)
- Empty State: "Noch keine Bewerbungen eingegangen."

---

### 6.4 Einsätze (`/kita/einsaetze`)

**Zweck**: Übersicht aller aktiven und vergangenen Erzieher-Einsätze in der Einrichtung.

**Layout**: Max-Width 6xl

**Header**: Users-Icon + "Einsätze"

**Empty State**: Users-Icon, "Keine Einsätze vorhanden", "Sobald Erzieher Ihrer Einrichtung zugewiesen werden, erscheinen sie hier."

---

## 7. Admin/Koordinator-Bereich

### 7.1 Admin Dashboard (`/admin`)

**Zweck**: Gesamtübersicht des Systems mit Kennzahlen, Wochenstatistik und dringenden Aufgaben.

**Layout**: Max-Width 1400px, Bento-Grid (5 Spalten, responsiv)

**Header**: "Admin Dashboard" + Wochen-Navigator: "Heute"-Button (Calendar) + ← **KW-Bereich** →

#### Statistik-Karten (3 kleine Karten)

| Icon | Farbe | Titel | Wert |
|------|-------|-------|------|
| Users | Primary | Aktive Erzieher | Anzahl (+ "Total: {X}"-Badge) |
| Building2 | Purple | Partner Einrichtungen | Anzahl |
| Briefcase | Warning | Offene Schichten | Anzahl (Warning-Farbe) |

#### Verwaltung Schnellzugriff (breite Karte, 2x3 Grid)

| Icon | Label | Route | Badge |
|------|-------|-------|-------|
| UserPlus | Bewerbungen | /admin/bewerbungen | Ausstehende Anzahl |
| Palmtree | Urlaubsanträge | /admin/urlaubsantraege | Ausstehende Anzahl |
| Briefcase | Schichten verwalten | /admin/schichten | - |
| Calendar | Planer öffnen | /admin/planer | - |
| Briefcase | Bedarfe verwalten | /admin/bedarfe | - |

#### Wochenübersicht-Chart (große Karte, 3 Spalten, 2 Zeilen)
- Header: Clock-Icon + "Wochenübersicht"
- Legende: Grün "Besetzt", Gelb "Offen"
- **Gestapeltes Balkendiagramm** (7 Tage):
  - Segmente: Abgeschlossen (Info/50), Besetzt (Success), Offen (Warning)
  - Hover-Tooltips mit Anzahlen
  - Tagesname-Labels darunter

#### Dringend-Karte (2 Spalten)
- Header: AlertCircle (Destructive) + "Dringend" + "High Priority"-Badge
- Liste dringender Aufgaben:
  - AlertCircle (Destructive bei hoch, Warning bei mittel)
  - Nachricht + "Bitte zeitnah prüfen."
- Alles erledigt: CheckCircle2, "Alles erledigt! Keine dringenden Aufgaben." (Success/50)

#### Aktivitäten-Karte (scrollbar, max-h 400px)
- Header: "Aktivitäten"
- Liste: Icon-Kreis + Nachricht + relativer Zeitstempel
- Empty State: "Keine Aktivitäten verzeichnet."

#### Top Einrichtungen-Karte (Balkendiagramm)
- Header: "Top Einrichtungen (Diesen Monat)"
- Rang + Einrichtungsname + Schichtanzahl + Fortschrittsbalken

---

### 7.2 Mitarbeiter (`/admin/mitarbeiter`)

**Zweck**: Verwaltung aller registrierten Erzieher und pädagogischen Fachkräfte.

**Layout**: Max-Width 1400px

#### Statistik-Karten (4 Spalten)
| Icon | Titel | Farbe |
|------|-------|-------|
| User | Gesamt | Standard |
| CheckCircle2 | Aktiv | Success |
| AlertCircle | Ausstehend | Warning |
| XCircle | Gesperrt | Destructive |

#### Status-Filter
- Select-Dropdown: Alle Status / Aktiv / Ausstehend / Gesperrt

#### Mobile Ansicht (Karten-Grid)
- Pro Erzieher: Name + Status-Badge, E-Mail, Telefon, Qualifikationen (max. 3 Badges), "Details anzeigen"-Button

#### Desktop Ansicht (DataTable)
| Spalte | Inhalt |
|--------|--------|
| Name | Name (fett) |
| Kontakt | E-Mail (Mail-Icon) + Telefon (Phone-Icon) |
| Status | Status-Badge |
| Qualifikationen | Badges (max. 2 + "+N") |
| Aktionen | MoreHorizontal-Button |

**Pagination** mit Seitenzahl und Größenauswahl

#### Detail-Modal
- Header: Name + Status-Badge
- 2-Spalten-Grid: E-Mail (Link), Telefon (Link), Registrierungsdatum, Rolle (Select-Dropdown: Erzieher/Koordinator/Admin)
- Qualifikationen als Badge-Liste
- **Aktions-Buttons**:
  - Pending → "Konto aktivieren" (Success)
  - Active → "Konto sperren" (Destructive)
  - Suspended → "Reaktivieren"

---

### 7.3 Bewerbungen (`/admin/bewerbungen`)

**Zweck**: Verwaltung und Bearbeitung von Schichtbewerbungen der Mitarbeiter.

**Layout**: Max-Width 1400px

#### Statistik-Karten (4 Spalten)
| Icon | Farbe | Titel |
|------|-------|-------|
| ClipboardList | Primary | Gesamt |
| AlertCircle | Warning | Ausstehend |
| CheckCircle2 | Success | Angenommen |
| XCircle | Destructive | Abgelehnt |

#### Filter-Karte
- Status-Select (pending/all/approved/rejected mit Zählern)
- Sortier-Select (shiftDate/applicant/createdAt)
- Sortierrichtungs-Button (↑/↓)

#### Gruppierte Bewerbungen (nach Schicht)
Pro Schichtgruppe (Karte):
- **Header** (muted/30): Einrichtungsname (MapPin) + Datum (Calendar) + Zeit (Clock) + Badge "{X} Bewerbung(en)"
- **Bewerbungsliste** (divide-y):
  - Avatar (10x10, Initialen)
  - Name, E-Mail, "Beworben am {Datum}"
  - Status-Badge
  - Buttons: "Details" + "Annehmen" (Success) bei pending

#### Detail-Dialog
- Avatar + Name + Bewerbungsdatum
- Link: "→ Mitarbeiter" (ExternalLink)
- **Bewerberprofil** (muted/30):
  - Mail + Telefon + Stadt + Stundenlohn
  - Qualifikationen (Outline-Badges)
- **Schichtinfo** (muted/30): Einrichtung + Datum + Zeit
- **Bei Pending**: Ablehnungsgrund-Textarea (optional)
- Buttons: "Abbrechen" | "Ablehnen" (Destructive) | "Annehmen" (Success)

---

### 7.4 Urlaubsanträge (`/admin/urlaubsantraege`)

**Zweck**: Genehmigung und Verwaltung von Abwesenheitsanträgen der Mitarbeiter.

**Layout**: Max-Width 1400px

#### Statistik-Karten (4 Spalten)
Gesamt | Ausstehend (Warning) | Genehmigt (Success) | Abgelehnt (Destructive)

#### Filter-Buttons (flex wrap)
- Ausstehend ({Anzahl}) | Alle | Genehmigt | Abgelehnt
- Farblich hervorgehoben wenn aktiv

#### Mobile Ansicht (Karten)
Pro Antrag: Name + Datum + Status-Badge, Typ-Badge, Datumsbereich + Tage, Grund (kursiv), Aktions-Button

#### Desktop Ansicht (Tabelle)
| Spalte | Inhalt |
|--------|--------|
| Mitarbeiter | Name + "am {Datum}" |
| Art | Typ-Badge |
| Zeitraum | Datumsbereich |
| Dauer | Tage |
| Grund | Text (abgeschnitten) |
| Status | Badge |
| Aktionen | "Entscheiden" oder "..." |

#### Prüf-Dialog
- Avatar + Name + Eingangsdatum
- Info-Grid: Typ-Badge, Dauer, Datumsbereich (CalendarDays)
- Begründung (falls vorhanden, kursiv, muted/30)
- **Bei Pending**: Notizen-Textarea (optional) + "Abbrechen" | "Ablehnen" (Destructive) | "Genehmigen" (Success)
- **Bei Entschieden**: Entscheidungsbegründung (falls vorhanden) + "Schließen"

---

### 7.5 Schichtverwaltung (`/admin/schichten`)

**Zweck**: Erstellen, Zuweisen und Verwalten aller Schichten im System.

**Layout**: Max-Width 1400px

**Header**: "Schichtverwaltung" + "Schicht erstellen"-Button (Plus)

#### Statistik-Karten (4 Spalten)
| Icon | Titel | Farbe |
|------|-------|-------|
| Briefcase | Gesamt | Standard |
| AlertCircle | Offen | Warning |
| CheckCircle2 | Besetzt | Success |
| CheckCircle2 | Abgeschlossen | Info |

#### Filter-Karte
- Suchfeld: "Nach Einrichtung oder Mitarbeiter suchen..."
- Status-Select: Alle / Offen / Besetzt / Abgeschlossen
- Sortier-Select: Datum / Einrichtung / Status / Vergütung
- Sortierrichtung (↑/↓)

#### Mobile Ansicht (Karten-Grid)
Pro Schicht: Einrichtungsname + Status-Badge, Datum, Zeit + Pause + Zuweisungsstatus, Buttons ("Zuweisen"/"Details"), Löschen-Button (Trash2, oben rechts)

#### Desktop Ansicht (Tabelle)
| Spalte | Inhalt |
|--------|--------|
| Datum | Datum (fett) |
| Einrichtung | Name |
| Zeit | Zeitbereich + Stunden |
| Status | Badge |
| Zugewiesen an | Erzieher oder "-" (+ "Bestätigung ausstehend" Warning) |
| Vergütung | €/h |
| Aktionen | Zuweisen / Details / Löschen |

#### Schicht-Erstellen-Dialog
| Feld | Typ |
|------|-----|
| Einrichtung | Combobox mit Suche (Popover/Command) |
| Datum | Date-Input |
| Von / Bis | 2x Time-Input |
| Stundenlohn (€) | Number-Input |
| Notizen (optional) | Textarea |

#### Zuweisungs-Dialog
- Schicht-Info (grau): MapPin + Einrichtung + Datum · Zeit
- Erzieher-Liste (scrollbar, max-h 300px):
  - Name (fett) + "Wählen"-Button
- Empty State: "Keine aktiven Mitarbeiter gefunden"

#### Detail-Dialog
- Einrichtungs-Box: Name (fett, groß) + Datum (Calendar) + Zeit (Clock)
- 2-Spalten-Grid: Status-Badge, Stundenlohn
- Zugewiesen an: Avatar-Kreis + Name
- Notizen (falls vorhanden, muted/30)

#### Lösch-Bestätigung
- "Sind Sie sicher, dass Sie diese Schicht löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."

---

### 7.6 Schichtplaner (`/admin/planer`)

**Zweck**: Visueller Schichtplaner für die Wochenplanung (Feature-Modul).

*Wird als separates Feature-Modul geladen.*

---

### 7.7 Bedarfsverwaltung (`/admin/bedarfe`)

**Zweck**: Zentrale Verwaltung aller Personalbedarfe aller Einrichtungen mit Matching-Funktion.

**Layout**: Max-Width 1400px

**Header**: "Bedarfsverwaltung" + Status-Filter-Select

#### Bedarfskarten (wie Einrichtungs-Bedarfe, aber mit zusätzlichen Funktionen)
- Titel + Status-Badge + Einrichtungsname (Primary)
- Beschreibung + Meta-Info + Qualifikationen
- **Aktions-Buttons** (bei "open"):
  - "Matching" (UserPlus, Outline) - findet passende Erzieher
  - "Bewerbungen" (Eye, Outline) - zeigt eingegangene Bewerbungen
  - Abbrechen (X, Ghost)
- Erweiterbare Bewerbungs-Sektion mit Annehmen/Ablehnen

#### Matching-Dialog
- Titel: "Passende Erzieher"
- "{Anzahl} verfügbare Erzieher gefunden"
- Pro Match:
  - Name, Stadt
  - **Match-Score-Badge** (% Match, farblich nach Score)
  - Stundenlohn (falls vorhanden)
  - Passende Qualifikationen (grüne Badges)
  - Fehlende Qualifikationen (rote Badges)
  - "Zuweisen"-Button (UserPlus)
- Empty State: "Keine passenden Erzieher gefunden."

---

### 7.8 Einrichtungen (`/admin/einrichtungen`)

**Zweck**: Verwaltung aller Partner-Einrichtungen und Kitas.

**Layout**: Max-Width 1400px

**Header**: "Einrichtungen" + "Einrichtung"-Button (Plus)

#### Statistik (3 Spalten)
| Icon | Titel | Farbe |
|------|-------|-------|
| Building2 | Gesamt | Primary |
| CheckCircle2 | Aktiv | Success |
| XCircle | Inaktiv | Muted |

#### Filter-Karte
- Suchfeld: "Nach Name oder Stadt suchen..."
- Typ-Filter (Select): Alle / Kita / Kindergarten / Schule
- Sortier-Select: Name / Stadt / Typ / Schichten
- Sortierrichtung (↑/↓)

#### Einrichtungs-Grid (1→2→3 Spalten, responsiv)
Pro Einrichtung (Karte, Link zur Detailseite):
- Header: Icon + Name/Typ + Status-Badge
- MapPin + Adresse
- Phone + Telefon
- Footer: "{X} Schichten/Monat" | "Details"-Button

#### Einrichtung-Erstellen-Dialog (React Hook Form)
| Feld | Validierung |
|------|-------------|
| Name der Einrichtung | Pflichtfeld |
| Typ (Select) | Pflichtfeld: daycare/kindergarten/school/other |
| Adresse | Pflichtfeld |
| PLZ | Pflichtfeld, Regex |
| Stadt | Pflichtfeld |
| Telefon | Pflichtfeld |
| E-Mail | Optional |
| Ansprechpartner | Optional |

---

### 7.9 Einrichtungsdetail (`/admin/einrichtungen/:id`)

**Zweck**: Detailansicht einer einzelnen Einrichtung mit Bedarfen und Schichten.

**Layout**: PageContainer width="wide"

#### Header-Karte
- Building2-Icon + Einrichtungsname + Status-Badge + Typ-Label
- "Bearbeiten"-Button (Pencil)

#### Statistik (4 Spalten)
| Icon | Titel | Farbe |
|------|-------|-------|
| Briefcase | Gesamte Schichten | Primary |
| CheckCircle2 | Abgeschlossen | Success |
| Calendar | Kommende | Warning |
| Users | Erzieher | Info |

#### Tabs: "Übersicht" | "Bedarfe ({X})" | "Schichten ({X})"

**Tab Übersicht**: Kontaktdaten-Karte (Adresse, Telefon, E-Mail, Ansprechpartner, Notizen)

**Tab Bedarfe**: Bedarfskarten mit Bewerbungs-/Matching-Funktionalität

**Tab Schichten**: Schichtkarten (Datum + Status + Meta + Notizen)

**Bearbeiten-Dialog**: Alle Einrichtungsfelder + Notizen-Textarea

---

### 7.10 Onboarding Pipeline (`/admin/onboarding`)

**Zweck**: Kanban-Board zur Verwaltung des Onboarding-Prozesses neuer Mitarbeiter.

**Layout**: PageContainer width="wide"

**Header**: "Onboarding Pipeline" + Lade-Indikator + "{X} Benutzer gesamt"-Badge

#### Kanban-Board (5 Spalten, horizontal scrollbar auf Mobil)

| Spalte | Icon | Farbe |
|--------|------|-------|
| Ausstehend | ClipboardList | Warning |
| Dokumentenprüfung | FileText | Info |
| Interview | MessageSquare | Purple |
| Genehmigt | CheckCircle2 | Success |
| Abgelehnt | XCircle | Destructive |

Jede Spalte hat Badge mit Anzahl.

**Sortierbare Benutzer-Karten** (Drag & Drop mit dnd-kit):
- Drag-Handle: GripVertical-Icon
- Avatar-Kreis (Initialen)
- Name + E-Mail (abgeschnitten)
- Meta: Calendar + Registrierungsdatum, FileText + Dokumentenanzahl, E-Mail-verifiziert-Badge (Warning wenn nicht)
- Drag-Overlay: shadow-xl, rotate-2

**Leere Spalte**: Search-Icon, "Keine Einträge"

---

### 7.11 Dokumentenprüfung (`/admin/dokumente`)

**Zweck**: Hochgeladene Dokumente der Erzieher prüfen und freigeben.

**Layout**: Max-Width 1400px

#### Statistik
- AlertTriangle (Warning) + "Ungeprüft": Anzahl ausstehender Dokumente

#### Dokumenten-Liste
Pro Dokument (Zeile mit muted/30-Hintergrund):
- FileText-Icon (Primary/10)
- Dokumentname + Benutzername-Badge + Typ-Badge + Ablaufdatum
- Buttons: "Vorschau" (Eye) | "Download" (Download) | "Freigeben" (CheckCircle2, Success) | "Ablehnen" (XCircle, Destructive)

**Vorschau-Dialog**:
- PDF: iframe (500px Höhe)
- Bild: img (max. 500px Höhe, zentriert)
- Buttons: "Schließen" | "Herunterladen"

**Ablehnen-Dialog**:
- Dokument-Info (Name + Benutzer + Typ)
- Begründung (Pflichtfeld): Textarea (3 Zeilen)
- Buttons: "Abbrechen" | "Ablehnen" (Destructive)

---

### 7.12 Stundenzettel Admin (`/admin/stundenzettel`)

**Zweck**: Übersicht und Statusverwaltung aller Stundenzettel.

**Layout**: Max-Width 1400px

#### Filter
- Filter-Icon + Status-Select (all/pending/approved/disputed/paid)
- Eintragsanzahl-Anzeige

#### Stundenzettel-Liste
Pro Stundenzettel (Zeile):
- Icon: FileCheck (signiert) / FilePen (unsigniert) / FileText (keines)
- "KW {Nummer}" + Status-Badge
- Meta: User + Name, Clock + Minuten, Calendar + Wochenstart
- Badges: "Signiert" (Success) / "PDF vorhanden" (Warning)
- Erstellungsdatum

---

### 7.13 ERP-Synchronisation (`/admin/erp-sync`)

**Zweck**: Übersicht und Steuerung der ERP-Anbindung (zvoove Mock) für Datensynchronisation.

**Layout**: Max-Width 1400px

**Header**: "ERP-Synchronisation" + "Sync starten"-Button (RefreshCw, dreht bei Sync)

#### Status-Karten (4 Spalten)
| Icon | Titel | Anzeige |
|------|-------|---------|
| CheckCircle2/XCircle | Status | "Verbunden"/"Fehler" |
| Database | Synchronisiert | Gesamtanzahl |
| AlertTriangle | Ausstehend | Anzahl |
| Clock | Letzter Sync | Datum/Uhrzeit oder "Noch nie" |

#### Letzte Sync-Einträge
Pro Eintrag (muted/30):
- CheckCircle2 (Success) oder XCircle (Destructive)
- Externe ID + Typ + Status-Badge + Zeitstempel

#### Info-Karte (Info-Styling)
- ArrowUpDown-Icon + "Automatischer Sync"
- "Der ERP-Sync läuft automatisch einmal täglich. Bestätigte Zeiteinträge und akzeptierte Einsätze werden mit dem ERP-System (zvoove Mock) synchronisiert."

---

### 7.14 Audit-Log (`/admin/audit`)

**Zweck**: Vollständiges Protokoll aller Systemänderungen und Aktivitäten für Nachverfolgbarkeit.

**Layout**: Max-Width 1400px

#### Filter-Karte
- Aktions-Select: Alle / Erstellen / Aktualisieren / Löschen
- Entitäts-Select: Alle / Schicht / Einrichtung / Erzieher / Urlaubsantrag / Bewerbung

#### Mobile Ansicht (Karten)
Pro Log-Eintrag: Aktions-Icon + Zeitstempel, Status-Badge, Avatar + Name, Entitäts-Badge, Änderungen, "Details anzeigen"-Button

#### Desktop Ansicht (DataTable)
| Spalte | Inhalt |
|--------|--------|
| Zeitpunkt | Formatiertes Datum/Uhrzeit |
| Benutzer | Avatar + Name |
| Aktion | Icon + Badge (create/update/delete) |
| Entität | Badge |
| Änderungen | Icon + Wert |
| Aktionen | Eye-Button |

#### Detail-Dialog
- Header-Grid: Zeitpunkt (History), Benutzer (User), Aktion (Badge), Entität (Badge)
- Entity-ID (monospace, falls vorhanden)
- **Alter Wert** (Trash2-Icon, destructive/5-Hintergrund): JSON vorformatiert
- **Neuer Wert** (Plus-Icon, success/5-Hintergrund): JSON vorformatiert
- **Metadaten** (falls vorhanden): JSON vorformatiert
- Footer: IP-Adresse + User-Agent

---

## 8. Gemeinsame Seiten

### 8.1 Profil (`/profile`)

**Zweck**: Persönliche Profildaten verwalten (alle Rollen).

*Wird als separate ProfilePage-Komponente geladen.*

---

### 8.2 Onboarding (`/onboarding`)

**Zweck**: Geführte Ersteinrichtung nach der Registrierung.

**Layout**: PageContainer, max-width-lg, zentriert

#### Schritt-Indikator
- Kreise mit Verbindungslinien:
  - Abgeschlossen: Primary-Hintergrund + CheckCircle2
  - Aktuell: Primary/10 mit Ring
  - Ausstehend: Muted

#### Erzieher-Onboarding (5 Schritte)

**Schritt 0 - Willkommen**:
- Sparkles-Icon + "Willkommen bei EduLink!"
- Checkliste: Kontaktdaten, Qualifikationen, Verfügbarkeit, Qualifikationsnachweise
- "Los geht's"-Button

**Schritt 1 - Persönliche Daten**:
- Felder: Telefonnummer, Adresse, PLZ (maxLength 5), Stadt
- Validierungsfehler unter jedem Feld

**Schritt 2 - Qualifikationen**:
- 9 Checkbox-Optionen:
  - Staatlich anerkannte/r Erzieher/in
  - Kinderpfleger/in
  - Sozialpädagoge/in
  - Heilpädagoge/in
  - Kindheitspädagoge/in
  - Erste-Hilfe-Kurs (aktuell)
  - Sprachförderung
  - Montessori-Pädagogik
  - Inklusion
- Jede Checkbox: p-3, rounded-lg, border, hover:bg-muted/50

**Schritt 3 - Verfügbarkeit**:
- Einsatzradius (km): Number (1-200)
- Stundensatz: Number (EUR/h)

**Schritt 4 - Dokumente**:
- Beschreibung + DocumentUpload-Komponente
- "Onboarding abschließen"-Button (CheckCircle2)

#### Einrichtungs-Onboarding (3 Schritte)

**Schritt 0 - Willkommen**:
- Checkliste: Einrichtungsdaten, Kontaktperson

**Schritt 1 - Einrichtungsdaten**:
- Felder: Name, Typ (Select), Adresse, PLZ, Stadt

**Schritt 2 - Ansprechpartner**:
- Felder: Name (Pflicht), Telefon (Pflicht), Beschreibung (Textarea)
- "Onboarding abschließen"-Button

---

## Anhang: Responsive Breakpoints

| Breakpoint | Pixel | Verwendung |
|------------|-------|------------|
| Default (mobil) | <640px | 1-spaltige Layouts, gestapelte Karten |
| **sm** | 640px+ | 2-spaltige Grids, kompaktere Layouts |
| **md** | 768px+ | Desktop-Navigation erscheint, Sidebar sichtbar, Tabellen statt Karten |
| **lg** | 1024px+ | 3-4 Spalten, zusätzliche Nav-Items inline |
| **xl** | 1280px+ | Volle Breite für Bento-Grids |

---

## Anhang: Status-Badge Farbschema

| Status | Hintergrund | Text | Rahmen |
|--------|------------|------|--------|
| Aktiv/Bestätigt | success/10 | success | success/20 |
| Ausstehend | warning/10 | warning | warning/20 |
| Offen | primary/10 | primary | primary/20 |
| Abgelehnt/Gesperrt | destructive/10 | destructive | destructive/20 |
| Info | info/10 | info | info/20 |
