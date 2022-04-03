#!/bin/bash

PROJECT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"

echo 'Setting .clasp.json and env.ts';
cp "$PROJECT_PATH"/.clasp.production.json "$PROJECT_PATH"/.clasp.json
cp "$PROJECT_PATH"/src/env.production.ts "$PROJECT_PATH"/src/env.ts

echo 'Pushing files'
clasp push -f

echo 'Restoring .clasp.json and env.ts'
cp "$PROJECT_PATH"/.clasp.local.json "$PROJECT_PATH"/.clasp.json
cp "$PROJECT_PATH"/src/env.local.ts "$PROJECT_PATH"/src/env.ts
