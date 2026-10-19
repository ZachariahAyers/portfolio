/**
 * Picks a Prism grammar for a code sample. The samples carry a technology label
 * rather than a file name, so the code itself is the better signal. Grammars
 * Prism does not bundle fall back to a close relative or plain text.
 */
export type Language =
  | 'tsx'
  | 'markup'
  | 'css'
  | 'json'
  | 'yaml'
  | 'python'
  | 'sql'
  | 'rust'
  | 'go'
  | 'clike'
  | 'graphql'
  | 'plain';

const RULES: [RegExp, Language][] = [
  [/^\s*<(!doctype|html|template|svg|\?xml)/i, 'markup'],
  [/^\s*(FROM\s+\S+|RUN\s|#\s*syntax=)/m, 'plain'],
  [/^\s*(resource|provider|module|variable)\s+"/m, 'plain'],
  [/^\s*(apiVersion|kind|name|on|jobs|steps|services|version):\s/m, 'yaml'],
  [/^\s*(SELECT|CREATE\s+(TABLE|INDEX|VIEW|PROCEDURE)|WITH\s+\w+\s+AS|INSERT\s+INTO)\b/im, 'sql'],
  [/^\s*(def\s+\w+\(|class\s+\w+(\(.*\))?:$|from\s+[\w.]+\s+import\s|import\s+\w+$)/m, 'python'],
  [/^\s*(fn\s+\w+|use\s+\w+::|let\s+mut\s|pub\s+fn\s|impl\s+\w+)/m, 'rust'],
  [/^\s*(package\s+main|func\s+\w+\()/m, 'go'],
  [/^\s*(type\s+(Query|Mutation)\s*\{|extend\s+type\s|schema\s*\{)/m, 'graphql'],
  [
    /^\s*(using\s+[\w.]+;|namespace\s+[\w.]+|public\s+(sealed\s+|static\s+|partial\s+)*(class|interface|record)\s|@(RestController|Service|Component|Autowired)|import\s+java\.|<\?php)/m,
    'clike',
  ],
  [
    /^\s*(\$[\w-]+\s*:|@(mixin|include|import|tailwind|media)\b|[.#:]?[\w-]+(\s*[,>~+]\s*[.#]?[\w-]+)*\s*\{\s*$)/m,
    'css',
  ],
];

export function detectLanguage(code: string): Language {
  const trimmed = code.trim();
  if (/^[{[]/.test(trimmed)) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Not JSON; continue with the other checks.
    }
  }
  for (const [pattern, language] of RULES) if (pattern.test(code)) return language;
  return 'tsx';
}
