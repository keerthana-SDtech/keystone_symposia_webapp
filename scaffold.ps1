$baseDir = "c:\keystone-initial\keystone-symposia\src"
$folders = @(
    "app\providers",
    "app\router",
    "pages",
    "features\sample-feature\api",
    "features\sample-feature\hooks",
    "features\sample-feature\components",
    "features\sample-feature\schemas",
    "features\sample-feature\types",
    "entities\sample-entity",
    "components\layout",
    "components\ui",
    "components\feedback",
    "shared\schemas",
    "shared\utils",
    "shared\constants",
    "lib",
    "types",
    "styles"
)

foreach ($f in $folders) {
    if (-not (Test-Path "$baseDir\$f")) {
        New-Item -ItemType Directory -Force -Path "$baseDir\$f" | Out-Null
    }
}

$files = @(
    "app\providers\AuthProvider.tsx",
    "app\providers\QueryProvider.tsx",
    "app\providers\ThemeProvider.tsx",
    "app\providers\index.tsx",
    "app\router\routes.tsx",
    "app\router\ProtectedRoute.tsx",
    "app\router\RoleGuard.tsx",
    "pages\SamplePage.tsx",
    "features\sample-feature\api\sampleApi.ts",
    "features\sample-feature\hooks\useSample.ts",
    "features\sample-feature\components\SampleComponent.tsx",
    "features\sample-feature\schemas\sampleSchemas.ts",
    "features\sample-feature\types\sample.types.ts",
    "entities\sample-entity\sample.types.ts",
    "entities\sample-entity\sample.constants.ts",
    "components\layout\Header.tsx",
    "components\layout\Sidebar.tsx",
    "components\layout\PageShell.tsx",
    "components\ui\Button.tsx",
    "components\ui\Badge.tsx",
    "components\ui\Modal.tsx",
    "components\feedback\LoadingSpinner.tsx",
    "components\feedback\ErrorBoundary.tsx",
    "components\feedback\EmptyState.tsx",
    "shared\schemas\commonSchemas.ts",
    "shared\utils\formatDate.ts",
    "shared\utils\formatStatus.ts",
    "shared\utils\cn.ts",
    "shared\constants\appConstants.ts",
    "lib\http.ts",
    "lib\queryClient.ts",
    "lib\storage.ts",
    "lib\logger.ts",
    "types\global.d.ts"
)

foreach ($f in $files) {
    if (-not (Test-Path "$baseDir\$f")) {
        New-Item -ItemType File -Force -Path "$baseDir\$f" | Out-Null
    }
}

# Move files
if (Test-Path "$baseDir\App.tsx") { Move-Item -Force "$baseDir\App.tsx" "$baseDir\app\App.tsx" }
if (Test-Path "$baseDir\App.css") { Move-Item -Force "$baseDir\App.css" "$baseDir\styles\App.css" }
if (Test-Path "$baseDir\index.css") { Move-Item -Force "$baseDir\index.css" "$baseDir\styles\index.css" }

Write-Host "Scaffolding completed"
