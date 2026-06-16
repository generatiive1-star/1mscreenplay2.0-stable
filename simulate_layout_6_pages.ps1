$logPath = "C:\Users\penta\AppData\Local\Microsoft\Edge\User Data\Profile 3\Local Storage\leveldb\000884.log"
$tempFile = [System.IO.Path]::GetTempFileName()
Copy-Item $logPath $tempFile -Force
$content = [System.IO.File]::ReadAllText($tempFile, [System.Text.Encoding]::GetEncoding('latin1'))

$idx = 0
$lastJson = $null
while (($idx = $content.IndexOf('{"projectName":"ggg"', $idx)) -ne -1) {
    $braceCount = 0
    $jsonEnd = -1
    for ($i = $idx; $i -lt $content.Length; $i++) {
        $char = $content[$i]
        if ($char -eq '{') { $braceCount++ }
        elseif ($char -eq '}') {
            $braceCount--
            if ($braceCount -eq 0) {
                $jsonEnd = $i + 1
                break
            }
        }
    }
    if ($jsonEnd -ne -1) {
        $jsonStr = $content.Substring($idx, $jsonEnd - $idx)
        $lastJson = $jsonStr
        $idx = $jsonEnd
    } else {
        $idx += 20
    }
}
Remove-Item $tempFile -Force | Out-Null

$obj = ConvertFrom-Json $lastJson
$allLines = @()
for ($p = 0; $p -lt $obj.pages.Count; $p++) {
    $page = $obj.pages[$p]
    for ($l = 0; $l -lt $page.Count; $l++) {
        $line = $page[$l]
        $allLines += [PSCustomObject]@{
            text = if ($line.text) { $line.text } else { "" }
            type = if ($line.type) { $line.type } else { "empty" }
            elementId = if ($line.elementId) { $line.elementId } else { "" }
            originalPageIdx = $p
            originalLineIdx = $l
        }
    }
}

# Trim trailing empty of document
$lastNonEmptyIdx = -1
for ($i = $allLines.Count - 1; $i -ge 0; $i--) {
    if ($allLines[$i].type -ne "empty" -or ($allLines[$i].text -and $allLines[$i].text.Trim() -ne "")) {
        $lastNonEmptyIdx = $i
        break
    }
}
$activeLines = if ($lastNonEmptyIdx -ge 0) { $allLines[0..$lastNonEmptyIdx] } else { @() }
Write-Host "activeLines Count: $($activeLines.Count)"
Write-Host "lastNonEmptyIdx: $lastNonEmptyIdx"

$renderItems = @()
foreach ($line in $activeLines) {
    if ($line.type -eq "empty") {
        $renderItems += [PSCustomObject]@{
            text = ""
            type = "empty"
            isBr = $true
            originalPageIdx = $line.originalPageIdx
            originalLineIdx = $line.originalLineIdx
        }
    } else {
        $parts = $line.text -split "<br\s*/?>"
        for ($partIdx = 0; $partIdx -lt $parts.Count; $partIdx++) {
            $renderItems += [PSCustomObject]@{
                text = $parts[$partIdx]
                type = $line.type
                isBr = $false
                originalPageIdx = $line.originalPageIdx
                originalLineIdx = $line.originalLineIdx
            }
            if ($partIdx -lt $parts.Count - 1) {
                $renderItems += [PSCustomObject]@{
                    text = ""
                    type = $line.type
                    isBr = $true
                    originalPageIdx = $line.originalPageIdx
                    originalLineIdx = $line.originalLineIdx
                }
            }
        }
    }
}
Write-Host "renderItems Count: $($renderItems.Count)"


function Get-LineHeight($text, $isBr) {
    if ($isBr) { return 20.0 }
    $cleanText = $text -replace '<[^>]*>', ''
    $len = $cleanText.Length
    $lines = [Math]::Max(1, [Math]::Ceiling($len / 60.0))
    return $lines * 20.0
}

# Browser page containers:
# Editor shows 3 pages. But VirtualLayout splits them!
# Wait! Let's check how many pages are created if we simulate VirtualLayout
# with and without trimming page-level empty lines!

$maxUsableHeight = 935 # 960 - 25

# Current logic simulation (no page-level trim) - sweep heights
foreach ($h_val in @(19.2, 20.0, 21.0, 22.0, 23.0, 24.0)) {
    $virtualPages = @()
    $currentPageLines = @()
    $currentY = 0
    foreach ($item in $renderItems) {
        # Calculate line height with height $h_val
        $lh = if ($item.isBr) { $h_val } else {
            $cleanText = $item.text -replace '<[^>]*>', ''
            $len = $cleanText.Length
            $lines = [Math]::Max(1, [Math]::Ceiling($len / 60.0))
            $lines * $h_val
        }
        if ($currentY + $lh -gt $maxUsableHeight -and $currentY -gt 0) {
            $virtualPages += ,$currentPageLines
            $currentPageLines = @()
            $currentY = 0
        }
        $currentPageLines += $item
        $currentY += $lh
    }
    if ($currentPageLines.Count -gt 0) {
        $virtualPages += ,$currentPageLines
    }
    Write-Host "CURRENT LOGIC sweep: Height $h_val : Pages = $($virtualPages.Count)"
    if ($virtualPages.Count -eq 6 -or $h_val -eq 22.0) {
        for ($p = 0; $p -lt $virtualPages.Count; $p++) {
            $vpage = $virtualPages[$p]
            $h_sum = 0.0
            foreach ($item in $vpage) {
                $lh = if ($item.isBr) { $h_val } else {
                    $cleanText = $item.text -replace '<[^>]*>', ''
                    $len = $cleanText.Length
                    $lines = [Math]::Max(1, [Math]::Ceiling($len / 60.0))
                    $lines * $h_val
                }
                $h_sum += $lh
            }
            Write-Host "  Page $($p+1): block count = $($vpage.Count), height = $h_sum px"
        }
    }
}

# After trimming page-level trailing empties
$trimmedLines = @()
for ($p = 0; $p -lt $obj.pages.Count; $p++) {
    $page = $obj.pages[$p]
    $lastNonEmptyInPage = -1
    for ($l = $page.Count - 1; $l -ge 0; $l--) {
        $line = $page[$l]
        if ($line.type -ne "empty" -or ($line.text -and $line.text.Trim() -ne "")) {
            $lastNonEmptyInPage = $l
            break
        }
    }
    $activeInPage = if ($lastNonEmptyInPage -ge 0) { $page[0..$lastNonEmptyInPage] } else { @() }
    for ($l = 0; $l -lt $activeInPage.Count; $l++) {
        $line = $activeInPage[$l]
        $trimmedLines += [PSCustomObject]@{
            text = if ($line.text) { $line.text } else { "" }
            type = if ($line.type) { $line.type } else { "empty" }
            elementId = if ($line.elementId) { $line.elementId } else { "" }
            originalPageIdx = $p
            originalLineIdx = $l
        }
    }
}

# Process into render items
$trimmedRenderItems = @()
foreach ($line in $trimmedLines) {
    if ($line.type -eq "empty") {
        $trimmedRenderItems += [PSCustomObject]@{
            text = ""
            type = "empty"
            isBr = $true
        }
    } else {
        $parts = $line.text -split "<br\s*/?>"
        for ($partIdx = 0; $partIdx -lt $parts.Count; $partIdx++) {
            $trimmedRenderItems += [PSCustomObject]@{
                text = $parts[$partIdx]
                type = $line.type
                isBr = $false
            }
            if ($partIdx -lt $parts.Count - 1) {
                $trimmedRenderItems += [PSCustomObject]@{
                    text = ""
                    type = $line.type
                    isBr = $true
                }
            }
        }
    }
}

# After page-level trim sweep
foreach ($h_val in @(19.2, 20.0, 21.0, 22.0, 23.0, 24.0)) {
    $trimmedPages = @()
    $currentPageLines = @()
    $currentY = 0
    foreach ($item in $trimmedRenderItems) {
        $lh = if ($item.isBr) { $h_val } else {
            $cleanText = $item.text -replace '<[^>]*>', ''
            $len = $cleanText.Length
            $lines = [Math]::Max(1, [Math]::Ceiling($len / 60.0))
            $lines * $h_val
        }
        if ($currentY + $lh -gt $maxUsableHeight -and $currentY -gt 0) {
            $trimmedPages += ,$currentPageLines
            $currentPageLines = @()
            $currentY = 0
        }
        $currentPageLines += $item
        $currentY += $lh
    }
    if ($currentPageLines.Count -gt 0) {
        $trimmedPages += ,$currentPageLines
    }
    Write-Host "AFTER PAGE-LEVEL TRIM sweep: Height $h_val : Pages = $($trimmedPages.Count)"
    if ($trimmedPages.Count -eq 4 -and $h_val -eq 22.0) {
        for ($p = 0; $p -lt $trimmedPages.Count; $p++) {
            $vpage = $trimmedPages[$p]
            $h_sum = 0.0
            foreach ($item in $vpage) {
                $lh = if ($item.isBr) { $h_val } else {
                    $cleanText = $item.text -replace '<[^>]*>', ''
                    $len = $cleanText.Length
                    $lines = [Math]::Max(1, [Math]::Ceiling($len / 60.0))
                    $lines * $h_val
                }
                $h_sum += $lh
            }
            Write-Host "  Page $($p+1): block count = $($vpage.Count), height = $h_sum px"
        }
    }
}
