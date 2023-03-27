#!/bin/bash

if [[ -z "$OPENAPI_API_KEY" ]]; then
  echo "OPENAPI_API_KEY is not set. Aborting."
  exit 1
fi

curl --request POST \
  --url https://api.openai.com/v1/audio/transcriptions \
  --header "Authorization: Bearer $OPENAPI_API_KEY" \
  --header "Content-Type: multipart/form-data" \
  --form file=@/home/neptuntriton/whisper2gpt/samples/recorded.mp3 \
  --form model=whisper-1
  