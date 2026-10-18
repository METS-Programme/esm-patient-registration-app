/*
 * Unit test for the scroll-position hook: it deliberately reaches nodes by
 * id the same way the hook does, so DOM-structure queries don't apply.
 */
/* eslint-disable testing-library/no-node-access */
import React, { useRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { useActiveSection } from './use-active-section';

const containerGeometry = { clientHeight: 900, scrollTop: 0, scrollHeight: 3000 };
// Viewport-relative tops, as getBoundingClientRect would report them.
const sectionTops: Record<string, number> = { demographics: 100, contact: 1200, relationships: 2400 };

function mockGeometry(container: HTMLElement) {
  const define = (prop: string, value: number) =>
    Object.defineProperty(container, prop, { configurable: true, writable: true, value });
  define('clientHeight', containerGeometry.clientHeight);
  define('scrollTop', containerGeometry.scrollTop);
  define('scrollHeight', containerGeometry.scrollHeight);
  container.getBoundingClientRect = () => ({ top: 0 }) as DOMRect;
  Object.keys(sectionTops).forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.getBoundingClientRect = () => ({ top: sectionTops[id] }) as DOMRect;
    }
  });
}

function fireScroll(container: HTMLElement, scrollTop: number) {
  act(() => {
    containerGeometry.scrollTop = scrollTop;
    container.scrollTop = scrollTop;
    container.dispatchEvent(new Event('scroll'));
  });
}

const Harness: React.FC<{ onActive: (section: string | undefined) => void }> = ({ onActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const active = useActiveSection(containerRef, ['demographics', 'contact', 'relationships']);
  onActive(active);
  return (
    <div ref={containerRef}>
      <div id="demographics" />
      <div id="contact" />
      <div id="relationships" />
    </div>
  );
};

describe('useActiveSection', () => {
  let active: string | undefined;

  beforeEach(() => {
    containerGeometry.scrollTop = 0;
    Object.assign(sectionTops, { demographics: 100, contact: 1200, relationships: 2400 });
    active = undefined;
  });

  it('reports the last section whose top crossed the activation line', () => {
    const { container } = render(<Harness onActive={(section) => (active = section)} />);
    const scroller = container.firstElementChild as HTMLElement;
    mockGeometry(scroller);
    fireScroll(scroller, 0);

    // The 30% mark is 270; only demographics (top 100) is above it.
    expect(active).toBe('demographics');

    // Scrolling 1200px moves every section top up by 1200; contact (now at
    // 0) crosses the mark, relationships (1200) has not.
    Object.assign(sectionTops, { demographics: -1100, contact: 0, relationships: 1200 });
    fireScroll(scroller, 1200);

    expect(active).toBe('contact');
  });

  it('pins the final section at the end of the scroll range', () => {
    const { container } = render(<Harness onActive={(section) => (active = section)} />);
    const scroller = container.firstElementChild as HTMLElement;
    mockGeometry(scroller);
    fireScroll(scroller, 0);

    // Scrolled to the very bottom (3000 - 900): the last section can never
    // reach the mark on its own, so it is pinned.
    fireScroll(scroller, 2100);

    expect(active).toBe('relationships');
  });

  it('stops listening on unmount', () => {
    const { container, unmount } = render(<Harness onActive={(section) => (active = section)} />);
    const scroller = container.firstElementChild as HTMLElement;
    mockGeometry(scroller);
    const removeSpy = vi.spyOn(scroller, 'removeEventListener');

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
