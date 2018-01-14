# arena.utt.fr-2017

Requires: node, npm/yarn, mariadb/mysql

## Development

```
cp server/config/config.json.example server/config/config.json
nano server/config/config.json
```

```
yarn # or npm install
yarn dev # or npm run dev
```

## Harcoded tournaments

Files containing hardcoded tournaments (search for "/* hard-coded tournaments */"):

  - client/containers/Home/components/Intro/Intro.jsx
  - client/containers/Spotlight/Spotlight.jsx

## Production - local

```
yarn prod # or npm run prod
```

## Production - dokku

Use env variables.

Example: `config.app.secret` will be `APP_SECRET`
Integers will be parsed (if the corresponding value in config.json[.example] is a number)
