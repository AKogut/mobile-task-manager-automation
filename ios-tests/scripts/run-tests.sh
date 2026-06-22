#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WORKSPACE="$REPO_ROOT/app/ios/MobileTaskManager.xcworkspace"
SCHEME="MobileTaskManager"
DESTINATION="${IOS_TEST_DESTINATION:-platform=iOS Simulator,name=iPhone 17 Pro Max}"
DERIVED_DATA="$REPO_ROOT/app/ios/build/uitests"
EMBED_BUNDLE="${IOS_TEST_EMBED_BUNDLE:-NO}"
RESULT_BUNDLE="${IOS_TEST_RESULT_BUNDLE:-}"

require_metro() {
  if [ "$EMBED_BUNDLE" = "YES" ]; then
    return 0
  fi
  if ! curl -s --max-time 3 http://localhost:8081/status 2>/dev/null | grep -q "packager-status:running"; then
    echo "Metro is not reachable on http://localhost:8081 — start it first: npm run app:start" >&2
    exit 1
  fi
}

build_for_testing() {
  local extra=()
  [ "$EMBED_BUNDLE" = "YES" ] && extra+=(FORCE_BUNDLING=YES)
  xcodebuild build-for-testing \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -sdk iphonesimulator \
    -destination "$DESTINATION" \
    -derivedDataPath "$DERIVED_DATA" \
    CODE_SIGNING_ALLOWED=NO \
    ${extra[@]+"${extra[@]}"}
}

test_without_building() {
  require_metro
  local extra=()
  [ -n "$RESULT_BUNDLE" ] && extra+=(-resultBundlePath "$RESULT_BUNDLE")
  xcodebuild test-without-building \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -destination "$DESTINATION" \
    -derivedDataPath "$DERIVED_DATA" \
    ${extra[@]+"${extra[@]}"}
}

case "${1:-all}" in
  build) build_for_testing ;;
  run) test_without_building ;;
  all) build_for_testing && test_without_building ;;
  *)
    echo "usage: run-tests.sh [build|run|all]" >&2
    exit 1
    ;;
esac
