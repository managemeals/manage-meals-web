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

Though for production that's done in a Dockerfile. To start it up using `docker-compose`:

```bash
cp .env.docker.example .env.docker

make build

make upd
```
