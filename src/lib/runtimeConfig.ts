/**
 * Resolve a URL base da API em tempo de execução.
 *
 * A imagem Docker é única e reutilizável entre ambientes (dev/staging/produção):
 * as variáveis `VITE_*` do Vite são embutidas em *build time*, então não servem
 * para configurar a mesma imagem em ambientes diferentes. Por isso, em produção
 * o valor real é injetado em `public/env-config.js` pelo `docker-entrypoint.sh`
 * (lido de uma variável de ambiente do container) e exposto em `window.__APP_CONFIG__`.
 *
 * Ordem de resolução:
 * 1. `window.__APP_CONFIG__.API_BASE_URL` (injetado em runtime pelo container)
 * 2. `import.meta.env.VITE_API_BASE_URL` (build local / `npm run dev`)
 * 3. string vazia (usa o proxy relativo `/api`, ex.: dev server do Vite)
 */
export function resolveApiBaseUrl(): string {
  const runtimeValue = window.__APP_CONFIG__?.API_BASE_URL;
  const isPlaceholder = !runtimeValue || runtimeValue.startsWith('__');

  if (!isPlaceholder) {
    return runtimeValue;
  }

  return import.meta.env.VITE_API_BASE_URL ?? '';
}

declare global {
  interface Window {
    __APP_CONFIG__?: {
      API_BASE_URL?: string;
    };
  }
}
