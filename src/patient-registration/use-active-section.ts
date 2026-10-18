import { useEffect, useState } from 'react';

/**
 * Tracks which registration section is currently at the top of the form
 * scroll container, for the section navigator's active highlight.
 *
 * A section is active once its top edge crosses a line 30% down the visible
 * container; the last such section (in document order) wins. Scrolling to
 * the very bottom pins the final section — short sections (Relationships,
 * Next of Kin) must activate even when a taller neighbour still occupies
 * the top of the container, and when the scroll range ends before they can
 * reach the line.
 */
export function useActiveSection(
  containerRef: React.RefObject<HTMLElement | null>,
  sectionIds: Array<string>,
): string | undefined {
  const [active, setActive] = useState<string | undefined>(undefined);
  const sectionKey = sectionIds.join(',');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }
    const ids = sectionKey.split(',');

    const update = () => {
      const mark = container.getBoundingClientRect().top + container.clientHeight * 0.3;
      let current: string | undefined;
      ids.forEach((id) => {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= mark) {
          current = id;
        }
      });
      // At the end of the scroll range the last section can never reach the
      // mark on its own, so pin it once the container is scrolled to bottom.
      if (container.scrollHeight - container.scrollTop <= container.clientHeight + 1) {
        current = ids[ids.length - 1];
      }
      setActive(current);
    };

    container.addEventListener('scroll', update, { passive: true });
    update();
    return () => container.removeEventListener('scroll', update);
    // sectionKey is the stable serialization of sectionIds
  }, [containerRef, sectionKey]);

  return active;
}
