FROM node:20-bookworm@sha256:4b4e58e59c5e042928790c6fccd8ad16da6296bcc2e9924c56fba84a8e5ff662 AS build-env

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci

COPY . .

RUN npm run build

CMD ["node", "build"]

FROM gcr.io/distroless/nodejs20-debian12:nonroot@sha256:010cb788479147947d2515097bc9c8b77e12e77316f79a0d46e60c445905038b

COPY --from=build-env /app /app

WORKDIR /app

CMD ["build/index.js"]
