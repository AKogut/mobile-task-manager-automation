# Security Policy

## Reporting a vulnerability

Please do not open public issues for security vulnerabilities.

Report privately via [GitHub Security Advisories](https://github.com/AKogut/mobile-task-manager-automation/security/advisories/new). You will receive an acknowledgement within 72 hours and a status update as the report is triaged.

## Scope

The React Native app in `app/`, the three automation suites (`appium-tests/`, `ios-tests/`, `android-tests/`) and the workflows that build, run and publish them.

## Supported versions

Only `main` is maintained.

## Dependency advisories

Dependabot alerts and security updates are enabled. Version updates are proposed weekly for the three npm projects, the app's Ruby toolchain and the workflows. [`.github/dependabot.yml`](.github/dependabot.yml) records which upgrades are held back and why: React Native minors are migrations, not bumps.
