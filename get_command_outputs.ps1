$logPath = "C:\Users\penta\.gemini\antigravity\brain\7e8bb87f-3914-4bb7-8644-ac9596b4e8a6\.system_generated\logs\transcript_full.jsonl"
$lines = Get-Content -Path $logPath
foreach ($line in $lines) {
    if ($line.Trim() -eq "") { continue }
    try {
        $data = ConvertFrom-Json $line
        if ($data.tool_calls) {
            foreach ($tc in $data.tool_calls) {
                if ($tc.name -eq "run_command") {
                    $cmd = $tc.args.CommandLine
                    Write-Host "STEP $($data.step_index) COMMAND: $cmd"
                    # Find if there is a response in next steps or if this step's status/content shows the output.
                }
            }
        }
        if ($data.content -and $data.source -eq "SYSTEM") {
            # This is the command response!
            $cleanContent = Out-String -InputObject $data.content
            if ($cleanContent.Trim() -ne "") {
                Write-Host "STEP $($data.step_index) RESPONSE:"
                Write-Host $cleanContent.Substring(0, [Math]::Min(1000, $cleanContent.Length))
                Write-Host "========================================================="
            }
        }
    } catch {
        # ignore
    }
}
