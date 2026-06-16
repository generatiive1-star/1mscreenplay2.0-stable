$procs = Get-Process msedge, chrome -ErrorAction SilentlyContinue
foreach ($p in $procs) {
    $id = $p.Id
    $cmd = (Get-CimInstance Win32_Process -Filter "ProcessId = $id").CommandLine
    if ($cmd) {
        Write-Host "PROCESS $($p.Name) (ID $id):"
        Write-Host $cmd
        Write-Host "--------------------------------------------------------"
    }
}
