$filePath = "c:\Users\ahmed\Documents\projects\Social-Pulse\docs\KANBAN_SOURCE_SOCIAL_PULSE.md"
$csvPath = "c:\Users\ahmed\Documents\projects\Social-Pulse\Social-Pulse-Issues.csv"

$lines = Get-Content $filePath -Encoding UTF8
$issues = @()
$currentIssue = $null

foreach ($line in $lines) {
    # Match main tasks: "- [ ] **Task Title** optionally followed by tags"
    if ($line -match '^\s*-\s*\[.*?\]\s*\*\*(.*?)\*\*') {
        if ($currentIssue -ne $null) {
            $issues += $currentIssue
        }
        $title = $matches[1]
        
        # Get the rest of the line for labels/context
        $restOfLine = $line -replace '^\s*-\s*\[.*?\]\s*\*\*.*?\*\*\s*', ''
        
        $currentIssue = [PSCustomObject]@{
            Titre = $title
            Description = ""
            Statut = "Ouvert"
            Etiquettes = $restOfLine.Trim()
        }
    }
    # Match sub-tasks: "    - [ ] Subtask detail"
    elseif ($line -match '^\s+-\s*\[.*?\]\s*(.*)') {
        if ($currentIssue -ne $null) {
             # Append to description with a bullet point
             $currentIssue.Description += "- " + $matches[1] + "`r`n"
        }
    }
}

# Add the very last issue
if ($currentIssue -ne $null) {
    $issues += $currentIssue
}

$issues | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8
Write-Output "Successfully parsed $($issues.Count) issues."
