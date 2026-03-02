keystone/
├── public/
│   ├── favicon.svg
│   └── logo.svg
│
├── src/
│   │
│   ├── app/
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── QueryProvider.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── index.tsx
│   │   ├── router/
│   │   │   ├── routes.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── RoleGuard.tsx
│   │   └── App.tsx
│   │
│   ├── pages/
│   │   └── SamplePage.tsx
│   │
│   ├── features/
│   │   └── sample-feature/
│   │       ├── api/
│   │       │   └── sampleApi.ts
│   │       ├── hooks/
│   │       │   └── useSample.ts
│   │       ├── components/
│   │       │   └── SampleComponent.tsx
│   │       ├── schemas/
│   │       │   └── sampleSchemas.ts
│   │       └── types/
│   │           └── sample.types.ts
│   │
│   ├── entities/
│   │   └── sample-entity/
│   │       ├── sample.types.ts
│   │       └── sample.constants.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── PageShell.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Modal.tsx
│   │   └── feedback/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── shared/
│   │   ├── schemas/
│   │   │   └── commonSchemas.ts
│   │   ├── utils/
│   │   │   ├── formatDate.ts
│   │   │   ├── formatStatus.ts
│   │   │   └── cn.ts
│   │   └── constants/
│   │       └── appConstants.ts
│   │
│   ├── lib/
│   │   ├── http.ts
│   │   ├── queryClient.ts
│   │   ├── storage.ts
│   │   └── logger.ts
│   │
│   ├── types/
│   │   └── global.d.ts
│   │
│   ├── styles/
│   │   └── index.css
│   │
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── .env
├── .env.example
├── index.html
├── tsconfig.json
├── tsconfig.node.json
