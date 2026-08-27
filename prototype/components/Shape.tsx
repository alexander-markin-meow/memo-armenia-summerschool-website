import type { ShapeName } from '@/lib/content';

export function Shape({ name, className = '' }: { name: ShapeName; className?: string }) {
  return <span className={`shape shape-${name} ${className}`} aria-hidden="true" />;
}
