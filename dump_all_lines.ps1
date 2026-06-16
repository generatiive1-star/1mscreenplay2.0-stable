$logPath = "C:\Users\penta\AppData\Local\Microsoft\Edge\User Data\Profile 3\Local Storage\leveldb\000880.log"
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

if ($lastJson) {
    $obj = ConvertFrom-Json $lastJson
    for ($p = 0; $p -lt $obj.pages.Count; $p++) {
        Write-Host "--- PAGE $($p+1) ---"
        $page = $obj.pages[$p]
        for ($l = 0; $l -lt $page.Count; $l++) {
            $line = $page[$l]
            Write-Host "Line $($l): [$($line.type)] '$($line.text)'"
        }
    }
} else {
    Write-Host "ggg not found"
}
Remove-Item $tempFile -Force | Out-Null
