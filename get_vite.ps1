$content = Invoke-RestMethod -Uri 'http://localhost:5173/resources/js/Pages/Invitation/netflix/DynamicIndex.jsx'
$lines = $content -split '\r?\n'
for ($i=530; $i -le 550; $i++) {
    if ($i -lt $lines.Length) {
        Write-Host "$($i+1): $($lines[$i])"
    }
}
