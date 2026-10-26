import type { ReactNode } from "react";

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function RevealLines({ lines, className }: { lines: ReactNode[]; className?: string }) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <span style={{ display: "block" }} key={i}>
          {line}
        </span>
      ))}
    </div>
  );
}
