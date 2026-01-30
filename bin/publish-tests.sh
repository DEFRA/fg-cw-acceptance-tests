#!/bin/sh
set -eu

echo "Publishing test results to S3"

if [ -z "${RESULTS_OUTPUT_S3_PATH:-}" ]; then
  echo "RESULTS_OUTPUT_S3_PATH is not set"
  exit 1
fi

publish_dir () {
  SRC="$1"
  DEST_SUFFIX="$2"

  if [ -d "$SRC" ]; then
    aws s3 cp --quiet "$SRC" "${RESULTS_OUTPUT_S3_PATH%/}/$DEST_SUFFIX" --recursive
    echo "Published $SRC to ${RESULTS_OUTPUT_S3_PATH%/}/$DEST_SUFFIX"
  else
    echo "Skipping: $SRC not found"
  fi
}

# if [ "${PROFILE:-}" = "accessibility" ]; then
#   publish_dir "$PWD/reports/accessibility" ""
# else
  publish_dir "$PWD/allure-report" ""
# fi

