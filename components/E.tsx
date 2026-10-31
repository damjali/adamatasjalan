/** Marks a piece of text as editable. Visitors just see the text; admin mode makes it editable in place. */
export function E({ k, raw, children }: { k: string; raw: string; children: React.ReactNode }) {
  return (
    <span data-t={k} data-raw={raw}>
      {children}
    </span>
  );
}
