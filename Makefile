.PHONY: default
default:
	echo default

# hosted
.PHONY: build
build:
	podman compose build

.PHONY: up
up:
	podman compose up

.PHONY: upd
upd:
	podman compose up -d

.PHONY: pull
pull:
	podman compose pull

# self hosted
.PHONY: build-selfhost
build-selfhost:
	podman compose \
	-f docker-compose.selfhost.yaml \
	-f docker-compose.selfhost.override.yaml \
	build

.PHONY: up-selfhost
up-selfhost:
	podman compose \
	-f docker-compose.selfhost.yaml \
	-f docker-compose.selfhost.override.yaml \
	up
