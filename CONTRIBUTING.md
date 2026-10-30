# Contributing

This document defines the branching model, commit conventions, and workflow for this repository.

## Branching Model

`main` is protected and always releasable. All changes land through pull requests — no direct pushes to `main`.

Create a short-lived branch per change, named `<type>/<short-slug>`:

```
feat/task-due-dates
test/espresso-filter-by-status
ci/nightly-ios-runner
docs/test-case-catalogue
```

## Commit Convention

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <description>

feat(app): add due dates to tasks
test(appium): cover sorting by priority
ci: bump Node to 22.22.0 for the Appium driver
```

Types: `feat`, `fix`, `test`, `ci`, `docs`, `chore`, `refactor`, `perf`, `build`.

## Local Setup

The toolchain versions are pinned in the repository: Node in `.nvmrc`, Ruby in `.ruby-version` (CocoaPods), Java in `.java-version` (Android). iOS work needs Xcode and Android work needs the Android SDK; [docs/build-and-run.md](docs/build-and-run.md) has the details.

```
npm run setup            # tooling, the app and its Pods
npm run app:ios          # or: npm run app:android
```

Each suite has its own README with the commands to run it: [appium-tests](appium-tests/), [ios-tests](ios-tests/README.md), [android-tests](android-tests/README.md).

## Before Opening a Pull Request

The pre-commit hook formats and lints staged files, and the pre-push hook runs the same checks as CI:

```
npm run lint
npm run typecheck
npm test --prefix app
```

## Pull Requests

- The PR title is a Conventional Commit, because PRs are squash-merged and the title becomes the commit message.
- `App lint, typecheck, and unit tests` must pass before merging.
- A new or changed user journey is added to the [test-case catalogue](docs/test-cases/) so all three suites stay traceable to it.
