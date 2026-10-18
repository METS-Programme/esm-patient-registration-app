import { useEffect, useState } from 'react';

/**
 * Tracks which registration section is currently at the top of the form
 * scroll container, for the section navigator's active highlight.
 *
 * A section counts as active once it crosses the upper 45% of the visible
 * container; the first (in document order) intersecting section wins.
 */
export function useActiveSection(
  containerRef: React.RefObject<HTMLElement | null>,
  sectionIds: Array<string>,
): string | undefined {
  const [active, setActive] = useState<string | undefined>(undefined);
  const sectionKey = sectionIds.join(',');

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !('IntersectionObserver' in window)) {
      return undefined;
    }
    const ids = sectionKey.split(',');
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set((entry.target as HTMLElement).id, entry.isIntersecting));
        setActive(ids.find((id) => visible.get(id)));
      },
      { root: container, rootMargin: '0px 0px -55% 0px', threshold: 0 },
    );
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });
    return () => observer.disconnect();
    // sectionKey is the stable serialization of sectionIds
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, sectionKey]);

  return active;
}
