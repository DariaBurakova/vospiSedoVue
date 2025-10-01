// Mock localStorage
const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock fetch
if (typeof window !== 'undefined') {
  (window as any).fetch = () => Promise.resolve({})
  
  // Mock console methods to reduce noise in tests
  (window as any).console = {
    ...console,
    log: () => {},
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
  }
}
