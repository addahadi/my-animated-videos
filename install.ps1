# Installs the three Runtime.tech video skills for Codex and, optionally, the workspace files:
# AGENTS.md, plans/style.md and references/runtime-style/.
#
# Usage (PowerShell, from the extracted folder):
#   powershell -ExecutionPolicy Bypass -File .\install.ps1 -Workspace "C:\path\to\your\video-workspace"
#
# Without -Workspace, only the skills are installed.
# Existing AGENTS.md and plans\style.md in the workspace are backed up first (*.old.md).

param(
    [string]$Workspace = ""
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$skillsDest = Join-Path $HOME ".agents\skills"

foreach ($name in "reel-script-writer", "video-planner", "remotion-builder") {
    $source = Join-Path $root "skills\$name\SKILL.md"
    if (-not (Test-Path $source)) {
        throw "Missing file: $source"
    }
    $target = Join-Path $skillsDest $name
    New-Item -ItemType Directory -Force $target | Out-Null
    Copy-Item -Force $source (Join-Path $target "SKILL.md")
    Write-Host "Installed skill: $name -> $target"
}

if ($Workspace -ne "") {
    if (-not (Test-Path $Workspace)) {
        throw "Workspace folder not found: $Workspace"
    }

    # AGENTS.md
    $agentsTarget = Join-Path $Workspace "AGENTS.md"
    if (Test-Path $agentsTarget) {
        Copy-Item -Force $agentsTarget (Join-Path $Workspace "AGENTS.old.md")
        Write-Host "Existing AGENTS.md backed up to: AGENTS.old.md"
    }
    Copy-Item -Force (Join-Path $root "AGENTS.md") $agentsTarget
    Write-Host "AGENTS.md installed in: $Workspace"

    # plans\style.md
    $plansDir = Join-Path $Workspace "plans"
    New-Item -ItemType Directory -Force $plansDir | Out-Null
    $styleTarget = Join-Path $plansDir "style.md"
    if (Test-Path $styleTarget) {
        Copy-Item -Force $styleTarget (Join-Path $plansDir "style.old.md")
        Write-Host "Existing plans\style.md backed up to: plans\style.old.md"
    }
    Copy-Item -Force (Join-Path $root "workspace\plans\style.md") $styleTarget
    Write-Host "Style guide installed: $styleTarget"

    # references\runtime-style\
    $refDir = Join-Path $Workspace "references\runtime-style"
    New-Item -ItemType Directory -Force $refDir | Out-Null
    Copy-Item -Force -Recurse (Join-Path $root "workspace\references\runtime-style\*") $refDir
    Write-Host "Reference images installed: $refDir"
    Write-Host "Optional: copy your reference video there as reference.mp4 (reference only, never used as footage)."
} else {
    Write-Host "Workspace files were not installed. Rerun with -Workspace <path> to add AGENTS.md, plans\style.md and the reference images."
}

Write-Host ""
Write-Host "Done. Start Codex in your workspace and type /skills to check that all three skills appear."
