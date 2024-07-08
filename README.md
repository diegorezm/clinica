# Setup

Create docker db:

```sh
docker-compose -f docker-compose.dev.yml up -d

```

Run migrations:

```sh
bun run generate && bun run migrate
```

To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

# Todos

## Services:

    - [] login
    - [] jwt auth
    - [] Create updates
