// Minimal ANSI SGR -> HTML converter for log streams (k6 stress test output).
// Supports the subset k6 actually emits: reset, bold, dim, italic, underline,
// 8 standard foreground colors and their bright variants. Unknown codes are
// silently skipped. The output uses semantic class names so colors are
// remapped to theme tokens in CSS (see stress-testing.component.css).

const ANSI_RE = /\x1b\[([\d;]*)m/g;

const FG_CLASSES: Record<number, string> = {
  30: 'ansi-fg-black',
  31: 'ansi-fg-red',
  32: 'ansi-fg-green',
  33: 'ansi-fg-yellow',
  34: 'ansi-fg-blue',
  35: 'ansi-fg-magenta',
  36: 'ansi-fg-cyan',
  37: 'ansi-fg-white',
  90: 'ansi-fg-bright-black',
  91: 'ansi-fg-bright-red',
  92: 'ansi-fg-bright-green',
  93: 'ansi-fg-bright-yellow',
  94: 'ansi-fg-bright-blue',
  95: 'ansi-fg-bright-magenta',
  96: 'ansi-fg-bright-cyan',
  97: 'ansi-fg-bright-white',
};

interface AnsiState {
  fg: string | null;
  bold: boolean;
  dim: boolean;
  italic: boolean;
  underline: boolean;
}

function emptyState(): AnsiState {
  return { fg: null, bold: false, dim: false, italic: false, underline: false };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function classesFor(state: AnsiState): string[] {
  const cls: string[] = [];
  if (state.fg) cls.push(state.fg);
  if (state.bold) cls.push('ansi-bold');
  if (state.dim) cls.push('ansi-dim');
  if (state.italic) cls.push('ansi-italic');
  if (state.underline) cls.push('ansi-underline');
  return cls;
}

function wrap(text: string, state: AnsiState): string {
  const safe = escapeHtml(text);
  const cls = classesFor(state);
  if (cls.length === 0) return safe;
  return `<span class="${cls.join(' ')}">${safe}</span>`;
}

function applyCodes(state: AnsiState, codes: number[]): AnsiState {
  let next = { ...state };
  for (const code of codes) {
    if (code === 0) next = emptyState();
    else if (code === 1) next.bold = true;
    else if (code === 2) next.dim = true;
    else if (code === 3) next.italic = true;
    else if (code === 4) next.underline = true;
    else if (code === 22) { next.bold = false; next.dim = false; }
    else if (code === 23) next.italic = false;
    else if (code === 24) next.underline = false;
    else if (code === 39) next.fg = null;
    else if (FG_CLASSES[code]) next.fg = FG_CLASSES[code];
  }
  return next;
}

export function ansiToHtml(input: string): string {
  if (!input) return '';
  let state = emptyState();
  let out = '';
  let lastIndex = 0;
  for (const match of input.matchAll(ANSI_RE)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) {
      out += wrap(input.slice(lastIndex, idx), state);
    }
    const codes = (match[1] || '0').split(';').map(s => Number.parseInt(s, 10) || 0);
    state = applyCodes(state, codes);
    lastIndex = idx + match[0].length;
  }
  if (lastIndex < input.length) {
    out += wrap(input.slice(lastIndex), state);
  }
  return out;
}
