# Adminpanelen på molla.se/admin

Här ändrar du texter och bilder på molla.se utan att röra koden.

## Så funkar det
- Allt innehåll ligger i filen `content/sida.json` i det här repot. Det är sidans "databas".
- När du trycker **Spara** i adminpanelen sparas ändringen direkt i GitHub.
- GitHub publicerar sedan om sidan automatiskt. Det tar ungefär en minut innan ändringen syns på molla.se.
- Uppladdade bilder hamnar i `assets/uploads/`.
- Alla ändringar sparas i historiken, så det går alltid att ångra.

## Engångsfix: skapa en inloggningsnyckel
Adminpanelen loggar in med en nyckel från GitHub (en så kallad *token*). Det gör du en gång:

1. Gå till https://github.com/settings/personal-access-tokens/new
2. **Token name:** `molla-admin`
3. **Expiration:** välj hur länge den ska gälla (t.ex. 1 år).
4. **Repository access:** välj **Only select repositories** och välj `OldFergie/molla-se`.
5. **Permissions → Repository permissions → Contents:** välj **Read and write**.
6. Klicka **Generate token** och kopiera nyckeln (den börjar med `github_pat_`).

Spara nyckeln i din lösenordshanterare. Dela den inte med någon.

## Logga in
1. Gå till https://molla.se/admin
2. Välj **Sign In Using Access Token** (inte "Sign In with GitHub").
3. Klistra in nyckeln. Webbläsaren kommer ihåg dig tills du loggar ut.

## Ändra något
1. Klicka **Sidan → Startsidan**.
2. Ändra texten i rätt ruta. Rutorna är grupperade som på sidan: Toppen, Livok, Plej T:M:S, Musik, 3D-printing, Kontakt.
3. Klicka **Save**. Vänta en minut och ladda om molla.se.

Tips:
- Lämnar du en **Bild**-ruta tom visas den vanliga illustrationen. Väljer du en bild visas den i stället.
- I kontaktrubriken blir en ny rad en radbrytning på sidan.
- Bilden när sidan delas (på t.ex. Facebook) bör vara 1200 × 630 pixlar.

## För den som rör koden
- Texterna i `index.html` är bara reservtexter. Vid publicering kör `scripts/bygg-sidan.mjs` och fyller i allt från `content/sida.json`.
- Element som styrs av adminpanelen har `data-cms="..."`, `data-cms-attr="..."` eller ligger mellan `<!--cms-bild:...-->` och `<!--/cms-bild-->`.
- Ny text i adminpanelen: lägg till fältet i `admin/config.yml`, värdet i `content/sida.json` och märkningen i `index.html`.
