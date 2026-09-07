#!/bin/sh
set -eu

# Injeta a URL base da API (definida via variável de ambiente do container/task
# definition) no arquivo estático env-config.js, servido antes do bundle React.
# Isso permite reaproveitar a MESMA imagem Docker em qualquer ambiente
# (dev/staging/produção) apenas trocando a variável de ambiente, sem rebuild.
: "${API_BASE_URL:=}"

CONFIG_FILE="/usr/share/nginx/html/env-config.js"

if [ -f "$CONFIG_FILE" ]; then
  sed -i "s#__API_BASE_URL__#${API_BASE_URL}#g" "$CONFIG_FILE"
fi

exec "$@"
