import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminTexts from "@/components/AdminTexts";
import { isAdmin } from "@/lib/admin";
import { getEntriesWithValues } from "@/lib/content";

export const metadata: Metadata = { title: "All texts", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const entries = await getEntriesWithValues();

  return (
    <section className="light" style={{ minHeight: "100vh", padding: "140px var(--gutter) 120px" }}>
      <div className="container">
        <p className="eyebrow muted" style={{ marginBottom: 16 }}>( Admin )</p>
        <h1 className="serif h2" style={{ marginBottom: 16 }}>
          All <em>texts</em>
        </h1>
        <p className="muted" style={{ maxWidth: "60ch", marginBottom: 48 }}>
          Every text on the site, including links, descriptions and the contact details. Edits save as you leave a
          box. Most visible text can also be edited directly on its page while you are logged in. Use *stars* for
          italics and | for a new line in headings.
        </p>
        <AdminTexts entries={entries} />
      </div>
    </section>
  );
}
