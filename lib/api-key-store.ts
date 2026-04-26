import { create } from 'zustand'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'
import { providers } from './ai'

interface ApiKeysState {
  open: boolean
  apiKeys: Record<string, string> // map provider to api key
  setApiKey: (provider: string, apiKey: string) => void
  getApiKey: (provider: string) => string | undefined
  getApiKeyFromModelId: (modelId: string) => string | undefined
  removeApiKey: (provider: string) => void
  clearAllApiKeys: () => void
  setOpen: (open: boolean) => void
}

export const useApiKeysStore = create<ApiKeysState>()(
  persist(
    (set, get) => ({
      open: false,
      apiKeys: {},
      setOpen: (open: boolean) => set({ open }),
      setApiKey: (provider: string, apiKey: string) =>
        set((state) => ({
          apiKeys: {
            ...state.apiKeys,
            [provider]: apiKey,
          },
        })),
      getApiKey: (provider: string) => get().apiKeys[provider],
      getApiKeyFromModelId: (modelId: string) => {
        const provider = Object.keys(providers).find((provider) => providers[provider].models.includes(modelId));
        return provider ? get().apiKeys[provider] : undefined;
      },
      removeApiKey: (provider: string) =>
        set((state) => {
          const { [provider]: _removed, ...rest } = state.apiKeys;
          return { apiKeys: rest };
        }),
      clearAllApiKeys: () => set({ apiKeys: {} }),
    }),
    {
      name: 'api-keys-storage',
      storage: createJSONStorage(() => {
        const fallbackStorage: StateStorage = {
          getItem: () => null,
          setItem: () => undefined,
          removeItem: () => undefined,
        };

        if (typeof window === "undefined") {
          return fallbackStorage;
        }

        const storage = window.localStorage;
        return storage && typeof storage.getItem === "function" ? storage : fallbackStorage;
      }),
      partialize: (state) => ({
        apiKeys: state.apiKeys,
      }),
    }
  )
)
