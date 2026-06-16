$logPath = "C:\Users\penta\.gemini\antigravity\brain\7e8bb87f-3914-4bb7-8644-ac9596b4e8a6\.system_generated\logs\transcript_full.jsonl"
$lines = Get-Content -Path $logPath
foreach ($line in $lines) {
    if ($line.Trim() -eq "") { continue }
    try {
        $data = ConvertFrom-Json $line
        $content = $data.content
        if ($content) {
            $contentStr = Out-String -InputObject $content
            if ($contentStr -match "Virtual Page 6|Page 6|Virtual Page 5|Page 5") {
                Write-Host "Step $($data.step_index):"
                Write-Host $contentStr
                Write-Host "---------------------------------------------"
            }
        }
    } catch {
        # ignore parse errors
    }
}
