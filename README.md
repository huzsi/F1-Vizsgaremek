# Leírás
Ez a weboldal egy átfogó Formula-1-es platform, ahol a látogatók egyrészt egy többrészes weboldal rendszeren keresztül elérhetik a Formula-1 történelmének statisztikáit valamint aktuális híreket olvashatnak az F1 világából, és egy pontrendszeren alapuló fogadási játékot is játszhatnak futamról futamra. Az oldal külön HTML fájlban jeleníti meg a híreket, míg a statisztikai adatok egy másik részben találhatóak, a fogadásokat mindkét oldalról elérhetik a felhasználók. Az oldal felhasználóbarát felületen nyújt részletes információkat a szezonokról, versenyekről, pilótákról és csapatokról.

# Elérés
[Kattints ide](https://f1statsandnews.com/)

# Funkciók
- **Statisztika:** Pilóták és csapatok eredményei (Futamgyőzelmek, Bajnoki címek), Minden megrendezett verseny teljes végeredménye futamról futamra, illetve összes szezon végeredménye.
- **Hírek:** Az F1 világának friss hírei külön HTML fájlban jelennek meg.
- **Keresési funkció:** Gyors és hatékony keresés a pilóták és csapatok között.
- **Interaktív statisztikák:** Grafikonok és vizualizációk a szezonok teljesítményéről.

# Technológiai háttér
- HTML5
- CSS3
- Python (Django)
- JavaScript
- MySQL

# Mappastruktúra
```
├── !News / # Weboldal mappa
|    └── Frontend / # Frontend fájlok (HTML, CSS, FONTS, JS)
|        └── html / # HTML fájlok        
|        └── css / # Stílusfájlok
|        └── fonts / # Betűtípusok
|        └── img / # Képek
|        └── js / # Javascript fájlok 
|    └── Backend / # Backend fájlok (Django, js)
|        └── js / # Javascript fájlok
|        └── application / # Django konfiguráló fájlok (Settings, URLs)
|            └──  __pycache__/ # Django Cache fájlok
|            └── application / # Django konfiguráló fájlok (Settings, URLs)
|                └──  __pycache__/ # Django Cache fájlok
|            └── static_files/ # Ide illesztjük be a Frontend fájlok Statikus részét (CSS, JS, IMGs)
|                └── admin/ # Django alap admin panel
|                └── index/ # Countdown
|                └── statics/ # Frontend mappából be másolt statikus fájlok
|            └── templates/ # Megjeleníthető HTML fájlok
|                └── static_pages/ # HTMLs
|            └── tmp/ # Temp Fájlok
├── !Stats / # Weboldal mappa
|    └── Frontend / # Frontend fájlok (HTML, CSS, FONTS, JS)
|        └── html / # HTML fájlok        
|        └── css / # Stílusfájlok
|        └── fonts / # Betűtípusok
|        └── img / # Képek
|        └── js / # Javascript fájlok 
|    └── Backend / # Backend fájlok (Django, js)
|        └── js / # Javascript fájlok
|        └── application / # Django konfiguráló fájlok (Settings, URLs)
|            └──  __pycache__/ # Django Cache fájlok
|            └── application / # Django konfiguráló fájlok (Settings, URLs)
|                └──  __pycache__/ # Django Cache fájlok
|            └── static_files/ # Ide illesztjük be a Frontend fájlok Statikus részét (CSS, JS, IMGs)
|                └── admin/ # Django alap admin panel
|                └── index/ # Countdown
|                └── statics/ # Frontend mappából be másolt statikus fájlok
|            └── templates/ # Megjeleníthető HTML fájlok
|                └── static_pages/ # HTMLs
|            └── tmp/ # Temp Fájlok
```

# Szerepek
- Bartók Krisztián (Adatok elérése, Hír oldalak felkeresése, Fogadás oldal elkészítése)
- Ináncsi Krisztián (Frontend - Stílusfájlok, UI/UX tervezése & elkészítése)
- Fábián Tamás (Backend - Adatbázis elkészítése, a frontend összekötése Djangó segítségével.)
