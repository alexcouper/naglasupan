# naglasupan - Claude Development Guide

## Project Overview

Django backend + Next.js web-ui + Terraform infrastructure for naglasupan.

## Workspace Information

You are running in a JJ (Jujutsu) workspace. Check your workspace:

```bash
jj workspace list
```

Workspaces:
- `default` - Reserved for the user (DO NOT use)
- `w1`, `w2`, `w3` - Claude instance workspaces

## Development Workflow

**ALWAYS start by doing `jj new -m "<change description>"`**

## TDD

Backend: Write tests first.

Prefer descriptive test names over docstrings

### Commit Between Development Stages

Commit your work frequently using JJ:

```bash
jj commit -m "descriptive message of changes"
```

Best practices:
- Commit after completing each logical unit of work
- Use clear, descriptive commit messages
- Check `jj status` before committing
- Never commit to the `default` workspace

### Linting

**Django Backend** (from `src/django-backend/`):
```bash
make lint  # runs: uv run ruff check . && uv run ruff format --check .
```

**Web UI** (from `src/web-ui/`):
```bash
npm run lint  # runs: eslint
```

**Terraform** (from `infra/prod/app/`):
```bash
terraform fmt -check
terraform validate
```

### Testing

**Django Backend** (from `src/django-backend/`):
```bash
make test  # runs: uv run pytest
```

### OpenAPI Workflow

When modifying Django API endpoints, you MUST regenerate types:

1. Make changes to Django API
2. Generate OpenAPI spec:
   ```bash
   cd src/django-backend && make extract-openapi
   ```
3. Generate TypeScript types in web-ui:
   ```bash
   cd src/web-ui && npm run generate-types
   ```

### Terraform Workflow

From `infra/prod/app/`:
```bash
terraform fmt      # Format files
terraform validate # Validate configuration
terraform plan     # Preview changes (requires credentials)
```

### Full CI Check

From project root:
```bash
make ci
```

## Browser Testing with Playwright

Use the Playwright MCP server for browser automation testing.

Test user credentials are in `.env.claude`:
```bash
source .env.claude
```

When testing authenticated features:
1. Navigate to the application URL (from `$TEST_APP_URL`)
2. Log in with test credentials (`$TEST_USER_EMAIL`, `$TEST_USER_PASSWORD`)
3. Perform the test scenario
4. Verify expected behavior visually
5. Only report back when the feature is confirmed working

## File Locations

| Component | Path |
|-----------|------|
| Django backend | `src/django-backend/` |
| Web UI | `src/web-ui/` |
| Terraform | `infra/prod/app/` |
| CI scripts | `scripts/ci/` |
| Roadmap | `roadmap/` |

## Standard Development Flow

JJ auto commits, but we need to set a description for the work we're doing. We do that at the START of the work

1. Verify you're in a workspace (`jj workspace list`).
2. Start by running `jj new -m <description>` giving you a first changeset that you'll work from and isolating your changes
3. Understand the task
4. Write code
5. Run lint (`make lint` in django-backend, `npm run lint` in web-ui)
6. Run tests (`make test` in django-backend)
7. If API changed: regenerate OpenAPI types
8. `jj new -m "description"`
9. If needed: test in browser with Playwright

