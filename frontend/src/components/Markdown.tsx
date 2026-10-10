import { Fragment, type ReactNode } from "react";

/** Renderizador Markdown mínimo (encabezados, listas, negrita, cursiva) sin dependencias ni HTML inseguro. */
function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("*") && p.endsWith("*") && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

export function Markdown({ source }: { source: string }) {
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flush = () => {
    if (!list) return;
    const items = list.items.map((it, i) => <li key={i}>{inline(it)}</li>);
    blocks.push(list.ordered ? <ol key={blocks.length}>{items}</ol> : <ul key={blocks.length}>{items}</ul>);
    list = null;
  };

  for (const raw of source.split("\n")) {
    const line = raw.trim();
    const ordered = /^\d+\.\s+/.exec(line);
    if (line.startsWith("- ") || ordered) {
      const isOrdered = Boolean(ordered);
      if (!list || list.ordered !== isOrdered) {
        flush();
        list = { ordered: isOrdered, items: [] };
      }
      list.items.push(ordered ? line.slice(ordered[0].length) : line.slice(2));
      continue;
    }
    flush();
    if (!line) continue;
    if (line.startsWith("### ")) blocks.push(<h3 key={blocks.length}>{inline(line.slice(4))}</h3>);
    else if (line.startsWith("## ")) blocks.push(<h2 key={blocks.length}>{inline(line.slice(3))}</h2>);
    else blocks.push(<p key={blocks.length}>{inline(line)}</p>);
  }
  flush();
  return <div className="prose">{blocks}</div>;
}
