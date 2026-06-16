$devPath = "C:\Users\penta\OneDrive\Desktop\1mscreenplay3.0\1mscreenplay3.0dev\app.js"
$stablePath = "C:\Users\penta\OneDrive\Desktop\1mscreenplay2.0 stable\1m-screenplay-main\1m-screenplay-main\app.js"

$devLines = Get-Content $devPath
$stableLines = Get-Content $stablePath

Write-Host "Dev lines count: $($devLines.Count)"
Write-Host "Stable lines count: $($stableLines.Count)"

# Simple line-by-line comparison or diff using Compare-Object
# Compare-Object compares line content
$diff = Compare-Object $devLines $stableLines

$addedToStable = ($diff | Where-Object { $_.SideIndicator -eq "=>" }).Count
$addedToDev = ($diff | Where-Object { $_.SideIndicator -eq "<=" }).Count

Write-Host "Lines in stable but not in dev (added in stable): $addedToStable"
Write-Host "Lines in dev but not in stable (removed in stable): $addedToDev"
