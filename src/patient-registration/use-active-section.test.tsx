import React, { useRef } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { useActiveSection } from './use-active-section';

type ObserverCallback = (entries: Array<IntersectionObserverEntry>) => void;

class MockIntersectionObserver {
  callback: ObserverCallback;
  observed: Array<Element> = [];
  disconnect = vi.fn();

  constructor(callback: ObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.observed.push(target);
  }

  unobserve() {}
}

const observers: Array<MockIntersectionObserver> = [];

function triggerIntersection(id: string, isIntersecting: boolean) {
  const observer = observers[observers.length - 1];
  const target = observer?.observed.find((el) => (el as HTMLElement).id === id);
  if (target) {
    act(() => {
      observer.callback([{ target, isIntersecting } as IntersectionObserverEntry]);
    });
  }
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
  const originalIntersectionObserver = window.IntersectionObserver;

  beforeEach(() => {
    observers.length = 0;
    active = undefined;
    window.IntersectionObserver = function (callback: ObserverCallback) {
      const instance = new MockIntersectionObserver(callback);
      observers.push(instance);
      return instance;
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    window.IntersectionObserver = originalIntersectionObserver;
  });

  it('reports the first intersecting section in document order', () => {
    render(<Harness onActive={(section) => (active = section)} />);

    triggerIntersection('contact', true);

    expect(active).toBe('contact');

    triggerIntersection('demographics', true);

    expect(active).toBe('demographics');
  });

  it('ignores sections that leave the viewport', () => {
    render(<Harness onActive={(section) => (active = section)} />);

    triggerIntersection('contact', true);
    triggerIntersection('contact', false);

    expect(active).toBeUndefined();
  });

  it('disconnects the observer on unmount', () => {
    const { unmount } = render(<Harness onActive={(section) => (active = section)} />);

    unmount();

    expect(observers[0].disconnect).toHaveBeenCalled();
  });
});
