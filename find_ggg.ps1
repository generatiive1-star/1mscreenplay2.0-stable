$dbPath = "C:\Users\penta\AppData\Local\Microsoft\Edge\User Data\Profile 3\Local Storage\leveldb"
$tempDir = Join-Path $env:TEMP "leveldb_copy"
if (!(Test-Path $tempDir)) { New-Item -ItemType Directory -Path $tempDir | Out-Null }

$files = Get-ChildItem -Path $dbPath -File
foreach ($f in $files) {
    if ($f.Name -eq "LOCK") { continue }
    $tempFile = Join-Path $tempDir $f.Name
    Copy-Item $f.FullName $tempFile -Force -ErrorAction SilentlyContinue
    if (Test-Path $tempFile) {
        $c = [System.IO.File]::ReadAllText($tempFile, [System.Text.Encoding]::GetEncoding('latin1'))
        if ($c.Contains('{"projectName":"ggg"') -or $c.Contains('\"projectName\":\"ggg\"')) {
            Write-Host "FOUND KEY IN: $($f.Name)"
        }
        Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
    }
}
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue | Out-Null
