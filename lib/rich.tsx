import { Fragment, type ReactNode } from "react";

/** `*word*` becomes italic, so sheet text can keep the site's italic accents. */
export function rich(text: string): ReactNode {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>
  );
}

/** `|` splits a heading into separate lines. */
export const richLines = (text: string): ReactNode[] => text.split("|").map((l) => rich(l.trim()));
