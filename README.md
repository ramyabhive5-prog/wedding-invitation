# Romantic Heart Royal Wedding Invitation

A mobile-first React + Vite wedding invitation for **D. Sowndhararajan & R. Vanitha**. It has a 3D envelope cover, pink/purple romantic styling, floating hearts and rose-petal-like particles, a music toggle, multi-page card navigation, a live countdown, Tamil invitation details, venue map link, WhatsApp wishes, and direct PDF download (no print dialog).

## Run on Windows with VS Code
1. Extract this ZIP.
2. Open the extracted `sowndhararajan-vanitha-heart-royal` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run:
   ```bash
   npm install
   npm run dev
   ```
5. Open the localhost URL shown in the terminal (usually `http://localhost:5173`).

## Details included
- Groom: D. Sowndhararajan, B.E.
- Bride: R. Vanitha, B.Sc.
- Groom's parents: Mr. P. Devaraj & Mrs. D. Venkateswari @ Eswari
- Bride's parents: Mr. V. Ravichandran & Mrs. R. Dhanalakshmi
- Reception: Saturday, 21 November 2026, 6:00 PM–9:00 PM
- Muhurtham: Sunday, 22 November 2026, 6:00 AM–7:30 AM
- Venue: Subramaniyar Thirumana Mandapam, Chennimalai Palayam Pirivu, Chennimalai – Kangayam Road

## Add wedding music
Put a music file you have permission to use at `public/wedding-song.mp3`. The music button starts/stops this file. Browsers may require a user click before music starts.

## Configure WhatsApp
In `src/main.jsx`, replace `whatsapp: '91XXXXXXXXXX'` with the real WhatsApp number, including country code and digits only. Until configured, the button shows a reminder instead of opening WhatsApp.

## Download PDF
Open the invitation, go to the last card (Wishes), and click **Download Invitation PDF**. It creates a PDF file directly; it does not open the print dialog. The PDF includes both event details, family names, venue and Tamil invitation wording.

## Before sharing publicly
Verify the exact map pin and wedding details. Replace the WhatsApp placeholder and add the licensed wedding audio file if needed.


## Printed Wedding Card feature
- On the welcome page, click **Printed Wedding Card** above **Discover the celebration**.
- The original supplied invitation image opens in a modal.
- Click **Download Printed Invitation PDF** to download a two-page PDF (English and Tamil sides) directly, without opening a print dialog.
- The files `public/printed-wedding-card.jpg` and `public/printed-wedding-card.pdf` are used by this feature.
