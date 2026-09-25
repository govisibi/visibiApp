#!/bin/sh
set -eu
export HOME=/tmp

while IFS='|' read -r title slug; do
  [ -n "$slug" ] || continue
  id="$(wp post list --post_type=page --name="$slug" --field=ID | head -n 1)"
  if [ -z "$id" ]; then
    id="$(wp post create --post_type=page --post_status=publish --post_title="$title" --name="$slug" --porcelain)"
    echo "Created page: $slug ($id)"
  else
    wp post update "$id" --post_status=publish >/dev/null
    echo "Kept page: $slug ($id)"
  fi
done <<'PAGES'
Home|home
About|about
GEO|geo
SEO|seo
AI Agents|ai-agents
Insights|insights
Tool|tool
How We Work|how-we-work
Contact|contact
Privacy Policy|privacy-policy
Terms of Use|terms-of-use
Coming Soon|coming-soon
PAGES

home_id="$(wp post list --post_type=page --name=home --field=ID | head -n 1)"
insights_id="$(wp post list --post_type=page --name=insights --field=ID | head -n 1)"
wp option update show_on_front page >/dev/null
wp option update page_on_front "$home_id" >/dev/null
wp option update page_for_posts "$insights_id" >/dev/null
wp option update permalink_structure '/insights/%postname%/' >/dev/null
wp rewrite flush >/dev/null
echo 'React route pages and WordPress permalinks are ready.'
