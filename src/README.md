# Source Code Structure

## Core Directories

### `/app`

- Core application setup
- Root components
- Main routing
- Global providers and configuration

### `/features`

Feature-based modules, each containing:

- Components
- Hooks
- Utils
- Types
- Services specific to the feature

### `/shared`

Shared/common code used across features:

- Components
- Hooks
- Utils
- Types
- Constants

### `/lib`

Core infrastructure and configuration:

- API clients
- Database setup
- Authentication
- Storage utilities

### `/styles`

Global styles and theming:

- Global CSS
- Theme configuration
- CSS utilities
- Design tokens

## Directory Structure

```
src/
├── app/                      # Application core
│   ├── providers/           # Global providers
│   ├── routes/             # Route definitions
│   └── store/              # Global state management
│
├── features/                # Feature modules
│   ├── auth/               # Authentication feature
│   ├── chat/               # Chat feature
│   ├── teams/              # Teams feature
│   └── settings/           # Settings feature
│
├── shared/                  # Shared code
│   ├── components/         # Reusable components
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   └── constants/          # Constants and enums
│
├── lib/                     # Core infrastructure
│   ├── api/                # API clients
│   ├── supabase/           # Supabase configuration
│   ├── aws/                # AWS services
│   └── storage/            # Storage utilities
│
├── styles/                  # Global styles
│   ├── theme/              # Theme configuration
│   ├── global/             # Global styles
│   └── utils/              # Style utilities
│
└── main.tsx                # Application entry point
```

## Key Principles

1. **Feature-First Organization**: Group related code by feature rather than type
2. **Shared Code Separation**: Common code is easily identifiable and reusable
3. **Clear Dependencies**: Each module has clear dependencies and boundaries
4. **Scalability**: Easy to add new features without affecting existing ones
5. **Maintainability**: Related code is co-located and easy to find

## Guidelines

1. Keep features independent and self-contained
2. Share common code through the shared directory
3. Use index files for clean exports
4. Maintain clear documentation
5. Follow consistent naming conventions
