/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_JWT_SECRET: string
  readonly VITE_JWT_EXPIRES_IN: string
  readonly VITE_STORAGE_KEY: string
  readonly VITE_AUTH_STORAGE_KEY: string
  readonly VITE_DEV_MODE: string
  readonly VITE_DEBUG: string
  readonly VITE_MOCK_API: string
  readonly VITE_DEFAULT_THEME: string
  readonly VITE_THEME_STORAGE_KEY: string
  readonly VITE_ENABLE_PWA: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_ERROR_REPORTING: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}