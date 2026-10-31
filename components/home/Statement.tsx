import { getContent } from "@/lib/content";
import { rich } from "@/lib/rich";

export default async function Statement() {
  const c = await getContent();
  return (
    <section className="section light container">
      <div className="split">
        <p className="eyebrow">{c.e("statement_label")}</p>
        <p className="serif statement">
          {c.e("statement_text")}
        </p>
      </div>
    </section>
  );
}
