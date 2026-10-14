#!/usr/bin/env bash
set -euo pipefail

catalog_dir=${1:?catalog directory required}
temporary_name=${2:?temporary filename required}
expected_sha=${3:?expected SHA-256 required}

[[ "$catalog_dir" =~ ^/[a-zA-Z0-9._/-]+$ && "$catalog_dir" != *".."* ]] || exit 1
[[ "$temporary_name" =~ ^\.classification-catalog\.json\.[a-zA-Z0-9.-]+\.tmp$ ]] || exit 1
[[ "$expected_sha" =~ ^[a-f0-9]{64}$ ]] || exit 1
[[ -d "$catalog_dir" && -w "$catalog_dir" ]] || exit 1

temporary_path="$catalog_dir/$temporary_name"
[[ -f "$temporary_path" ]] || exit 1
actual_sha=$(sha256sum "$temporary_path")
[[ "${actual_sha%% *}" == "$expected_sha" ]] || {
    echo 'Uploaded Classification catalog failed its SHA-256 check' >&2
    exit 1
}

chmod 0644 "$temporary_path"
mv -f -- "$temporary_path" "$catalog_dir/classification-catalog.json"
