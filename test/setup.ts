import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

// Mock fetch
global.fetch = vi.fn()

// Mock localStorage
class InMemoryStorage implements Storage {
  private store = new Map<string, string>()
  get length() { return this.store.size }
  clear() { this.store.clear() }
  getItem(key: string) { return this.store.has(key) ? this.store.get(key)! : null }
  setItem(key: string, value: string) { this.store.set(key, String(value)) }
  removeItem(key: string) { this.store.delete(key) }
  key(index: number) { return Array.from(this.store.keys())[index] ?? null }
}
const localStorageInstance = new InMemoryStorage()
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageInstance,
  writable: true,
  configurable: true,
})

// Mock matchMedia for Radix UI components
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: () => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      }),
    })
  }
}

// Mock ResizeObserver
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
}

// Mock Element.prototype methods for Radix UI
if (typeof Element !== 'undefined') {
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = function () {}
  }
  if (!('hasPointerCapture' in Element.prototype)) {
    ;(Element.prototype as unknown as { hasPointerCapture: () => boolean }).hasPointerCapture = () => false
  }
  if (!('setPointerCapture' in Element.prototype)) {
    ;(Element.prototype as unknown as { setPointerCapture: () => void }).setPointerCapture = () => {}
  }
  if (!('releasePointerCapture' in Element.prototype)) {
    ;(Element.prototype as unknown as { releasePointerCapture: () => void }).releasePointerCapture = () => {}
  }
}