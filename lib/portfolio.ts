import { cache } from "react";
import { genres, type Shot } from "./data";
import {
  FOLDER_MIME,
  driveConfigured,
  driveRootId,
  listFolder,
  type DriveFile,
} from "./drive";

/*
 * Drive layout:
 *
 *   <root>/convo/athirah/image1.jpeg     genre folder / project folder / photos
 *   <root>/weddings/aina-haziq/01.jpg
 *   <root>/home/hero.jpg                 optional: first photo is the home hero
 *   <root>/about/me.jpg                  optional: first photo is the About portrait
 *
 * A genre folder matches a genre by its URL slug, nav label or title (case-insensitive),
 * e.g. "convo" or "convocation". Photos placed directly in a genre folder show up under "Selected".
 */

export type Project = { name: string; slug: string; shots: Shot[] };
export type GenreContent = { projects: Project[]; cover: Shot | null; count: number };
export type Portfolio = {
  genres: Record<string, GenreContent>;
  home: Shot[];
  about: Shot[];
  live: boolean;
};

const isFolder = (f: DriveFile) => f.mimeType === FOLDER_MIME;
const isImage = (f: DriveFile) => /^image\/(jpeg|png|webp|avif|gif)$/.test(f.mimeType);
const natural = (a: DriveFile, b: DriveFile) =>
  a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
const norm = (s: string) => s.trim().toLowerCase();
const pretty = (s: string) =>
  s
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
const slugify = (s: string) => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function toShots(files: DriveFile[], label: string): Shot[] {
  return files
    .filter(isImage)
    .sort(natural)
    .map((f, i) => {
      const m = f.imageMediaMetadata;
      let w = m?.width ?? 1600;
      let h = m?.height ?? 1067;
      if ((m?.rotation ?? 0) % 2 === 1) [w, h] = [h, w];
      return { src: `/drive/${f.id}`, w, h, alt: `${label} — ${String(i + 1).padStart(2, "0")}` };
    });
}

async function loadGenre(folderId: string, genreTitle: string): Promise<GenreContent> {
  const items = await listFolder(folderId);

  const projects: (Project & { created: string })[] = (
    await Promise.all(
      items.filter(isFolder).map(async (folder) => {
        const name = pretty(folder.name);
        const shots = toShots(await listFolder(folder.id), `${genreTitle} · ${name}`);
        return { name, slug: slugify(folder.name), shots, created: folder.createdTime };
      })
    )
  )
    .filter((p) => p.shots.length > 0)
    .sort((a, b) => b.created.localeCompare(a.created)); // newest project first

  const loose = toShots(items, `${genreTitle} · Selected`);
  if (loose.length) projects.unshift({ name: "Selected", slug: "selected", shots: loose, created: "" });

  return {
    projects,
    cover: projects[0]?.shots[0] ?? null,
    count: projects.reduce((n, p) => n + p.shots.length, 0),
  };
}

// ---- Placeholder content, used until Drive is configured ----

const ratios: [number, number][] = [
  [1200, 1600], [1600, 1067], [1200, 1500], [1200, 1800], [1600, 1067], [1200, 1600],
];

function placeholderPortfolio(): Portfolio {
  const result: Portfolio = { genres: {}, home: [], about: [], live: false };
  for (const g of genres) {
    const projects: Project[] = ["Sample One", "Sample Two"].map((name, p) => ({
      name,
      slug: slugify(name),
      shots: ratios.map(([w, h], i) => ({
        src: `https://picsum.photos/seed/${g.slug}-${p}-${i}/${w}/${h}`,
        w,
        h,
        alt: `${g.title} · ${name} — ${String(i + 1).padStart(2, "0")}`,
      })),
    }));
    result.genres[g.slug] = {
      projects,
      cover: {
        src: `https://picsum.photos/seed/${g.slug}-cover/2000/1300`,
        w: 2000,
        h: 1300,
        alt: g.title,
      },
      count: projects.reduce((n, p) => n + p.shots.length, 0),
    };
  }
  return result;
}

export const getPortfolio = cache(async (): Promise<Portfolio> => {
  if (!driveConfigured()) return placeholderPortfolio();

  // Genre folders rarely change, so the root listing is cached for a minute; everything below is live.
  const folders = (await listFolder(driveRootId()!, 60)).filter(isFolder);
  const find = (...names: string[]) => folders.find((f) => names.map(norm).includes(norm(f.name)));
  const result: Portfolio = { genres: {}, home: [], about: [], live: true };

  await Promise.all([
    ...genres.map(async (g) => {
      const folder = find(g.slug, g.label, g.title);
      result.genres[g.slug] = folder
        ? await loadGenre(folder.id, g.title)
        : { projects: [], cover: null, count: 0 };
    }),
    (async () => {
      const f = find("home");
      if (f) result.home = toShots(await listFolder(f.id), "Home");
    })(),
    (async () => {
      const f = find("about");
      if (f) result.about = toShots(await listFolder(f.id), "About");
    })(),
  ]);

  return result;
});
