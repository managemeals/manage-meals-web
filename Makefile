.PHONY: default
default:
	echo default

.PHONY: build
build:
	docker compose -f docker-compose.dev.yaml build

.PHONY: up
up:
	docker compose -f docker-compose.dev.yaml up

.PHONY: down
down:
	docker compose -f docker-compose.dev.yaml down

.PHONY: clean
clean:
	docker compose -f docker-compose.dev.yaml down -v

.PHONY: restart
restart: down build up

.PHONY: recreate
recreate: clean build up
