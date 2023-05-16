[![Build and Deploy to PRD](https://github.com/luanfv/api-jo-ken-po/actions/workflows/main.yml/badge.svg)](https://github.com/luanfv/api-jo-ken-po/actions/workflows/main.yaml)

## Description

API JO KEN PO developed with NestJS.

## Installation

```bash
$ npm install
```

## Running the app

You need create a copy of the file `.env.example` in the project root and rename to `.env` with your env variables.

### DEV

You need have install [docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/) to up postgres database.
If is installed, you need setting value of the env variable `DATABASE_URL` in the .env to `postgresql://postgres:postgres@localhost:5432/postgres?schema=public`. Obs: you don't edit docker-compose.yaml to it working.

```bash
# run to start project in dev mode
$ npm run start:dev
```

### PROD

```bash
# run to start project in production mode
$ npm run start:prod
```

## Tests

### Unit tests

```bash
# run
$ npm run test
```

### Integration tests

You need have install [docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/) to up postgres database.

```bash
# run
$ npm run test:integration-local
```
