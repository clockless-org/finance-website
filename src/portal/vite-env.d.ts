/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GCIP_API_KEY?: string
  readonly VITE_GCIP_AUTH_DOMAIN?: string
  readonly VITE_GCIP_PROJECT_ID?: string
  readonly VITE_GCIP_TENANT_ID?: string
  readonly VITE_API_BASE?: string
  readonly VITE_TENANT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
