Write-Host "Czyszczenie rozpoczęte..."

# TEMP i Windows Temp
Remove-Item "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$env:WINDIR\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue

# Prefetch
Remove-Item "$env:SystemRoot\Prefetch\*" -Force -ErrorAction SilentlyContinue

# Recent
Remove-Item "$env:APPDATA\Microsoft\Windows\Recent\*" -Force -ErrorAction SilentlyContinue
Remove-Item "$env:APPDATA\Microsoft\Windows\Recent\AutomaticDestinations\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$env:APPDATA\Microsoft\Windows\Recent\CustomDestinations\*" -Recurse -Force -ErrorAction SilentlyContinue

# Amcache
try {
    takeown /F "C:\Windows\AppCompat\Programs\Amcache.hve" /A
    icacls "C:\Windows\AppCompat\Programs\Amcache.hve" /grant administrators:F
    Remove-Item "C:\Windows\AppCompat\Programs\Amcache.hve" -Force -ErrorAction SilentlyContinue
} catch {}

# Muicache
Remove-ItemProperty -Path "HKCU:\Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\MuiCache" -Name * -Force -ErrorAction SilentlyContinue

# RunMRU
Remove-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\RunMRU" -Recurse -Force -ErrorAction SilentlyContinue

# Open/Save dialogs
Remove-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32\LastVisitedPidlMRU" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32\OpenSavePidlMRU" -Recurse -Force -ErrorAction SilentlyContinue

# UserAssist
Remove-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\UserAssist" -Recurse -Force -ErrorAction SilentlyContinue

# RecentApps
Remove-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search\RecentApps" -Recurse -Force -ErrorAction SilentlyContinue

# ShellBags
Remove-Item "HKCU:\Software\Microsoft\Windows\Shell\BagMRU" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "HKCU:\Software\Microsoft\Windows\Shell\Bags" -Recurse -Force -ErrorAction SilentlyContinue

# Event logi
try {
    wevtutil el | ForEach-Object { wevtutil cl $_ } 
} catch {}

Write-Host "`nCzyszczenie zakończone. Uruchom ponownie komputer, by zobaczyć efekt w LastActivityView."
Read-Host "Wciśnij Enter, aby zamknąć..."
