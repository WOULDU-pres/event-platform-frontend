/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: 'development' | 'production'
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 