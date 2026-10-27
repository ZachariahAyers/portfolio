import { CodeOS } from './CodeOS.tsx';
const source = [
  'src/app/router.tsx',
  'src/features/codeos/CodeOS.tsx',
  'src/features/codeos/apps.ts',
  'src/features/codeos/windowManager.ts',
];
export default function DesktopPage() {
  return (
    <main className="fixed inset-0" aria-label="CodeOS 98 desktop">
      <CodeOS title="Portfolio" source={source} standalone />
    </main>
  );
}
