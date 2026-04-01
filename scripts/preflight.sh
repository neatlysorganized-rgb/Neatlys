#!/usr/bin/env bash

set -u

RED="$(printf '\033[31m')"
GREEN="$(printf '\033[32m')"
YELLOW="$(printf '\033[33m')"
RESET="$(printf '\033[0m')"

HAS_ERROR=0
CHECK_SECRETS=1

if [[ "${1:-}" == "--skip-secrets" ]]; then
  CHECK_SECRETS=0
fi

pass() {
  echo "${GREEN}PASS${RESET} $1"
}

warn() {
  echo "${YELLOW}WARN${RESET} $1"
}

fail() {
  echo "${RED}FAIL${RESET} $1"
  HAS_ERROR=1
}

require_cmd() {
  local cmd="$1"
  local purpose="$2"
  if command -v "$cmd" >/dev/null 2>&1; then
    pass "$cmd found ($purpose)"
  else
    fail "$cmd missing ($purpose)"
  fi
}

repo_slug_from_remote() {
  local remote_url
  remote_url="$(git remote get-url origin 2>/dev/null || true)"

  if [[ -z "$remote_url" ]]; then
    echo ""
    return
  fi

  # https://github.com/org/repo(.git)
  if [[ "$remote_url" =~ github\.com[:/]([^/]+/[^/.]+)(\.git)?$ ]]; then
    echo "${BASH_REMATCH[1]}"
    return
  fi

  echo ""
}

echo "Running deploy preflight checks..."
echo

require_cmd git "repository operations"
require_cmd gh "GitHub authentication and secrets checks"
require_cmd node "build/runtime tooling"
require_cmd npm "dependency install/build scripts"

if [[ ! -d ".github/workflows" ]]; then
  fail ".github/workflows not found in current directory"
else
  pass "workflow directory found"
fi

if gh auth status >/dev/null 2>&1; then
  pass "gh authentication is valid"
else
  fail "gh authentication invalid. Run: gh auth login -h github.com --git-protocol https --web"
fi

if [[ "$CHECK_SECRETS" -eq 1 ]]; then
  REPO_SLUG="$(repo_slug_from_remote)"
  if [[ -z "$REPO_SLUG" ]]; then
    fail "could not determine GitHub repo from origin remote"
  else
    pass "detected repo: $REPO_SLUG"
  fi

  REQUIRED_SECRETS="$(grep -RhoE 'secrets\.[A-Z0-9_]+' .github/workflows 2>/dev/null | sed 's/^secrets\.//' | sort -u)"
  if [[ -z "$REQUIRED_SECRETS" ]]; then
    warn "no secrets referenced in workflows"
  else
    pass "required secrets discovered from workflows: $(echo "$REQUIRED_SECRETS" | tr '\n' ' ' | sed 's/ *$//')"

    if [[ -n "$REPO_SLUG" ]] && gh auth status >/dev/null 2>&1; then
      REPO_SECRETS="$(gh secret list --repo "$REPO_SLUG" --json name --jq '.[].name' 2>/dev/null || true)"
      if [[ -z "$REPO_SECRETS" ]]; then
        warn "could not read repo secrets list (insufficient permissions or no secrets)"
      fi

      while IFS= read -r secret_name; do
        [[ -z "$secret_name" ]] && continue
        if echo "$REPO_SECRETS" | grep -qx "$secret_name"; then
          pass "GitHub secret present: $secret_name"
        else
          fail "GitHub secret missing: $secret_name"
        fi
      done <<< "$REQUIRED_SECRETS"
    fi
  fi
else
  warn "skipping GitHub secrets checks (--skip-secrets)"
fi

echo
if [[ "$HAS_ERROR" -eq 1 ]]; then
  echo "${RED}Preflight failed.${RESET}"
  exit 1
fi

echo "${GREEN}Preflight passed.${RESET}"
