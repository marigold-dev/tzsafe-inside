# Define the shell used
SHELL := /bin/bash

# Default target executed when no arguments are given to make
.PHONY: all
all: update deploy

# Target for updating data
.PHONY: update
update:
	@echo "Updating data..."
	cd data && tsc
	node --experimental-specifier-resolution=node ./data/build/lastUpdatedTime.js || exit $?
	node --experimental-specifier-resolution=node ./data/build/fetchContractCounts.js || exit $?
	# fetch all safes
	node --experimental-specifier-resolution=node ./data/build/fetchContract.js || exit $?
	node --experimental-specifier-resolution=node ./data/build/processContracts.js || exit $?
	node --experimental-specifier-resolution=node ./data/build/postProcessContracts.js || exit $?
	@echo "Building..."
	cd ui && npm run build

# Target for building and deploying UI
.PHONY: deploy
deploy:
	@echo "Deploying UI..."
	npm run deploy
