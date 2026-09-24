#!/bin/sh
set -eu
export HOME=/tmp

while IFS='|' read -r slug title published excerpt; do
  [ -n "$slug" ] || continue
  id="$(wp post list --post_type=post --name="$slug" --field=ID | head -n 1)"
  if [ -n "$id" ]; then
    echo "Kept article: $slug ($id)"
    continue
  fi
  id="$(wp post create --post_type=post --post_status=publish --post_name="$slug" --post_title="$title" --post_excerpt="$excerpt" --post_content="$excerpt" --post_date="$published 12:00:00" --porcelain)"
  echo "Created article: $slug ($id)"
done <<'ARTICLES'
geo-playbook-2026|The 2026 GEO Playbook: How to Win in AI-Enabled Search|2025-12-01|Search has quietly crossed a line. Learn the 7 key signals for organic success in 2026 and strategies for optimizing AI-enabled search.
small-business-ai-visibility-guide|Can't See Your Business in AI Results? 7 Practical Steps for Small Businesses|2025-12-01|Practical, budget-friendly guide for small businesses to improve visibility in AI search results.
chatgpt-brand-discovery|How ChatGPT Discovers & Cites Brands in 2025|2025-11-17|Deep analysis of the technical mechanisms ChatGPT uses to source information and how brands can optimize for citations.
ARTICLES
