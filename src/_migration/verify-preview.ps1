param([string]$BaseUrl = 'https://govisibi.ai/v2/')
$ErrorActionPreference = 'Stop'
$base = $BaseUrl.TrimEnd('/') + '/'
$paths = @('', 'geo/', 'ai-agents/', 'ecommerce-development/', 'insights/', 'insights/what-is-geo/', 'contact/')
$failed = @()
foreach ($path in $paths) {
    $url = $base + $path
    try {
        $response = Invoke-WebRequest -Uri $url -MaximumRedirection 3 -UseBasicParsing
        $html = [string]$response.Content
        $robots = [string]$response.Headers['X-Robots-Tag']
        if ($response.StatusCode -ne 200) { $failed += "$url status $($response.StatusCode)" }
        if ($robots -notmatch 'noindex') { $failed += "$url missing X-Robots-Tag noindex" }
        if ($html -notmatch '<h1\b') { $failed += "$url missing H1" }
        if ($html -match '\.dc\.html') { $failed += "$url contains prototype URL" }
        Write-Output "$($response.StatusCode) $url noindex=$($robots -match 'noindex')"
    } catch { $failed += "$url request failed: $($_.Exception.Message)" }
}
$robotsUrl = ([Uri]$base).GetLeftPart([System.UriPartial]::Authority) + '/robots.txt'
try {
    $robotsText = (Invoke-WebRequest -Uri $robotsUrl -UseBasicParsing).Content
    if ($robotsText -notmatch '(?m)^Disallow:\s*/v2/?\s*$') { $failed += "$robotsUrl missing Disallow: /v2/" }
} catch { $failed += "$robotsUrl request failed: $($_.Exception.Message)" }
if ($failed.Count) { $failed | ForEach-Object { Write-Error $_ }; exit 1 }
Write-Output 'Preview route and indexing checks passed.'
