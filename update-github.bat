@echo off
setlocal

echo ----------------------------------------
echo   GitHub Update wird gestartet...
echo ----------------------------------------

REM In das Verzeichnis wechseln, in dem das Skript liegt
cd /d "%~dp0"

REM Prüfen, ob wir in einem Git-Repo sind
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo Fehler: Dieses Verzeichnis ist kein Git-Repository.
    echo Bitte in den Projektordner wechseln.
    pause
    exit /b 1
)

echo Änderungen werden geprüft...

REM Prüfen, ob es Änderungen gibt
git status --porcelain >nul 2>&1
if %errorlevel% neq 0 (
    echo Fehler beim Prüfen des Status.
    pause
    exit /b 1
)

git status --porcelain | findstr . >nul
if errorlevel 1 (
    echo Keine Änderungen gefunden. Nichts zu committen.
    echo ----------------------------------------
    echo   Update abgeschlossen!
    echo ----------------------------------------
    pause
    exit /b 0
)

echo Änderungen gefunden. Commit wird erstellt...

git add .
git commit -m "Automatisches Update"

echo Push nach GitHub wird ausgeführt...

git push origin main
if errorlevel 1 (
    echo Fehler beim Push. Bitte prüfen, ob der Branch 'main' existiert.
    pause
    exit /b 1
)

echo ----------------------------------------
echo   Update abgeschlossen!
echo ----------------------------------------
pause
