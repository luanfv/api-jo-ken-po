[![Build and Deploy to PRD](https://github.com/luanfv/api-jo-ken-po/actions/workflows/main.yaml/badge.svg)](https://github.com/luanfv/api-jo-ken-po/actions/workflows/main.yaml)

## Description

JO KEN PO API development with NestJS + Prisma + Postgres. This project is the classic game JO KEN PO. <br />
You can [play JO KEN PO for here](https://api-jo-ken-po-prd.onrender.com/swagger).

## Installation

```bash
$ npm install
```

## Running the app

You need create a copy of the file `.env.example` in the project root and rename to `.env` with your environment variables. You can run this script for it:

```bash
# create a copy of the .env.example and rename to .env
$ cat .env.example > .env
```

### DEV

You need have install [docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/) to up postgres database.

```bash
# run to start project in dev mode
$ npm run start:dev
```

## Tests

### Unit tests

```bash
# run
$ npm run test
```

### Integration tests

You need have install [docker](https://docs.docker.com/engine/install/) and [docker-compose](https://docs.docker.com/compose/install/) to up postgres database.
Obs: you cannot edit docker-compose.yaml and .env.example to work.

```bash
# run
$ npm run test:integration-local
```
