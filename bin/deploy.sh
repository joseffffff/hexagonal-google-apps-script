#!/bin/bash

PROJECT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"

if [[ ! -d "${PROJECT_PATH}"/node_modules ]]; then
    echo "node_modules does not exist, running npm install"
    cd $PROJECT_PATH
    npm install
fi

echo '------------------------------------'
echo '---------- RUNNING TESTS -----------'
echo '------------------------------------'

npm test
TESTS_EXIT_CODE=$?

if [[ ! $TESTS_EXIT_CODE -eq 0 ]]; then
  echo '------------------------------------'
  echo '------ BAD EXIT CODE ON TESTS ------'
  echo '------------------------------------'
  exit 1;
else
  echo '------------------------------------'
  echo '------------- TESTS OK -------------'
  echo '------------------------------------'
fi


echo 'Setting .clasp.json and env.ts';
cp "$PROJECT_PATH"/.clasp.local.json "$PROJECT_PATH"/.clasp.json
cp "$PROJECT_PATH"/src/env.local.ts "$PROJECT_PATH"/src/env.ts


if [ ! -f "${PROJECT_PATH}"/bin/.env ]; then
  cp "${PROJECT_PATH}"/bin/.env.example "${PROJECT_PATH}"/bin/.env
  echo -e "No .env file present.\nCopying .env.example to .env"
fi

echo 'Reading .env variables'
# shellcheck disable=SC2163
# shellcheck disable=SC1073
while read line; do export "$line";
# shellcheck disable=SC2002
done < <(cat "${PROJECT_PATH}"/bin/.env | grep -v "#" | grep -v "^$")

echo 'Pushing files and deploying'
clasp push -f && clasp deploy -i $DEPLOY_ID
