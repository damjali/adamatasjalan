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

## Editing the site's text (admin)

Every text on the site (titles, biography, prices, packages, FAQ, contact details, menu and form
labels) is stored in the Supabase table `site_texts` and read from there. Defaults live in
`lib/content.tsx`; anything missing from the table falls back to them.

One-time setup:

1. In Supabase open **SQL Editor** and run `supabase/site_texts.sql` (creates the table).
2. Set these environment variables locally in `.env` and on Vercel:
   `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
   (optional: `ADMIN_SESSION_SECRET`).

Then use the small **Login as admin** link at the bottom of any page. While logged in, click any text
on the page, type, and click away (or press Enter) to save. `/admin` lists every text, including
links, descriptions and hidden ones. In text, `*word*` is italic and `|` starts a new line in
headings. The first login copies all default texts into Supabase.

