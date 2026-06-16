$logPath = "C:\Users\penta\.gemini\antigravity\brain\7e8bb87f-3914-4bb7-8644-ac9596b4e8a6\.system_generated\logs\transcript_full.jsonl"
$lines = Get-Content -Path $logPath
foreach ($line in $lines) {
    if ($line.Trim() -eq "") { continue }
    try {
        $data = ConvertFrom-Json $line
        $step = $data.step_index
        if ($step -ge 140 -and $step -le 160) {
            Write-Host "--- STEP $step ($($data.source) / $($data.type)) ---"
            if ($data.tool_calls) {
                Write-Host "TOOL CALLS:"
                $data.tool_calls | ForEach-Object { Write-Host "  $($_.name) with args: $($_.args | ConvertTo-Json -Compress)" }
            }
            if ($data.content) {
                Write-Host "CONTENT:"
                Write-Host (Out-String -InputObject $data.content).Trim()
            }
            Write-Host "--------------------------------------------------------"
        }
    } catch {
        # ignore
    }
}
