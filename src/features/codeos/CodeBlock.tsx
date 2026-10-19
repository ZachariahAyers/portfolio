import { Highlight } from 'prism-react-renderer';
import { useMemo } from 'react';
import { detectLanguage } from './detectLanguage.ts';

/** Prism's theme colours arrive as inline styles; the CSS classes are used instead. */
function withoutStyle<T extends { style?: unknown }>(props: T): Omit<T, 'style'> {
  const copy = { ...props };
  delete copy.style;
  return copy;
}

/**
 * Syntax-highlighted code. Token colours come from styles/code.css through
 * Prism's token class names, so the theme follows light and dark mode.
 */
export function CodeBlock({ code }: { code: string }) {
  const language = useMemo(() => detectLanguage(code), [code]);
  return (
    <Highlight code={code.trimEnd()} language={language}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className="code-block font-mono text-sm whitespace-pre-wrap" data-language={language}>
          <code>
            {/* Lines and tokens are positional and never reorder, so their index is their identity. */}
            {tokens.map((line, i) => (
              // oxlint-disable-next-line react/no-array-index-key
              <div key={i} {...withoutStyle(getLineProps({ line }))}>
                {line.map((token, key) => (
                  // oxlint-disable-next-line react/no-array-index-key
                  <span key={key} {...withoutStyle(getTokenProps({ token }))} />
                ))}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
