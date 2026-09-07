// Config injetada em runtime pelo docker-entrypoint.sh a partir da variável de
// ambiente API_BASE_URL do container. Em desenvolvimento local este placeholder
// é ignorado (ver src/lib/runtimeConfig.ts), então o proxy do Vite continua valendo.
window.__APP_CONFIG__ = {
  API_BASE_URL: '__API_BASE_URL__',
};
