# Adam Atas Jalan — portfolio

Next.js photography/videography portfolio. Photos are read from a Google Drive folder.

```
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Updating photos

Organise one Drive folder like this (a folder name is matched to a genre by its URL name or nav label, case-insensitive):

```
Portfolio/                    <- the root folder you share
  convo/                      <- genre   (convo, weddings, sports, portraits, events)
    athirah/                  <- project (shown as a titled section on the page)
      image1.jpeg
      image2.jpeg
  weddings/
    aina-haziq/
      01.jpg
  home/hero.jpg               <- optional: home page hero (first photo)
  about/me.jpg                <- optional: About page portrait (first photo)
```

- Add a project = add a folder. Add photos = drop them in. Just refresh the site — Drive is read live on every page view, so there is no rebuild or waiting.
- Photos are shown straight from Google's image servers (resized per screen), so Drive is the only storage.
- Photos are sorted by filename (`image2` before `image10`); projects are newest-first.
- Photos placed directly inside a genre folder appear under "Selected".
- Use JPEG / PNG / WebP (HEIC from iPhones is ignored — export as JPEG first).

## One-time setup

1. Share the root Drive folder: **Share → General access → Anyone with the link → Viewer**.
2. Copy its ID from the URL: `drive.google.com/drive/folders/<THIS_PART>`.
3. In [Google Cloud Console](https://console.cloud.google.com/): create a project, enable **Google Drive API**, then **Credentials → Create API key** (restrict it to the Drive API).
4. Copy `.env.example` to `.env.local` and fill in `GOOGLE_DRIVE_API_KEY` and `GOOGLE_DRIVE_ROOT_FOLDER_ID`.
   On your host (e.g. Vercel) set the same two variables.

Until both are set the site shows placeholder photos.

## Price list (Google Sheet)

Packages, add-ons, FAQ and the wording on the Price List page come from a Google Sheet in the
portfolio Drive folder (shared as **Anyone with the link → Viewer**). Edit a cell and the site
updates within about a minute; responses are cached so pages open instantly, and the built-in
defaults in `lib/data.ts` are used if the sheet is unreachable.

Tabs (names matter, first row is the header, row order is display order):

| Tab | Columns |
| --- | --- |
| Packages | Category · Name · Price · Duration · Featured · Feature 1 … Feature 8 |
| Add-ons | Name · Price |
| FAQ | Question · Answer |
| Settings | Key · Value (button and heading wording; `{name}` in `book_button` becomes the package name) |

`Category` is one of `convocation`, `weddings`, `sports`, `portraits`, `events`. Put `yes` under
Featured for the highlighted "Most loved" card. Ready-made starting data is in `sheet-seed/`
(File → Import → Upload → "Insert new sheet(s)", once per CSV). The sheet ID can be overridden
with `GOOGLE_SHEET_ID`.

## Site wording (Google Sheet)

All other text on the site (titles, biography, footer, contact details, form labels, menu, the About
numbers/process/gear lists, category names) comes from a second Google Sheet whose name contains
"Content", in the same root Drive folder. Tabs: `Content` (Key / Value / Where it appears), `Genres`
(Slug / Label / Title), `Stats` (Value / Suffix / Label), `Process` (Title / Text), `Gear` (Item).
Use `*word*` for italics and `|` for a line break in headings. Missing keys or tabs fall back to the
defaults in `lib/content.ts`. Starting data: `sheet-seed/SiteContent.xlsx` (upload to Drive, then
Open with Google Sheets, File, Save as Google Sheets). Override with `GOOGLE_CONTENT_SHEET_ID`.
