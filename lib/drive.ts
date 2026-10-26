// Thin Google Drive v3 client (API key + a folder shared as "Anyone with the link can view").

const API = process.env.GOOGLE_DRIVE_API_BASE ?? "https://www.googleapis.com/drive/v3";

const apiKey = () => process.env.GOOGLE_DRIVE_API_KEY;
// Accepts a bare ID, or a pasted share link such as .../folders/<id>?usp=sharing.
export const driveRootId = () => {
  const raw = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID?.trim();
  if (!raw) return undefined;
  return raw.match(/\/folders\/([\w-]+)/)?.[1] ?? raw.split("?")[0];
};
export const driveConfigured = () => Boolean(apiKey() && driveRootId());

export const FOLDER_MIME = "application/vnd.google-apps.folder";

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  imageMediaMetadata?: { width?: number; height?: number; rotation?: number };
};

/** `cacheSeconds` 0 = always ask Drive, so new uploads show up on the next page view. */
export async function listFolder(folderId: string, cacheSeconds = 0): Promise<DriveFile[]> {
  const files: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      fields:
        "nextPageToken,files(id,name,mimeType,createdTime,imageMediaMetadata(width,height,rotation))",
      pageSize: "1000",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
      key: apiKey()!,
    });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(
      `${API}/files?${params}`,
      cacheSeconds > 0 ? { next: { revalidate: cacheSeconds } } : { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error(`Google Drive API ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    const data = await res.json();
    files.push(...data.files);
    pageToken = data.nextPageToken;
  } while (pageToken);

  return files;
}
