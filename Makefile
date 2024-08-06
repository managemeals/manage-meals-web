.PHONY: default
default:
	echo default

# hosted
.PHONY: build
build:
	docker compose build

.PHONY: up
up:
	docker compose up

.PHONY: upd
upd:
	docker compose up -d

.PHONY: pull
pull:
	docker compose pull

# self hosted
.PHONY: build-selfhost
build-selfhost:
	docker compose \
	-f docker-compose.selfhost.yaml \
	-f docker-compose.selfhost.override.yaml \
	build

.PHONY: up-selfhost
up-selfhost:
	docker compose \
	-f docker-compose.selfhost.yaml \
	-f docker-compose.selfhost.override.yaml \
	up
