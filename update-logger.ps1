# Get all component files without LoggerService
$all = Get-ChildItem -Path src/app/features -Include "*.component.ts" -Recurse
$updated = 0
$failed = @()

foreach ($file in $all) {
    $content = Get-Content $file -Raw
    
    # Skip if already has LoggerService
    if ($content -match "LoggerService") {
        continue
    }
    
    try {
        # Step 1: Add import statement after other imports
        if ($content -match "import\s*{[^}]*}\s*from\s*['\"]@angular") {
            # Find the last angular import
            $lines = $content -split "`n"
            $lastAngularImportIdx = -1
            
            for ($i = 0; $i -lt $lines.Count; $i++) {
                if ($lines[$i] -match "import\s*{[^}]*}\s*from\s*['\"]@angular") {
                    $lastAngularImportIdx = $i
                } elseif ($lines[$i] -match "import\s*{[^}]*}\s*from\s*['\"].*service") {
                    # Stop at other services
                    break
                }
            }
            
            if ($lastAngularImportIdx -ge 0) {
                # Insert LoggerService import after last angular import
                $lines[$lastAngularImportIdx] = $lines[$lastAngularImportIdx] + "`nimport { LoggerService } from '../../../../core/services/logger.service';"
                $content = $lines -join "`n"
            }
        }
        
        # Step 2: Add logger to constructor parameters
        # Find constructor and add logger parameter
        if ($content -match "constructor\s*\([^)]*\)") {
            # Check if constructor has parameters
            $constructorMatch = [regex]::Match($content, "constructor\s*\(([^)]*)\)")
            if ($constructorMatch.Success) {
                $params = $constructorMatch.Groups[1].Value.Trim()
                if ($params -and -not $params.EndsWith(',')) {
                    # Add comma if there are existing params and no comma at end
                    if ($params.Length -gt 0) {
                        $content = $content -replace "constructor\s*\(([^)]*[^\s,])\)", "constructor(`$1,"
                    }
                }
                # Add logger parameter if not present
                if ($content -notmatch "private\s+logger\s*:\s*LoggerService") {
                    $content = $content -replace "constructor\s*\(", "constructor(`n    private logger: LoggerService,"
                }
            }
        }
        
        # Write updated content
        Set-Content -Path $file.FullName -Value $content
        $updated++
        Write-Host " Updated: $($file.Name)"
    } catch {
        $failed += $file.FullName
        Write-Host " Failed: $($file.Name) - $_"
    }
}

Write-Host "`n========== SUMMARY =========="
Write-Host "Successfully updated: $updated files"
Write-Host "Failed: $($failed.Count) files"
if ($failed.Count -gt 0) {
    Write-Host "Failed files:"
    $failed | ForEach-Object { Write-Host "  - $_" }
}
