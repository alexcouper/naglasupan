build:
	../../scripts/build.sh $(APP)

publish:
	../../scripts/publish.sh $(APP)

lint-default:
	@echo "Linting not implemented for $(APP)"

