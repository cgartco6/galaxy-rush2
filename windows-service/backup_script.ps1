$date = Get-Date -Format "yyyyMMdd"
$backupDir = "C:\GalaxyRush\Backup\$date"
$repoPath = "C:\GalaxyRush\galaxy-rush"

# Create backup directory
New-Item -ItemType Directory -Path $backupDir -Force

# Backup Firebase config
Copy-Item "$repoPath\backend\firestore.rules" -Destination "$backupDir\firestore.rules"

# Backup database
firebase firestore:export "$backupDir\firestore_export" --project your-project-id

# Backup game assets
Compress-Archive -Path "$repoPath\game\Assets" -DestinationPath "$backupDir\game_assets.zip"

# Upload to GitHub
Set-Location $repoPath
git add .
git commit -m "Daily backup $date"
git push origin main

Write-Host "Backup completed successfully"
