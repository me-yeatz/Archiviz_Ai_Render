/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_PROVIDER?: string;
  readonly VITE_OLLAMA_BASE_URL?: string;
  readonly VITE_OLLAMA_MODEL?: string;
  readonly VITE_LMSTUDIO_BASE_URL?: string;
  readonly VITE_LMSTUDIO_MODEL?: string;
  readonly VITE_HF_BASE_URL?: string;
  readonly VITE_HF_MODEL?: string;
  readonly VITE_HF_API_KEY?: string;
  readonly VITE_GOOGLE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
