jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map()
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(key => Promise.resolve(store.get(key) ?? null)),
      setItem: jest.fn((key, value) => Promise.resolve(store.set(key, value))),
      removeItem: jest.fn(key => Promise.resolve(store.delete(key))),
      clear: jest.fn(() => Promise.resolve(store.clear())),
      getAllKeys: jest.fn(() => Promise.resolve([...store.keys()])),
    },
  }
})