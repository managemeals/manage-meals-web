# ManageMeals Web

This is the ManageMeals frontend, what you see at https://managemeals.com. It's a SvelteKit app.

## Development

The [backend](https://github.com/managemeals/manage-meals-api) needs to be running. Then setup the environment variables:

```bash
cp .env.example .env
```

After that, the app can be started:

```bash
npm install

npm run dev
```

## Production

To build the app:

```bash
npm run build
```

Though for production that's done in a Dockerfile.

Expose ports by creating a file called `docker-compose.override.yaml` with the contents:

```yaml
services:
  manage-meals-web-01:
    ports:
      - 8301:3000

  manage-meals-web-02:
    ports:
      - 8302:3000

  manage-meals-web-lb:
    ports:
      - 8309:80
```

Then start it up using `docker-compose`:

```bash
cp .env.docker.example .env.docker

make build

make upd
```
