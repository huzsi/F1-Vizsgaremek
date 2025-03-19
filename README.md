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
- Express
- Node.JS
- JavaScript
- MySQL


# Telepítési útmutató


# Mappastruktúra
```
├── .temp / # Olyan fájlok amik nem szükségesek az oldal működéséhez
|    └── Bet Oldal /
├──  hub / # Az elosztó oldal fájljai
|    └── client / # Frontend fájlok (HTML, CSS, FONTS, JS)       
|        └── CSS / # Stílusfájlok
|        └── Fonts / # Betűtípusok
|        └── images / # Képek
|        └── JS / # Javascript fájlok 
├──  news / # A hír oldal fájljai
|    └── public / # Javascript fájlok
|        └── CSS / # Stílusfájlok
|            └── base # Alap CSS fájlok
|            └── components # Komponensek CSS fájljai
|            └── layout # Egyes tag-ek CSS fájljai
|            └── pages # Oldalak CSS fájljai
|        └── HTML / # Weboldalfájlok
|        └── Fonts / # Betűtípusok
|        └── images / # Képek
|            └── drivers # Versenyzők képei
|            └── flags # Zászlók képei
|            └── tracks # Pályák képei
|        └── JS / # Javascript fájlok 
|            └── api # API Javascript fájlok
|            └── frontend # Frontend Javascript fájlok
|            └── utils # Egyéb Javascript fájlok
├──  node_modules / # Az oldalhoz szükséges modulok
├──  statistics / # Az oldalhoz szükséges modulok
|    └── client / # Frontend fájlok (CSS, FONTS, JS)
|        └── CSS / # Stílusfájlok
|        └── Fonts / # Betűtípusok
|        └── images / # Képek
|    └── node_modules / # Az oldalhoz szükséges modulok
```

# Szerepek
•	Ináncsi Krisztián 
-   Statisztikai oldal kinézetének megtervezése, megvalósítása
-   Híroldal kinézetének megtervezése, megvalósítása
-   Híroldal működése: Főoldal funkciók, dropdown funkciók, pályainformációk
  
•	Bartók Krisztán
-    Híroldal adatbázisa.
-    Híroldal működése: Fórum oldal, Hír részleg, Bejelentkezés és Regisztráció, Profil funkciók, futam végeredmények.
  
•	Fábián Tamás
-    HUB részleg megvalósítása.
-    Statisztikai oldal kinézetének megtervezése, megvalósítása.
-    Statisztikai oldal teljes funkciójának megvalósítása


