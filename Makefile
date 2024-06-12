.PHONY: default
default:
	echo default

.PHONY: build
build:
	docker compose build

.PHONY: upd
upd:
	docker compose up -d
