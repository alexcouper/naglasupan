.PHONY: ci ci-ship maintenance maintenance-dry-run

ci:
	./scripts/ci/ci.sh

ci-ship:
	./scripts/ci/ci-ship.sh

maintenance:
	uv run cleanup-registry --profile naglasupan-prod

maintenance-dry-run:
	uv run cleanup-registry --profile naglasupan-prod --dry-run