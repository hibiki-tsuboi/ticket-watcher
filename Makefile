SHELL := /bin/bash

.PHONY: setup run test lint format

setup:
	npm run setup

run:
	npm run start

test:
	npm run test

lint:
	npm run lint

format:
	npm run format

